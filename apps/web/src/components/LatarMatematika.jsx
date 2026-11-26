// Latar melayang berisi bangun datar, bangun ruang, dan rumus.
// Dipakai HANYA di lobi/halaman masuk (tidak di layar belajar agar tidak menambah beban kognitif).
import Bentuk from './Bentuk.jsx'

const WARNA = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#db2777', '#dc2626', '#4f46e5']

const ITEM = [
  { b: 'segitiga', x: 4, y: 6, s: 54 },
  { t: 'Uₙ = a·rⁿ⁻¹', x: 58, y: 3 },
  { b: 'kubus', x: 84, y: 10, s: 62 },
  { t: '×2', x: 30, y: 16 },
  { b: 'lingkaran', x: 44, y: 26, s: 34 },
  { t: 'π', x: 8, y: 30 },
  { b: 'tabung', x: 74, y: 32, s: 56 },
  { t: 'Sₙ', x: 90, y: 44 },
  { b: 'segienam', x: 16, y: 46, s: 46 },
  { t: '2, 4, 8, 16, …', x: 46, y: 50 },
  { b: 'kerucut', x: 86, y: 60, s: 54 },
  { t: '√', x: 4, y: 62 },
  { b: 'bola', x: 34, y: 68, s: 48 },
  { t: 'r = ½', x: 64, y: 72 },
  { b: 'limas', x: 8, y: 80, s: 58 },
  { t: 'Σ', x: 50, y: 84 },
  { b: 'persegi', x: 80, y: 86, s: 40 },
  { t: 'x²', x: 24, y: 92 },
  { b: 'belahketupat', x: 64, y: 94, s: 36 },
]

export default function LatarMatematika() {
  return (
    <div className="latar-mtk" aria-hidden>
      {ITEM.map((it, i) => {
        const gaya = {
          left: `${it.x}%`, top: `${it.y}%`,
          animationDelay: `${(i % 6) * -1.3}s`, animationDuration: `${9 + (i % 5) * 2}s`,
          color: WARNA[i % WARNA.length],
        }
        return it.b
          ? <span key={i} className="latar-item" style={gaya}><Bentuk jenis={it.b} warna={WARNA[i % WARNA.length]} ukuran={it.s} /></span>
          : <span key={i} className="latar-item latar-rumus" style={gaya}>{it.t}</span>
      })}
    </div>
  )
}
