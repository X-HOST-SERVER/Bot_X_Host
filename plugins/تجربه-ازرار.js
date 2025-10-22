import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    const sections = [
        {
            title: "📌 قائمة التجربة",
            highlight_label: "🔹 اختر أحد الأوامر التالية:",
            rows: [
                { title: "🔘 زر رد سريع", description: "زر رد سريع للتجربة", id: "test_quick_button" },
                { title: "📄 قائمة تفاعلية", description: "قائمة تحتوي على خيارات", id: "test_list" },
                { title: "⚡ زر قالب", description: "زر يتم إضافته في القالب", id: "test_template" }
            ]
        }
    ];

    const buttons = [
        { buttonId: 'test_quick_button', buttonText: { displayText: '🔘 زر رد سريع' }, type: 1 },
        { buttonId: 'test_template', buttonText: { displayText: '⚡ زر قالب' }, type: 1 }
    ];

    const listMessage = {
        text: "🔹 *تجربة جميع الأزرار المتاحة*\n\nاختر أي نوع من الأزرار أدناه لتجربته:",
        footer: "📌 𝑩𝑶𝑫𝒀 BOT",
        title: "🛠️ تجربة الأزرار",
        buttonText: "🔍 عرض القائمة",
        sections
    };

    const buttonMessage = {
        text: "🔹 *تجربة جميع الأزرار المتاحة*\n\nجرب الضغط على أحد الأزرار أدناه:",
        footer: "📌 𝑩𝑶𝑫𝒀 BOT",
        buttons: buttons,
        headerType: 1
    };

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: "🛠️ تجربة الأزرار"
                    },
                    body: { text: "🔹 جرب جميع أنواع الأزرار هنا 👇" },
                    footer: { text: "📌 𝑩𝑶𝑫𝒀 BOT" },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: "📌 قائمة التجربة",
                                    sections
                                }),
                                messageParamsJson: ''
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: conn.user.jid, quoted: m });

    // إرسال جميع أنواع الأزرار
    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    await conn.sendMessage(m.chat, listMessage, { quoted: m });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['تجربه-ازرار'];
handler.tags = ['test'];
handler.command = ['تجربه-ازرار'];

export default handler;