let handler = async (m, { conn, participants, groupMetadata }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg' 
const groupAdmins = participants.filter(p => p.admin) 
const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
let text = 
` \n\n🔹 _هذا الأمر يعرض معلومات شاملة عن المجموعة._ \n\n📌 _المعلومات التي يتم عرضها:_ \n1️⃣ _معرف الجروب:_ يعرض المعرف الخاص بالمجموعة.\n   \`${groupMetadata.id}\`\n\n2️⃣ _اسم الجروب:_ يظهر الاسم الحالي للمجموعة.\n   \`${groupMetadata.subject}\`\n\n3️⃣ _وصف الجروب:_ يعرض وصف المجموعة أو يخبرك بعدم وجود وصف.\n   \`${groupMetadata.desc?.toString() || 'لا يوجد وصف متاح 🙃'}\`\n\n4️⃣ _عدد الأعضاء:_ يظهر العدد الإجمالي لأعضاء المجموعة.\n   \`${participants.length} أعضاء 👥\`\n\n5️⃣ _مالك الجروب:_ يعرض المستخدم الذي يملك المجموعة.\n   \`@${owner.split('@')[0]}\`\n\n6️⃣ _قائمة الأدمنز:_ يعرض قائمة بجميع المشرفين في المجموعة.\n   \`${listAdmin}\`\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀\n _
`.trim()
  
await conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, { mentions: [...groupAdmins.map(v => v.id), owner] })   
}

handler.help = ['معلومات_الجروب']
handler.tags = ['جروب']
handler.command = /^(معلومات_الجروب|معلومات_المجموعه|معلومات_gc)$/i
handler.group = true
export default handler