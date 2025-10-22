import axios from 'axios'

let handler = async (m, { text, conn, args, command, usedPrefix }) => {
  if (!text) throw `[!] *غير صالح*\n*مثال*: ${usedPrefix+command} https://github.com/sadxzyq`
    
  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  })

  shortlink(text).then(a => {
    conn.reply(m.chat, `*الرابط* : ${a.data}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, m)
  })
}

handler.help = ['tinyurl <link>', 'اختصر <رابط>']
handler.tags = ['tools']
handler.command = /^(tinyurl|اختصر)$/i
handler.premium = true
handler.limit = true
export default handler

async function shortlink(url) {
  let isurl = /https?:\/\//.test(url)
  return isurl ? axios.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url)) : ''
}