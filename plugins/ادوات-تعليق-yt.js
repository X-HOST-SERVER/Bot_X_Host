let handler = async (m, { conn, text, command }) => {
  if (!text) {
    throw `💀 مرحبًا بك في أمر *${command}* 💀

❖ وظيفة هذا الأمر:
إنشاء تعليق وهمي على شكل صورة كما لو كنت تعلق على فيديو في يوتيوب.

❖ كيفية الاستخدام:
*اكتب الأمر ثم اكتب التعليق الذي تريده.*

❖ مثال عملي:
.${command} هذا تعليق رائع!`
  }

  let avatar = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
  let username = conn.getName(m.sender)
  let url = global.API('https://some-random-api.com', '/canvas/misc/youtube-comment', {
    avatar: avatar,
    comment: text,
    username: username
  })

  await conn.sendFile(m.chat, url, 'comment.png', `💀 تم إنشاء تعليقك بنجاح!

💀 *التعليق:* ${text}

𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, m)
}

handler.help = ['ytcomment', 'تعليق-yt']
handler.tags = ['tools']
handler.command = /^(ytcomment|تعليق-yt)$/i
handler.limit = true

export default handler