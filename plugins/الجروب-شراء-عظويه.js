// الكود الأصلي بواسطة The Carlos 👑
// تمت الترجمة والتعديل بواسطة 𝑩𝑶𝑫𝒀 💀

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const emoji = '💀';
  const moneda = '💀 عملات سحرية';
  let user = global.db.data.users[m.sender];

  const isOwner = global.owner?.map(v => v + '@s.whatsapp.net').includes(m.sender);
  if (isOwner) {
    user.premium = true;
    user.premiumTime = Infinity;
    return conn.reply(m.chat, `${emoji} *أنت المطور الأعلى!*\n💀 تم منحك عضوية بريميوم دائمة.`, m);
  }

  if (!text) {
    return conn.reply(
      m.chat,
      `${emoji} *يجب تحديد مدة الاشتراك.*\n\n💀 *طريقة الاستخدام:*\nاكتب:\n${usedPrefix + command} 1 يوم\n\nمثال:\n${usedPrefix + command} 2 ايام\n\n💀 الوحدات المسموح بها:\n- دقيقة\n- دقائق\n- ساعة\n- ساعات\n- يوم\n- ايام\n\n𝑩𝑶𝑫𝒀 💀`,
      m
    );
  }

  let [amount, unit] = text.trim().split(' ');
  amount = parseInt(amount);
  unit = unit?.toLowerCase();

  if (isNaN(amount) || amount <= 0) {
    return conn.reply(m.chat, `${emoji} *العدد يجب أن يكون رقمًا موجبًا.*`, m);
  }

  const unidades = {
    دقيقة: 1,
    دقائق: 1,
    ساعة: 60,
    ساعات: 60,
    يوم: 1440,
    ايام: 1440
  };

  if (!unit || !(unit in unidades)) {
    return conn.reply(m.chat, `${emoji} *وحدة الوقت غير صالحة.*\n💀 استخدم: دقيقة، دقائق، ساعة، ساعات، يوم، ايام.`, m);
  }

  let minutos = amount * unidades[unit];

  if (minutos > 10080) {
    return conn.reply(m.chat, `${emoji} *لا يمكنك شراء أكثر من 7 أيام بريميوم في كل مرة.*`, m);
  }

  let costo = Math.ceil(minutos / 100);

  if (user.coin < costo) {
    return conn.reply(
      m.chat,
      `${emoji} *ليس لديك ما يكفي من ${moneda}.*\n💀 المطلوب: *${costo}* و المتوفر: *${user.coin || 0}*.`,
      m
    );
  }

  user.coin -= costo;
  user.premium = true;
  user.premiumTime = Date.now() + minutos * 60 * 1000;

  return conn.reply(
    m.chat,
    `${emoji} *تمت عملية الشراء بنجاح!*\n💀 أصبحت الآن عضو بريميوم لمدة *${amount} ${unit}*.\n💀 تم خصم *${costo} ${moneda}* من رصيدك.\n\n🧙‍♂️💀 ستحميك قوى الظلال أيها المحارب.\n\n𝑩𝑶𝑫𝒀 💀`,
    m
  );
};

handler.help = ['comprarpremium <المدة> <الوحدة>'];
handler.tags = ['premium'];
handler.command = [
  'comprarpremium', 'premium', 'vip',
  'شراء-عضوية', 'شراء-عظويه', 'اشتراك-بريمو'
];
handler.register = true;

export default handler;