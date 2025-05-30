// Importation des modules nécessaires
const { REST, Routes, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/**
 * Fonction pour déployer les commandes d'application (/) pour le client Discord.
 * @param {Client} client - L'instance du client Discord.
 * @throws {Error} - Si une erreur se produit lors du déploiement des commandes.
 */
module.exports = async (client) => {
    // Initialiser le client REST avec le token du bot
    const rest = new REST().setToken(process.env.TOKEN);

    // Initialiser les collections pour les cooldowns et les commandes
    client.cooldowns = new Collection();
    client.commands = new Collection();

    // Tableau pour stocker les données des commandes à déployer
    const commands = [];
    // Chemin vers le répertoire des commandes
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    /**
     * Charger toutes les commandes du répertoire 'commands'.
     * Les commandes valides doivent avoir des propriétés 'data' et 'execute'.
     */
    async function loadAllCommands() {
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, file));
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[AVERTISSEMENT] La commande dans ${file} manque d'une propriété "data" ou "execute" requise.`);
                }
            }
        }
        console.log('Commandes (/) chargées avec succès.');
    }

    /**
     * Déployer toutes les commandes d'application (/) chargées sur Discord.
     */
    async function deployAllCommands() {
        try {
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), // trouver une méthode pour le faire sur toutes les guildes
                { body: commands },
            );
            console.log(`${data.length} commandes (/) déployées avec succès.`);
        } catch (error) {
            console.error('Erreur lors du déploiement des commandes :', error);
            throw error;
        }
    }

    // Exécuter le processus de déploiement des commandes
    try {
        // Supprimer toutes les commandes existantes
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log('Toutes les commandes ont été supprimées avec succès.');
        // Charger et déployer les nouvelles commandes
        await loadAllCommands();
        await deployAllCommands();
        console.log(`Déploiement des commandes terminé !`);
    } catch (error) {
        console.error('Erreur lors du déploiement des commandes :', error);
        throw error;
    }
};