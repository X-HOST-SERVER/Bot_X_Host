import util from 'util'
import path from 'path'

const handler = async (m, { conn, command, usedPrefix }) => {
  let txt = '';
  try {
    const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
    const totalGroups = groups.length;

    for (let i = 0; i < groups.length; i++) {
      const [jid, chat] = groups[i];
      const groupMetadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch((_) => null))) || {};
      const participants = groupMetadata.participants || [];
      const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
      const isBotAdmin = bot?.admin || false;
      const isParticipant = participants.some((u) => conn.decodeJid(u.id) === conn.user.jid);
      const participantStatus = isParticipant ? '👤 مشارك 💀' : '❌ لست مشارك 💀';
      const totalParticipants = participants.length;

      txt += `*◉ الجروب رقم ${i + 1} 💀*
*➤ الاسم:* ${await conn.getName(jid)} 💀
*➤ ID:* ${jid} 💀
*➤ هل البوت أدمن:* ${isBotAdmin ? '✔ نعم 💀' : '❌ لا 💀'}
*➤ الحالة:* ${participantStatus}
*➤ عدد الأعضاء:* ${totalParticipants} 💀
*➤ الرابط:* ${isBotAdmin ? `https://chat.whatsapp.com/${await conn.groupInviteCode(jid) || '--- (خطأ) ---'} 💀` : '--- (ليس أدمن) --- 💀'}\n\n`;
    }

    m.reply(`*قائمة الجروبات الخاصة بالبوت 🤖* 💀

*—◉ العدد الكلي:* ${totalGroups} 💀

${txt}

𝑩𝑶𝑫𝒀 💀`.trim());
  } catch {
    m.reply('❌ حدث خطأ أثناء جلب بيانات الجروبات 💀');
  }
};

handler.help = ['listgroup', 'grouplist', 'gruposlista', 'listagrupos', 'الجروب', 'المجموعه'];
handler.tags = ['owner'];
handler.command = ['listgroup', 'gruposlista', 'grouplist', 'listagrupos', 'الجروب', 'المجموعه'];
handler.rowner = true;
handler.private = true;

export default handler;