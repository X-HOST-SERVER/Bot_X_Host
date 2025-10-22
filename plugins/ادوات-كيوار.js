import qrcode from "qrcode"

let handler = async (m, { conn, text, command }) => {
  if (!text) {
    return conn.reply(m.chat, `❌ *يجب عليك إدخال نص لإنشاء رمز QR!*\n\n📌 *ماذا يفعل هذا الكود؟*\nهذا الكود يقوم بإنشاء رمز QR لأي نص أو رابط تقوم بإدخاله، مما يسهل مشاركته ومسحه باستخدام الكاميرا أو تطبيقات قراءة QR.\n\n🔹 *كيفية الاستخدام:*\n- أرسل الأمر متبوعًا بالنص أو الرابط الذي تريد تحويله إلى QR.\n- مثال:\n\`\`\`/${command} https://example.com\`\`\`\n- سيتم إنشاء رمز QR وإرساله إليك مباشرةً.\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, m)
  }

  let qrImage = await qrcode.toDataURL(text.slice(0, 2048), { scale: 8 })
  let fileName = 'qrcode.png'
  let caption = `✅ *تم إنشاء رمز QR بنجاح!*\n\n📌 *يمكنك مسح الرمز باستخدام كاميرا هاتفك أو أي تطبيق لقراءة QR.*\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`

  await conn.sendFile(m.chat, qrImage, fileName, caption, m)
}

handler.help = [
  'qr', 'qrcode', 'كيو ار'
].map(v => v + ' <النص>')

handler.tags = ['tools', 'أدوات']
handler.command = /^qr(code)?|كيوار$/i

handler.limit = true
handler.fail = null

export default handler