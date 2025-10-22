import ytSearch from 'yt-search'

function formatNumber(num) {
  const suffixes = ['', 'k', 'M', 'B', 'T']
  const numString = Math.abs(num).toString()
  const numDigits = numString.length

  if (numDigits <= 3) {
    return numString
  }

  const suffixIndex = Math.floor((numDigits - 1) / 3)
  let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1)

  if (formattedNum.endsWith('.0')) {
    formattedNum = formattedNum.slice(0, -2)
  }

  return formattedNum + suffixes[suffixIndex]
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    const exampleQuery = 'Furina Trailer'
    let usageMessage = `💀 طريقة الاستخدام:\n\n`
    usageMessage += `اكتب الأمر ثم اسم ما تريد البحث عنه، مثل:\n`
    usageMessage += `\n${usedPrefix + command} ${exampleQuery}\n`
    usageMessage += `\n🔎 هذا الأمر يبحث عن مقاطع فيديو على YouTube ويعرض النتائج بالتفصيل.\n`
    usageMessage += `\n𝑩𝑶𝑫𝒀 💀`
    return m.reply(usageMessage)
  }

  try {
    const search = await ytSearch(text)
    const videos = search.videos.slice(0, 10)

    if (!videos.length) return conn.reply(m.chat, '💀 لم يتم العثور على نتائج لهذه الكلمة.', m)

    const primary = videos[0]

    let caption = `💀 نتائج البحث عن: "${text}"\n\n`
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i]
      caption += `💀 العنوان : ${v.title}\n`
      caption += `💀 المدة   : ${v.timestamp}\n`
      caption += `💀 المشاهدات: ${formatNumber(v.views)} مشاهدة\n`
      caption += `💀 تم النشر : ${v.ago}\n`
      caption += `💀 الرابط   : ${v.url}\n`
      caption += `💀────────────────────────────\n`
    }

    caption += `\n𝑩𝑶𝑫𝒀 💀`

    await conn.sendMessage(m.chat, {
      text: caption.trim(),
      contextInfo: {
        externalAdReply: {
          title: primary.title,
          thumbnailUrl: primary.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: primary.url
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '💀 حدث خطأ أثناء البحث، حاول مرة أخرى لاحقًا.', m)
  }
}

handler.command = /^(yts(earch)?|بحث-يوتيوب)$/i
handler.help = ['بحث-يوتيوب', 'yts', 'ytsearch']
handler.tags = ['internet']
handler.register = true

export default handler