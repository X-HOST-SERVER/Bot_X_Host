import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command}) => {
  await m.react('🖕');

  let who = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0]: m.fromMe? conn.user.jid: m.sender;
  let name = await conn.getName(who);
  let username = await conn.getName(m.sender);

  // روابط الصوتيات
  const voiceNotes = [
    'https://files.catbox.moe/iuu9k7.mp3',
    'https://files.catbox.moe/iuu9k7.mp3',
    'https://files.catbox.moe/fap8c9.mp3'
  ];

  // إرسال كل المقاطع الصوتية واحدة تلو الأخرى
  for (let url of voiceNotes) {
    await conn.sendMessage(m.chat, {
      audio: { url},
      mimetype: 'audio/mp4',
      ptt: false
}, { quoted: m});

    await new Promise(resolve => setTimeout(resolve, 1000)); // تأخير بسيط بين كل مقطع
}

  // روابط الصور
  const images = [
    'https://i.postimg.cc/X7H7f51p/IMG.jpg',
    'https://qu.ax/iZTzX.jpg',
    'https://qu.ax/rAkcp.jpg',
    'https://qu.ax/zRwiX.jpg',
    'https://qu.ax/UDNdp.jpg',
    'https://qu.ax/Pdbsp.jpg',
    'https://qu.ax/wiXYr.jpg'
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // تأخير بسيط قبل إرسال جهة الاتصال والإعلان
  setTimeout(async () => {
    // جهة الاتصال
    let list = [{
      displayName: "｢𝑩𝑶𝑫𝒀🧞",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN: 𝑩𝑶𝑫𝒀 🧞
TEL;type=CELL;waid=201104213887:+201119779522
EMAIL;type=INTERNET:taib3a@gmail.com
ADR;type=WORK:;;اليمن-صنعاء;;;;
URL:https://www.instagram.com/dy3_alexander?igsh=YzljYTk1ODg3Zg==
END:VCARD`
}];

    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: `${list.length} جهة اتصال`,
        contacts: list
},
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: 'بودي اليوتيوبر مطور بوتات محترف',
          body: 'اذا كنت تريد شراء بوت او سيرفر تواصل معه',
          thumbnailUrl: randomImage,
          sourceUrl: null,
          mediaType: 1,
          renderLargerThumbnail: true
}
}
}, { quoted: m});

    // رسالة نصية مع زر
    let txt = `
*مرحباً ${username}* 👋

أنا *𝑩𝑶𝑫𝒀*، مطور بوتات واتساب محترف ✨

✅ *الخدمات التي أقدمها:*
- منصه استضافه بوتات باسعار رخيصه جدا وموثوقه
- صنع بوتات واتساب بمواصفات خاصة
- بوتات الدردشة الذكية
- بوتات الإدارة المتكاملة
- بوتات الألعاب والتسلية
- وأنظمة مخصصة حسب طلبك

📲 *للطلب أو الاستفسار:*
+201119779522`;

    await conn.sendMessage(m.chat, {
      text: txt,
      footer: '｢𝑩𝑶𝑫𝒀🧞',
      buttons: [
        {
          buttonId: ".امر",
          buttonText: {
            displayText: 'العودة الى القائمة'
},
          type: 1
}
      ],
      viewOnce: true,
      headerType: 1
}, { quoted: m});

}, 1000);
};

handler.help = ['مطور', 'برمجة', 'طلب-بوت'];
handler.tags = ['services'];
handler.command = /^(مطور|مبرمج|صنع-بوت|المطور|برمجة|بودي|حملي-تونز-بودي|owner)$/i;

export default handler;