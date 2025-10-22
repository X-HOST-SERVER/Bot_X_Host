import fetch from 'node-fetch'
import cheerio from 'cheerio'

const douyin = async (url) => {
  const apiUrl = "https://lovetik.app/api/ajaxSearch"
  const formBody = new URLSearchParams()
  formBody.append("q", url)
  formBody.append("lang", "id")

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "*/*",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: formBody.toString()
  })

  const data = await res.json()
  if (data.status !== "ok") throw "فشل في جلب بيانات دوين."

  const $ = cheerio.load(data.data)
  const title = $("h3").text()
  const thumbnail = $(".image-tik img").attr("src")
  const duration = $(".content p").text()
  const dl = []

  $(".dl-action a").each((i, el) => {
    dl.push({
      text: $(el).text().trim(),
      url: $(el).attr("href")
    })
  })

  return { title, thumbnail, duration, dl }
}

const handler = async (m, { conn, args, command }) => {
  const url = args[0]
  if (!url) {
    // رسالة التوضيح مع تخصيص حسب الأمر (douyin أو دوين)
    const cmd = command.toLowerCase()
    return conn.sendMessage(m.chat, {
      text: `مرحباً 💀
لاستخدام الأمر *${cmd}*، الرجاء إرسال الرابط كما في المثال التالي:

مثال: *.${cmd} https://v.douyin.com/iPHW24DE/*

𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { react: { text: "🔥", key: m.key } })

  try {
    const result = await douyin(url)
    const caption = `*العنوان:* ${result.title} 💀
*المدة:* ${result.duration} 💀

𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`

    const video = result.dl.find(v => /mp4/i.test(v.text))
    const audio = result.dl.find(v => /mp3/i.test(v.text))

    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video.url },
        caption
      }, { quoted: m })
    }

    if (audio) {
      await conn.sendMessage(m.chat, {
        audio: { url: audio.url },
        mimetype: 'audio/mp4',
        ptt: false
      }, { quoted: m })
    }

    if (!video && !audio) {
      throw 'لم يتم العثور على روابط فيديو أو صوت.'
    }
  } catch (e) {
    console.error(e)
    throw 'فشل في تحميل فيديو دوين. تأكد من صحة الرابط.'
  }
}

handler.command = ['douyin', 'دوين']
handler.tags = ['downloader']
handler.help = ['douyin <الرابط>', 'دوين <الرابط>']
handler.premium = false
handler.limit = false

export default handler