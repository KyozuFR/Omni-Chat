import 'dotenv/config';
import { StaticAuthProvider} from '@twurple/auth';
import {ChatClient} from '@twurple/chat';
// @ts-ignore
import * as process from "node:process";

const MY_CHANNEL ='LaNoitDeCoco';

const authProvider = new StaticAuthProvider(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_ACCESS_TOKEN!);
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
async function updateMessage(){
    try {
        const response = await fetch(process.env.API_LINK, {
            method: 'GET',
            headers: { 'X-SERVICE': 'twitch' }
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
    
setInterval(updateMessage, 5000);
}