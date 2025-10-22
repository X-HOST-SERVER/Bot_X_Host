let handler = async (m) => {
    const reply = `

____________________________
*مزي🌝🫦*
____________________________
::::::::::::::::::💫:::::::::::::::::::
`.trim();

    await m.reply(reply);
};

// كلمات مفتاحية للرد التلقائي
handler.customPrefix = /^(|مزتي|مزاتي|مزي|مزاتي|||)$/i;
handler.command = new RegExp;
handler.exp = 0;

export default handler;