import fetch from 'node-fetch'
import FormData from 'form-data'

async function اختصار_رابط(url) {
  let form = new FormData()
  form.append('c', url)
  let res = await fetch('https://fars.ee/u', { method: 'POST', body: form })
  let result = await res.text()
  let match = result.match(/url: (https:\/\/fars.ee\/\S+)/)
  return match ? match[1] : '💀 لم يتمكن من اختصار الرابط، حاول لاحقًا.'
}

async function انشاء_نص(content) {
  let form = new FormData()
  form.append('c', content)
  let res = await fetch('https://fars.ee/?u=1', { method: 'POST', body: form })
  let url = await res.text()
  return url.trim()
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (command === 'اختصار') {
    if (!args[0]) {
      return m.reply(`💀 أين الرابط؟  
🔹 *مثال:* ${usedPrefix}اختصار https://google.com`)
    }
    let url = args[0]
    if (!url.match(/^https?:\/\//)) url = 'https://' + url
    try {
      let result = await اختصار_رابط(url)
      await m.reply(result)
    } catch (e) {
      m.reply('💀 حدث خطأ، حاول لاحقًا.')
    }
  }

  if (command === 'انشاء') {
    if (!args[0]) {
      return m.reply(`💀 أين النص؟  
🔹 *مثال:* ${usedPrefix}انشاء مرحبًا بالعالم`)
    }
    let text = args.join(' ')
    try {
      let result = await انشاء_نص(text)
      await m.reply(result)
    } catch (e) {
      m.reply('💀 تعذر النشر، حاول لاحقًا.')
    }
  }
}

handler.help = ['اختصار <رابط>', 'انشاء <نص>']
handler.command = ['اختصار', 'انشاء']
handler.tags = ['tools']

export default handler

// 𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀