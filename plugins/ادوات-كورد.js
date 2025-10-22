import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { text, command }) => {
    if (!text) {
        return m.reply(`❌ *يجب عليك إدخال اسم الأغنية للحصول على الكوردات!*\n\n📌 *طريقة الاستخدام:*\n- قم بإرسال الأمر مع اسم الأغنية التي تريد البحث عن كورداتها.\n- مثال:\n\`\`\`/${command} Someone Like You\`\`\`\n\n✅ *سيتم جلب الكوردات وإرسالها لك مباشرة.*\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`)
    }

    let result = await chord(text)
    if (!result) return m.reply(`❌ *عذرًا، لم يتم العثور على كوردات لهذه الأغنية!* 💀`)

    m.reply(`🎵 *الأغنية:* ${result.title} 💀\n🎸 *الكوردات:* \n\n${result.chord} 💀\n\n𝑩𝑶𝑫𝒀 𝑩𝑶𝑻💀`)
}

handler.help = ['chord', 'كورد', 'كوردات']
handler.tags = ['music', 'موسيقى']
handler.command = /^(chord|كورد|كوردات)$/i

handler.limit = true

export default handler

export async function chord(query) {
    return new Promise(async (resolve, reject) => {
        const head = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
            "Cookie": "__gads=ID=4513c7600f23e1b2-22b06ccbebcc00d1:T=1635371139:RT=1635371139:S=ALNI_MYShBeii6AFkeysWDKiD3RyJ1106Q; _ga=GA1.2.409783375.1635371138; _gid=GA1.2.1157186793.1635371140; _fbp=fb.1.1635371147163.1785445876"
        }

        let { data } = await axios.get(`http://app.chordindonesia.com/?json=get_search_results&exclude=date,modified,attachments,comment_count,comment_status,thumbnail,thumbnail_images,author,excerpt,content,categories,tags,comments,custom_fields&search=${query}`, { headers: head })

        if (!data.posts.length) return resolve(null)

        axios.get(`http://app.chordindonesia.com/?json=get_post&id=${data.posts[0].id}`, { headers: head })
            .then(anu => {
                let $ = cheerio.load(anu.data.post.content)
                resolve({
                    title: $("img").attr("alt"),
                    chord: $("pre").text().trim()
                })
            })
            .catch(reject)
    })
}