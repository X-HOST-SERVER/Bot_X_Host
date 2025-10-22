import axios from 'axios';
import FormData from 'form-data';

async function Uguu(buffer, filename) {
  try {
    const form = new FormData();
    form.append('files[]', buffer, { filename });
    const { data } = await axios.post('https://uguu.se/upload.php', form, {
      headers: form.getHeaders(),
    });
    if (data.files && data.files[0]) {
      return {
        name: data.files[0].name,
        url: data.files[0].url,
        size: data.files[0].size,
      };
    } else {
      throw new Error('فشل في رفع الصورة 💀');
    }
  } catch (err) {
    throw `💀 حدث خطأ أثناء الرفع: ${err.message}`;
  }
}

let handler = async (m, { conn, command }) => {
  try {
    // إرسال رد فعل "🕒" عند بدء التنفيذ
    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !mime.startsWith('image/'))
      throw `💀 أرسل صورة أو قم بالرد على صورة لاستخدام هذا الأمر.\n\nمثال:\n*${command}* (بالرد على صورة)\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;

    let media = await q.download();
    let ext = mime.split('/')[1];
    let filename = `upload.${ext}`;

    let result = await Uguu(media, filename);

    let { data } = await axios.get(`https://www.abella.icu/rmbg?url=${result.url}`, {
      responseType: 'arraybuffer',
    });

    await conn.sendMessage(m.chat, { image: data }, { quoted: m });

  } catch (error) {
    await conn.sendMessage(m.chat, { text: `${error}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀` }, { quoted: m });
  }
};

handler.help = ['rmbg', 'ازالة-الخلفية2', 'ازاله-الخلفيه2'];
handler.tags = ['tools'];
handler.command = ['rmbg', 'ازالة-الخلفية2', 'ازاله-الخلفيه2'];

export default handler;