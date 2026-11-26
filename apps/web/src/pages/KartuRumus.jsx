import { Halaman } from '../components/Layout.jsx'
import Rumus from '../components/Rumus.jsx'
import Bentuk from '../components/Bentuk.jsx'
import { Inline } from '../components/Teks.jsx'

const KARTU = [
  { judul: 'Rasio', warna: '#7c3aed', bentuk: 'segienam', rumus: 'r', contoh: '3, 6, 12, 24 → [r:r] = 6 : 3 = 2' },
  { judul: 'Suku ke-n', warna: '#0891b2', bentuk: 'kubus', rumus: 'Un', contoh: '3, 6, 12, … → U₆ = [a:3] × [r:2]⁵ = 96' },
  { judul: 'Jumlah n suku (r > 1)', warna: '#d97706', bentuk: 'tabung', rumus: 'Sn', contoh: '2 + 4 + 8 + 16 = 2(2⁴ − 1) : 1 = 30' },
  { judul: 'Jumlah n suku (0 < r < 1)', warna: '#059669', bentuk: 'bola', teks: 'Sₙ = a(1 − rⁿ) : (1 − r)', contoh: '8 + 4 + 2 = 8(1 − ⅛) : ½ = 14' },
  { judul: 'Pangkat', warna: '#db2777', bentuk: 'limas', teks: 'aⁿ = a × a × … × a (n kali)', contoh: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32' },
  { judul: 'Persen berulang', warna: '#dc2626', bentuk: 'kerucut', teks: 'Turun p% → r = 1 − p/100', contoh: 'Turun 20% → [r:r] = 0,8; naik 10% → [r:r] = 1,1' },
  { judul: 'Aritmetika (pembanding)', warna: '#475569', bentuk: 'belahketupat', teks: 'Uₙ = a + (n − 1)b', contoh: '3, 7, 11 → U₅ = 3 + 4 × 4 = 19' },
]

export default function KartuRumus() {
  return (
    <Halaman judul="📐 Kartu Rumus" warna="#0891b2" lebar>
      <p className="kecil">Simbol berwarna: <span className="sim sim-a">a</span> suku pertama, <span className="sim sim-r">r</span> rasio, <span className="sim sim-n">n</span> urutan suku.</p>
      <div className="grid-rumus">
        {KARTU.map((k) => (
          <section key={k.judul} className="kartu kartu-rumus-besar" style={{ '--aksen': k.warna }}>
            <span className="krb-bentuk"><Bentuk jenis={k.bentuk} warna={k.warna} ukuran={44} /></span>
            <h3>{k.judul}</h3>
            {k.rumus ? <Rumus nama={k.rumus} /> : <div className="rumus">{k.teks}</div>}
            <p className="kecil"><strong>Contoh:</strong> <Inline teks={k.contoh} /></p>
          </section>
        ))}
      </div>
    </Halaman>
  )
}
