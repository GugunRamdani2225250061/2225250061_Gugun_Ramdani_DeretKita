import { useState } from 'react'
import { Halaman } from '../components/Layout.jsx'
import { Batang } from '../components/Visual.jsx'
import { barisan, jumlahN, parseAngka, formatAngka, sukuKe } from '../lib/geometri.js'

export default function Kalkulator() {
  const [a, setA] = useState('3')
  const [r, setR] = useState('2')
  const [n, setN] = useState(6)
  const va = parseAngka(a), vr = parseAngka(r)
  const valid = Number.isFinite(va) && Number.isFinite(vr) && vr !== 0
  const suku = valid ? barisan(va, vr, n) : []
  const sifat = !valid ? '' : vr > 1 ? 'membesar' : vr === 1 ? 'tetap' : vr > 0 ? 'mengecil' : 'berganti tanda'

  return (
    <Halaman judul="Kalkulator Pola">
      <section className="kartu">
        <p>Ubah nilai <span className="sim sim-a">a</span>, <span className="sim sim-r">r</span>, dan <span className="sim sim-n">n</span>, lalu lihat polanya.</p>
        <div className="grid-input">
          <label className="field"><span className="sim sim-a">a (suku pertama)</span>
            <input inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} /></label>
          <label className="field"><span className="sim sim-r">r (rasio)</span>
            <input inputMode="decimal" value={r} onChange={(e) => setR(e.target.value)} placeholder="2 atau 1/2 atau 0,8" /></label>
        </div>
        <label className="field"><span className="sim sim-n">n (banyak suku): {n}</span>
          <input type="range" min="1" max="15" value={n} onChange={(e) => setN(+e.target.value)} /></label>
      </section>

      {valid ? (
        <section className="kartu">
          <h2>Barisan {sifat}</h2>
          <p className="deret-suku">{suku.map((v, i) => <span key={i}>{formatAngka(v)}</span>)}</p>
          <Batang nilai={suku} />
          <div className="hasil-rumus">
            <div>U<sub>{n}</sub> = {formatAngka(va)} × {formatAngka(vr)}<sup>{n - 1}</sup> = <strong>{formatAngka(sukuKe(va, vr, n))}</strong></div>
            <div>S<sub>{n}</sub> (jumlah {n} suku) = <strong>{formatAngka(jumlahN(va, vr, n))}</strong></div>
          </div>
        </section>
      ) : (
        <p className="umpan salah">Isi a dan r dengan angka (r tidak boleh 0). Contoh r: 2, 1/2, atau 0,8.</p>
      )}
    </Halaman>
  )
}
