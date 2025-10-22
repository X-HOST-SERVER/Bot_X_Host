import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { canLevelUp, xpRange } from '../lib/levelling.js';
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import moment from 'moment-timezone'; // إضافة مكتبة moment-timezone

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms % 3600000 / 60000);
    let s = Math.floor(ms % 60000 / 1000);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

const handler = async (m, { conn, usedPrefix, text, isPrems }) => {
    let d = new Date(new Date() + 3600000);
    let locale = 'ar';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);

    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender);
    let { money, joincount, diamond, exp, limit, level, role } = user;

    // حساب XP و الترقية
    let { min, xp, max } = xpRange(level, global.multiplier);
    let xpToLevelUp = max - exp;

    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered === true).length;
    let more = String.fromCharCode(8206);
    let readMore = more.repeat(850);
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];

    // الوقت المحلي الافتراضي
    let userTimeZone = 'UTC';
    let localTime = moment().tz(userTimeZone).format('HH:mm:ss');
    let localDate = moment().tz(userTimeZone).format('YYYY-MM-DD');

    // إرسال رسالة مبدئية
    const snMessage = '*جاري تجهيز الأكوان💀*';
    conn.fakeReply(m.chat, snMessage, '0@s.whatsapp.net', 'مرحبا بك 👽 في عائلة بودي كورليوني', 'status@broadcast');

    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });

    const images = [
        'https://i.postimg.cc/X7H7f51p/IMG.jpg',
        'https://i.postimg.cc/X7H7f51p/IMG.jpg',
        'https://i.postimg.cc/X7H7f51p/IMG.jpg',
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];

    var messa = await prepareWAMessageMedia({ image: { url: randomImage } }, { upload: conn.waUploadToServer });

    await new Promise(resolve => setTimeout(resolve, 250)); // Optional delay before sending the main message

    conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text: `           
◦ مرحبا بك${taguser}* 💀◈─🕷️〘𝑩𝑶𝑫𝒀〙🕷️─◈
╮─━─ *مـرحـبـا بـك*🍷
┊🍷الإسم:𝑩𝑶𝑫𝒀 ‌|⎆
┊🍷المنشن:@129773024059602@lid|⎆
┊🍷المستوى:0|⎆
╯─━─━─━─━─━─━─━─╰
◈─🕷️〘𝑩𝑶𝑫𝒀〙🕷️─◈
╮─━─ *الـمـطـور*🩸 
┊🩸الإسم: بودي|⎆
╯─━─━─━─━─━─━─━─╰ 
◈─🕷️〘𝑩𝑶𝑫𝒀〙🕷️─◈
╮─━─ *مـعـلـومـات*🌐 
┊🌐 إسم البوت:𝑩𝑶𝑫𝒀|⎆
┊🌐 التشغيل:00:01:29|⎆
╯─━─━─━─━─━─━─━─╰
◈─🕷️〘𝑩𝑶𝑫𝒀-〙🕷️─◈
𝐁𝐘:〔𝑩𝑶𝑫𝒀〕`
                    },
                    footer: {
                        text: '{𝑩𝑶𝑫𝒀} 𝑩𝑶𝑻 𝗩.1💀'
                    },
                    header: {
                        title: '',
                        hasMediaAttachment: true,
                        imageMessage: messa.imageMessage,
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: '『🌍 كواكب الأوامر 』',
                                    sections: [
                                        {
                                            title: '❪🐣┊مـهـام_الـبـوت┊🍡❫',
                                                highlight_label: '𝑩𝑶𝑫𝒀 𝑩𝑶𝑻',
                                                rows: [
  { header: '🚀┊القـ🚀ـسـم الأول', title: '📡┊「قـسـم_الـبـحـث_والـتـنـزيـل」📥', id: '.قسم-البحث' },
  { header: '🎮┊القـ🎮ـسـم الثاني', title: '🎯┊「قـسـم_الألـعـاب_والفـعـالـيـات」☠️', id: '.قسم-الفعاليات' },
  { header: '🎭┊القـ🎭ـسـم الثالث', title: '🎲┊「قـسـم_الـتـرفـيـه_والـتـسـلـيـه」🎉', id: '.قسم-الترفيه' },
  { header: '💻┊القـ💻ـسـم الرابع', title: '👨‍💻┊「قـسـم_الـبـرمـجـه」🧠', id: '.قسم-برمجه' },
  { header: '⭐┊الق⭐ـسـم', title: '🌍┊「قـسـم_الـدول_والـاطـارات」🔍', id: '.قسم-دول' },
  { header: '💬┊القـ💬ـسـم السادس', title: '🗨️┊「قـسـم_الـمـجـمـوعـات」📢', id: '.قسم-جروب' },
  { header: '📲┊القـ📲ـسـم السابع', title: '🛜┊「قـسـم_الـتـحـمـيـل」📥', id: '.قسم-التحميلات' },
  { header: '🔊┊القـ🔊ـسـم الثامن', title: '🎙️┊「قـسـم_الـصـوتـيـات」🔉', id: '.قسم-صوتيات' },
  { header: '🛠️┊القـ🛠️ـسـم التاسع', title: '🧰┊「قـسـم_الأدوات」🧱', id: '.قسم-الادوات' },
  { header: '📿┊القـ📿ـسـم العاشر', title: '🤲🏻┊「قـسـم_الـديـنـي」🕌', id: '.قسم-الدين' },
  { header: '📰┊القـ📰ـسـم الحادي عشر', title: '🔍┊「قـسـم_الأخـبـار_والتواصل」📡', id: '.قسم-بحث' },
  { header: '🤖┊القـ🤖ـسـم الثاني عشر', title: '🧠┊「قـسـم_الذكاء_الاصطناعي」🤖', id: '.قسم-الذكاء' },
  { header: '👑┊القـ👑ـسـم الثالث عشر', title: '🍫┊「قـسـم_الألـعـاب」🍥', id: '.ق1' },
  { header: '💀┊القـ💀ـسـم الرابع عشر', title: '🍨┊「قـسـم_الـمـشـرفـيـن」🍨', id: '.ق3' },
  { header: '👑┊القـ👑ـسـم الخامس عشر', title: '🍨┊「قـسـم_الادوات」🍬', id: '.ق4' },
  { header: '🛡┊القـ🛡ـسـم السادس عشر', title: '🍬┊「قـسـم_الـتـحـمـيـل」🍨', id: '.ق5' },
  { header: '🕹┊القـ🕹ـسـم السابع عشر', title: '🍬┊「قـسـم_الـبـنـك」🍨', id: '.ق6' },
  { header: '🌀┊القـ🌀ـسـم الثامن عشر', title: '🍬┊「قـسـم_الــAI」🍨', id: '.ق7' },
  { header: '🤖┊القـ🤖ـسـم التاسع عشر', title: '🍬┊「قـسـم_الـتـسـلـيـه」🍨', id: '.ق9' },
  { header: '🕋┊القـ📿ـسـم العشرون', title: '🍬┊「قــســم_الـديـن」🍨', id: '.ق10' },
  { header: '🖌️┊القـ🖌️ـسـم الحادي والعشرون', title: '🍬┊「قــســم_الـزخــارف」🍨', id: '.ق11' },
  { header: '⚔️┊القـ⚜️ـسـم الثاني والعشرون', title: '🍬┊「قــســم_الـنـقـابـات」🍨', id: '.ق12' },
  { header: '🗾┊القـ🌅ـسـم الثالث والعشرون', title: '🍬┊「قــســم_الـصــور」🍨', id: '.ق13' },
  { header: '👨🏻‍💻┊القـ👨🏻‍💻ـسـم الرابع والعشرون', title: '🍬┊「 القوانين 」🍨', id: '.القواعد' }
]
                                        }
                                    ]
                                }),
                                messageParamsJson: '𝐕𝐢𝐭𝐨 𝐂𝐨𝐫𝐥𝐞𝐨𝐧𝐞 𝗩.1'
                            },
                            { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"『 المطور👨🏻‍💻 』\",\"id\":\".المطور\"}" },
                            { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"\",\"id\":\". \"}" },
                            {
                                name: "cta_url",
buttonParamsJson: "{\"display_text\":\"『 قناه تحديثات 💀 』\",\"url\":\"https://whatsapp.com/channel/0029Vb5K8H490x2oNzMbb82O\"}"
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: "{\"display_text\":\"\",\"url\":\"\"}"
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: "{\"display_text\":\"\",\"url\":\"://\"}"
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "",
                                    url: "-"
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, {});
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['اوامر', 'الاوامر', 'امر', 'اوامرو', 'الوامر'];

export default handler;