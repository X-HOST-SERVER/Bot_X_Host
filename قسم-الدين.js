const handler = async (m, { conn }) => {

    const imageUrl = "https://files.catbox.moe/hq9uk4.jpg";

    const messageText = `
*『 مرحبا بك يا  ⌊ ${m.pushName} ⌉ في بــودي بـــ𝑩𝑶𝑫𝒀ـــوت 』*

*⌝ قسم الدين ┋🕋⌞ ⇊*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*
*🕋┊⇇『اذكار-الصباح』*
*🕋┊⇇『اذكار-المساء』*
*🕋┊⇇『اذكار-النوم』*
*🕋┊⇇『دعاء』*
*🕋┊⇇『فيديو-قرآن』*
*🕋┊⇇『مواقيت_الصلاة』*
*🕋┊⇇『خطبة』*
*🕋┊⇇『دعاء-رمضان』*
*🕋┊⇇『الله』*
*🕋┊⇇『حديث』*
*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*

> بــودي بـــ𝑩𝑶𝑫𝒀ـــوت 💗💛
    `.trim();

    await conn.sendMessage(m.chat, { text: "*_جاري إرسال القسم....... 💗📿_*" }, { quoted: m });

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messageText
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '🕋', key: m.key } });
};

handler.command = /^قسم-الدين$/i;
handler.tags = ["بــودي"];
handler.help = ["قسم-الدين"];

export default handler;