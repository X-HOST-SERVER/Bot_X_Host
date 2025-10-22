//تحميل من انستا
import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn, command }) => {
  const emoji = '💀';
  const rwait = '🕒';
  const done = '✅';
  const error = '❌';
  const msm = '⚠️';

  if (!args[0]) {
    const example = `${command.startsWith('ان') ? '.' + command : '.instagram'} https://www.instagram.com/reel/xxxxx`;
    return conn.reply(
      m.chat,
      `${emoji} *يرجى إدخال رابط من إنستغرام.*\n\n📌 *مثال على الاستخدام:*\n${example}\n\n📝 *الاستخدام:* تحميل فيديوهات أو صور من إنستغرام عبر الرابط.`,
      m
    );
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', `${emoji} تفضل، تم التحميل بنجاح.\n\n𝑩𝑶𝑫𝒀 💀`, m);
      await m.react(done);
    }
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${msm} حدث خطأ أثناء جلب الوسائط. 💀`, m);
  }
};

// أوامر بالإنجليزي والعربي
handler.command = ['instagram', 'ig', 'انستا', 'انستجرام', 'انستغرام'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig', 'انستا', 'انستجرام', 'انستغرام'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;