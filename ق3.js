let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
*┃ 🍥┊❝ مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم الادمن ❞┊🍥┃*  
   *┃ ☠️┊❝ 𝑩𝑶𝑫𝒀 ❞┊☠️┃*  
*┃ 🍡┊❝ قسم الجروبات ❞┊🍡┃*  
*┃ 🔥┊❝ القسـم يـقدم لك أوامر تخص الجروبات ❞┊🔥┃*
*╰───⊰ 🍡❀⊱───╮*  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
🍡 *القسم يقدم لك أوامر لي مساعدتك في ايداره الجروب!* 🍡  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
*╭──⊰ 🍬 قائمة المشرفين 🍬 ⊱──╮*  
🍡 ⩺ ⌟مـنـشـن⌜  
🍡 ⩺ ⌟جـروب⌜  
🍡 ⩺ ⌟طـرد⌜  
🍡 ⩺ ⌟انـذار⌜  
🍡 ⩺ ⌟انذارات⌜  
🍡 ⩺ ⌟لـيـنـك⌜  
🍡 ⩺ ⌟اعـفـاء⌜  
🍡 ⩺ ⌟تـرقـيـه⌜  
🍡 ⩺ ⌟طــرد⌜  
🍡 ⩺ ⌟الـمـتـصـلـيـن⌜  
🍡 ⩺ ⌟تـجـديـد⌜
🍡 ⩺ ⌟مـخـفـي⌜ 
🍡 ⩺ ⌟كـتـم-جروب⌜ 
🍡 ⩺ ⌟الـغـاء-الـكـتـم⌜ 
*╰──⊰ 🍬 ⊱──╯*  
*╭━─━─━─❀💋❀─━─━─━╮*  
*┃ 🍬┊ البوت: 𝑩𝑶𝑫𝒀 ┊🍬┃*  
*┃ ☠️┊ توقيع: 𝑩𝑶𝑫𝒀 ┊☠️┃*  
*╰━─━─━─❀💋❀─━─━─━╯*`;

  const emojiReaction = '🪭';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://i.postimg.cc/X7H7f51p/IMG.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق3)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;