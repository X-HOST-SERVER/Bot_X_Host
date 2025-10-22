let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `💀 *يرجى كتابة ما تريد ${command === 'اقتراح' || command === 'sugerir' || command === 'sug' ? 'اقتراحه' : 'الإبلاغ عنه'}.*\n\n📌 *مثال الاستخدام:*\n${usedPrefix}${command} إضافة أمر لتحميل الصور من Pinterest 💀`, m)

  if (text.length < 10) return conn.reply(m.chat, `💀 *${command === 'اقتراح' || command === 'sugerir' || command === 'sug' ? 'الاقتراح' : 'الإبلاغ'} يجب أن يحتوي على أكثر من 10 أحرف.*`, m)

  if (text.length > 1000) return conn.reply(m.chat, `💀 *الحد الأقصى لعدد الأحرف هو 1000.*`, m)

  const nombre = await conn.getName(m.sender)
  const teks = `
💀 *${command === 'اقتراح' || command === 'sugerir' || command === 'sug' ? 'اقتراح جديد' : 'بلاغ جديد'} من المستخدم:* *${nombre}*

💬 *المحتوى:*
> ${text}

𝑩𝑶𝑫𝒀 💀
  `.trim()

  // رقم مالك البوت
  const ownerJid = '201104213887@s.whatsapp.net'

  // إرسال الاقتراح/البلاغ للمالك
  await conn.reply(ownerJid, m.quoted ? teks + '\n\n💬 *الرسالة المقتبسة:* ' + m.quoted.text : teks, m, {
    mentions: conn.parseMention(teks)
  })

  // الرد على المستخدم
  m.reply(`💀 *تم إرسال ${command === 'اقتراح' || command === 'sugerir' || command === 'sug' ? 'الاقتراح' : 'البلاغ'} إلى مطور البوت بنجاح.*\n\n✉️ *شكراً لمساهمتك!*`)
}

handler.help = ['اقتراح', 'ابلاغ', 'أبلاغ', 'sugerir', 'sug'].map(cmd => `${cmd} <نص>`)
handler.tags = ['info']
handler.command = /^(اقتراح|ابلاغ|أبلاغ|sugerir|sug)$/i

export default handler