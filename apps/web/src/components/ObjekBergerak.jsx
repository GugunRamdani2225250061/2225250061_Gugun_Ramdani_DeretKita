// Objek bangun ruang & bangun datar yang bergerak (CSS 3D + SVG, tanpa pustaka).
// Dipakai di halaman selamat datang. Semua animasi berhenti jika pengguna memilih "kurangi gerakan".
import Bentuk from './Bentuk.jsx'
import Bangun3D from './Bangun3D.jsx'

export const Kubus3D = ({ ukuran = 90 }) => <Bangun3D jenis="kubus" ukuran={ukuran} warna="#8b5cf6" />
export const Limas3D = ({ ukuran = 90 }) => <Bangun3D jenis="limas" ukuran={ukuran} warna="#f59e0b" durasi={12} />
export const PutarBentuk = ({ jenis, warna, ukuran = 64, jeda = 0 }) => <Bangun3D jenis={jenis} warna={warna} ukuran={ukuran} jeda={jeda} />
export function BolaMemantul() {
  return (
    <div className="bola-pantul" role="img" aria-label="Bola memantul, tingginya setengah setiap pantulan">
      <svg viewBox="0 0 220 170" className="bp-latar" aria-hidden>
        <line x1="6" x2="214" y1="160" y2="160" />
        {/* tiang setinggi puncak pantulan bola (lihat @keyframes pantul): 160 → 80 → 40 → 20 → 10 */}
        {[[16, 118, 160], [86, 68, 80], [134, 34, 40], [164, 17, 20], [184, 8, 10]].map(([x, h, t], i) => (
          <g key={x}>
            <line x1={x} x2={x} y1={160} y2={160 - h - 24} className="tiang" />
            <text x={x} y={160 - h - 28} className={i === 0 ? 'awal' : ''}>{t}</text>
          </g>
        ))}
      </svg>
      <span className="bp-bola" />
    </div>
  )
}

export function BatangTumbuh() {
  const nilai = [1, 2, 4, 8, 16]
  return (
    <div className="batang-tumbuh" role="img" aria-label="Pola dikali dua: 1, 2, 4, 8, 16">
      {nilai.map((v, i) => (
        <div key={v} className="bt-kolom">
          <span className="bt-nilai">{v}</span>
          <span className="bt-batang" style={{ height: `${v * 6 + 6}px`, animationDelay: `${i * 0.5}s` }} />
          {i < nilai.length - 1 && <em className="bt-kali">×2</em>}
        </div>
      ))}
    </div>
  )
}

function segitiga(x, y, s, d, out) {
  if (d === 0) { out.push([x, y, s]); return out }
  const h = (s * Math.sqrt(3)) / 2
  segitiga(x + s / 4, y, s / 2, d - 1, out)
  segitiga(x, y + h / 2, s / 2, d - 1, out)
  segitiga(x + s / 2, y + h / 2, s / 2, d - 1, out)
  return out
}
const SIER = segitiga(4, 4, 172, 3, [])
const WARNA_SIER = ['#7c3aed', '#db2777', '#0891b2']

export function Sierpinski() {
  return (
    <svg className="sierpinski" viewBox="0 0 180 158" role="img" aria-label="Segitiga Sierpinski: 1, 3, 9, 27 segitiga">
      <polygon points="90,4 176,153 4,153" className="sier-luar" />
      {SIER.map(([x, y, s], i) => {
        const h = (s * Math.sqrt(3)) / 2
        return (
          <polygon key={i} points={`${x + s / 2},${y} ${x + s},${y + h} ${x},${y + h}`}
            fill={WARNA_SIER[i % 3]} style={{ animationDelay: `${i * 0.12}s` }} />
        )
      })}
    </svg>
  )
}

export function OrbitBangun() {
  return (
    <div className="orbit" role="img" aria-label="Bangun datar mengorbit segi enam">
      <span className="orbit-pusat"><Bangun3D jenis="papan-segienam" warna="#6366f1" ukuran={64} /></span>
      <div className="orbit-cincin">
        <span className="orbit-satelit s1"><Bentuk jenis="lingkaran" warna="#f59e0b" ukuran={30} /></span>
        <span className="orbit-satelit s2"><Bentuk jenis="segitiga" warna="#ec4899" ukuran={30} /></span>
        <span className="orbit-satelit s3"><Bentuk jenis="persegi" warna="#10b981" ukuran={30} /></span>
        <span className="orbit-satelit s4"><Bentuk jenis="belahketupat" warna="#0ea5e9" ukuran={28} /></span>
      </div>
    </div>
  )
}

/** Panel kiri (bangun ruang) dan kanan (bangun datar & pola) untuk halaman selamat datang. */
export function PanelKiri() {
  return (
    <aside className="panel-samping panel-kiri" aria-hidden>
      <p className="panel-judul">🧊 Bangun Ruang</p>
      <div className="kartu-objek">
        <div className="objek-baris"><Kubus3D /><Limas3D /></div>
        <small>Kubus & limas segiempat berputar</small>
      </div>
      <div className="kartu-objek">
        <div className="objek-baris">
          <PutarBentuk jenis="tabung" warna="#10b981" />
          <PutarBentuk jenis="kerucut" warna="#f59e0b" jeda={-1.5} />
          <PutarBentuk jenis="bola" warna="#0ea5e9" jeda={-3} />
        </div>
        <small>Tabung, kerucut, dan bola</small>
      </div>
      <div className="kartu-objek">
        <div className="objek-baris">
          <PutarBentuk jenis="prisma-segitiga" warna="#ec4899" ukuran={60} />
          <PutarBentuk jenis="balok" warna="#22c55e" ukuran={60} jeda={-2} />
          <PutarBentuk jenis="prisma-segienam" warna="#6366f1" ukuran={60} jeda={-4} />
        </div>
        <small>Prisma segitiga, balok, prisma segi enam</small>
      </div>
      <div className="kartu-objek">
        <BolaMemantul />
        <small>Bola memantul: tinggi <b>× ½</b> setiap pantulan</small>
      </div>
    </aside>
  )
}

export function PanelKanan() {
  return (
    <aside className="panel-samping panel-kanan" aria-hidden>
      <p className="panel-judul">🔷 Bangun Datar & Pola</p>
      <div className="kartu-objek">
        <Sierpinski />
        <small>Segitiga Sierpinski: 1, 3, 9, 27 → <b>× 3</b></small>
      </div>
      <div className="kartu-objek">
        <BatangTumbuh />
        <small>Pola dikali dua: 1, 2, 4, 8, 16</small>
      </div>
      <div className="kartu-objek">
        <div className="objek-baris">
          <Bangun3D jenis="papan-persegi" warna="#10b981" ukuran={60} />
          <Bangun3D jenis="papan-segitiga" warna="#ec4899" ukuran={60} jeda={-2} />
          <Bangun3D jenis="papan-lingkaran" warna="#f59e0b" ukuran={60} jeda={-4} />
        </div>
        <small>Persegi, segitiga, lingkaran berputar</small>
      </div>
      <div className="kartu-objek">
        <OrbitBangun />
        <small>Segi enam, lingkaran, segitiga, persegi</small>
      </div>
    </aside>
  )
}

/** Versi ringkas untuk HP (di atas formulir). */
export function StripObjek() {
  return (
    <div className="strip-objek" aria-hidden>
      <Kubus3D ukuran={54} />
      <BatangTumbuh />
      <Limas3D ukuran={54} />
    </div>
  )
}
