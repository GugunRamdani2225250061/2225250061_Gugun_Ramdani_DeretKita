// Membuat ikon PNG aplikasi tanpa pustaka tambahan.
// Gambar: 4 batang yang tumbuh berlipat (1, 2, 4, 8), simbol barisan geometri.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'

const TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function png(w, h, pix) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    for (let x = 0; x < w; x++) raw.set(pix(x, y), y * (w * 4 + 1) + 1 + x * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ])
}

const BG = [31, 95, 191, 255], PUTIH = [255, 255, 255, 255], ORANYE = [255, 169, 77, 255], KOSONG = [0, 0, 0, 0]

// mode: 'kotak' (sudut membulat), 'penuh' (maskable), 'bulat' (ikon bundar Android), 'fg' (latar transparan, ikon adaptif Android)
function ikon(size, mode) {
  if (mode === true) mode = 'penuh'
  if (mode === false) mode = 'kotak'
  const rad = mode === 'kotak' ? size * 0.22 : 0
  const pad = size * ({ kotak: 0.17, penuh: 0.24, bulat: 0.27, fg: 0.33 }[mode])
  const lebarArea = size - 2 * pad, tinggiArea = size - 2 * pad
  const kolom = lebarArea / 4, lebarBatang = kolom * 0.72
  const tinggi = [1, 2, 4, 8].map((v) => (v / 8) * tinggiArea)
  return png(size, size, (x, y) => {
    if (mode === 'bulat' && (x + 0.5 - size / 2) ** 2 + (y + 0.5 - size / 2) ** 2 > (size / 2) ** 2) return KOSONG
    // sudut membulat
    const cx = Math.min(Math.max(x, rad), size - 1 - rad), cy = Math.min(Math.max(y, rad), size - 1 - rad)
    if (rad && (x - cx) ** 2 + (y - cy) ** 2 > rad ** 2) return KOSONG
    for (let i = 0; i < 4; i++) {
      const x0 = pad + i * kolom + (kolom - lebarBatang) / 2
      if (x >= x0 && x < x0 + lebarBatang && y >= size - pad - tinggi[i] && y < size - pad) return i === 3 ? ORANYE : PUTIH
    }
    return mode === 'fg' ? KOSONG : BG
  })
}

const dir = new URL('../public/icons/', import.meta.url)
mkdirSync(dir, { recursive: true })
writeFileSync(new URL('icon-192.png', dir), ikon(192, 'kotak'))
writeFileSync(new URL('icon-512.png', dir), ikon(512, 'kotak'))
writeFileSync(new URL('icon-maskable-512.png', dir), ikon(512, 'penuh'))
writeFileSync(new URL('apple-touch-icon.png', dir), ikon(180, 'penuh'))
console.log('Ikon web dibuat di public/icons/')

// Ikon aplikasi Android (APK), jika folder android/ sudah ada
const res = new URL('../android/app/src/main/res/', import.meta.url)
if (existsSync(res)) {
  const KEPADATAN = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 }
  for (const [nama, k] of Object.entries(KEPADATAN)) {
    const d = new URL(`mipmap-${nama}/`, res)
    mkdirSync(d, { recursive: true })
    writeFileSync(new URL('ic_launcher.png', d), ikon(Math.round(48 * k), 'kotak'))
    writeFileSync(new URL('ic_launcher_round.png', d), ikon(Math.round(48 * k), 'bulat'))
    writeFileSync(new URL('ic_launcher_foreground.png', d), ikon(Math.round(108 * k), 'fg'))
  }
  writeFileSync(new URL('values/ic_launcher_background.xml', res),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#1F5FBF</color>\n</resources>\n')
  console.log('Ikon Android dibuat di android/app/src/main/res/')
}
