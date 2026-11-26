// Pembuat soal acak untuk Latihan Kilat. Semua kunci dihitung dengan rumus (geometri.js),
// angka dipilih agar hasilnya bilangan bulat yang wajar untuk siswa SMP.
import { sukuKe, jumlahN, barisan, formatAngka } from './geometri.js'

const acak = (n) => Math.floor(Math.random() * n)
const pilih = (arr) => arr[acak(arr.length)]
const tulis = (xs) => xs.map(formatAngka).join(', ')

const PEMBUAT = [
  function rasio() {
    const a = pilih([2, 3, 4, 5, 6, 7]), r = pilih([2, 3, 4])
    const s = barisan(a, r, 4)
    return { tipe: 'Rasio', tanya: `Berapa rasio (r) barisan ${tulis(s)}, …?`, kunci: r, bahas: `r = ${formatAngka(s[1])} : ${formatAngka(s[0])} = ${r}` }
  },
  function lanjutkan() {
    const a = pilih([1, 2, 3, 5]), r = pilih([2, 3])
    const s = barisan(a, r, 5)
    return { tipe: 'Pola', tanya: `Lanjutkan polanya: ${tulis(s.slice(0, 4))}, …`, kunci: s[4], bahas: `Setiap suku dikali ${r}: ${formatAngka(s[3])} × ${r} = ${formatAngka(s[4])}` }
  },
  function suku() {
    const a = pilih([1, 2, 3, 4, 5]), r = pilih([2, 3]), n = pilih([5, 6, 7])
    const k = sukuKe(a, r, n)
    return { tipe: 'Suku ke-n', tanya: `Tentukan suku ke-${n} dari barisan ${tulis(barisan(a, r, 3))}, …`, kunci: k, bahas: `U${n} = ${a} × ${r}^${n - 1} = ${formatAngka(k)}` }
  },
  function mengecil() {
    const a = pilih([64, 96, 128, 160, 256]), n = pilih([3, 4, 5])
    const k = sukuKe(a, 0.5, n)
    return { tipe: 'Pola mengecil', tanya: `Barisan ${tulis(barisan(a, 0.5, 3))}, … Berapa suku ke-${n}?`, kunci: k, bahas: `r = ½, U${n} = ${a} × (½)^${n - 1} = ${formatAngka(k)}` }
  },
  function deret() {
    const a = pilih([1, 2, 3, 5]), r = pilih([2, 3]), n = pilih([3, 4, 5])
    const k = jumlahN(a, r, n)
    return { tipe: 'Deret', tanya: `Hitung jumlah ${n} suku pertama: ${tulis(barisan(a, r, n))}`, kunci: k, bahas: `${tulis(barisan(a, r, n)).replace(/, /g, ' + ')} = ${formatAngka(k)}` }
  },
  function jenis() {
    const geo = Math.random() < 0.5
    const a = pilih([2, 3, 4, 5]), d = pilih([2, 3, 4])
    const s = geo ? barisan(a, d, 4) : [0, 1, 2, 3].map((i) => a + i * d)
    return {
      tipe: 'Jenis barisan', tanya: `${tulis(s)}, … termasuk barisan apa?`, pg: ['Aritmetika (ditambah tetap)', 'Geometri (dikali tetap)'],
      kunci: geo ? 1 : 0, bahas: geo ? `Selalu dikali ${d}, jadi geometri.` : `Selalu ditambah ${d}, jadi aritmetika.`,
    }
  },
]

export function buatSesi(jumlah = 10) {
  return Array.from({ length: jumlah }, (_, i) => ({ id: i, ...PEMBUAT[i % PEMBUAT.length]() })).sort(() => Math.random() - 0.5)
}
