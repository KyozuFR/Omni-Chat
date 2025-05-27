// Importation des modules nécessaires
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Délai de rechargement de la commande en secondes
    cooldown: 5,
    // Catégorie de la commande
    category: 'utility',
    // Données et options de la commande
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond pong si le bot est en ligne.'),

    /**
     * Logique d'exécution de la commande.
     * @param {Interaction} interaction - L'objet interaction de Discord.js
     */
    async execute(interaction) {
        const start = Date.now();

        // Différer la réponse à l'interaction
        await interaction.deferReply({ ephemeral: true });

        // Créer les boutons menant à la documentation et au guide de Discord.js
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Discord.jS Docs')
                .setURL("https://discord.js.org/docs/packages/discord.js/14.16.3")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel('Discord.jS Guide')
                .setURL("https://discordjs.guide/#before-you-begin")
                .setStyle(ButtonStyle.Link)
        );

        // Modifier la réponse avec le temps de réponse et les boutons
        await interaction.editReply({
            content: `Pong: ${interaction.user} | en: ${Date.now() - start}ms`,
            components: [row]
        });

        // Optionnellement attendre et supprimer la réponse
        //await wait(10_000);
        //interaction.deleteReply();
    },
};