import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// 💀 وظيفة رفع الفيديو إلى موقع Videy
async function uploadVideo(filePath) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://videy.co/api/upload', formData, {
            headers: { ...formData.getHeaders() }
        });

        return response.data;
    } catch (error) {
        throw new Error('❌ فشل رفع الفيديو، يرجى المحاولة لاحقًا!');
    }
}

// 💀 وظيفة معالجة الأمر
const handler = async (m, { conn, command }) => {
    try {
        await m.react('⌛'); // 🔄 إرسال إشارة انتظار

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        // 💀 التأكد من أن الملف هو فيديو
        if (!mime.startsWith('video/')) {
            throw `❌ *يجب إرسال فيديو مع الأمر أو الرد على فيديو!*\n\n🔹 *مثال الاستخدام:*\n📌 إرسال فيديو مع كتابة:\n\`${command}\`\n📌 أو الرد على فيديو بكتابة:\n\`${command}\``;
        }

        let media = await q.download();
        if (!media) throw '❌ *فشل تحميل الفيديو!*';

        const filePath = './temp_video.mp4';
        await fs.promises.writeFile(filePath, media);

        let result = await uploadVideo(filePath);
        await fs.promises.unlink(filePath);

        await m.react('✅'); // ✔️ إرسال إشارة نجاح

        // 💀 إرسال رابط الفيديو بعد الرفع
        await conn.reply(m.chat, `🟢 *تم رفع الفيديو بنجاح!*\n\n🎥 *معرف الفيديو:* ${result.id}\n🔗 *الرابط:* https://videy.co/v?id=${result.id}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, m);

    } catch (error) {
        await m.react('❌');
        await conn.reply(m.chat, `❌ *خطأ:* ${error.message || error}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`, m);
    }
};

// 💀 إعدادات الأوامر
handler.help = ['لرابط12', 'videy-up'];
handler.tags = ['tools'];
handler.command = /^(لرابط12|videy-up)$/i;

export default handler;