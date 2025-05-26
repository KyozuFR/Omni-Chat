// Importation du module nécessaire depuis discord.js
const { Events } = require('discord.js');

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

        require("../moodle-reminder")(client);
    },
};