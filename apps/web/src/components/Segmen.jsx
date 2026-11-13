import { useEffect, useState } from 'react'
import Teks, { Inline } from './Teks.jsx'
import Rumus from './Rumus.jsx'
import Visual from './Visual.jsx'
import { cocokJawaban, formatAngka } from '../lib/geometri.js'

// Langkah contoh yang harus diisi siswa (fading worked example)
function LangkahKosong({ l, onBenar }) {
  const [isi, setIsi] = useState('')
  const [coba, setCoba] = useState(0)
  const [status, setStatus] = useState(null)
  const benar = status === 'benar' || status === 'lihat'
  const cek = () => {
    if (!isi.trim()) return
    if (cocokJawaban(isi, l.kosong.kunci)) { setStatus('benar'); onBenar() }
    else { setStatus('salah'); setCoba(coba + 1) }
  }
  const teksLengkap = l.teks.replace('…', formatAngka(l.kosong.kunci))
  if (benar) return <li className="langkah ok"><Inline teks={teksLengkap} /> {status === 'benar' ? '✔' : ''}</li>
  return (
    <li className="langkah kosong">
      <Inline teks={l.teks} />
      <div className="baris-isian">
        <input inputMode="decimal" value={isi} onChange={(e) => { setIsi(e.target.value); setStatus(null) }}
          onKeyDown={(e) => e.key === 'Enter' && cek()} aria-label="Isi langkah ini" placeholder="?" />
        {l.kosong.satuan && <span className="satuan">{l.kosong.satuan}</span>}
        <button className="btn kecil" onClick={cek}>Cek</button>
      </div>
      {status === 'salah' && <p className="umpan salah">Belum tepat, coba hitung lagi.</p>}
      {coba >= 2 && <button className="btn teks-saja" onClick={() => { setStatus('lihat'); onBenar() }}>Tunjukkan jawabannya</button>}
    </li>
  )
}

function Contoh({ s, onSiap }) {
  const [tampil, setTampil] = useState(1)
  const [terisi, setTerisi] = useState({})
  const butuhIsi = (i) => typeof s.langkah[i] !== 'string' && !terisi[i]
  const terakhirOk = !butuhIsi(tampil - 1)
  const semuaSiap = tampil === s.langkah.length && terakhirOk
  useEffect(() => { onSiap(semuaSiap) }, [semuaSiap, onSiap])

  return (
    <div className="contoh">
      <div className="soal-contoh"><Teks>{s.soal}</Teks></div>
      <ol className="daftar-langkah">
        {s.langkah.slice(0, tampil).map((l, i) =>
          typeof l === 'string'
            ? <li key={i} className="langkah muncul"><Inline teks={l} /></li>
            : <LangkahKosong key={i} l={l} onBenar={() => setTerisi((t) => ({ ...t, [i]: true }))} />,
        )}
      </ol>
      {tampil < s.langkah.length && terakhirOk && (
        <button className="btn sekunder" onClick={() => setTampil(tampil + 1)}>Tampilkan langkah berikutnya ↓</button>
      )}
    </div>
  )
}

export default function Segmen({ s, onSiap }) {
  useEffect(() => { if (s.jenis !== 'contoh') onSiap(true) }, [s, onSiap])
  return (
    <section className={`kartu segmen segmen-${s.jenis}`}>
      <p className={`chip chip-${s.jenis}`}>{s.jenis === 'kartu' ? '💡 Istilah' : s.jenis === 'contoh' ? '✏️ Contoh soal' : '📖 Materi'}</p>
      <h2>{s.judul}</h2>
      {s.visual && <Visual v={s.visual} />}
      {s.teks && <Teks>{s.teks}</Teks>}
      {s.rumus && <Rumus nama={s.rumus} />}
      {s.catatan && <Teks className="catatan">{s.catatan}</Teks>}
      {s.contoh && <div className="kotak-contoh"><Inline teks={s.contoh} /></div>}
      {s.tabel && (
        <table className="tabel">
          <tbody>
            {s.tabel.map((baris, i) => <tr key={i}>{baris.map((sel, k) => <td key={k}><Inline teks={sel} /></td>)}</tr>)}
          </tbody>
        </table>
      )}
      {s.jenis === 'contoh' && <Contoh s={s} onSiap={onSiap} />}
    </section>
  )
}
