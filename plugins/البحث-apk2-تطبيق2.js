import { search, download } from 'aptoide-scraper';

const channelRD = 'https://chat.whatsapp.com/FrSwIvDHsE2HteLrjDgMlP?mode=ems_copy_t';
const sukiIcon = 'https://files.catbox.moe/qjrpvt.jpg';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const name = conn.getName(m.sender);

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    externalAdReply: {
      title: '✨ تحميل تطبيقات APK 💀',
      body: `🌸 جاري التحميل لـ: ${name}`,
      thumbnailUrl: sukiIcon,
      sourceUrl: channelRD,
      mediaType: 1,
      renderLargerThumbnail: true,
    },
  };

  if (!text) {
    return conn.reply(
      m.chat,
      `💀 *مرحباً ${name}*\n\n📥 لاستخدام هذا الأمر، أرسل اسم التطبيق الذي تريد تحميله.\n\n📌 *طريقة الاستخدام:*\n${usedPrefix + command} <اسم التطبيق>\n\n📍 *مثال:*\n${usedPrefix + command} WhatsApp\n\n𝑩𝑶𝑫𝒀 💀`,
      m,
      { contextInfo, quoted: m }
    );
  }

  try {
    await m.react('🔍');

    conn.reply(
      m.chat,
      `🔍 *جاري البحث عن التطبيق المطلوب يا ${name}...* 💀`,
      m,
      { contextInfo, quoted: m }
    );

    const results = await search(text);
    if (!results?.length) {
      return conn.reply(
        m.chat,
        `❌ *عذراً ${name}، لم أتمكن من العثور على أي تطبيق باسم:* "${text}" 💀\n\n𝑩𝑶𝑫𝒀 💀`,
        m,
        { contextInfo, quoted: m }
      );
    }

    const data = await download(results[0].id);
    if (!data?.dllink) {
      return conn.reply(
        m.chat,
        `⚠️ *تعذر الحصول على رابط تحميل لـ:* "${results[0].name}" 💀\n\n𝑩𝑶𝑫𝒀 💀`,
        m,
        { contextInfo, quoted: m }
      );
    }

    await conn.sendMessage(
      m.chat,
      {
        document: { url: data.dllink },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${data.name}.apk`,
        caption: `📦 *تم تحميل التطبيق بنجاح!*\n\n📲 الاسم: ${data.name}\n\n𝑩𝑶𝑫𝒀 💀`,
      },
      { quoted: m }
    );

    await m.react('✅');
  } catch (error) {
    console.error('حدث خطأ أثناء تحميل التطبيق:', error);
    conn.reply(
      m.chat,
      `🚫 *حدث خطأ غير متوقع أثناء المعالجة...*\n\n🔍 *تفاصيل الخطأ:* ${error.message} 💀\n\n𝑩𝑶𝑫𝒀 💀`,
      m,
      { contextInfo, quoted: m }
    );
    await m.react('❌');
  }
};

handler.tags = ['descargas'];
handler.help = ['apk2', 'تطبيق2'];
handler.command = ['apk2', 'تطبيق2'];
handler.group = true;
handler.register = true;
handler.coin = 5;

export default handler;