const handler = async (m, { conn }) => {

const imageUrl = "https://i.postimg.cc/X7H7f51p/IMG.jpg";  

const messageText = `

『 مـرحـبـاً بــك يــا ⌊ ${m.pushName} ⌉ فـي 『 𝑩𝑶𝑫𝒀-bₒₜ 』 』

⌝ قــســم الــفــعــالــيــات ┋🪄⌞ ⇊
⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔

📝┊⇇『 احـــزر 』
📍┊⇇『 عــلــم 』
🗃️┊⇇『 عــيــن 』
⚽┊⇇『 كـــورة 』
📿┊⇇『 ديــــن 』
✨┊⇇『 تــرتــيــب 』
🧩┊⇇『 تـفـكـيـك 』
❓┊⇇『 ســؤال 』
💡┊⇇『 إيـمـوجـي 』
🤔┊⇇『 لـغــــز 』
🍥┊⇇『 لـغــز-أنــمـي 』
🏅┊⇇『 ريــاضــة 』
🧠┊⇇『 ثـقـافـي 』

✦─━── •﹝💀﹞• ──━─✦
⟣ ✧ هـذا الـقـسـم قـيـد الـتـطـويـر ✧ ⟢
✦─━── •﹝💀﹞• ──━─✦

✦ 『 𝑩𝑶𝑫𝒀 』ــوت 💗💛
`.trim();

await conn.sendMessage(m.chat, { text: "*✦ جـــارٍ إرســال الـقـسـم....... 💗*" }, { quoted: m });  

await conn.sendMessage(m.chat, {  
    image: { url: imageUrl },  
    caption: messageText  
}, { quoted: m });  

await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });

};

handler.command = /^قسم-الفعاليات$/i;
handler.tags = ["بــودي"];
handler.help = ["بــودي"];

export default handler;