let handler = async (m) => {
    const reply = `

*___________________________*
*شرموطي🫦*
*___________________________*
*:::::::::::::::::💫:::::::::::::::::::*
`.trim();

    await m.reply(reply);
};

// كلمات مفتاحية للرد التلقائي
handler.customPrefix = /^(|شرموطي|شرموطه|شرموطتي|شرموطتي|||)$/i;
handler.command = new RegExp;
handler.exp = 0;

export default handler;