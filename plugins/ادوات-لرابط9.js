import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  await m.react('🕒')
  if (!mime.startsWith('image/')) {
    return m.reply('💀 *يجب الرد على صورة لإرسالها إلى IBB*')
  }

  let media = await q.download()
  let formData = new FormData()
  formData.append('image', media, { filename: 'file' })

  let api = await axios.post('https://api.imgbb.com/1/upload?key=10604ee79e478b08aba6de5005e6c798', formData, {
    headers: {
      ...formData.getHeaders()
    }
  })

  await m.react('✅')
  if (api.data.data) {
    let txt = '💀 *رفع الصورة إلى IBB* 💀\n\n'
        txt += `*🔖 العنوان:* ${q.filename || 'غير معروف'}\n`
        txt += `*🔖 المعرف:* ${api.data.data.id}\n`
        txt += `*🔖 الرابط:* ${api.data.data.url}\n`
        txt += `*🔖 رابط العرض:* ${api.data.data.url_viewer}\n`
        txt += `*🔖 النوع:* ${mime}\n`
        txt += `*🔖 الملف:* ${q.filename || 'x.jpg'}\n`
        txt += `*🔖 الامتداد:* ${api.data.data.image.extension}\n`
        txt += `*🔖 رابط الحذف:* ${api.data.data.delete_url}\n\n`
        txt += `© 💀 *تم الرفع بواسطة: 𝑩𝑶𝑫𝒀 𝑩𝑶𝑻*`

    await conn.sendFile(m.chat, api.data.data.url, 'ibb.jpg', txt, m)
  } else {
    await m.react('✅')
  }
}
handler.tags = ['تحويل']
handler.help = ['لرابط9', 'toibb']
handler.command = /^(لرابط9|toibb)$/i
handler.register = true 
export default handler