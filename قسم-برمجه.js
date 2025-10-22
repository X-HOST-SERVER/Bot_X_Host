const handler = async (m, { conn }) => {

    const imageUrl = "https://i.postimg.cc/X7H7f51p/IMG.jpg";

    const messageText = `

*╔══✦〘💻〙✦══╗*
  『 مـرحـبــاً بـك يـا ⌊ ${m.pushName} ⌉ 』
        فــي قـســم الـبـرمجــة
      داخـل بـوت *『 𝑩𝑶𝑫𝒀 』*
*╚══✦〘💻〙✦══╝*

*⌝ قــســم الـبــرمجــة ┋💻⌞ ⇊*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*

*💻┊⇇ 『 إحــســب-الــحــروف 』*  
*📎┊⇇ 『 إخــتـصــار-إنــشــاء 』*  
*📎┊⇇ 『 إخــتـصــار 』*  
*🌐┊⇇ 『 أيــ-بــي 』*  
*📶┊⇇ 『 بــنــج 』*  
*📄┊⇇ 『 بــي-دي-اف 』*  
*✨┊⇇ 『 تــشــويــش 』*  
*🧪┊⇇ 『 دي-أن-أس 』*  
*🔍┊⇇ 『 فــحــص-الـمــوقــع 』*  
*🧾┊⇇ 『 هــيــدر 』*

*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*

> ⚡ بــوتــك مـع *『 𝑩𝑶𝑫𝒀 』*  
> دائــمــاً فــي أمــان وخـدمــة 💻
    `.trim();

    await conn.sendMessage(m.chat, { text: "*_جــارٍ إرســال قــســم الــبــرمجــة... ⏳💻_*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '💻', key: m.key } });
};

handler.command = /^قسم-برمجه$/i;
handler.tags = ["بودي"];
handler.help = ["قسم-برمجه"];

export default handler;