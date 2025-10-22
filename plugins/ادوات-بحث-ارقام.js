let handler = async (m, { conn, text, usedPrefix, command }) => {
    let regex = /x/g;
    if (!text) throw `💀 *طريقة الاستخدام:*\n\nهذا الأمر يسمح لك بالبحث عن الأرقام المحتملة على واتساب من خلال إدخال رقم يحتوي على "x" ليتم استبدالها تلقائيًا بأرقام مختلفة.\n\n📌 *مثال الاستخدام:*\n\`\`\`${usedPrefix + command} 12345x\`\`\`\n\n⚠️ يجب أن تحتوي الأرقام على حرف "x" ليتم التبديل بين القيم المختلفة.`;
    if (!text.match(regex)) throw `💀 *طريقة الاستخدام:*\n\nيرجى إدخال رقم يحتوي على "x" لاستبدالها بالأرقام المحتملة.\n\n📌 *مثال الاستخدام:*\n\`\`\`${usedPrefix + command} ${m.sender.split('@')[0]}x\`\`\``;
    
    let random = text.match(regex).length, total = Math.pow(10, random), array = [];
    for (let i = 0; i < total; i++) {
        if (array.length >= 30) break; // ضمان عرض 30 رقمًا مسجلاً على الأقل
        let list = [...i.toString().padStart(random, '0')];
        let result = text.replace(regex, () => list.shift()) + '@s.whatsapp.net';
        let exists = await conn.onWhatsApp(result).then(v => (v[0] || {}).exists);
        if (exists) {
            let contact = await conn.getName(result);
            let info = await conn.fetchStatus(result).catch(_ => ({ status: 'لا يوجد' }));
            let profile = await conn.profilePictureUrl(result, 'image').catch(_ => 'https://i.imgur.com/4NZ6uLY.jpg');
            array.push({
                jid: result,
                name: contact || '',
                status: info.status || 'لا يوجد',
                profile
            });
        }
    }
    
    if (array.length === 0) return m.reply('💀 لم يتم العثور على أرقام مسجلة على واتساب!');
    
    let txt = '💀 • *الأرقام المسجلة على واتساب:*\n\n' + array
        .map(v => `📞 *رقم:* wa.me/${v.jid.split('@')[0]}\n${v.name ? `👤 *الاسم:* ${v.name}\n` : ''}📝 *الحالة:* ${v.status}\n🖼️ *الصورة:* ${v.profile}`).join('\n\n');
    
    m.reply(txt + '\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀');
}

handler.command = /^(بحث-ارقام|nowa)$/i;
handler.tags = ['أدوات', 'tools'];
handler.help = ['بحث-ارقام', 'nowa'];

export default handler;