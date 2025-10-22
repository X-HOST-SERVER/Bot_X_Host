/*
Jangan Hapus Wm Bang 

*Penghitam Waipu  Plugins Esm*

💀 هذا هو إصدار بدون Gemini، جربه الآن!

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E
*/

import axios from "axios";
import fs from "fs";

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';

        // التحقق من أن الميديا المرسلة صورة
        if (!mime.startsWith('image')) 
            throw `💀 قم بالرد على صورة باستخدام الأمر *${usedPrefix + command}* مثال: *${usedPrefix + command}*`;

        const media = await q.download();
        
        // تحديد الفلتر بناءً على الأمر
        const filter = 
            command === 'penghitaman' || command === 'aswad' || command === 'lil-aswad' || command === 'لاسود' || command === 'لسود' || command === 'اسود' 
            ? 'hitam' 
            : 'need';
        
        // إرسال الصورة بعد معالجتها
        const result = await penghitamanMassal({
            buffer: media,
            filter
        });

        await conn.sendMessage(m.chat, {
            image: result,
            caption: `💀 تم تطبيق الفلتر بنجاح!`
        }, { quoted: m });
    } catch (error) {
        m.reply(`💀 قم بالرد على صورة باستخدام الأمر مثال: *${usedPrefix + command}*`);
    }
};

// وظيفة لمعالجة الصورة باستخدام API
async function penghitamanMassal(options = {}) {
    if (!options.buffer) 
        throw new Error("💀 لا يمكن أن يكون الـ Buffer فارغًا!");

    // التأكد من أن الفلتر صحيح
    if (!["need", "coklat", "hitam"].includes(options.filter)) 
        throw new Error("💀 الفلتر غير صالح!");

    const payload = {
        imageData: options.buffer.toString("base64"),
        filter: options.filter
    };

    const res = await axios.post("https://negro.consulting/api/process-image", payload);

    if (res.data && res.data.status === "success" && res.data.processedImageUrl) {
        const imgRes = await axios.get(res.data.processedImageUrl, { responseType: "arraybuffer" });
        return Buffer.from(imgRes.data);
    } else {
        throw new Error("💀 فشل معالجة الصورة.");
    }
}

// إضافة الرسالة التوضيحية لكل أمر
handler.help = ['penghitaman', 'aswad', 'lil-aswad', 'لاسود', 'لسود', 'اسود'];
handler.command = /^(penghitaman|aswad|lil-aswad|لاسود|لسود|اسود)$/i;
handler.tags = ['tools'];

// تخصيص الرسالة التوضيحية بناءً على الأمر المستخدم
handler.handler = async (m, { conn, usedPrefix, command }) => {
    const explanation = {
        'penghitaman': '💀 لاستخدام هذا الأمر، قم بالرد على صورة واستخدام الأمر *penghitaman* للحصول على صورة مع تطبيق الفلتر الأسود.',
        'aswad': '💀 لاستخدام هذا الأمر، قم بالرد على صورة واستخدام الأمر *aswad* للحصول على صورة مع تطبيق الفلتر الأسود.',
        'lil-aswad': '💀 لاستخدام هذا الأمر، قم بالرد على صورة واستخدام الأمر *lil-aswad* للحصول على صورة مع تطبيق فلتر التعتيم.',
        'لاسود': '💀 لاستخدام هذا الأمر، قم بالرد على صورة واستخدام الأمر *لاسود* للحصول على صورة مع تطبيق الفلتر الأسود.',
        'لسود': '💀 لاستخدام هذا الأمر، قم بالرد على صورة واستخدام الأمر *لسود* للحصول على صورة مع تطبيق الفلتر الأسود.',
        'اسود': '💀 لاستخدام هذا الأمر، قم بالرد على صورة واستخدام الأمر *اسود* للحصول على صورة مع تطبيق الفلتر الأسود.',
    };

    const message = explanation[command] || '💀 أمر غير معروف';

    // إرسال الرسالة التوضيحية مع المثال
    await conn.sendMessage(m.chat, {
        text: `${message}\n\nمثال:\n1. قم بالرد على صورة.\n2. استخدم الأمر ${usedPrefix + command}`,
    }, { quoted: m });
};

// إضافة توقيع البوت
handler.footer = "💀𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀";

export default handler;