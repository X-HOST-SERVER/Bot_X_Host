import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, '*`اكتب الامر ياحيدي وبعده العنوان مثال .شغل سورة النازعات رعد الكردي`*', m);

    await m.react('🕓');
    try {
        let searchResults = await searchVideos(args.join(" "));
        let spotifyResults = await searchSpotify(args.join(" "));
        
        if (!searchResults.length && !spotifyResults.length) throw new Error('لم يتم العثور على نتائج.');

        let video = searchResults[0];
        let thumbnail = await (await fetch(video.miniatura)).buffer();

        let messageText = `> *𝑩𝑶𝑫𝒀 𝑩𝑶𝑻 💀.*\n\n`;
        messageText += `${video.titulo}\n\n`;
        messageText += `• *الـمـده:* ${video.duracion || 'غـيـر مـتـوفـࢪ'}\n`;
        messageText += `• *الـمـصـدࢪ:* ${video.canal || 'غير معروف'}\n`;
        messageText += `• *الزمن:* ${convertTimeToSpanish(video.publicado)}\n`;
        messageText += `• *الـࢪابـط:* ${video.url}\n`;

        let ytSections = searchResults.slice(1, 11).map((v, index) => ({
            title: `${index + 1}┃ ${v.titulo}`,
            rows: [
                {
                    title: `🎶 تـحـمـيل بـصـيغه MP3`,
                    description: `الـمـدة: ${v.duracion || 'غـيـر مـتـوفـࢪ'}`, 
                    id: `${usedPrefix}صو ${v.url}`
                },
                {
                    title: `🎥 الـتـحـمـيـل بـصـيغه MP4`,
                    description: `الـمـدة: ${v.duracion || 'غـيـر مـتـوفـر'}`, 
                    id: `${usedPrefix}فيد ${v.url}`
                }
            ]
        }));

        let spotifySections = spotifyResults.slice(0, 10).map((s, index) => ({
            title: `${index + 1}┃ ${s.titulo}`,
            rows: [
                {
                    title: `🎶 تـحـمـيـل صـوت`,
                    description: `الـمـدة: ${s.duracion || 'غــيـࢪ مـتـوفـࢪ'}`, 
                    id: `${usedPrefix}spotify ${s.url}`
                }
            ]
        }));

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: ' اول زر تستطيع اختيار عنوان مشابه لما بحثت والازرار الاخرى لنوع التحميل الذي تود ملاحظات لا يدعم الحجم الكبير',
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            },
            buttons: [
                {
                    buttonId: `${usedPrefix}تحميل_صوت ${video.url}`,
                    buttonText: { displayText: 'صـوت 🔊' },
                    type: 1,
                },
                {
                    buttonId: `${usedPrefix}تحميل_فيديو ${video.url}`,
                    buttonText: { displayText: 'فـيـديـو 🎬' },
                    type: 1,
                },
                {
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'الـبـحث فـي يـوتـيـوب 🔍',
                            sections: ytSections,
                        }),
                    },
                },
            ],
            headerType: 1,
            viewOnce: true
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('✖️');
        conn.reply(m.chat, '*`خطا في البحث عن الفيديو.`*', m);
    }
};

handler.help = ['play *<texto>*'];
handler.tags = ['dl'];
handler.command = ['شغل'];
export default handler;

async function searchVideos(query) {
    try {
        const res = await yts(query);
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }));
    } catch (error) {
        console.error('Error en yt-search:', error.message);
        return [];
    }
}

async function searchSpotify(query) {
    try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.data.slice(0, 10).map(track => ({
            titulo: track.title,
            url: track.url,
            duracion: track.duration || 'No disponible'
        }));
    } catch (error) {
        console.error('Error en Spotify API:', error.message);
        return [];
    }
}

function convertTimeToSpanish(timeText) {
    return timeText
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}