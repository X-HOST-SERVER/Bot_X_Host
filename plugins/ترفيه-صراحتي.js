let handler = async (m, { conn, command, text }) => {
let user = m.sender;
  let Lie = `╭━━━[ *الطلب نسبه الصراحه* ]━━━━⬣
┃(@${user.split('@')[0]})
*❈↲ نسبة الصراحه 🦉  ${Math.floor(Math.random() * 100)}%* *من 100%*
│
╰━━━〔 *🛡️ 1.4.9* 〕━━━━━⬣
`.trim()
m.reply(Lie, null, { mentions: conn.parseMention(Lie) })}
handler.help = ['Lie']
handler.tags = ['fun']
handler.command = /^(صراحتي)$/i
export default handler
