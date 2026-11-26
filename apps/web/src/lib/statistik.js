// Ringkasan sederhana untuk dasbor (tampilan cepat).
// Analisis statistik lengkap dikerjakan oleh Python (services/api & analisis/).
const rata = (xs) => {
  const v = xs.filter((x) => x !== '' && x !== null && x !== undefined).map(Number)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

export function ringkasPerSoal(jawaban) {
  const per = {}
  for (const j of jawaban) (per[j.soal_id] ||= []).push(j)
  return Object.keys(per).sort().map((id) => {
    const rows = per[id]
    return {
      soal_id: id,
      n: rows.length,
      p: rata(rows.map((r) => r.benar)),
      waktu: rata(rows.map((r) => r.waktu_detik)),
      paas: rata(rows.map((r) => r.paas)),
      persepsi: rata(rows.map((r) => r.persepsi)),
      bantuan: rata(rows.map((r) => r.butuh_bantuan)),
      ai: rata(rows.map((r) => r.ai_dipakai ?? 0)),
    }
  })
}

export function skorSUS(respon) {
  // item ganjil: skor - 1, item genap: 5 - skor, jumlah x 2,5
  return respon.reduce((t, v, i) => t + (i % 2 === 0 ? v - 1 : 5 - v), 0) * 2.5
}

export function skorLeppink(respon) {
  const r = (a, b) => rata(respon.slice(a, b))
  return { IL: r(0, 3), EL: r(3, 6), GL: r(6, 10) }
}

export { rata }

const KOLOM = ['kode_siswa', 'soal_id', 'benar', 'waktu_detik', 'butuh_bantuan', 'persepsi', 'paas', 'modul_id', 'hint_dipakai', 'ai_dipakai', 'skor_bagian', 'kode_kelas', 'waktu']

export function keCSV(jawaban) {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [KOLOM.join(','), ...jawaban.map((j) => KOLOM.map((k) => esc(j[k])).join(','))].join('\n')
}

export function unduh(namaFile, isi, tipe) {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }))
  const a = document.createElement('a')
  a.href = url
  a.download = namaFile
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
