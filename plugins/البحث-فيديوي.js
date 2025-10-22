import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    let contoh = `${usedPrefix + command} سورة الكهف بصوت ماهر المعيقلي`
    return m.reply(
      `💀 *كيفية الاستخدام:*\n` +
      `اكتب رابط أو عنوان المقطع الصوتي أو الفيديو الذي تريد تحميله.\n\n` +
      `📌 *مثال:*\n${contoh}`
    )
  }

  m.react("📹")

  try {
    let urlYT = ''
    // تحقق إذا النص رابط يوتيوب
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(text.trim())) {
      urlYT = text.trim()
    } else {
      // البحث عن الفيديو عبر yt-search
      let search = await yts(text.trim())
      if (!search?.videos?.length) {
        return m.reply('❗ لم يتم العثور على نتائج لهذا البحث.')
      }
      urlYT = search.videos[0].url
    }

    // جودات التجربة بترتيب أولوية: 720 ثم 480
    const qualitiesToTry = ['720', '480']
    let json = null

    for (const quality of qualitiesToTry) {
      let res = await fetch(`https://api.rapikzyeah.biz.id/api/downloader/donlotyete?url=${encodeURIComponent(urlYT)}&type=mp4&quality=${quality}`)
      let data = await res.json()
      if (data.downloadUrl) {
        json = data
        break
      }
    }

    if (!json) throw '💀 لم يتم العثور على رابط التنزيل بجودة مناسبة.'

    await conn.sendFile(m.chat, json.downloadUrl, 'video.mp4', `🎞️ *تم تحميل الفيديو بنجاح*\n📄 *العنوان:* ${json.title}\n🎚️ *الدقة:* ${json.quality}\n\n𝑩𝑶𝑫𝒀 💀`, m)

  } catch (e) {
    m.reply(`❗ حدث خطأ:\n${e.message || e}`)
  }

  m.react("✅")
}

handler.help = ['ytv <رابط أو نص>']
handler.tags = ['downloader']
handler.command = ['ytv', 'فيديوي']
handler.limit = true
handler.register = true

export default handler