// Membuat ikon PNG aplikasi tanpa pustaka tambahan.
// Gambar: 4 batang yang tumbuh berlipat (1, 2, 4, 8), simbol barisan geometri.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

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

function ikon(size, maskable) {
  const rad = maskable ? 0 : size * 0.22
  const pad = size * (maskable ? 0.24 : 0.17)
  const lebarArea = size - 2 * pad, tinggiArea = size - 2 * pad
  const kolom = lebarArea / 4, lebarBatang = kolom * 0.72
  const tinggi = [1, 2, 4, 8].map((v) => (v / 8) * tinggiArea)
  return png(size, size, (x, y) => {
    // sudut membulat
    const cx = Math.min(Math.max(x, rad), size - 1 - rad), cy = Math.min(Math.max(y, rad), size - 1 - rad)
    if (rad && (x - cx) ** 2 + (y - cy) ** 2 > rad ** 2) return KOSONG
    for (let i = 0; i < 4; i++) {
      const x0 = pad + i * kolom + (kolom - lebarBatang) / 2
      if (x >= x0 && x < x0 + lebarBatang && y >= size - pad - tinggi[i] && y < size - pad) return i === 3 ? ORANYE : PUTIH
    }
    return BG
  })
}

const dir = new URL('../public/icons/', import.meta.url)
mkdirSync(dir, { recursive: true })
writeFileSync(new URL('icon-192.png', dir), ikon(192, false))
writeFileSync(new URL('icon-512.png', dir), ikon(512, false))
writeFileSync(new URL('icon-maskable-512.png', dir), ikon(512, true))
writeFileSync(new URL('apple-touch-icon.png', dir), ikon(180, true))
console.log('Ikon dibuat di public/icons/')
