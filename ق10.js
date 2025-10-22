let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
*┃ 🍥┊❝ مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم الزخارف ❞┊🍥┃*  
   *┃ ☠️┊❝ 𝑩𝑶𝑫𝒀 ❞┊☠️┃*  
*┃ 🍡┊❝ قسم الزخارف ❞┊🍡┃*  
*┃ 🔥┊❝ القسـم يـقدم لك أوامر تخص الزخارف ❞┊🔥┃*
*╰───⊰ 🍡❀⊱───╮*  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
🍡القسم يقدم لك أوامر المتعلقه بي الزخارف🍡  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
*╭──⊰ 🍬 قائمة الزخارف 🍬 ⊱──╮*  
🍡 ⩺ ⌟زخــرفـه1⌜
🍡 ⩺ ⌟زخــرفـه2⌜
🍡 ⩺ ⌟زخــرفـه3⌜  
🍡 ⩺ ⌟زخــرفـه4⌜  
🍡 ⩺ ⌟زخــرفـه5⌜  
🍡 ⩺ ⌟زخــرفـه6⌜ 
🍡 ⩺ ⌟زخــرفـه7⌜
🍡 ⩺ ⌟زخــرفـه8⌜
🍡 ⩺ ⌟زخرفـه9⌜
🍡 ⩺ ⌟زخــرفـه10⌜
🍡 ⩺ ⌟زخــرفـه11⌜
*╰──⊰ 🍬 ⊱──╯*  
*✦ ━━━━━ ❀💋❀ ━━━━━ ✦*  
🍡 *┊ مـلاحظـة 🍡 : القسم تحت التطوير!*  
*╭━─━─━─❀💋❀─━─━─━╮*  
*┃ 🍬┊ البوت: 𝑩𝑶𝑫𝒀 ┊🍬┃*  
*┃ ☠️┊ توقيع: 𝑩𝑶𝑫𝒀 ┊☠️┃*  
*╰━─━─━─❀💋❀─━─━─━╯*`;

  const emojiReaction = '📜';

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

handler.command = /^(ق11)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;