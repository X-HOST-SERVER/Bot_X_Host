const dir = [
"https://telegra.ph/file/cb68e3f56e4a487966d85.jpg",
"https://telegra.ph/file/7f0b3d1d2dd00bb8bfe54.jpg",
"https://telegra.ph/file/bffefaf09e71f10a12907.jpg",
"https://telegra.ph/file/51b4c9fda1d1ce0114b59.jpg",
"https://telegra.ph/file/abe91d81a9235d595dc38.jpg",
        "https://telegra.ph/file/e54458c9ffe147a71428e.jpg",
        "https://telegra.ph/file/a57345b352cb85c5ea018.jpg",
        "https://telegra.ph/file/ccc6ec157d9afe1f977e9.jpg",
        "https://telegra.ph/file/99ffa2113374204a9392f.jpg",
        "https://telegra.ph/file/9b410209d1a1da372c7f0.jpg",
        "https://telegra.ph/file/b3b0f9b0bb3f0e1dc91e8.jpg",
        "https://telegra.ph/file/fd5816c7c16ed218a9377.jpg",
        "https://telegra.ph/file/09a1c0a6a76fe48d07023.jpg",
        "https://telegra.ph/file/db3900d98ae34c2801f18.jpg",
        "https://telegra.ph/file/935dc1877f816ab00d93e.jpg",
        "https://telegra.ph/file/a0f421d40fb1e4db9aac2.jpg",
        "https://telegra.ph/file/8f1d3ef8db3c5b005fd32.jpg",
        "https://telegra.ph/file/7b44a8a01a24f4c4cec39.jpg",
        "https://telegra.ph/file/647cc55114e1dd409591b.jpg",
        "https://telegra.ph/file/64cd9ee051d11cde320d6.jpg",
        "https://telegra.ph/file/d7fcbe0430a132ce6ff0d.jpg",
        "https://telegra.ph/file/03c840593ba04ed044c6c.jpg",
        "https://telegra.ph/file/71cb3d7f871625e69d331.jpg",
        "https://telegra.ph/file/dd982326318b36111ae49.jpg",
        "https://telegra.ph/file/9d9b0165e91d57b0e74e5.jpg",
        "https://telegra.ph/file/0f6ce5b3cad5d1f69a952.jpg",
        "https://telegra.ph/file/937b3db6be5099fa50746.jpg",
"https://telegra.ph/file/121d7b33a2639e0e2dfe5.jpg",
"https://telegra.ph/file/e196e92fc6edf00b02dd5.jpg",
"https://telegra.ph/file/5d039d8b0d5462ce7c910.jpg",
"https://telegra.ph/file/89a08fd57a6194fcec52f.jpg",
"https://telegra.ph/file/d28df19f99ac6df56b294.jpg",
"https://telegra.ph/file/ee71b270e2ceffb524061.jpg",
"https://telegra.ph/file/eb5daf0ce7ae78ea01481.jpg",
"https://telegra.ph/file/28ebc42d9930fe7b3e7ee.jpg",
"https://telegra.ph/file/14ed96f090ec5e6aa9ee9.jpg",
"https://telegra.ph/file/f4d7d02cd7cccdf4c59ed.jpg",
"https://telegra.ph/file/9f3afb0d80bc38c1b45e7.jpg",
"https://telegra.ph/file/c34ba9cc99850a327e913.jpg",
"https://telegra.ph/file/414576afbc66f36f727a8.jpg",
"https://telegra.ph/file/058b7aa821f4148c56f1f.jpg",
"https://telegra.ph/file/236f69011f94522c537d0.jpg",
"https://telegra.ph/file/bd36e89996ebcb1366a0f.jpg",
"https://telegra.ph/file/b639c028baa3ac0084be2.jpg",
"https://telegra.ph/file/d4f11f91c72a2d5d2091d.jpg",
"https://telegra.ph/file/c0221f39e4a3b7c2ba9c3.jpg",
"https://telegra.ph/file/cc5fff02db1e17a301a34.jpg",
"https://telegra.ph/file/ed385fd36adf3057c6930.jpg",
"https://telegra.ph/file/2ccfb426c6616d5885982.jpg",
"https://telegra.ph/file/158415e0509b3f2faf630.jpg",
"https://telegra.ph/file/b2db687ab7dfc00a2718d.jpg"
]
let handler = async (m, { conn }) => {
  conn.sendFile(m.chat, dir[Math.floor(Math.random() * dir.length)], 'dado.webp', '', m)
await conn.sendMessage(m.chat, { react: { text: '🔫', key: m.key } })
}
handler.help = ['dado']
handler.tags = ['game']
handler.command = ['سلاحي'] 

export default handler
