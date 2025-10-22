import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
    try {
        const response = await fetch('https://the-end-api.vercel.app/home/sections/Tools/api/matches/yallakora');
        const json = await response.json();

        if (!Array.isArray(json) || json.length === 0) {
            return await conn.reply(m.chat, "> 🚫 *لم يتم العثور على أي مباريات.*", m);
        }

        let message = `> 🏟️ *تفاصيل المباريات القادمة:*\n\n`;

        json.forEach((match, index) => {
            const { stage, status, time, teamA, teamB } = match;

            message += `
> ➩ 🏟️ *المرحلة:* 【 ${stage} 】
> ➩ ⏱️ *الحالة:* 【 ${status} 】
> ➩ 🕒 *التوقيت:* 【 ${time} 】
> ➩ ⚽【 ${teamA.name} 】 〆 【 ${teamB.name} 】
❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱
${index < json.length - 1 ? '\n' : ''}`;
        });

        // إضافة الزخرفة من الصورة
        message += `\n\n> 𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;

        await conn.reply(m.chat, message, m);
    } catch (error) {
        console.error('حدث خطأ:', error);
        await conn.reply(m.chat, `> ❌ *حدث خطأ أثناء جلب تفاصيل المباريات:* 【${error.message}】`, m);
    }
};

handler.help = ['matches'];
handler.tags = ['tools'];
handler.command = /^(مباريات|مباراه)$/i;
handler.owner = false;

export default handler;