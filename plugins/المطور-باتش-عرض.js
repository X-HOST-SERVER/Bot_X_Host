import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const exec = promisify(_exec).bind(cp);
const basePath = 'plugins';

// قائمة الأرقام المسموح لها بالتنفيذ
const allowedNumbers = [
    '201119779522@s.whatsapp.net', // الرقم الأول
    '201104213887@s.whatsapp.net'  // الرقم الثاني
];

let displayFileContent = async (filename) => {
    let filePath = path.join(basePath, filename);

    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (err) {
        throw new Error(`الملف ${filename} غير موجود.`);
    }

    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (err) {
        throw new Error(`فشل في قراءة الملف ${filename}: ${err.message}`);
    }
};

const listFilesInDirectory = async () => {
    try {
        const files = await fs.promises.readdir(basePath);
        return files.filter((file) => file.endsWith('.js'));
    } catch (err) {
        throw new Error('فشل في قراءة محتويات المجلد plugins.');
    }
};

const handler = async (m, { conn, text }) => {
    if (!allowedNumbers.includes(m.sender)) {
        await conn.sendMessage(m.chat, { text: `ماذا حلمت ايضا يا عبد` }, { quoted: m });
        return;
    }

    try {
        const files = await listFilesInDirectory();

        if (!text) {
            if (files.length === 0) {
                m.reply('📂 المجلد plugins فارغ.');
                return;
            }

            const fileList = files
                .map((file, index) => `${index + 1}. ${file}`)
                .join('\n');
            m.reply(`📂 عدد الملفات: ${files.length}\n\n${fileList}\n\n💀 اختر ملفًا باستخدام رقمه أو اسمه.`);
            return;
        }

        let filename;
        const index = parseInt(text.trim()) - 1;
        if (!isNaN(index) && index >= 0 && index < files.length) {
            filename = files[index];
        } else {
            const inputName = text.trim().toLowerCase();
            const targetName = inputName.endsWith('.js') ? inputName : `${inputName}.js`;
            filename = files.find((file) => file.toLowerCase() === targetName);
            if (!filename) {
                m.reply('❌ الملف غير موجود. تأكد من الرقم أو الاسم.');
                return;
            }
        }

        const fileContent = await displayFileContent(filename);

        await conn.sendMessage(
            m.chat,
            { text: fileContent },
            { quoted: m }
        );
    } catch (e) {
        console.error(e.message);
        m.reply(`❌ حدث خطأ: ${e.message}`);
    }
};

handler.help = ['getplugin'];
handler.tags = ['owner'];
handler.command = /^(getplugin|عرض-كود|gp|باتش-عرض)$/i;
handler.rowner = true;

export default handler;