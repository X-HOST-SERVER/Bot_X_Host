let handler = async (m) => {
  const reply = ` ____________________________ 
*لبوي💋*
::::::::::::::::::🖕::::::::::::::::::: `.trim();
  await m.conn.sendMessage(m.chat, {
    text: reply,
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363413534233515@newsletter',
        newsletterName: '𝑩𝒐𝒅𝒆 𝑩𝒐𝒐𝒕🦶',
        serverMessageId: 100
      }
    }
  }, { quoted: m });
};

// كلمات مفتاحية للرد التلقائي
handler.customPrefix = /^(|لبو|يا لبوه|لبوه|لبوه|||)$/i;
handler.command = new RegExp;
handler.exp = 0;

export default handler;