// Importation des modules nécessaires
const path = require('node:path');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/**
 * Fonction principale pour initialiser et démarrer le client Discord bot.
 * Elle déploie les commandes et les événements, puis connecte le client.
 * @throws {Error} - Si une erreur se produit lors de l'initialisation.
 */
async function main() {
    // Créer une nouvelle instance du client Discord avec les intentions nécessaires
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
    });

    try {
        // Déployer les commandes, événements et base de données
        await Promise.all([
            require('./deploy-commands')(client),
            require('./deploy-events')(client),
            require('./deploy-db')(),
        ]);

        // Se connecter à Discord avec le token du bot
        await client.login(process.env.TOKEN);

        client.user.setActivity(`j'ai une activité 🤓`, { type: ActivityType.Watching });
    } catch (error) {
        // Enregistrer et afficher les erreurs rencontrées lors de l'initialisation
        console.error('Erreur lors de l\'initialisation :', error);
    }
}

main()