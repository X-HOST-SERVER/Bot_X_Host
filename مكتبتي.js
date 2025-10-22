import fs from 'fs';

const handler = async (m, { conn }) => {
  try {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const dependencies = pkg.dependencies || {};

    let list = Object.keys(dependencies)
      .map((name, i) => `${i + 1}. ${name} : ${dependencies[name]}`)
      .join('\n');

    const message = `📦 *المكتبات المستخدمة في البوت:*\n\n${list}\n\n> 𝑩𝑶𝑫𝒀 𝖡𝖮𝖳 ²`;

    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  } catch (e) {
    await conn.sendMessage(m.chat, { text: "❌ حصل خطأ أثناء قراءة المكتبات." }, { quoted: m });
  }
};

handler.command = ['مكتبتي'];
export default handler;