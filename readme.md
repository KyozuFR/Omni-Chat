# Omni-Chat

Omni-Chat est une application de chat qui connecte plusieurs services différents—Discord, Twitch Chat, Roblox, Gmod, Telegram et Minecraft—tous liés à une API Symfony.

## Table des matières
- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Nettoyage automatique des messages](#nettoyage-automatique-des-messages)
  - [1. Installation Twitch](#1-installation-twitch)
  - [2. Installation Minecraft](#2-installation-minecraft)
  - [3. Installation Roblox](#3-installation-roblox)
  - [4. Installation Gmod](#4-installation-gmod)
  - [5. Installation Telegram](#5-installation-telegram)
  - [6. Installation Discord](#6-installation-discord)
  - [7. Installation WebClient](#7-installation-webclient)
- [Contributeurs](#contributeurs)

## Prérequis
- PHP >= 8.2
- Composer
- Apache ou Caddy
- Node.js (pour les clients)

## Installation

Clonez le dépôt :

```bash
git clone <repository-url>
cd omni-chat
```

Installez les dépendances PHP :

```bash
composer install
```

Configurez votre base de données dans le fichier `.env` et exécutez les migrations :

```bash
php bin/console doctrine:migrations:migrate
```

### Nettoyage automatique des messages

Pour supprimer automatiquement les messages de plus de cinq minutes, ouvrez l'éditeur crontab :

```bash
crontab -e
```

Puis ajoutez la ligne suivante :

```bash
*/5 * * * * cd /workspaces/Omni-Chat && php bin/console DeleteOldMessages >> var/log/cleanup.log 2>&1
```

> **Note :** Vous pouvez personnaliser la durée en utilisant l'option `--minutes` ou `-m` :
> ```bash
> */5 * * * * cd /workspaces/Omni-Chat && php bin/console DeleteOldMessages --minutes=10
> ```

## 1. Installation Twitch

### Prérequis
- Node.js installé
- TypeScript installé globalement

### Étapes
1. Créez un chatbot en utilisant le portail développeur Twitch : https://dev.twitch.tv/console
2. Récupérez votre `Client_ID` et `Client_Secret` dans les paramètres de votre ChatBot
3. Entrez l'URL suivante dans votre navigateur pour obtenir un code d'autorisation (remplacez `Client_ID` et `Redirect_OAuth` par vos vraies informations) :
   ```
   https://id.twitch.tv/oauth2/authorize?client_id=Client_ID&redirect_uri=Redirect_OAuth&response_type=code&scope=chat:read+chat:edit
   ```
4. Prenez le code d'autorisation obtenu précédemment et incluez-le dans la requête suivante avec votre `Client_ID` et `Client_Secret`. Cela vous donnera un `Access_Token` :
   ```bash
   curl -X POST "https://id.twitch.tv/oauth2/token?client_id=Client_ID&client_secret=Client_Secret&code=Code&grant_type=authorization_code&redirect_uri=Redirect_OAuth"
   ```
5. Vous recevrez vos tokens dans ce format :
   ```json
   {
     "access_token":"Access_Token",
     "expires_in":0,
     "refresh_token":"Refresh_Token",
     "scope":["chat:edit","chat:read"],
     "token_type":"bearer"
   }
   ```

### Compilation et exécution
```bash
cd client/twitch
npm install
tsc src/index.ts
node src/index.js
```

> **Note :** Pour permettre au ChatBot d'écrire les messages qu'il reçoit, il doit être modérateur du canal.

## 2. Installation Minecraft

### Prérequis
- JDK 21
- Gradle
- Un serveur Minecraft

### Compilation
- Linux :
  ```bash
  ./gradlew build
  ```
- Windows :
  ```bash
  gradlew.bat build
  ```

Le fichier `.jar` se trouvera dans **build/libs/**. Placez Omni-Chat sur votre serveur par la suite.

## 3. Installation Roblox

### Prérequis
- Roblox Studio installé
- Accès à votre projet Roblox
- Point de terminaison API externe (configuré dans le script)

### Étapes
1. **Ouvrez votre projet dans Roblox Studio**

2. **Activez les requêtes HTTP :**
   - Allez dans Accueil > Paramètres du jeu > Sécurité
   - Cochez la case "Activer les requêtes HTTP"
   - Cliquez sur "Enregistrer"

3. **Créez les objets nécessaires dans l'Explorateur :**
   - Ouvrez la fenêtre Explorateur (Vue > Explorateur si pas visible)
   - Localisez "ReplicatedStorage" (partagé entre serveur et clients)
   - Clic droit sur ReplicatedStorage, sélectionnez "Insérer un objet", et ajoutez un RemoteEvent nommé "AfficherMessageChat"

4. **Ajoutez le script serveur :**
   - Dans l'Explorateur, localisez "ServerScriptService" (utilisé pour la logique côté serveur)
   - Clic droit dessus, sélectionnez "Insérer un objet", et choisissez "Script"
   - Collez le script serveur à l'intérieur

5. **Ajoutez le script client :**
   - Dans l'Explorateur, naviguez vers :
     - StarterPlayer > StarterPlayerScripts (s'exécute quand le joueur démarre), ou
     - ReplicatedFirst (s'exécute plus tôt dans le processus de chargement)
   - Clic droit sur le dossier, sélectionnez "Insérer un objet", et choisissez "LocalScript"
   - Collez le script client à l'intérieur

6. **Configurez le point de terminaison API :**
   - Dans le script serveur, localisez la ligne commençant par :
     ```lua
     local url =
     ```
   - Remplacez le placeholder par votre vraie URL d'API si différente

### Comment ça fonctionne
- Quand un joueur tape un message dans le chat, il est envoyé à votre API externe
- Le serveur récupère périodiquement les nouveaux messages de l'API
- Tous les nouveaux messages sont diffusés à tous les clients via le RemoteEvent
- Les clients reçoivent les messages et les affichent dans l'interface de chat Roblox, avec le formatage suivant :
  - Info de plateforme en gris
  - Nom d'utilisateur en vert
  - Contenu du message en blanc

> **Notes :**
> - Les requêtes HTTP doivent être activées pour que ce système fonctionne
> - Les messages sont stylisés en utilisant le formatage HTML pour une meilleure lisibilité
> - L'intervalle de polling et le style peuvent être personnalisés dans les scripts
> - Assurez-vous que votre API externe envoie et reçoit du JSON dans le format attendu

## 4. Installation Gmod

### Prérequis
- Serveur Garry's Mod (ou serveur local)

### Étapes
1. Placez le dossier client gmod nommé 'omni-chat' dans 'GarrysMod/garrysmod/addons'
2. Allez dans le dossier omni-chat
3. Renommez 'sv_config.example.lua' → 'sv_config.lua'
4. Déplacez 'sv_config.lua' vers le dossier omni_chat/lua/autorun
5. Changez l'`SYMFONY_REST_API_URL` vers votre URL

## 5. Installation Telegram

### Prérequis
- Node.js installé

### Étapes
1. **Créez un bot Telegram avec @BotFather**
   - Faites `/start` pour voir la liste des commandes
   - `/newbot` pour créer un bot
   - Vous devrez choisir un nom et un nom d'utilisateur
   - Une fois le bot créé, copiez le token et mettez-le dans `.env.example` sous `TELEGRAM_BOT_TOKEN`

2. **Configurez les permissions du bot**
   - Dans @BotFather, faites `/mybots`
   - Sélectionnez votre bot > Bot Settings > Group Privacy > Turn Off

3. **Configurez le groupe**
   - Créez un groupe dans Telegram et invitez votre bot
   - Trouvez le groupID et mettez-le dans `.env.example` sous `TELEGRAM_CHANNEL_ID`
   - Renommez `.env.example` en `.env`

4. **Lancez le serveur**
   ```bash
   cd client/Telegram
   npm install
   node app.js
   ```

## 6. Installation Discord

### Prérequis
- Node.js installé
- Discord.js installé
- Accès à un serveur Discord où vous pouvez ajouter le bot

### Étapes
1. Créez un bot sur le portail développeur Discord : https://discord.com/developers/docs/intro
2. Accordez-lui les trois Privileged Gateway Intents
3. Stockez toutes les informations du bot dans les variables d'environnement
4. Invitez le bot sur votre serveur

### Exécution
```bash
cd client/DiscordBot
npm install
node src/app.js
```

## 7. Installation WebClient

### Prérequis
- Node.js installé

### Étapes
```bash
cd client/webclient
npm install
```

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
```

## Contributeurs

| ![Linares Julien](https://avatars.githubusercontent.com/u/85966963?v=4&s=80) | ![Mulcey Amaury](https://avatars.githubusercontent.com/u/170519711?v=4&s=80) | ![Billot Corentin](https://avatars.githubusercontent.com/u/65243313?v=4&s=80) | ![Sautière Quentin](https://avatars.githubusercontent.com/u/75904100?v=4&s=80) | ![Henry Gwendal](https://avatars.githubusercontent.com/u/158183796?v=4&s=80) |
|:---:|:---:|:---:|:---:|:---:|
| [Linares Julien](https://github.com/KyozuFR) | [Mulcey Amaury](https://github.com/AmauRizz) | [Billot Corentin](https://github.com/LaNoitDeCoco) | [Sautière Quentin](https://github.com/SautiereQDev) | [Henry Gwendal](https://github.com/dadal560) |

## Licence

Ce projet est sous licence Apache License 2.0. Pour plus de détails, consultez le fichier [LICENSE](LICENSE).
## Avertissement
Ce projet est un travail en cours et peut contenir des bugs. N'hésitez pas à contribuer ou à signaler des problèmes.
