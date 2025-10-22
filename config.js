// يجب عليك عدم تعديل اي شئ من بدايه السطر ال13 لعدم تخريب اللبوت #
// 𝑩𝒐𝒅𝒆 𝑪𝒐𝒓𝒍𝒆𝒐𝒏𝒆 𝑩𝑶𝑻-𝑴𝑫
import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'


global.owner = [
  ['201119779522', '𝑩𝒐𝒅𝒆', true],
  ['201119779522', '𝑩𝒐𝒅𝒆', true],
]


global.mods = []
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = '𝑸𝑹'
global.namebot = '𝑩𝒐𝒅𝒆'
global.sessions = 'bodesessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

global.packname = '𝑩𝒐𝒅𝒆 𝑩𝒐𝒐𝒕'
global.namebot = '𝑩𝒐𝒅𝒆 𝑩𝒐𝒐𝒕'
global.author = '𝑩𝒐𝒅𝒆 𝑩𝒐𝒐𝒕'
global.moneda = 'Dolar'
global.canalreg = '120363413534233515@newsletter'

global.namecanal = '⌜ 𝑩𝒐𝒅𝒆 𝑩𝒐𝒐𝒕 💀 ⌟  || بوت بودي 💀'
global.canal = 'https://whatsapp.com/channel/0029Vb5K8H490x2oNzMbb82O'
global.idcanal = '120363413534233515@newsletter'

global.ch = {
ch1: '120363413534233515@newsletter',
}

global.multiplier = 69 
global.maxwarn = '2'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})