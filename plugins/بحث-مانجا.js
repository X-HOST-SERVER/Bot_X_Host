import axios from 'axios';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import cheerio from 'cheerio';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    let obito = [""];
    let lister = ["", "فصل", "تحميل"];
    let [feature, inputs] = text.split(" ");
    if (!lister.includes(feature)) return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو ترك مصفوفتان يا اخي يعني مثال .مانجا  اسم الانمي البوت لا يقبل هكذا .مانجا اسم الانمي وشكرا*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*" + obito.map((v, index) => "   " + v).join("\n"));

    if (lister.includes(feature)) {
        if (feature == "") {
            if (!inputs) return m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*المرجو تقديم اسم الانمي لي عرض المانجا الخاص به وتحميلها 😁*\nالمرجو نقل مرات يعني هكذا .مانجا  الانمي يعني ليس .مانجا الاسم\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");
            await m.reply("انتظر يا اخي جاري البحث...");

            try {
                let res = await search3asq(inputs);
                const buttons = res.map((item, index) => ({
                    header: 'المانجا',
                    title: item.name,
                    description: `رقم ${index + 1}`,
                    id: `.مانجا فصل ${item.link}`
                }));

                conn.relayMessage(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                header: {
                                    title: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*نتائج المــــانجا المطلوبة 😁💛*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`
                                },
                                body: {
                                    text: ''
                                },
                                nativeFlowMessage: {
                                    buttons: [
                                        {
                                            name: 'single_select',
                                            buttonParamsJson: JSON.stringify({
                                                title: 'اخــــتر المانجا',
                                                sections: [
                                                    {
                                                        title: 'قسم المانــــجا',
                                                        highlight_label: '𝑩𝑶𝑫𝒀-BOT',
                                                        rows: buttons
                                                    }
                                                ]
                                            }),
                                            messageParamsJson: ''
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }, {});
            } catch (e) {
                await m.reply('حدثت مشكلة، أعد المحاولة لاحقًا');
            }
        }

        if (feature == "فصل") {
            if (!inputs) return m.reply("مثال: .مانجا فصل الرابط");
            await m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\nانتظر يا اخي جاري جلب الفصول.....\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

            try {
                let res = await getAllChapters(inputs);
                const buttons = res.map((item, index) => ({
                    header: 'الفصول',
                    title: `الفصل ${index + 1}`,
                    description: item.title,
                    id: `.مانجا تحميل ${item.link}`
                }));

                conn.relayMessage(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                header: {
                                    title: `*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\n*فصول المانجا 📜*\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*`
                                },
                                body: {
                                    text: ''
                                    },
                                nativeFlowMessage: {
                                    buttons: [
                                        {
                                            name: 'single_select',
                                            buttonParamsJson: JSON.stringify({
                                                title: 'اختر الــــفصل',
                                                sections: [
                                                    {
                                                        title: 'قسم الفصول',
                                                        highlight_label: '𝑩𝑶𝑫𝒀-BOT',
                                                        rows: buttons
                                                    }
                                                ]
                                            }),
                                            messageParamsJson: ''
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }, {});
            } catch (e) {
                await m.reply('حدثت مشكلة، أعد المحاولة لاحقًا');
            }
        }

        if (feature == "تحميل") {
            if (!inputs) return m.reply("```مثال: .مانجا تحميل الرابط```");
            await m.reply("*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*\nانتظر يا اخي جاري تحميل الفصل يا اخي...\n*⎔ ⋅ ───━ •﹝💀﹞• ━─── ⋅ ⎔*");

            try {
                let data = await getChapterPdf(inputs);
                const [, mangaTitle, chapterNumber] = inputs.match(/manga\/([^/]+)\/(\d+)\/$/);
                const pdfTitle = `${mangaTitle.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())} : ${chapterNumber}`;

                await conn.sendFile(m.chat, data, pdfTitle, "تم تحميل المانجا بواسطة بــودي بوت بنجاح 💛", m, null, {
                    mimetype: 'application/pdf',
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });
            } catch (e) {
                await m.reply('حدثت مشكلة، أعد المحاولة لاحقًا');
            }
        }
    }
};

handler.help = ["مانجا"];
handler.tags = ["anime"];
handler.command = /^(مانجا)$/i;
export default handler;

/* New Line */
async function search3asq(q) {
    try {
        const { data } = await axios.get(`https://3asq.org/?s=${q}&post_type=wp-manga`);
        const $ = cheerio.load(data);

        return $('.tab-summary').map((index, element) => ({
            name: $(element).find('.post-title h3 a').text().trim(),
            link: $(element).find('.post-title h3 a').attr('href'),
            alternativeNames: $(element).find('.mg_alternative .summary-content').text().trim(),
            genres: $(element).find('.mg_genres .summary-content a').map((i, el) => $(el).text()).get().join(', ')
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getAllChapters(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        return $('.wp-manga-chapter').map((index, element) => ({
            title: $(element).text().trim(),
            link: $(element).find('a').attr('href'),
            releaseDate: $(element).find('.chapter-release-date i').text().trim(),
            views: $(element).find('.view').text().trim(),
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getChapterPdf(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const buffers = [];
        const pdfDoc = new PDFDocument();
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);

        const imageLinks = $('.wp-manga-chapter-img').map((index, element) =>
            $(element).attr('src').trim()).get();

        if (imageLinks.length === 0) {
            console.log('No images found.');
            return null;
        }
        for (const [index, imageLink] of imageLinks.entries()) {
            try {
                const imageResponse = await axios.get(imageLink, { responseType: 'arraybuffer' });
                await pdfDoc.addPage().image(Buffer.from(imageResponse.data), { fit: [pdfDoc.page.width, pdfDoc.page.height] });
            } catch (error) {
                console.error(`Error processing image ${index + 1}:`, error);
            }
        }

        pdfDoc.end();

        pdfStream.on('data', (chunk) => buffers.push(chunk));

        return new Promise((resolve) => pdfStream.on('end', () => resolve(Buffer.concat(buffers))));
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};