import db from '../lib/database.js'
import { createHash } from 'crypto'
import moment from 'moment-timezone'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.sender
  let user = global.db.data.users[who]
  let nameFromContact = await conn.getName(who)
  let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://i.ibb.co/Jww0n5FY/file.jpg')
  let statusData = await conn.fetchStatus(who).catch(() => null)
  let bio = statusData?.status ? statusData.status + ' 💀' : '🕷️ وصف مخفي... 💀'

  // --- إذا المستخدم مسجل بالفعل ---
  if (user.registered) {
    let msgTxt = `🚫 أنت مسجل بالفعل.\n⛩️ اضغط على الزر لحذف التسجيل 💀`

    const thumb = await prepareWAMessageMedia({ image: { url: perfil } }, { upload: conn.waUploadToServer })

    let button = [{
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "🗑 حذف التسجيل",
        id: `${usedPrefix}unreg`
      })
    }]

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: msgTxt },
            footer: { text: "𝑩𝑶𝑫𝒀" },
            header: { hasMediaAttachment: true, imageMessage: thumb.imageMessage },
            nativeFlowMessage: { buttons: button, messageParamsJson: "" }
          }
        }
      }
    }, { userJid: conn.user.jid, quoted: m })

    return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }

  // --- إذا كتب المستخدم "تسجيل" فقط بدون بيانات ---
  if (!text) {
    let fixedAge = 20
    let msgTxt = `╭─『 📌 إرشادات التسجيل 📌 』─╮
☄️ لكتابة الأمر يدويًا:
*${usedPrefix + command} الاسم.العمر*

💥 مثال صحيح:
*${usedPrefix + command} ${nameFromContact}.${fixedAge}*

أو اضغط الزر للتسجيل التلقائي ⬇️
╰──────────────────────────╯`

    const thumb = await prepareWAMessageMedia({ image: { url: perfil } }, { upload: conn.waUploadToServer })

    let button = [{
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "تسجيل تلقائي 🔐",
        id: `${usedPrefix + command} ${nameFromContact}.${fixedAge}`
      })
    }]

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: msgTxt },
            footer: { text: "𝑩𝑶𝑫𝒀" },
            header: { hasMediaAttachment: true, imageMessage: thumb.imageMessage },
            nativeFlowMessage: { buttons: button, messageParamsJson: "" }
          }
        }
      }
    }, { userJid: conn.user.jid, quoted: m })

    return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }

  // --- التحقق من التنسيق الاسم.العمر ---
  if (!Reg.test(text)) {
    let fixedAge = 20
    return m.reply(`❌ الصيغة غير صحيحة.\nاكتب: *${usedPrefix + command} الاسم.العمر*\nمثال: *${usedPrefix + command} ${nameFromContact}.${fixedAge}* 💀`)
  }

  let [_, namex, splitter, agex] = text.match(Reg)
  if (!namex || !agex) return m.reply('❌ تأكد من كتابة الاسم والعمر 💀')
  if (namex.length >= 100) return m.reply('❌ الاسم طويل جدًا 💀')
  let edad = parseInt(agex)
  if (isNaN(edad)) return m.reply('❌ العمر غير صالح 💀')
  if (edad > 1000) return m.reply('❌ العمر غير منطقي 💀')
  if (edad < 5) return m.reply('❌ العمر صغير جدًا 💀')

  // --- حفظ بيانات المستخدم ---
  user.name = namex + '✓'
  user.age = edad
  user.descripcion = bio
  user.regTime = +new Date()
  user.registered = true
  user.coin = (user.coin || 0) + 40
  user.exp = (user.exp || 0) + 300
  user.joincount = (user.joincount || 0) + 20

  let sn = createHash('md5').update(who).digest('hex').slice(0, 20)

  // --- رسالة تأكيد التسجيل للمستخدم ---
  let regbot = `╭── ✅ تم التسجيل ──╮
📛 الاسم: *${namex}*
🎂 العمر: *${edad} سنة*
💰 عملات: +40
✨ خبرة: +300
🪙 رموز: +20
╰──────────────────╯
⛩️ شكراً لتسجيلك 💀`

  await conn.sendMessage(m.chat, { image: { url: perfil }, caption: regbot, mentions: [who] }, { quoted: m })

  // --- إشعار العضو الجديد مع زر قائمة الأوامر ---
  let regNotice = `╭─⊷ عضو جديد ⊶─╮
⛩️ المستخدم: @${who.split('@')[0]}
📛 الاسم: *${user.name}*
🎂 العمر: *${user.age} سنة*
📆 التسجيل: *${moment.tz('Africa/Cairo').format('DD/MM/YYYY')}*
🧬 المعرف: *${sn}*
╰────────────────────╯`

  let channelID = '120363419331719264@g.us'

  const commandButton = [{
    name: "quick_reply",
    buttonParamsJson: JSON.stringify({
      display_text: "⌈🚀╎قائمة الأوامر╎🚀⌋",
      id: ".الاوامر"
    })
  }]

  const thumb = await prepareWAMessageMedia({ image: { url: perfil } }, { upload: conn.waUploadToServer })

  let msg = generateWAMessageFromContent(channelID, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: regNotice },
          footer: { text: "𝑩𝑶𝑫𝒀" },
          header: { hasMediaAttachment: true, imageMessage: thumb.imageMessage },
          nativeFlowMessage: { buttons: commandButton, messageParamsJson: "" }
        }
      }
    }
  }, { userJid: conn.user.jid, quoted: m })

  await conn.relayMessage(channelID, msg.message, { messageId: msg.key.id })
}

handler.help = ['تسجيل', 'سجل', 'register', 'reg']
handler.tags = ['rg']
handler.command = ['تسجيل', 'سجل', 'register', 'reg']

export default handler