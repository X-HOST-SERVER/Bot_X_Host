import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

const API = 'https://eu.qobuz.squid.wtf/api';
const UA = 'Postify/1.0.0';

function getAlbumId(url) {
  const match = url.match(/\/album\/.*?\/([a-zA-Z0-9]+)$/);
  return match ? match[1] : null;
}

function qualities(bit, rate) {
  const q = [
    { id: '5', label: 'MP3 320kbps' },
    { id: '6', label: 'FLAC 16bit (جودة CD)' },
  ];
  if (bit >= 24) q.push({ id: '7', label: 'FLAC 24bit/96kHz (جودة عالية)' });
  if (rate >= 192000) q.push({ id: '27', label: 'FLAC 24bit/192kHz (جودة فائقة)' });
  return q;
}

async function searchTrack(query) {
  const { data } = await axios.get(`${API}/get-music`, {
    params: { q: query, offset: 0 },
    headers: { 'user-agent': UA },
  });
  const track = data?.data?.tracks?.items?.[0];
  if (!track) throw '💀 لم يتم العثور على الأغنية';
  return track;
}

async function fetchAlbum(id) {
  const { data } = await axios.get(`${API}/get-album`, {
    params: { album_id: id },
    headers: { 'user-agent': UA },
  });
  const album = data?.data;
  if (!album?.tracks?.items?.length) throw '💀 الألبوم فارغ أو غير متاح';
  return album;
}

async function fetchDownload(trackId, quality) {
  const { data } = await axios.get(`${API}/download-music`, {
    params: { track_id: trackId, quality },
    headers: { 'user-agent': UA },
  });
  const url = data?.data?.url;
  if (!url) throw '💀 رابط التحميل غير متوفر';
  return url;
}

async function downloadToTemp(url, name = 'track.flac') {
  const temp = path.join(tmpdir(), name);
  const res = await axios({ url, method: 'GET', responseType: 'stream' });
  const writer = fs.createWriteStream(temp);
  await new Promise((resolve, reject) => {
    res.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  return temp;
}

const handler = async (m, { text, args, conn, usedPrefix, command }) => {
  try {
    // رسالة المساعدة المخصصة
    if (!text) {
      let helpMsg = `💀 *طريقة الاستخدام الصحيحة*\n\n`;
      helpMsg += `▸ ${usedPrefix}قبووز <اسم الأغنية> <جودة>\n`;
      helpMsg += `▸ ${usedPrefix}qobuz <song> <quality>\n\n`;
      helpMsg += `*مستويات الجودة:*\n5 = MP3\n6 = FLAC 16bit\n7 = FLAC 24bit\n27 = FLAC 24bit/192kHz\n\n`;
      helpMsg += `*أمثلة:*\n${usedPrefix}قبووز أغنية الحب 7\n`;
      helpMsg += `${usedPrefix}qobuz https://qobuz.com/album/...\n\n`;
      helpMsg += `𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;
      return m.reply(helpMsg);
    }

    let quality = '6';
    if (args[1] && /^[567]|27$/.test(args[1])) quality = args[1];

    let track, album;
    if (text.includes('qobuz.com/album/')) {
      const id = getAlbumId(text);
      if (!id) throw '💀 رابط الألبوم غير صحيح';
      album = await fetchAlbum(id);
    } else {
      track = await searchTrack(text);
      album = await fetchAlbum(track.album.id);
    }

    const q = qualities(
      Math.max(...album.tracks.items.map(t => t.maximum_bit_depth || 0)),
      Math.max(...album.tracks.items.map(t => t.maximum_sampling_rate || 0))
    );

    if (!q.find(q => q.id === quality)) {
      throw `💀 الجودة ${quality} غير متوفرة\nالجودات المتاحة: ${q.map(q => q.id).join(', ')}`;
    }

    await m.reply(`💀 جاري تحميل الألبوم: *${album.title}*...`);

    for (const tr of album.tracks.items) {
      const url = await fetchDownload(tr.id, quality);
      const file = await downloadToTemp(url, `${tr.title}.flac`);

      const caption = `💀 *${tr.title}*\n🎤 الفنان: ${tr.performer?.name || 'غير معروف'}\n💿 الألبوم: ${album.title}\n🎧 الجودة: ${q.find(q => q.id === quality)?.label || 'غير معروف'}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;

      await conn.sendMessage(m.chat, { 
        audio: { url: file },
        mimetype: 'audio/mp4',
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: tr.title,
            body: `من ألبوم: ${album.title}`,
            thumbnailUrl: album.image?.large || null,
            mediaType: 1
          }
        }
      }, { quoted: m });

      fs.unlinkSync(file); // حذف الملف المؤقت
    }

  } catch (e) {
    console.error(e);
    await m.reply(`💀 حدث خطأ!\n${e.message || e}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
  }
};

// الأوامر
handler.help = [
  'qobuz <song> <quality>', 
  'قبووز <أغنية> <جودة>'
];

handler.tags = ['أدوات', 'downloader', 'موسيقى'];

handler.command = /^(قبووز|qobuz)$/i;

export default handler;