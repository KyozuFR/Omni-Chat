import 'dotenv/config';
import { RefreshingAuthProvider } from '@twurple/auth';
import {ChatClient} from '@twurple/chat';
import * as process from "node:process";
import { promises as fs } from 'fs';
import * as path from 'path';
console.log('API_LINK:', process.env.API_LINK);

const tokenPath = path.join(__dirname, 'tokens.json');

const MY_CHANNEL ='LaNoitDeCoco';
const clientId = 'd7p3z8hanbyjd59x51uolq74lwbwnv';
const clientSecret = 'pmg3y6u2sotb1kaib2w40tl5cyl9il';
async function main() {
const tokenData = JSON.parse(await fs.readFile(tokenPath, 'utf-8'));
const authProvider = new RefreshingAuthProvider(
    {
        clientId,
        clientSecret
    }
);

    authProvider.onRefresh(async (newTokenData) => {
        await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 4), 'utf-8');
    });
await authProvider.addUserForToken(tokenData, ['chat']);

const chatClient = new ChatClient({ authProvider, channels: [MY_CHANNEL] });
const platform = "(twitch) ";

chatClient.connect();
chatClient.onDisconnect(()=> {console.log("Disconnected from twitch"), chatClient.connect()})
chatClient.onConnect(() => {updateMessage(), console.log("Connected to Twitch chat")});
chatClient.onMessage((channel, user, text, msg) => {
    console.log(platform + user+ ": " + text);
    sendMessage(user, text);
});
async function sendMessage(user: string, text: string) {
    const payload = {
        content: text,
        author: user
    };
    try {
        await fetch(process.env.API_LINK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SERVICE': 'twitch'
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error while sending messages to API: ', error);
    }
}
async function updateMessage() {
    try {
        const response = await fetch(process.env.API_LINK, {
            method: 'GET',
            headers: {'X-SERVICE': 'twitch'}
        });
        if (!response.ok) throw new Error(`HTTP error : ${response.status}`);
        const messages = await response.json();

        for (const msg of messages) {
            await chatClient.say(MY_CHANNEL, "(" + msg.service + ") " + msg.author + ": " + msg.content);
            console.log("(" + msg.service + ") " + msg.author + ": " + msg.content)
        }
    } catch (error) {
        console.error('Error while getting messages: ', error);
    }
}
setInterval(updateMessage, 3000);
}
main();