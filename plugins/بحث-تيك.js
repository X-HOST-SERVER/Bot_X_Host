import axios from 'axios'
const { proto, generateWAMessageFromContent, generateWAMessageContent } = (await import("@whiskeysockets/baileys")).default

let handler = async (message, { conn, text, usedPrefix, command }) => {
  // إرسال رد فعل "🕒" عند بدء التنفيذ
  conn.sendMessage(message.chat, { react: { text: "🕒", key: message.key } });

  if (!text) {
    let usage = {
      'tiktoksearch': '✍️ أرسل الأمر مع كلمة للبحث عن فيديوهات تيك توك.\nمثال:\n'.concat(`${usedPrefix}${command} جمال الطبيعة`),
      'بحث-تيك': '✍️ أرسل الأمر مع كلمة للبحث عن فيديوهات تيك توك.\nمثال:\n'.concat(`${usedPrefix}${command} سيارات فخمة`),
      'بحث-تكتوك': '✍️ أرسل الأمر مع كلمة للبحث عن فيديوهات تيك توك.\nمثال:\n'.concat(`${usedPrefix}${command} رقص شعبي`)
    }[command] || '✍️ استخدم الأمر مع كلمة مفتاحية للبحث في تيك توك.'

    return conn.reply(message.chat, `💀 ${usage}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, message)
  }

  async function createVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent({ video: { url } }, { upload: conn.waUploadToServer })
    return videoMessage
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  try {
    let results = []
    let { data: response } = await axios.get('https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=' + text)
    let searchResults = response.data
    shuffleArray(searchResults)
    let selectedResults = searchResults.splice(0, 7)

    for (let result of selectedResults) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: '💀 نتائج تيك توك' }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '' + result.title,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(result.nowm)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
      })
    }

    const responseMessage = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({ text: `💀 نتيجة البحث عن: ${text}` }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: '💀 تيك توك - بحث 💀' }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: [...results] })
          })
        }
      }
    }, { quoted: message })

    await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id })
  } catch (error) {
    await conn.reply(message.chat, `💀 حدث خطأ:\n${error}`, message)
  }
}

handler.help = ['tiktoksearch <كلمة>', 'بحث-تيك <كلمة>', 'بحث-تكتوك <كلمة>']
handler.cookies = 1
handler.register = true
handler.tags = ['buscador']
handler.command = ['tiktoksearch', 'بحث-تيك', 'بحث-تكتوك']

export default handler