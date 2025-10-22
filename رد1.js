let handler = async (m, { conn, args }) => {
  if (/^تست$/i.test(m.text)) {
    await conn.sendMessage(m.chat, {
      text: '*بودي معاك يسطا😙*',
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363413534233515@newsletter',
          newsletterName: '⛩️ 𝑩𝑶𝑫𝒀 BOT 🌴',
          serverMessageId: 100
        },
        externalAdReply: {
          title: '⛩️ 𝑩𝑶𝑫𝒀 BOT  🌴',
          body: 'اضغط هنا دعم 𝑩𝑶𝑫𝒀 𝗕𝗢𝗧 ⚔️',
          mediaType: 2,
          thumbnailUrl: 'https://i.postimg.cc/X7H7f51p/IMG.jpg', // ← الصورة المصغّرة
          mediaUrl: 'https://chat.whatsapp.com/DRGLrkSyiH9DXdiRhBoeQy?mode=ems_copy_t',
          showAdAttribution: true,
          renderLargerThumbnail: false // ← اجعلها false لعرضها صغيرة يمين الرسالة
        }
      }
    }, { quoted: m });
    return;
  }
};

handler.customPrefix = /^تست$|^امر$|^allامر$|^help$/i;
handler.command = new RegExp;
export default handler;