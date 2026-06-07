const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// আপনার বট টোকেন
const bot = new Telegraf('8068023821:AAEkhKKmiYcAFtv25WKr7v1hLlzMFYyQcHc');

// Render থেকে পাওয়া ওয়েবসাইটের লিঙ্ক
const webAppUrl = process.env.WEBAPP_URL || 'https://your-app-name.onrender.com';

// সরাসরি index.html ফাইলটি ওয়েব সার্ভারে দেখানোর জন্য
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// /start কমান্ড দিলে কী হবে (নতুন প্রফেশনাল Inline Keyboard সহ)
bot.start((ctx) => {
    ctx.reply('স্বাগতম! 🎁\nইনকাম শুরু করতে নিচের "🎮 Open App" বাটনে ক্লিক করুন।', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Open App", web_app: { url: webAppUrl } }]
            ]
        }
    });
});

// Ad দেখা শেষ হলে Web App থেকে ডাটা রিসিভ করার জন্য
bot.on('web_app_data', (ctx) => {
    const data = ctx.message.web_app_data.data;
    
    if (data === 'ad_watched_successfully') {
        // এখানে আপনি ইউজারের ব্যালেন্স ডাটাবেসে অ্যাড করার কোড লিখতে পারেন
        ctx.reply('🎉 অভিনন্দন! আপনি সফলভাবে Ad দেখেছেন। আপনার একাউন্টে ব্যালেন্স যোগ করা হয়েছে।');
    } else {
        ctx.reply('⚠️ আপনি Ad টি সম্পূর্ণ দেখেননি।');
    }
});

// বট চালু করা
bot.launch();
console.log('Bot is running...');

// Express সার্ভার চালু করা
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// সার্ভার ক্র্যাশ রোধ করার জন্য
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
