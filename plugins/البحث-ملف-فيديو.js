import yts from "yt-search"

let ytmp3mobi = async (youtubeUrl, format = "mp4") => {
    // ✅ استخراج videoId من جميع روابط يوتيوب
    const regYoutubeId = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = youtubeUrl.match(regYoutubeId)
    const videoId = match ? match[1] : null

    if (!videoId) throw Error("❌ لم أتمكن من استخراج معرف الفيديو من الرابط، تأكد أنه رابط يوتيوب صالح.")

    const urlParam = { v: videoId, f: format, _: Math.random() }
    const headers = { "Referer": "https://id.ytmp3.mobi/" }

    const fetchJson = async (url, fetchDescription) => {
        const res = await fetch(url, { headers })
        if (!res.ok) throw Error(`❌ فشل في ${fetchDescription} | ${res.status} ${res.statusText}`)
        return await res.json()
    }

    const { convertURL } = await fetchJson("https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=" + Math.random(), "الحصول على رابط التحويل")
    const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${new URLSearchParams(urlParam).toString()}`, "الحصول على رابط التقدم")

    let { error, progress, title } = {}
    while (progress != 3) {
        ({ error, progress, title } = await fetchJson(progressURL, "جلب حالة التحويل"))
        if (error) throw Error(`❌ خطأ أثناء التحويل: ${error}`)
    }

    return { title, downloadURL }
}

let handler = async (m, { conn, args, command }) => {
    try {
        if (!args[0]) {
            return m.reply(`🎥 طريقة الاستخدام:
.${command} رابط_يوتيوب أو عنوان_الفيديو

📌 مثال:
.${command} https://youtu.be/MN_JP4gyBNI
.${command} اغنية يمني`)
        }

        let query = args.join(" ")
        let url = query

        // ✅ لو ماكان رابط → نبحث في يوتيوب
        if (!/youtu(\.be|be\.com)/i.test(query)) {
            let search = await yts(query)
            if (!search || !search.videos.length) return m.reply("❌ لم أجد أي نتائج للعنوان المدخل.")
            url = search.videos[0].url
        }

        m.reply("⏳ جاري تجهيز الفيديو (جودة 360p)، انتظر قليلاً...")

        const { title, downloadURL } = await ytmp3mobi(url, "mp4")
        await conn.sendMessage(m.chat, {
            document: { url: downloadURL }, // ⬅️ الآن يرسله كـ ملف document
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            caption: `🎥 *${title}*\n\n𝑩𝑶𝑫𝒀 💀`
        }, { quoted: m })

    } catch (e) {
        m.reply(e.message)
    }
}

// ✅ أوامر بالإنجليزي والعربي
handler.help = ['ytmp4', 'ملف-فيديو']
handler.command = ['ytmp4', 'ملف-فيديو']
handler.tags = ['downloader']

export default handler