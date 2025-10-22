import fetch from 'node-fetch'

const nodeToRegion = {
    ae1: '🇦🇪 الإمارات العربية المتحدة',
    bg1: '🇧🇬 بلغاريا',
    br1: '🇧🇷 البرازيل',
    ch1: '🇨🇭 سويسرا',
    cz1: '🇨🇿 جمهورية التشيك',
    de1: '🇩🇪 ألمانيا',
    de4: '🇩🇪 ألمانيا',
    es1: '🇪🇸 إسبانيا',
    fi1: '🇫🇮 فنلندا',
    fr2: '🇫🇷 فرنسا',
    hk1: '🇭🇰 هونغ كونغ',
    hr1: '🇭🇷 كرواتيا',
    id1: '🇮🇩 إندونيسيا',
    il1: '🇮🇱 إسرائيل',
    il2: '🇮🇱 إسرائيل',
    in1: '🇮🇳 الهند',
    ir1: '🇮🇷 إيران',
    ir3: '🇮🇷 إيران',
    ir5: '🇮🇷 إيران',
    it2: '🇮🇹 إيطاليا',
    jp1: '🇯🇵 اليابان',
    kz1: '🇰🇿 كازاخستان',
    lt1: '🇱🇹 ليتوانيا',
    md1: '🇲🇩 مولدوفا',
    nl1: '🇳🇱 هولندا',
    nl2: '🇳🇱 هولندا',
    pl1: '🇵🇱 بولندا',
    pl2: '🇵🇱 بولندا',
    pt1: '🇵🇹 البرتغال',
    rs1: '🇷🇸 صربيا',
    ru1: '🇷🇺 روسيا',
    ru2: '🇷🇺 روسيا',
    ru3: '🇷🇺 روسيا',
    se1: '🇸🇪 السويد',
    tr1: '🇹🇷 تركيا',
    tr2: '🇹🇷 تركيا',
    ua1: '🇺🇦 أوكرانيا',
    ua2: '🇺🇦 أوكرانيا',
    ua3: '🇺🇦 أوكرانيا',
    uk1: '🇬🇧 المملكة المتحدة',
    us1: '🇺🇸 الولايات المتحدة',
    us2: '🇺🇸 الولايات المتحدة',
    us3: '🇺🇸 الولايات المتحدة',

    // إضافة الدول العربية
    eg1: '🇪🇬 مصر',
    ma1: '🇲🇦 المغرب',
    ye1: '🇾🇪 اليمن',
    sa1: '🇸🇦 السعودية',
    kw1: '🇰🇼 الكويت',
    dz1: '🇩🇿 الجزائر',
    jo1: '🇯🇴 الأردن',
    lb1: '🇱🇧 لبنان',
    qa1: '🇶🇦 قطر',
    sy1: '🇸🇾 سوريا',
    tn1: '🇹🇳 تونس',
    om1: '🇴🇲 عمان',
    bh1: '🇧🇭 البحرين',
    ps1: '🇵🇸 فلسطين'
};

const handler = async (m, { text, conn }) => {
    if (!text) return conn.reply(m.chat, '```[🔍] .فحص-الموقع <رابط_الموقع>```\nمثال: `.فحص-الموقع example.com`', m);

    try {
        const response = await fetch(`https://check-host.net/check-http?host=${encodeURIComponent(text)}&max_nodes=43`, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        const { request_id: requestId, permanent_link: reportLink } = data;

        conn.reply(m.chat, `✅ *تم بدء الفحص!*\n📄 *ID الطلب:* ${requestId}\n🔗 *رابط التقرير:* ${reportLink}\n🌐 *رابط الموقع:* ${text}`, m);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const response1 = await fetch(`https://check-host.net/check-result/${requestId}`, {
            headers: { 'Accept': 'application/json' }
        });
        const resultData = await response1.json();

        let results = '';
        for (const [node, data] of Object.entries(resultData)) {
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(result => {
                    const region = nodeToRegion[node.split('.')[0]] || '🌍 منطقة غير معروفة';
                    results += `\n🌍 *المنطقة:* ${region}\n📶 *الحالة:* ${result[3]} ${result[2]}\n⏳ *وقت الاستجابة:* ${result[1] * 1000} مللي ثانية\n🖥️ *IP:* ${result[4]}\n────────────────\n`;
                });
            }
        }

        if (!results) return conn.reply(m.chat, 'لم يتم العثور على نتائج صالحة.', m);

        await conn.reply(m.chat, results, m);
    } catch (error) {
        conn.reply(m.chat, 'فشل في معالجة الطلب. حاول مرة أخرى لاحقًا.', m)
    }
}

handler.help = ['فحص-الموقع', 'check-host']
handler.tags = ['أدوات', 'tools']
handler.command = /^(فحص-الموقع|check-host)$/i

export default handler