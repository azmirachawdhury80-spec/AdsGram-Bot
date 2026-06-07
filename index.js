const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// আপনার দেওয়া নতুন টেলিগ্রাম বট টোকেন
const bot = new Telegraf('8450687153:AAFQUq552vLhEPmDVJbJETJ3SiqdI2bQdj4');

// Render থেকে পাওয়া আপনার ওয়েবসাইটের লিঙ্ক (ডিপ্লয় করার পর Environment Variable এ সেট করবেন)
const webAppUrl = process.env.WEBAPP_URL || 'https://your-app-name.onrender.com';

// পাবলিক ফোল্ডারটি ওয়েব সার্ভারে হোস্ট করার জন্য
app.use(express.static(path.join(__dirname, 'public')));

// /start কমান্ড দিলে কী হবে
bot.start((ctx) => {
    ctx.reply('স্বাগতম! 🎁\nইনকাম শুরু করতে নিচের "📺 View Ad" বাটনে ক্লিক করুন।', {
        reply_markup: {
            keyboard: [
                [{ text: "📺 View Ad", web_app: { url: webAppUrl } }]
            ],
            resize_keyboard: true
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
console.log('Bot is running with the new token...');

// Express সার্ভার চালু করা
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// সার্ভার ক্র্যাশ রোধ করার জন্য
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

