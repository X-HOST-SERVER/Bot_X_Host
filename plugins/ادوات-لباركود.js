import { toDataURL } from 'qrcode'

let handler = async (m, { conn, text, command }) => {
    let commandText = command.includes('code') || command.includes('لباركود') ? 'لباركود' : 'رمز QR'

    if (!text) return conn.reply(m.chat, `💀 *طريقة الاستخدام:* \n- أرسل الأمر *\`.${commandText} <النص>\`*\n- سيتم تحويل النص إلى ${commandText} وإرساله إليك.\n\n💀 *مثال:* \n\`.${commandText} مرحبًا\``, m)

    conn.sendFile(m.chat, await toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', `💀 *تم إنشاء ${commandText} بنجاح!* \n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, m)
}

handler.help = ['', 'code', 'لباركود'].map(v => 'qr' + v)
handler.tags = ['tools']
handler.command = /^(qr|qrcode|لباركود)$/i
handler.register = true

export default handler