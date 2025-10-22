import fetch from 'node-fetch';

const LoveTik = {
    async dapatkan(url) {
        const response = await fetch('https://lovetik.com/api/ajax/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `query=${encodeURIComponent(url)}`
        });

        const data = await response.json();
        if (!data.links || data.links.length === 0) throw new Error("💀 فشل في جلب البيانات من تيك توك! 💀");

        let videos = [];
        let audios = [];

        data.links.forEach(item => {
            if (!item.a) return;
            const formatted = {
                format: item.t.replace(/<.*?>|♪/g, '').trim(),
                resolution: item.s || 'صوت فقط',
                link: item.a
            };

            if (item.ft == 1) {
                videos.push(formatted);
            } else {
                audios.push(formatted);
            }
        });

        videos.sort((a, b) => {
            let resA = parseInt(a.resolution.replace(/\D/g, '')) || 0;
            let resB = parseInt(b.resolution.replace(/\D/g, '')) || 0;
            return resB - resA;
        });

        return { 
            videos, 
            audios, 
            desc: data.desc, 
            author: data.author
        };
    }
};

let handler = async (m, { args, conn, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return m.reply(`💀 *طريقة الاستخدام:*\n\n📌 أرسل رابط فيديو تيك توك ليتم تحميله بدون علامة مائية.\n\n📝 *مثال:* \n\`${usedPrefix + command} https://vt.tiktok.com/xxxxx\`\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`);
        }

        if (!/^https?:\/\/(.*\.)?tiktok\.com\//.test(args[0])) {
            return m.reply("💀 *يجب عليك إدخال رابط تيك توك صالح!* 💀");
        }

        await conn.sendMessage(m.chat, { react: { text: '🍁', key: m.key } });

        let response = await LoveTik.dapatkan(args[0]);

        let caption = `🎥 *تم جلب الفيديو بنجاح!* 💀\n\n📌 *الناشر:* ${response.author}\n📝 *الوصف:* ${response.desc || "لا يوجد وصف"}\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`;

        let sentVideo = false, sentAudio = false;

        if (response.videos.length > 0) {
            let bestVideo = response.videos[0];
            await conn.sendFile(m.chat, bestVideo.link, 'tiktok.mp4', caption, m);
            sentVideo = true;
        }

        if (response.audios.length > 0) {
            let bestAudio = response.audios[0];
            await conn.sendFile(m.chat, bestAudio.link, 'tiktok.mp3', '', m);
            sentAudio = true;
        }

        if (!sentVideo && !sentAudio) {
            return m.reply("💀 *عذرًا، لم أتمكن من تحميل الفيديو أو الصوت!* 💀");
        }

        await conn.sendMessage(m.chat, { react: { text: '💋', key: m.key } });

    } catch (error) {
        m.reply(`💀 *حدث خطأ أثناء تحميل الفيديو:* ${error.message || error.toString()} 💀`);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};

handler.help = ['تيك2', 'تيكتوك2', 'tiktok', 'tt'].map(v => v + ' <رابط>');
handler.tags = ['downloader'];
handler.command = /^(تيك2|تيكتوك2|tiktok|tt)$/i;
handler.register = true;
handler.limit = 2;

export default handler;