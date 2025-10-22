let handler = async (m) => {
  const reply = ` *🐤عطلاق نت نجس اخاف عليك ونت بتࢪد السلام تتحࢪق* `.trim();
  await m.conn.sendMessage(m.chat, {
    text: reply,
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363420844346610@newsletter',
        newsletterName: '𝑩𝑶𝑫𝒀 𝑩𝑶𝑻|بودي بوت😔',
        serverMessageId: 100
      }
    }
  }, { quoted: m });
};

// كلمات مفتاحية للرد التلقائي
handler.customPrefix = /(عليكم السلام| عليكو)/i
handler.command = new RegExp;
handler.exp = 0;

export default handler;