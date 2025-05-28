const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Define Telegram API endpoint
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Fetch messages from the Symfony REST API and forward them to Telegram
async function getMessageFromAPI() {
    try {
        const response = await axios.get(process.env.SYMFONY_REST_API_URL, {
            headers: { "X-Service": "telegram" }
        });

        for (const message of response.data) {
            const formattedMessage = `(${message.service}) ${message.author}: ${message.content}`;
            await sendMessageToTelegram(formattedMessage);
        }
    } catch (error) {
        console.error("❌ Error requesting messages from REST API:", error.message);
    }
}

// Send a message to the Telegram channel
async function sendMessageToTelegram(message) {
    try {
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: process.env.TELEGRAM_CHANNEL_ID,
            text: message
        });
    } catch (error) {
        console.error("❌ Error sending messages to Telegram:", error.message);
    }
}

// Forward a message received from Telegram to the Symfony REST API
async function sendMessageToAPI(message) {
    try {
        await axios.post(
            process.env.SYMFONY_REST_API_URL,
            {
                    author: message.from?.first_name || "Unknown",
                content: message.text || ""
            },
            {
                headers: {
                    "X-Service": "telegram",
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("❌ Error sending messages to REST API:", error.message);
    }
}

async function setTelegramWebhook() {
    try {
        if (!process.env.WEBHOOK_URL) {
            console.warn("⚠️ WEBHOOK_URL not set. Skipping webhook registration.");
            return;
        }

        const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
            url: process.env.WEBHOOK_URL
        });

        if (!response.data.ok) {
            console.error("❌ Failed to set webhook:", response.data);
        }
    } catch (error) {
        console.error("❌ Error setting Telegram webhook:", error.message);
    }
}


setTelegramWebhook();

// Use PORT from hosting platform (e.g. Railway, Heroku), fallback to local WEBHOOK_PORT
const port = process.env.PORT || process.env.WEBHOOK_PORT;
app.listen(port, () => {
    console.log(`Telegram Bot server is running on port ${port}`);
});

// Handle incoming webhook messages from Telegram
app.post("/telegram-webhook", (req, res) => {
    const message = req.body.message;

    if (!message) {
        console.warn("⚠️ No message received in webhook payload");
        return res.sendStatus(400);
    }

    sendMessageToAPI(message);
    res.sendStatus(200);
});

// Set up polling based on the interval defined in .env
const pollingInterval = parseInt(process.env.SYMFONY_REST_API_POLLING_TIMER, 10);
setInterval(getMessageFromAPI, pollingInterval);