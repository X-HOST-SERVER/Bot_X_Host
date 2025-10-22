import axios from 'axios';

const handler = async (m, { args, command }) => {
    if (!args.length) {
        return m.reply(`💀 | *طريقة الاستخدام:*  
❖ أرسل الأمر مع سؤالك للحصول على إجابة من الذكاء الاصطناعي.  
❖ مثال:  
  *.${command} ما هو اليوم؟*  

𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
    }

    let query = encodeURIComponent(args.join(" "));
    let apiUrl = `https://www.laurine.site/api/ai/heckai?query=${query}`;

    try {
        let response = await axios.get(apiUrl);
        let data = response.data;

        if (!data.status || !data.data) {
            return m.reply("💀 | ❌ *لم يتمكن الذكاء الاصطناعي من تقديم إجابة.*");
        }

        // تصفية النص لإزالة الكلمات أو الرموز الزائدة
        let answer = data.data
            .replace(/\*\*/g, '') // إزالة التنسيقات الزائدة
            .replace(/\s{2,}/g, ' ') // تقليل الفراغات المكررة
            .replace(/\bم\s?رحبآ\b/g, 'مرحبا') // تصحيح كلمة "م رحبآ" إلى "مرحبا"
            .trim();

        m.reply(`💀 | 🤖 *رد الذكاء الاصطناعي:*  

📌 *الإجابة:*  
${answer}  

𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
    } catch (error) {
        console.error(error);
        return m.reply("💀 | ❌ *حدث خطأ أثناء الوصول إلى الذكاء الاصطناعي. حاول مرة أخرى لاحقًا.*");
    }
};

handler.command = /^(بــودي)$/i;

export default handler;