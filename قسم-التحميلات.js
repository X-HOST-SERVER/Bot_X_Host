const handler = async (m, { conn }) => {

    const imageUrl = "https://files.catbox.moe/xj1ji9.jpg";

    const messageText = `
*『 ✧ مـرحبـاً بـك يا ⌊ ${m.pushName} ⌉ ✧ 』*  
*فـي قـسم ┇ التحميلات 📥 داخـل بـوت 𓆩𝑩𝑶𝑫𝒀𓆪*

╭───━ • ✦ • ━───╮  
   ⟡ ˚ ༘ ⋆｡𖦹  
   ˚⌝ قـسم التحميلات ⌞ ˚  
╰───━ • ✦ • ━───╯  

📝┊⇇『 ✧ بيـن-فيديـو ✧ 』  
📍┊⇇『 ✧ تـويتر ✧ 』  
🗃️┊⇇『 ✧ جيبـهاب ✧ 』  
🗄️┊⇇『 ✧ جيبتـهوب ✧ 』  
💌┊⇇『 ✧ كـابكـات ✧ 』  
📤┊⇇『 ✧ ميـجا ✧ 』  
📥┊⇇『 ✧ تطبيـق ✧ 』  
📯┊⇇『 ✧ إنستـا ✧ 』  
💎┊⇇『 ✧ تيكتـوك ✧ 』  
🛢️┊⇇『 ✧ تيك-صـوت ✧ 』  
⚙️┊⇇『 ✧ تيك-جـوده ✧ 』  
🖼️┊⇇『 ✧ بيـن-صـور ✧ 』  

╭───━ • ✦ • ━───╮  
 > ✧ استمتع بالتحميلات السريعة ⚡📥 ✧  
╰───━ • ✦ • ━───╯  

> بـودي بـــ𝑩𝑶𝑫𝒀ـــوت 🕷️💗
    `.trim();

    await conn.sendMessage(m.chat, { text: "*_⏳ جاري إرسال قسم التحميلات... 📥_*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } });
};

handler.command = /^قسم-التحميلات$/i;
handler.tags = ["بــودي"];
handler.help = ["قسم-التحميلات"];

export default handler;