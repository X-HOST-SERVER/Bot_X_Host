import fetch from 'node-fetch'  // أو أي مكتبة تستخدمها للـ fetch حسب بيئتك

const handler = async (m, { conn, args, command }) => {
  if (!args[0]) {
    return m.reply(`💀 كيف تستخدم الأمر "${command}"؟\n\nمثال:\n.${command} https://whatsapp.com/channel/0029VbAa17UJkK7J5EAGyT1h/256 Minato Boot 💀`);
  }

  if (!args[0].startsWith("https://whatsapp.com/channel/")) {
    return m.reply("💀 الرابط المرسل غير صالح. الرجاء إرسال رابط قناة واتساب صحيح. 💀");
  }

  const hurufGaya = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
  };

  const emojiInput = args.slice(1).join(' ').toLowerCase();
  const emoji = emojiInput.split('').map(c => {
    if (c === ' ') return '―';
    return hurufGaya[c] || c;
  }).join('');

  try {
    const link = args[0];
    const channelId = link.split('/')[4];
    const messageId = link.split('/')[5];

    const res = await conn.newsletterMetadata("invite", channelId);
    await conn.newsletterReactMessage(res.id, messageId, emoji);

    return m.reply(`💀 تم إرسال رد الفعل *${emoji}* على رسالة في القناة *${res.name}* بنجاح! 💀`);
  } catch (e) {
    console.error(e);
    return m.reply("💀 فشل في إرسال رد الفعل. تأكد من صحة الرابط والرموز المستخدمة. 💀");
  }
};

// الأمر بالعربي والانجليزي معاً
handler.command = /^(reactch|رد-فعل)$/i;

export default handler;

// توقيع
// 𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀