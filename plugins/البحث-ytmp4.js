import fetch from 'node-fetch'

// دالة التحميل
global.loading = async (m, conn, end = false) => {
    // إرسال رد فعل "🕒" عند بدء التنفيذ
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
}

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        let usage = ''
        if (command === 'ytmp4' || command === 'ytv') {
            usage = `💀 طريقة الاستخدام:\nاكتب الأمر متبوعًا برابط يوتيوب والدقة المطلوبة (اختياري)\nمثال:\n.ytmp4 https://youtu.be/xxxxx 720\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`
        } else if (command === 'مقطع') {
            usage = `💀 طريقة الاستخدام:\nاكتب الأمر "مقطع" ثم رابط اليوتيوب والدقة (مثلاً 360، 720، 1080)\nمثال:\nمقطع https://youtu.be/xxxxx 720\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`
        }
        throw usage
    }

    const [url, res] = text.split(' ')
    const resolution = res && /^\d{3,4}$/.test(res) ? res : '360'

    await global.loading(m, conn)
    try {
        const response = await fetch(`https://cloudkutube.eu/api/ytv?url=${encodeURIComponent(url)}&resolution=${resolution}`)
        const data = await response.json()

        if (data.status !== 'success') throw '💀 فشل في الحصول على الفيديو 💀'

        const {
            title, uploader, uploadDate,
            views, likes, resolution: usedRes,
            fileSize, url: videoUrl,
            thumbnail
        } = data.result

        const caption = `💀 ┌───〔 فيديو من يوتيوب 〕
│ 
│ 💀 العنوان : ${title}
│ 💀 القناة : ${uploader}
│ 💀 تم الرفع : ${uploadDate}
│ 💀 المشاهدات : ${views}
│ 💀 الإعجابات : ${likes}
│ 
│ 💀 الجودة : ${usedRes}
│ 💀 الحجم : ${fileSize}
│ 
│ 💀 المصدر: cloudkutube.eu
│ 💀 القناة: https://whatsapp.com/channel/0029Vb2VEyaHAdNLWqDcRz1v
└───────────────
𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: `💀 الجودة: ${usedRes}`,
                    thumbnailUrl: thumbnail,
                    sourceUrl: 'https://cloudkutube.eu',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                },
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363370918801903@newsletter",
                    serverMessageId: 1102,
                    newsletterName: "Cloudkuimages Information"
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        throw `💀 عذرًا، فشل تحميل الفيديو.\n${e.message || e} 💀\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`
    } finally {
        // لا حاجة لتمرير رسالة "تم التحميل"
    }
}

handler.help = ['ytmp4 <الرابط> [الجودة]', ' <الرابط> [الجودة]']
handler.tags = ['downloader']
handler.command = /^(ytmp4|ytvideo|ytv)$/i
handler.limit = true

export default handler