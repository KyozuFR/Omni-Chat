// Importation des modules nécessaires depuis discord.js
const { Events, Collection } = require('discord.js');

module.exports = {
    // Définir le nom de l'événement
    name: Events.InteractionCreate,

    /**
     * Fonction d'exécution pour gérer l'événement de création d'interaction.
     * @param {Interaction} interaction - L'objet interaction de Discord.js
     */
    async execute(interaction) {
        // Vérifier si l'interaction est une commande de chat
        if (!interaction.isChatInputCommand()) return;

        // Récupérer la commande depuis la collection de commandes du client
        const command = interaction.client.commands.get(interaction.commandName);

        // Si la commande n'existe pas, enregistrer une erreur et retourner
        if (!command) {
            console.error(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
            return;
        }

        // Récupérer la collection des cooldowns du client
        const { cooldowns } = interaction.client;
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name) || new Collection();
        const cooldownAmount = (command.cooldown ?? 3) * 1_000; // Par défaut, 3 secondes de cooldown

        // Vérifier si l'utilisateur est en période de recharge pour cette commande
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                return interaction.reply({ content: `Veuillez patienter, vous êtes en période de recharge pour \`${command.data.name}\`. Vous pouvez l'utiliser à nouveau <t:${expiredTimestamp}:R>.`, ephemeral: true });
            }
        }

        // Ajouter un timestamp pour l'utilisateur et définir un timeout pour supprimer le timestamp après la période de recharge
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        cooldowns.set(command.data.name, timestamps);

        try {
            // Exécuter la commande
            await command.execute(interaction);
        } catch (error) {
            // Enregistrer toutes les erreurs survenues lors de l'exécution de la commande
            console.error(error);
            const replyContent = 'Une erreur est survenue lors de l\'exécution de cette commande !';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: replyContent, ephemeral: true });
            } else {
                await interaction.reply({ content: replyContent, ephemeral: true });
            }
        }
    },
};