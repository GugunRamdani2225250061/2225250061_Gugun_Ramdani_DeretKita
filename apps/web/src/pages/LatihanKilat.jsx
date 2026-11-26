// Latihan Kilat: 10 soal acak, umpan balik langsung. Bukan data penelitian.
import { useState } from 'react'
import { Halaman } from '../components/Layout.jsx'
import { buatSesi } from '../lib/latihan.js'
import { cocokJawaban } from '../lib/geometri.js'
import { useStore, simpanLatihan } from '../lib/store.js'

export default function LatihanKilat() {
  const { profil, latihan } = useStore()
  const terbaik = latihan?.[profil.kode]?.terbaik ?? 0
  const [sesi, setSesi] = useState(null)
  const [i, setI] = useState(0)
  const [isian, setIsian] = useState('')
  const [hasil, setHasil] = useState(null) // null | 'benar' | 'salah'
  const [skor, setSkor] = useState(0)
  const [beruntun, setBeruntun] = useState(0)

  const mulai = () => { setSesi(buatSesi(10)); setI(0); setSkor(0); setBeruntun(0); setHasil(null); setIsian('') }

  if (!sesi) {
    return (
      <Halaman judul="⚡ Latihan Kilat" warna="#ea580c">
        <section className="kartu latihan-mulai">
          <div className="latihan-ikon" aria-hidden>⚡</div>
          <h2>10 soal acak, langsung dinilai!</h2>
          <p>Rasio, melanjutkan pola, suku ke-n, pola mengecil, deret, dan jenis barisan. Soalnya selalu baru setiap kali bermain.</p>
          <p className="kecil">Skor terbaikmu: <strong>{terbaik}/10</strong></p>
          <button className="btn btn-besar lebar" onClick={mulai}>▶ Mulai latihan</button>
        </section>
      </Halaman>
    )
  }

  if (i >= sesi.length) {
    return (
      <Halaman judul="⚡ Latihan Kilat" warna="#ea580c">
        <section className="kartu selesai-modul">
          <div className="bintang-besar">{skor >= 9 ? '🏆' : skor >= 6 ? '🎉' : '💪'}</div>
          <h2>Skor kamu: {skor}/10</h2>
          <p>{skor >= 9 ? 'Luar biasa!' : skor >= 6 ? 'Bagus! Sedikit lagi sempurna.' : 'Terus berlatih, kamu pasti bisa!'}</p>
          <p className="kecil">Skor terbaik: {Math.max(terbaik, skor)}/10</p>
          <button className="btn btn-besar lebar" onClick={mulai}>🔄 Main lagi</button>
        </section>
      </Halaman>
    )
  }

  const s = sesi[i]
  const jawab = (nilai) => {
    if (hasil) return
    const benar = s.pg ? nilai === s.kunci : cocokJawaban(nilai, s.kunci)
    setHasil(benar ? 'benar' : 'salah')
    if (benar) { setSkor(skor + 1); setBeruntun(beruntun + 1) } else setBeruntun(0)
  }
  const berikut = () => {
    if (i + 1 >= sesi.length) simpanLatihan(skor)
    setI(i + 1); setHasil(null); setIsian('')
  }

  return (
    <Halaman judul="⚡ Latihan Kilat" warna="#ea580c">
      <div className="latihan-atas">
        <div className="titik-progres">{sesi.map((_, k) => <i key={k} className={k < i ? 'lewat' : k === i ? 'kini' : ''} />)}</div>
        <span>⭐ {skor}{beruntun >= 2 && <b className="beruntun"> 🔥{beruntun}</b>}</span>
      </div>
      <section className="kartu soal">
        <p className="chip chip-soal">#{i + 1} · {s.tipe}</p>
        <h2 className="tanya">{s.tanya}</h2>
        {s.pg ? (
          <div className="opsi">
            {s.pg.map((o, k) => (
              <button key={k} disabled={!!hasil} className={hasil && k === s.kunci ? 'benar' : ''} onClick={() => jawab(k)}>
                <span className="huruf">{String.fromCharCode(65 + k)}</span>{o}
              </button>
            ))}
          </div>
        ) : (
          <div className="baris-isian">
            <input inputMode="decimal" value={isian} disabled={!!hasil} placeholder="Jawabanmu" aria-label="Jawaban"
              onChange={(e) => setIsian(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && isian.trim() && jawab(isian)} />
            <button className="btn kecil" disabled={!isian.trim() || !!hasil} onClick={() => jawab(isian)}>Cek</button>
          </div>
        )}
        {hasil === 'benar' && <div className="umpan benar"><strong>Benar!</strong> {s.bahas}</div>}
        {hasil === 'salah' && <div className="umpan salah">Belum tepat. {s.bahas}</div>}
        {hasil && <div className="aksi"><button className="btn" onClick={berikut}>{i + 1 < sesi.length ? 'Soal berikutnya →' : 'Lihat skor'}</button></div>}
      </section>
    </Halaman>
  )
}
