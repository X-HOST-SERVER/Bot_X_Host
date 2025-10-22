let handler = async (m) => {
  const reply = ` *لينا يقلبي يتي 😍* `.trim();
  await m.conn.sendMessage(m.chat, {
    text: reply,
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363420844346610@newsletter',
        newsletterName: '𝑩𝑶𝑫𝒀 𝑩𝑶𝑻|بودي بوت💔',
        serverMessageId: 100
      }
    }
  }, { quoted: m });
};

// كلمات مفتاحية للرد التلقائي
handler.customPrefix = /(العمركلو يكوتي|العمر كلو )/i
handler.command = new RegExp;
handler.exp = 0;

export default handler;