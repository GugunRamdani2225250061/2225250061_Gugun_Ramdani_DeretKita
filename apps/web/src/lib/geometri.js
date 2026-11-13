// Rumus barisan & deret geometri (versi JavaScript).
// Hasilnya harus sama dengan analisis/deret_geometri.py.

export function sukuKe(a, r, n) {
  if (n < 1) throw new Error('n minimal 1')
  return a * r ** (n - 1)
}

export function jumlahN(a, r, n) {
  if (r === 1) return a * n
  return (a * (r ** n - 1)) / (r - 1)
}

export function barisan(a, r, k) {
  return Array.from({ length: k }, (_, i) => sukuKe(a, r, i + 1))
}

/**
 * Membaca angka dari jawaban siswa dalam format Indonesia.
 * "12.800.000" -> 12800000, "0,8" -> 0.8, "1/2" -> 0.5, "Rp64.000" -> 64000, "12,8 juta" -> 12800000
 */
export function parseAngka(input) {
  if (input === null || input === undefined) return NaN
  let s = String(input).toLowerCase().trim()
  if (!s) return NaN
  let kali = 1
  if (/miliar|milyar/.test(s)) kali = 1e9
  else if (/juta|jt/.test(s)) kali = 1e6
  else if (/ribu|rb/.test(s)) kali = 1e3
  s = s.replace(/[^0-9.,/\-]/g, '')
  if (!s) return NaN
  if (s.includes('/')) {
    const [p, q] = s.split('/')
    const a = parseAngka(p), b = parseAngka(q)
    return b ? (a / b) * kali : NaN
  }
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.')
  } else {
    const titik = (s.match(/\./g) || []).length
    if (titik > 1 || /^-?[1-9]\d{0,2}\.\d{3}$/.test(s)) s = s.replace(/\./g, '')
  }
  const v = Number(s)
  if (!Number.isFinite(v)) return NaN
  return kali === 1 ? v : Number((v * kali).toFixed(6))
}

export function samaDengan(v, kunci) {
  if (!Number.isFinite(v)) return false
  return Math.abs(v - kunci) <= 1e-9 * Math.max(1, Math.abs(kunci))
}

export function cocokJawaban(input, kunci) {
  return samaDengan(parseAngka(input), kunci)
}

/** Mencari umpan balik untuk jawaban salah yang umum. `salah` = { "160": "pesan", ... } */
export function cariSalahUmum(salah, input) {
  if (!salah) return null
  const v = parseAngka(input)
  for (const [k, pesan] of Object.entries(salah)) {
    if (samaDengan(v, parseAngka(k))) return pesan
  }
  return null
}

export function formatAngka(v) {
  if (!Number.isFinite(v)) return '-'
  const bulat = Math.round(v)
  if (Math.abs(v - bulat) < 1e-9) return bulat.toLocaleString('id-ID')
  return v.toLocaleString('id-ID', { maximumFractionDigits: 4 })
}

export function formatPendek(v) {
  const abs = Math.abs(v)
  if (abs >= 1e9) return formatAngka(+(v / 1e9).toFixed(1)) + ' M'
  if (abs >= 1e6) return formatAngka(+(v / 1e6).toFixed(1)) + ' jt'
  if (abs >= 1e4) return formatAngka(+(v / 1e3).toFixed(1)) + ' rb'
  return formatAngka(+v.toFixed(2))
}

const SUB = '₀₁₂₃₄₅₆₇₈₉'
export const subskrip = (n) => String(n).replace(/\d/g, (d) => SUB[d])
