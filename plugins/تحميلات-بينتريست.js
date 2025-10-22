import fetch from 'node-fetch'

const handler = async (m, { conn, text, command, usedPrefix }) => {
  // 💀 تحديد اسم الأمر المستخدم (عربي/إنجليزي)
  const commandName = command.toLowerCase()
  const isArabicCommand = commandName === 'بينتريست'

  // 💀 رسالة المساعدة مع أمثلة
  const usageMessage = `
*💀 كيفية الاستخدام:*
▢ *${usedPrefix}${command}* <رابط Pinterest>
▢ *مثال:* ${usedPrefix}${command} https://pin.it/idf8aB4uN

*💀 ملاحظات:*
▢ يدعم تحميل الصور والفيديوهات
▢ يحاول جلب أعلى جودة متاحة
▢ قد لا تعمل بعض الروابط القديمة
`.trim()

  if (!text) {
    const errorMsg = isArabicCommand 
      ? `💀 *يرجى إدخال رابط Pinterest!*\n\n${usageMessage}`
      : `💀 *Please enter Pinterest URL!*\n\n${usageMessage}`
    return m.reply(errorMsg)
  }

  // 💀 تفاعل مع الرسالة
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const api = `https://zenzzapiofficial.vercel.app/downloader/pinterest?url=${encodeURIComponent(text)}`
    const res = await fetch(api)
    
    if (!res.ok) {
      const errorMsg = isArabicCommand
        ? '💀 *فشل الاتصال بخدمة التحميل!*'
        : '💀 *Failed to connect to download service!*'
      throw errorMsg
    }

    const json = await res.json()
    if (!json.status) {
      const errorMsg = isArabicCommand
        ? '💀 *الرابط غير صالح أو المحتوى غير متاح!*'
        : '💀 *Invalid URL or content not available!*'
      throw errorMsg
    }

    const results = json.result
    if (!results || results.length === 0) {
      const errorMsg = isArabicCommand
        ? '💀 *لم يتم العثور على أي وسائط!*'
        : '💀 *No media found!*'
      throw errorMsg
    }

    // 💀 معالجة الفيديو
    const video = results.find(x => x.tag === 'video')
    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video.direct },
        caption: isArabicCommand
          ? `💀 *فيديو من Pinterest*\n🔗 الرابط: ${text}`
          : `💀 *Pinterest Video*\n🔗 URL: ${text}`
      }, { quoted: m })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return
    }

    // 💀 معالجة الصور
    const images = results.filter(x => x.tag === 'image')
    if (!images.length) {
      const errorMsg = isArabicCommand
        ? '💀 *لم يتم العثور على صور!*'
        : '💀 *No images found!*'
      throw errorMsg
    }

    // 💀 اختيار أفضل جودة
    const priority = ['HD', '736P', '474P']
    let image = images.find(img => img.quality === 'HD') 
             || images.find(img => img.quality === '736P') 
             || images.find(img => img.quality === '474P') 
             || images[0]

    await conn.sendMessage(m.chat, {
      image: { url: image.direct },
      caption: isArabicCommand
        ? `💀 *صورة من Pinterest*\n🔗 الرابط: ${text}\n🎚️ الجودة: ${image.quality}`
        : `💀 *Pinterest Image*\n🔗 URL: ${text}\n🎚️ Quality: ${image.quality}`
    }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    const errorMsg = isArabicCommand
      ? '💀 *حدث خطأ أثناء التحميل!*\nيرجى المحاولة لاحقًا.'
      : '💀 *Download error!*\nPlease try again later.'
    m.reply(typeof e === 'string' ? e : errorMsg)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

// 💀 الأوامر المتاحة
handler.help = ['pinterest', 'بينتريست']
handler.tags = ['downloader', 'social']
handler.command = /^(pinterest|بينتريست)$/i

// 💀 توقيع البوت
handler.footer = '𝑩𝑶𝑫𝒀 𝑩𝑶𝑻 💀\n📌 قسم تحميل الوسائط'

export default handler