import fetch from 'node-fetch'

let linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i
let linkRegex1 = /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i
const defaultImage = 'https://files.catbox.moe/k9dlno.jpg'

const handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('🔒 هذا الأمر مخصص للجروبات فقط.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  if (!['antilink', 'welcome', 'antiarabe', 'antispam'].includes(type)) {
    return m.reply(`🌟 استخدم:\n*.on antilink* / *.off antilink*\n*.on welcome* / *.off welcome*\n*.on antiarabe* / *.off antiarabe*\n*.on antispam* / *.off antispam*`)
  }

  if (!(isAdmin || isOwner)) return m.reply('❌ هذا الأمر للمشرفين فقط.')

  chat[type] = enable
  return m.reply(`✅ ${type} ${enable ? 'مفعل' : 'متوقف'} بنجاح.`)
}

handler.command = ['on', 'off']
handler.group = true
handler.register = true
handler.tags = ['group']
handler.help = ['on antilink', 'off antilink', 'on welcome', 'off welcome', 'on antiarabe', 'off antiarabe', 'on antispam', 'off antispam']

handler.before = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  // ANTI SPAM
  if (chat.antispam && m.text && m.text.length > 5000) {
    const delet = m.key.participant
    const msgID = m.key.id
    const userTag = `@${m.sender.split('@')[0]}`

    const fakemek = {
      key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net' },
      message: {
        groupInviteMessage: {
          groupJid: '51995386439-1616969743@g.us',
          inviteCode: 'm',
          groupName: 'P',
          caption: '🚫 تم اكتشاف رسالة مزعجة',
          jpegThumbnail: null
        }
      }
    }

    if (!isBotAdmin) {
      await conn.sendMessage(m.chat, {
        text: `⚠️ تم اكتشاف رسالة طويلة جدًا من ${userTag}\nلكنني لست مشرفًا لذا لا أستطيع حذفها!`,
        mentions: [m.sender]
      }, { quoted: fakemek })
      return false
    }

    try {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: msgID,
          participant: delet
        }
      })

      await conn.sendMessage(m.chat, {
        text: `🚫 تم حذف رسالة طويلة جدًا\nالمستخدم: ${userTag}`,
        mentions: [m.sender]
      }, { quoted: fakemek })
    } catch (error) {
      console.error("Error:", error)
      await conn.sendMessage(m.chat, {
        text: `⚠️ حدث خطأ أثناء محاولة حذف الرسالة الطويلة`,
        mentions: [m.sender]
      }, { quoted: fakemek })
    }

    return false
  }

  // ANTI-ARABE
  if (chat.antiarabe && m.messageStubType === 27) {
    const newJid = m.messageStubParameters?.[0]
    if (!newJid) return

    const number = newJid.split('@')[0].replace(/\D/g, '')
    const arabicPrefixes = ['', '20', '971', '965', '966', '974', '973', '962']
    const isArab = arabicPrefixes.some(prefix => number.startsWith(prefix))

    if (isArab) {
      await conn.sendMessage(m.chat, { text: `🚫 المستخدم ${newJid} تم طرده بسبب التفعيل التلقائي لميزة [ Anti Arabe ]` })
      await conn.groupParticipantsUpdate(m.chat, [newJid], 'remove')
      return true
    }
  }

  // ANTI-LINK
  if (chat.antilink) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const isUserAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
    const text = m?.text || ''

    if (!isUserAdmin && (linkRegex.test(text) || linkRegex1.test(text))) {
      const userTag = `@${m.sender.split('@')[0]}`
      const delet = m.key.participant
      const msgID = m.key.id

      try {
        const ownGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (text.includes(ownGroupLink)) return
      } catch {}

      try {
        await conn.sendMessage(m.chat, {
          text: `🚫 Hey ${userTag}, لا يسمح بنشر الروابط.`,
          mentions: [m.sender]
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: msgID,
            participant: delet
          }
        })

        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      } catch {
        await conn.sendMessage(m.chat, {
          text: `⚠️ لم أتمكن من حذف أو طرد ${userTag}.`,
          mentions: [m.sender]
        }, { quoted: m })
      }

      return true
    }
  }

  // WELCOME / BYE
  if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`
    let profilePic

    try {
      profilePic = await conn.profilePictureUrl(userId, 'image')
    } catch {
      profilePic = defaultImage
    }

    if (m.messageStubType === 27) {
      const txtWelcome = '*مـــنـــور/ه يــقــلــب اخوك/ي*'
      const bienvenida = `
مـــنـــور ..... الـخـࢪابـةة المتواضع :  ${groupMetadata.subject}  
${userMention} مــــنـــور
عدد الاعضاء اصبح الان *${groupSize}*    
> ممنوع لينكات هتاخد طرد فوري🦶
> ممنوع شتايم🫩
> تابع قوانين اللي مكتوبه في وصف البار لعدم المشاكل 🤡
> احنا اخوات كلنا 🤝
> الـفـديـوـهـات الـمـخـالـفـةة مـمـنـوعـه🙂
> شكراً لستماعك لي بوت 𝑩𝑶𝑫𝒀 𝑩𝑶𝑻🤖🤛🤜 
`.trim()

      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: `${txtWelcome}\n\n${bienvenida}`,
        contextInfo: { mentionedJid: [userId] }
      })
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
      const txtBye = '*ابـن الـكـلـب خـࢪج😂*'
      const despedida = `
غـادࢪ كـلـب يـجـي مـحـتـࢪم🐤 ..... الـخـࢪابـةة :${groupMetadata.subject}   
➪ ${userMention}, الـڪـلـب
عـدد الـبـاࢪ🥹💔 🙂💔 *${groupSize}* 
> الي بعدو
`.trim()

      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: `${txtBye}\n\n${despedida}`,
        contextInfo: { mentionedJid: [userId] }
      })
    }
  }
}

export default handler