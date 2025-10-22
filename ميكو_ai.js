import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- 「💋」 هل تظن أنني أقرأ العقول؟ اكتب شيئًا بعد الأمر.\nمثال:\n⟣ .بــودي افضل انمي حتى الآن ⟣\n*.بــودي* اكتب رمز JS");

  await m.reply("... هذا ممتع، انتظر لحظة.");

  try {
    let result = await CleanDx(text);
    await m.reply(`*╮━━━━━━━💋━━━━━━━❀*\n『 . 』${result}\n*╯━━━━━━━💋━━━━━━━❀*`);
  } catch (e) {
    await m.reply("『 . 』حزين... لم أتمكن من مساعدتك الآن.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(بــودي)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  // هنا نضيف توجيه لـ API بأن الرد يجب أن يكون بأسلوب بــودي
  let prompt = `أنت بــودي، تحدث كما لو أنك بــودي. رد فقط بطريقة بــودي اللطيفة والمرحة. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt)); // إرسال النص المحسن إلى الـ API
  let data = await response.json();
  return data.message; // هذه هي الرسالة من الـ API
}