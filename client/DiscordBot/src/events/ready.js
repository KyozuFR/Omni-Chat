// Importation du module nécessaire depuis discord.js
const { Events } = require('discord.js');
const {resolve} = require("node:path");
require('dotenv').config({ path: resolve(__dirname, '../.env') });

/**
 * Gestionnaire d'événement pour l'événement 'ready'.
 * Cet événement est déclenché lorsque le bot est connecté avec succès et prêt.
 */
module.exports = {
    // Nom de l'événement
    name: Events.ClientReady,

    // Indique que cet événement doit être géré une seule fois
    once: true,

    /**
     * Exécute le gestionnaire d'événement.
     * @param {Client} client - L'instance du client Discord.
     */
    execute(client) {
        // Afficher un message dans la console lorsque le bot est prêt
        console.log(`Bot prêt ! Connecté en tant que ${client.user.tag}`);
        const { resolve } = require('node:path');
        require('dotenv').config({ path: resolve(__dirname, '../.env') });

        async function fetchMessages() {
            try {
                const response = await fetch(process.env.API_LINK, {
                    method: 'GET',
                    headers: { 'X-SERVICE': 'discord' }
                });
                if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                const messages = await response.json();
                const channel = client.channels.cache.get(process.env.CHANNEL_ID);
                if (!channel) {
                    console.error('Channel introuvable.');
                    return;
                }
                for (const msg of messages) {
                    await channel.send(`(${msg.service}) ${msg.author}: ${msg.content}`);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
            }
        }

        setInterval(fetchMessages, 5000);
    },


};