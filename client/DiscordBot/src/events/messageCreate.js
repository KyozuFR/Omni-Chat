const { Events } = require('discord.js');
const {resolve} = require("node:path");
require('dotenv').config({ path: resolve(__dirname, '../.env') });

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.id !== process.env.CHANNEL_ID) return;
        const payload = {
            content: message.content,
            author: message.author.tag,
        };
        try {
            console.log(JSON.stringify(payload));
            await fetch(process.env.API_LINK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            'X-SERVICE': 'discord' },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi à l\'API :', error);
        }
    },
};