import axios from 'axios';
import fetch from 'node-fetch';

async function transYt(url) {
  try {
    const response = await axios.get(`https://api.anthiago.com/transkrip/get_subs?url=${url}`, {
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ar',
        'Cookie': 'cf_clearance=os4IxjkWy7UqgKbzs..oeXkY6IP7pp9DqluFrgjaPHs-1720963363-1.0.1.1-2e6zVLxNKX5aaC1sVNR1x6So1w40FWK1gebhjAEUO2nHfgMx9EVdg.wwxg3T5nf.of9mJGpB7BJJ7BqHWX13yQ',
        'Origin': 'https://anthiago.com/transkrip',
        'Referer': 'https://anthiago.com/transkrip/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
      }
    });

    const sub = response.data.subtitles;
    const text = sub.map(item => item.f).join(' ');

    return {
      status: true,
      subtitle: text
    };
  } catch (error) {
    return {
      status: false,
      message: '💀 فشل في جلب الترجمة.',
      error: error.message
    };
  }
}

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
      return [data[0].map((item) => item[0].trim()).join("\n"), data[2]];
    } else {
      return "";
    }
  } catch (err) {
    throw err;
  }
}

const handler = async (m, { conn, args, command }) => {
  // إرسال رد فعل "🕒" عند بدء التنفيذ
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  if (!args.length) {
    return m.reply(`💀 *طريقة استخدام الأمر (${command})*:

يمكنك استخدام هذا الأمر لاستخراج النص المترجم من فيديوهات اليوتيوب التي تحتوي على ترجمة تلقائية أو مرفقة.

*مثال الاستخدام:*
${command} https://youtube.com/watch?v=dQw4w9WgXcQ

𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
  }

  const res = await transYt(args[0]);
  if (!res || !res.subtitle) return m.reply('💀 لم يتم العثور على ترجمة لهذا الفيديو.');

  const translated = await translate(res.subtitle, 'ar');

  let teks = `💀 *استوحى من فيديو يوتيوب*\n\n${translated[0]}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;

  await conn.sendMessage(m.chat, {
    text: teks,
    contextInfo: {
      externalAdReply: {
        title: "💀 استوحى من فيديو",
        body: "استخراج النص العربي من الفيديو",
        thumbnailUrl: "https://files.catbox.moe/kaantq.jpg",
        sourceUrl: args[0],
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  // إرسال رد فعل "✅" عند الانتهاء
  conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.help = ['استوحى'];
handler.command = ['استوحى'];
handler.tags = ['tools'];
handler.limit = true;
handler.premium = false;

export default handler;