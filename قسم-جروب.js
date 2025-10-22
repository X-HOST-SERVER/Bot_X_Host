import fs from 'fs'

const handler = async (m, { conn }) => {
const imageUrl = "https://i.postimg.cc/X7H7f51p/IMG.jpg";

const messageText = `

『 مـرحبـاً بـك يـا ⌊ ${m.pushName} ⌉ فـي قـسـم الـجـروبـات داخـل بـوت 𝑩𝑶𝑫𝒀 』

⌝ أوامــر الـجـروبـات ┋👥⌞ ⇊
⎔ ⋅ ───━ •﹝🪐﹞• ━─── ⋅ ⎔
┊⇇『 بروفايل 🪪 』
┊⇇『 طــرد 🚫 』
┊⇇『 لــفـل 🎯 』
┊⇇『 مـنـشـن 💥 』
┊⇇『 جــروب 🔒 』
┊⇇『 جـروب2 🔓 』
┊⇇『 تـرقـيـة ⚡ 』
┊⇇『 دعــوة 🎟️ 』
┊⇇『 مـخـفـي 👻 』
┊⇇『 مـعـلـومـات-الـجـروب ℹ️ 』
⎔ ⋅ ───━ •﹝🪐﹞• ━─── ⋅ ⎔

> جروبك مع 𝑩𝑶𝑫𝒀 دائماً بأمان ونظام. 🔐
`.trim();

await conn.sendMessage(m.chat, { text: "*_جاري تحميل قسم الجروب... ⏳👥_*" }, { quoted: m });  

await conn.sendMessage(m.chat, {  
    image: { url: imageUrl },  
    caption: messageText  
}, { quoted: m });  

await conn.sendMessage(m.chat, { react: { text: '👥', key: m.key } });

};

handler.command = /^قسم-جروب$/i;
handler.tags = ["group"];
handler.help = ["قسم-جروب"];

export default handler;