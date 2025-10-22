let handler = async (m) => {
  const replies = [
    ` *يبنلمتناككهههههههههههههههههه😍* `,
    ` *استغفر الله 💖* `,
    ` *اقلع يبو كلوت 😘* `,
    ` *كسم مين يبنلمتناكةة🖕* `,
    ` *توب يعم استغفرالله العظيم😔* `
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)].trim();
  await m.conn.sendMessage(m.chat, {
    text: reply,
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363413534233515@newsletter',
        newsletterName: '𝑩𝑶𝑫𝒀 𝑩𝑶𝑻|بودي بوت💔',
        serverMessageId: 100
}
}
}, { quoted: m});
};

// كلمات مفتاحية للرد التلقائي
handler.customPrefix = /(كسمك|كصمك)/i
handler.command = new RegExp;
handler.exp = 0;

export default handler;