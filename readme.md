# Omni-Chat

Omni-Chat is a chat application that connects multiple different services—Discord, Twitch Chat, Roblox, Gmod, Telegram, and Minecraft—all linked to a Symfony API.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
    - [Twitch Installation](#twitch-installation)
    - [Minecraft Installation](#minecraft-installation)
    - [Roblox Installation](#roblox-installation)
    - [Gmod Installation](#gmod-installation)
    - [Telegram Installation](#telegram-installation)
    - [Discord Installation](#discord-installation)
    - [WebClient Installation](#webclient-installation)
- [Contributors](#contributors)

## Prerequisites
- PHP >= 8.0
- Composer
- Apache or Caddy

## Installation

- Clone the repository:

```bash
git clone <repository-url>
cd omni-chat
```
- If you want to delete messages older than five minutes, open the crontab editor:
```bash
crontab -e
```

- Then add the following line:
```bash
  */5 * * * * php /var/www/Omni-Chat/bin/console DeleteOldMessages
```
### 1. Twitch Installation
- Prerequisites
    - Node.js installed
    - TypeScript installed globally
- Steps
    - Create a chatbot using the Twitch Developer Portal: https://dev.twitch.tv/console
    - Retrieve your Client_ID and Client_Secret on your ChatBot settings page
    - Enter the following URL in your browser to obtain an authorization code (replace Client_ID, Redirect_OAuth with your actual credentials):
      ```
      https://id.twitch.tv/oauth2/authorize?client_id=Client_ID&redirect_uri=Redirect_OAuth&response_type=code&scope=chat:read+chat:edit
      ```
    - Take the authorization code obtained previously and include it in the following request along with your Client_ID and Client_Secret. This will give you an Access_Token:
      ```bash
      curl -X POST "https://id.twitch.tv/oauth2/token?client_id=Client_ID&client_secret=Client_Secret&code=Code&grant_type=authorization_code&redirect_uri=Redirect_OAuth"
      ```
    - You will receive your tokens in this format:
      ```
      {
        "access_token":"Access_Token",
        "expires_in":0,
        "refresh_token":"Refresh_Token",
        "scope":["chat:edit","chat:read"],
        "token_type":"bearer"
      }
      ```

- Compile and run:
  ```bash
  tsc src/index.ts
  node src/index.js
  ```

**Note**: To allow the ChatBot to write the messages it receives, it must be a moderator of the channel.

### 2. Minecraft Installation
- Prerequisites:
    - JDK 21
    - Gradle
    - A Minecraft server
- Compile:
    - Linux:
      ```bash
      ./gradlew build
      ```
    - Windows:
      ```bash
      gradlew.bat build
      ```
    - The `.jar` file will be located in **build/libs/**. Place Omni-Chat on your server afterward.

### 3. Roblox Installation
- Prerequisites
    - Roblox Studio installed
    - Access to your Roblox project
    - External API endpoint (configured in the script)

- Steps
    1. Open your project in Roblox Studio.
    2. Enable HTTP Requests:
        - Go to Home > Game Settings > Security.
        - Check the box “Enable HTTP Requests”.
        - Click “Save”.
    3. Create the necessary objects in the Explorer:
        - Open the Explorer window (View > Explorer if not visible).
        - Locate “ReplicatedStorage” (shared between server and clients).
        - Right-click ReplicatedStorage, select “Insert Object,” and add a RemoteEvent named “AfficherMessageChat”.
    4. Add the server script:
        - In the Explorer, locate “ServerScriptService” (used for server-side logic).
        - Right-click it, select “Insert Object,” and choose “Script.”
        - Paste the server script inside.
    5. Add the client script:
        - In the Explorer, navigate to either:
            - StarterPlayer > StarterPlayerScripts (runs when player starts), or
            - ReplicatedFirst (runs earlier in the load process).
        - Right-click the folder, select “Insert Object,” and choose “LocalScript.”
        - Paste the client script inside.
    6. Configure the API endpoint:
        - In the server script, locate the line starting with:
          ```lua
          local url =
          ```
        - Replace the placeholder with your actual API URL if different.

- How It Works
    - When a player types a message in the chat, it is sent to your external API.
    - The server periodically fetches new messages from the API.
    - Any new messages are broadcast to all clients via the RemoteEvent.
    - Clients receive the messages and display them in the Roblox chat UI, with the following formatting:
        - Platform info in grey
        - Username in green
        - Message content in white

- Notes
    - HTTP Requests must be enabled for this system to function.
    - Messages are stylized using HTML formatting for better readability.
    - Polling interval and styling can be customized inside the scripts.
    - Ensure your external API sends and receives JSON in the expected format.

### 4. Gmod Installation
(No additional details provided.)

### 5. Telegram Installation
(No additional details provided.)

### 6. Discord Installation
- Prerequisites
    - Node.js installed
    - Discord.js installed
    - Access to a Discord server where you can add the bot

- Steps
    - Create a bot on the Discord Developer Portal: https://discord.com/developers/docs/intro
    - Grant it the three Privileged Gateway Intents.
    - Store all bot information in environment variables.
    - Invite the bot to your server.

- Run:
  ```bash
  node src/app.js
  ```

### 7. WebClient Installation
- Prerequisites
    - Node.js installed

- Steps
    - Install dependencies:
      ```bash
      npm i
      ```
    - Run in development mode:
      ```bash
      npm run dev
      ```

## Contributors
| <div style="text-align:center">![Linares Julien](https://avatars.githubusercontent.com/u/85966963?v=4?width=80)</div> | <div style="text-align:center">![Mulcey Amaury](https://avatars.githubusercontent.com/u/170519711?v=4?width=80)</div> | <div style="text-align:center">![Billot Corentin](https://avatars.githubusercontent.com/u/65243313?v=4?width=80)</div> | <div style="text-align:center">![Sautière Quentin](https://avatars.githubusercontent.com/u/75904100?v=4)</div> |  <div style="text-align:center">![Henry Gwendal](https://avatars.githubusercontent.com/u/158183796?v=4)</div> |
|:---------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------:|--------------------------------------------------------------------------------------------------------------:|
|                                     [Linares Julien](https://github.com/KyozuFR)                                      |                                     [Mulcey Amaury](https://github.com/AmauRizz)                                      |                                   [Billot Corentin](https://github.com/LaNoitDeCoco)                                   |                              [Sautière Quentin](https://github.com/SautiereQDev)                               |                                                                  [Henry Gwendal](https://github.com/dadal560) |
