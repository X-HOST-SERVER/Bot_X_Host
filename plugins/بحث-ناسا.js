import axios from 'axios';
import cheerio from 'cheerio';
import fetch from "node-fetch";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userAgent = 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0';

let cache = {};

const handler = async (m, { conn, usedPrefix, command }) => {
    // توضيح للمستخدم إذا لم يتم إدخال استعلام
    if (command !== 'ناسا' && command !== 'nasa') {
        return m.reply(`💀 | *طريقة الاستخدام:*  
❖ استخدم الأمر *ناسا* فقط للحصول على آخر الأخبار من وكالة ناسا.  
𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
    }

    const query = 'latest';  // نبحث دائمًا عن آخر الأخبار
    let cacheKey = `${command}_${query}`;

    if (cache[cacheKey]) {
        return await conn.reply(m.chat, cache[cacheKey], m);
    }

    const url = 'https://www.nasa.gov/news/all-news/';
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': userAgent },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        const latestNews = [];
        $('article, .item, .news-item, .content').each((i, element) => {
            const title = $(element).find('h1, h2, h3, .title').text().trim();
            const link = $(element).find('a').attr('href') || '';
            let date = $(element).find('time, .date, .meta, .timestamp, .publish-date, [datetime]').text().trim() ||
                       $(element).find('[datetime]').attr('datetime') || 
                       $(element).text().match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+\d{4}\b/)?.[0] || 
                       'التاريخ غير متوفر';
            const excerpt = $(element).find('p, .excerpt, .summary').text().trim() || 'الوصف غير متوفر';

            if (title && link) {
                latestNews.push({
                    title: title,
                    link: link.startsWith('http') ? link : `https://www.nasa.gov${link}`,
                    date: date,
                    excerpt: excerpt
                });
            }
        });

        if (latestNews.length === 0) {
            throw 'عذرًا، لم أتمكن من العثور على أخبار جديدة. ربما الموقع غير متاح الآن!';
        }

        // الجزء الذي لا يُترجم
        const headerText = `*أحدث الأخبار من وكالة ناسا* 🚀\n`;
        const additionalText = `هل ترغب في معرفة المزيد؟ يمكنك المحاولة لاحقًا لمزيد من الأخبار! 😎`;

        let replyText = `==============================\n`;
        latestNews.slice(0, 3).forEach((news, index) => {
            replyText += `${index + 1}. *${news.title}*\n`;
            replyText += `   التاريخ: ${news.date}\n`;
            replyText += `   الوصف: ${news.excerpt}\n`;
            replyText += `   الرابط: [اضغط هنا](${news.link})\n`;
            replyText += '--------------------------------\n';
        });

        // الترجمة إلى العربية للنص بعد العنوان
        let translatedText = await translate(replyText, 'ar');

        // إضافة النص الثابت
        translatedText = `${headerText}${translatedText}\n${additionalText}`;

        cache[cacheKey] = translatedText;

        await conn.sendMessage(m.chat, {
            text: translatedText, 
            contextInfo: {
                externalAdReply :{
                    mediaUrl: '', 
                    mediaType: 1,
                    title: '🚀 ناسا',
                    body: '', 
                    thumbnailUrl: 'https://files.catbox.moe/g6b95j.jpg', 
                    sourceUrl: '',
                    renderLargerThumbnail: true, 
                    showAdAttribution: false
                }
            }
        }, { quoted: m });

    } catch (error) {
        await conn.reply(m.chat, `💀 | ❌ *حدث خطأ أثناء الوصول إلى الأخبار: ${error.message}. حاول مجددًا لاحقًا!*`, m);
    }
};

// أوامر البوت باللغة العربية والانجليزية
handler.help = ['nasa', 'ناسا'].map(v => v + ' - الحصول على أحدث الأخبار من وكالة ناسا!');
handler.tags = ['internet'];
handler.command = /^(nasa|ناسا)$/i;
handler.limit = 1;

export default handler;

async function translate(query = "", lang) {
    if (!query.trim()) return "";
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.append("client", "gtx");
    url.searchParams.append("sl", "auto");
    url.searchParams.append("dt", "t");
    url.searchParams.append("tl", lang);
    url.searchParams.append("q", query);

    try {
        const response = await fetch(url.href);
        const data = await response.json();
        if (data) {
            return data[0].map((item) => item[0].trim()).join("\n");
        } else {
            return "";
        }
    } catch (err) {
        throw err;
    }
}