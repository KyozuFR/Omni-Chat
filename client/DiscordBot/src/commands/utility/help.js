// Importation des modules nécessaires
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ComponentType, AttachmentBuilder} = require('discord.js');
const path = require('node:path');

module.exports = {
    // Délai de rechargement de la commande en secondes
    cooldown: 1,
    // Catégorie de la commande
    category: 'utility',
    // Données et options de la commande
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Renvoie les commande existantes et l'aide de la commande en argument`)
        .addIntegerOption(option =>
            option.setName('choix-commande')
                .setDescription('Choisissez la commande pour laquelle vous souhaitez obtenir de l\'aide')
                .addChoices(
                    { name: 'login', value: 0 },
                    { name: 'display', value: 1 },
                    { name: 'join', value: 2 },
                    { name: 'leave', value: 3 },
                    { name: 'getinfo', value: 4 },
                    { name: 'ping', value: 5 },
                )),
    /**
     * Logique d'exécution de la commande.
     * @param {Interaction} interaction - L'objet interaction de Discord.js
     */
    async execute(interaction) {
        let start = Date.now();
        const choice = interaction.options.getInteger('choix-commande');

        // Différer la réponse à l'interaction
        await interaction.deferReply({ ephemeral: true });

        const previous = new ButtonBuilder().setCustomId('previous').setLabel('◀️').setStyle(ButtonStyle.Primary);
        const next = new ButtonBuilder().setCustomId('next').setLabel('▶️').setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(previous, next);

        let title;
        let description;
        let fields;
        let images;

        let response;

        let curPage;

        switch (choice){
            case 0:
                title = "Manuel de la commande /login :";
                description = "Permet de se connecter à l'Université de La Rochelle pour afficher son emploie du temps";
                fields = [{ name: 'Utilisation', value: '/login ‹methode› ‹identifiant›'},
                    { name: 'Methode', value: 'moodle - ent'},
                    { name: 'Cooldown', value: '1s', inline: true },
                    { name: 'Permissions', value: 'Aucune', inline: true },
                    { name: 'Version Admin', value: '/forcelogin ‹cible› ‹methode› ‹identifiant›' },
                    { name: 'Permissions', value: 'Gestion des rôles ', inline: true }];
                images = [
                    { path: path.resolve(__dirname, '../../../assets/help/identifiantEnt.png'), attachement: "attachment://identifiantEnt.png", title: "Récupération de l'identifiant ENT"},
                    { path: path.resolve(__dirname, '../../../assets/help/LienMoodle.gif'), attachement: "attachment://LienMoodle.gif", title: "Récupération du lien Moodle"},
                ]

                curPage = 1;
                response = await interaction.editReply({
                    embeds: [EmbedImage(title, description, fields, images[curPage-1]["title"], images[curPage-1]["attachement"], start)],
                    files: [new AttachmentBuilder(images[curPage-1]["path"])],
                    components: [row]
                });

                const collectorLog = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });
                collectorLog.on('collect', async i => {
                    start = Date.now();

                    curPage = i.customId === 'previous' ? Math.max(curPage - 1, 1) : Math.min(curPage + 1, Object.keys(images).length);
                    await i.update({
                        embeds: [EmbedImage(title, description, fields, images[curPage-1]["title"], images[curPage-1]["attachement"], start)],
                        files: [new AttachmentBuilder(images[curPage-1]["path"])],
                    });
                });
                break;

            case 1:
                title = "Manuel de la commande /display :";
                description = "Permet d'afficher son emploi du temps ou ses activités Moodle";
                fields = [
                    { name: 'Utilisation', value: '/display ‹methode›' },
                    { name: 'Methode', value: 'moodle - edt'},
                    { name: 'Cooldown', value: '0s', inline: true },
                    { name: 'Permissions', value: 'Aucune', inline: true }
                ];

                response = await interaction.editReply({
                    embeds: [createEmbed(title, description, fields, start)],
                });
                break;

            case 2:
                title = "Manuel de la commande /join :";
                description = "Permet de rejoindre les groupes automatiquement";
                fields = [
                    { name: 'Utilisation', value: '/join ' },
                    { name: 'Cooldown', value: '5s', inline: true },
                    { name: 'Permissions', value: 'Aucune', inline: true },
                    { name: 'Version Admin', value: '/forcejoin ‹cible›' },
                    { name: 'Permissions', value: 'Gestion des rôles', inline: true },
                ];

                response = await interaction.editReply({
                    embeds: [createEmbed(title, description, fields, start)]
                });
                break;
            case 3:
                title = "Manuel de la commande /leave :";
                description = "Permet de quitter les groupes automatiquement";
                fields = [
                    { name: 'Utilisation', value: '/leave ' },
                    { name: 'Cooldown', value: '5s', inline: true },
                    { name: 'Permissions', value: 'Aucune', inline: true },
                    { name: 'Version Admin', value: '/forceleave ‹cible›' },
                    { name: 'Permissions', value: 'Gestion des rôles', inline: true },
                ];

                response = await interaction.editReply({
                    embeds: [createEmbed(title, description, fields, start)]
                });
                break;

            case 4:
                title = "Manuel de la commande /getinfo :";
                description = "Permet de vérifier les information de la personne cible de la commande.\n" +
                    "Seule la personne ayant lancé la commande peut voir la réponse.";
                fields = [
                    { name: 'Utilisation', value: '/getinfo ‹cible›' },
                    { name: 'Cooldown', value: '0s', inline: true },
                    { name: 'Permissions', value: 'Gestion des rôles', inline: true },
                ];

                response = await interaction.editReply({
                    embeds: [createEmbed(title, description, fields, start)]
                });
                break;

            case 5:
                title = "Manuel de la commande /ping :";
                description = "Permet de vérifier si le bot est en ligne et son temps de réaction.\n" +
                    "Seule la personne ayant lancé la commande peut voir la réponse.";
                fields = [
                    { name: 'Utilisation', value: '/ping' },
                    { name: 'Cooldown', value: '5s', inline: true },
                    { name: 'Permissions', value: 'Aucune', inline: true }
                ];

                response = await interaction.editReply({
                    embeds: [createEmbed(title, description, fields, start)]
                });
                break;

            default:
                title = "Manuel des commandes :";
                description = "Ce bot permet de gérer différents salons et d'affecter un utilisateur en fonction de ses groupes de travail à l'université\n" +
                    "Il permet aussi d'afficher son emploi du temps et ses activités Moodle.";
                fields = [
                    { name: 'Commandes', value: '/login\n/display\n/join\n/ping' },
                    { name: 'Utilisation', value: "/help ‹commande›" },
                    { name: 'Cooldown', value: '1s', inline: true }
                ];

                response = await interaction.editReply({
                    embeds: [createEmbed(title, description, fields, start)]
                });
                break;
        }
    },
};

function createEmbed(title, description, fields, start) {
    return new EmbedBuilder()
        .setColor(0x0F6EB1)
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setTimestamp()
        .setFooter({ text: `Requête réalisé en ${Date.now() - start}ms`, iconURL: 'https://images-ext-1.discordapp.net/external/kMhIi1qtRXShjyfpUaFtpeANp0CUby-IxgrbxN6JUhw/https/www.univ-larochelle.fr/wp-content/uploads/png/logo-universite-de-la-rochelle-2X.png' });}

function EmbedImage(title, description, fields, titreImage, image, start){
    return createEmbed(title, description, fields, start)
        .addFields({name: titreImage, value: "    "})
        .setImage(image);
}