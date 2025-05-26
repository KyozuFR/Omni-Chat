const { Events } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        const payload = {
            content: message.content,
            author: message.author.tag,
            service: 'discord',
        };
        try {
            console.log(JSON.stringify(payload));
            await fetch('https://votre-api.com/endpoint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi à l\'API :', error);
        }
    },
};