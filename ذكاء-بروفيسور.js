/*
• Plugins Ai Support Logic 💀
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C 💀
• Source Scrape: Shannz 💀
*/

import fetch from 'node-fetch';

async function writecream(logic, question) {
  const url = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat";
  const query = [
    { role: "system", content: logic },
    { role: "user", content: question }
  ];
  const params = new URLSearchParams({
    query: JSON.stringify(query),
    link: "writecream.com"
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    let raw = data.response_content || data.reply || data.result || data.text || '';
    let cleaned = raw
      .replace(/\\n/g, '\n')
      .replace(/\n{2,}/g, '\n\n')
      .replace(/\*\*(.*?)\*\*/g, '*$1*');

    return cleaned.trim();
  } catch (error) {
    return `💀 فشل في الحصول على الرد: ${error.message}`;
  }
}

const handler = async (m, { text, conn, command }) => {
  if (!text) {
    let usage = `💀 طريقة استخدام الأمر *${command}*:\n`;
    usage += `\n💬 الصيغة:\n.${command} أنا أعاني من مشكلة معينة...`;
    usage += `\n\n📌 مثال:\n.${command} أنا مريض نفسي وأعاني من أرق`;
    usage += `\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;
    return m.reply(usage);
  }

  let persona = '';
  if (command === 'بروفيسور' || command === 'writecream') {
    persona = 'أنت بروفيسور خبير في علم النفس وتساعد الناس بطريقة مباشرة وسهلة الفهم.';
  } else {
    persona = 'أنت مساعد ذكي يساعد بطريقة محترفة.';
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: '🔥',
      key: m.key
    }
  });

  const response = await writecream(persona, text);
  m.reply(`${response}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
};

handler.command = ['writecream', 'بروفيسور'];
handler.tags = ['ai'];
handler.help = ['writecream السؤال', 'بروفيسور السؤال'];

export default handler;