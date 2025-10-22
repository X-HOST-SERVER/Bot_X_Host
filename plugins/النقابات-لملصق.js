import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'
import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, args, command }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    let buffer

    try {
        // التحقق من الوسائط أو رابط
        if (/image|video|webp|tgs|webm/g.test(mime) && q.download) {
            if (/video|webm/.test(mime) && (q.msg || q).seconds > 20) {
                return conn.reply(m.chat, `✦❀ عذرًا 💀 لا يمكن أن يكون الملصق المتحرك أطول من *20* ثانية 💀`, m)
            }
            buffer = await q.download()
        } else if (args[0] && isUrl(args[0])) {
            const res = await fetch(args[0])
            buffer = await res.buffer()
        } else {
            // رسالة توضيحية للمستخدم مع مثال
            return conn.reply(m.chat, `✦❀ رجاءً 💀 قم بالرد على صورة، فيديو، ملصق، أو رابط صورة 💀 لتحويله إلى ملصق.\n\nمثال: \nإذا أردت تحويل صورة إلى ملصق:\n\n-${command} (قم بالرد على الصورة)\n\n𝑩𝑶𝑫𝒀 💀`, m)
        }

        await m.react('🕓') // ساعة أثناء التحويل 💀

        const stickerData = await toWebp(buffer)
        const finalSticker = await addExif(stickerData, '🅥🅘🅣🅞 💀', '𝑩𝑶𝑫𝒀 💀')

        await conn.sendFile(m.chat, finalSticker, 'sticker.webp', '✦❀ تم تحويل الوسائط إلى ملصق 💀', m)
        await m.react('✅') // تم بنجاح 💀

    } catch (e) {
        await m.react('✖️') // فشل 💀
        console.error('❀ خطأ أثناء إنشاء الملصق 💀:', e)
        conn.reply(m.chat, `✦❀ حدث خطأ أثناء إنشاء الملصق 💀`, m)
    }
}

handler.help = ['s', 'sticker', 'stiker', 'ملصق', 'لملصق']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker', 'ملصق', 'لملصق']

export default handler

async function toWebp(buffer, opts = {}) {
    const { ext } = await fromBuffer(buffer)
    if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif|webp|webm|tgs)/i.test(ext)) throw 'الوسائط غير مدعومة 💀'

    const tempDir = global.tempDir || './tmp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const input = path.join(tempDir, `${Date.now()}.${ext}`)
    const output = path.join(tempDir, `${Date.now()}.webp`)

    fs.writeFileSync(input, buffer)

    const aspectRatio = opts.isFull
        ? `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease`
        : `scale='if(gt(iw,ih),-1,299):if(gt(iw,ih),299,-1)', crop=299:299:exact=1`

    const options = [
        '-vcodec', 'libwebp',
        '-vf', `${aspectRatio}, fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
        ...(ext.match(/(mp4|mkv|m4p|gif|webm)/)
            ? ['-loop', '0', '-ss', '0', '-t', '20', '-preset', 'default', '-an', '-vsync', '0', '-y']
            : []
        )
    ]

    return new Promise((resolve, reject) => {
        fluent(input)
            .addOutputOptions(options)
            .toFormat('webp')
            .save(output)
            .on('end', () => {
                try {
                    const result = fs.readFileSync(output)
                    fs.unlinkSync(input)
                    fs.unlinkSync(output)
                    resolve(result)
                } catch (err) {
                    reject('فشل قراءة الملف بعد التحويل 💀')
                }
            })
            .on('error', (err) => {
                console.error('FFMPEG Error 💀:', err)
                if (fs.existsSync(input)) fs.unlinkSync(input)
                if (fs.existsSync(output)) fs.unlinkSync(output)
                reject('حدث خطأ أثناء تحويل الملف 💀')
            })
            .on('stderr', (stderrLine) => {
                console.log('FFMPEG 💀:', stderrLine)
            })
    })
}

function isUrl(text) {
    return /^https?:\/\/\S+\.(jpg|jpeg|png|gif|webp)$/i.test(text)
}