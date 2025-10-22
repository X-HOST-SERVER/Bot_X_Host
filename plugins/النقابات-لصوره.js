import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    // رسالة التوضيح
    const usageMessage = `
💀 *طريقة استخدام الأمر:*  
- أرسل ملصق 🌀  
- ثم رد عليه بالأمر: *${usedPrefix + command}*  

📌 *مثال:*  
أرسل ملصق ➝ ثم اكتب:  *.${command}* 💀  

𝑩𝑶𝑫𝒀 💀
`

    const q = m.quoted || m
    const mime = q?.mediaType || ''
    const isAnimated = q?.isAnimated || /animated/.test(JSON.stringify(q)) // محاولة اكتشاف المتحرك

    // لو مش ملصق
    if (!/sticker/.test(mime)) {
        return m.reply(`💀 يجب أن ترد على *ملصق* لتحويله إلى صورة.\n\n${usageMessage}`)
    }

    // تحميل وتحويل اللللللملصق
    const media = await q.download()
    let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)

    // رسالة خاصة إذا كان اللللللملصق متحرك
    let extraNote = isAnimated 
        ? "\n\n⚠️ اللللللملصق كان *متحرك*، تم تحويله إلى صورة ثابتة فقط 💀" 
        : ""

    // إرسال النتيجة
    await conn.sendFile(m.chat, out, 'output.png', `💀 تم تحويل اللللللملصق إلى صورة بنجاح!${extraNote}\n\n𝑩𝑶𝑫𝒀 💀`, m)
}

handler.help = ['toimg', 'img', 'jpg', 'لصوره', 'لصورة']
handler.tags = ['sticker']
handler.command = ['toimg', 'img', 'jpg', 'لصوره', 'لصورة']

export default handler