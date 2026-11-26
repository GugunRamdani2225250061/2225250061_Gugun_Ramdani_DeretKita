import { useRef, useState } from 'react'
import Teks, { Inline } from './Teks.jsx'
import Visual from './Visual.jsx'
import RatingBeban from './RatingBeban.jsx'
import KakDeret from './KakDeret.jsx'
import { cocokJawaban, cariSalahUmum, formatAngka } from '../lib/geometri.js'

const AKSI_MEDIASI = [
  { label: 'Aku bingung mulai dari mana' },
  { label: 'Informasi apa yang penting?' },
  { label: 'Kenapa jawabanku salah?' },
]

function Bagian({ b, nomor, total, soal, modulJudul, onSelesai }) {
  const [aiDipakai, setAiDipakai] = useState(0)
  const [isian, setIsian] = useState('')
  const [pilih, setPilih] = useState(null)
  const [status, setStatus] = useState(null) // null | 'salah' | 'benar' | 'lihat'
  const [pesan, setPesan] = useState('')
  const [percobaan, setPercobaan] = useState(0)
  const [hintKe, setHintKe] = useState(0)
  const [riwayat, setRiwayat] = useState([])
  const selesai = status === 'benar' || status === 'lihat'
  const hints = b.hints || []

  function periksa() {
    const kosong = b.tipe === 'pg' ? pilih === null : !isian.trim()
    if (kosong || selesai) return
    const benar = b.tipe === 'pg' ? pilih === b.kunci : cocokJawaban(isian, b.kunci)
    const n = percobaan + 1
    setPercobaan(n)
    setRiwayat((r) => [...r, b.tipe === 'pg' ? b.opsi[pilih] : isian])
    if (benar) {
      setStatus('benar')
      setPesan(n === 1 ? 'Benar!' : 'Benar! Bagus, kamu berhasil memperbaikinya.')
    } else {
      setStatus('salah')
      const khusus = b.tipe === 'pg' ? b.salah?.[pilih] : cariSalahUmum(b.salah, isian)
      setPesan(khusus || (hintKe < hints.length ? 'Belum tepat. Coba lagi, atau buka petunjuk.' : 'Belum tepat. Coba periksa lagi langkahmu.'))
    }
  }

  const kunciTeks = b.tipe === 'pg' ? b.opsi[b.kunci] : `${formatAngka(b.kunci)} ${b.satuan && b.satuan !== 'rupiah' ? b.satuan : ''}`.trim()

  return (
    <div className="bagian">
      {total > 1 && (
        <p className="tahap">Langkah {nomor} dari {total}{b.tahap ? ` · ${b.tahap}` : ''}</p>
      )}
      {total === 1 && b.tahap && <p className="tahap">{b.tahap}</p>}
      <Teks className="tanya">{b.tanya}</Teks>

      {b.tipe === 'pg' ? (
        <div className="opsi" role="radiogroup">
          {b.opsi.map((o, i) => {
            const kelas = [pilih === i ? 'pilih' : '', selesai && i === b.kunci ? 'benar' : ''].join(' ')
            return (
              <button key={i} role="radio" aria-checked={pilih === i} className={kelas} disabled={selesai}
                onClick={() => { setPilih(i); if (status === 'salah') setStatus(null) }}>
                <span className="huruf">{String.fromCharCode(65 + i)}</span><Inline teks={o} />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="baris-isian">
          {b.satuan === 'rupiah' && <span className="satuan">Rp</span>}
          <input inputMode="decimal" value={isian} disabled={selesai} placeholder="Jawabanmu"
            aria-label="Jawaban" onChange={(e) => { setIsian(e.target.value); if (status === 'salah') setStatus(null) }}
            onKeyDown={(e) => e.key === 'Enter' && periksa()} />
          {b.satuan && b.satuan !== 'rupiah' && <span className="satuan">{b.satuan}</span>}
        </div>
      )}

      {hintKe > 0 && (
        <div className="petunjuk">
          {hints.slice(0, hintKe).map((h, i) => <div key={i} className="hint"><strong>Petunjuk {i + 1}:</strong> <Inline teks={h} /></div>)}
        </div>
      )}

      {status === 'salah' && <div className="umpan salah" role="status"><Inline teks={pesan} /></div>}
      {status === 'benar' && <div className="umpan benar" role="status"><strong>{pesan}</strong><Teks>{b.bahas}</Teks></div>}
      {status === 'lihat' && (
        <div className="umpan lihat" role="status">
          <strong>Jawaban: <Inline teks={kunciTeks} /></strong>
          <Teks>{b.bahas}</Teks>
        </div>
      )}

      <div className="aksi">
        {!selesai && <button className="btn" onClick={periksa}>Periksa</button>}
        {!selesai && hintKe < hints.length && (
          <button className="btn sekunder" onClick={() => setHintKe(hintKe + 1)}>Petunjuk ({hintKe + 1}/{hints.length})</button>
        )}
        {!selesai && percobaan >= 2 && (
          <button className="btn teks-saja" onClick={() => setStatus('lihat')}>Lihat pembahasan</button>
        )}
        {selesai && (
          <button className="btn" onClick={() => onSelesai({
            benarPertama: status === 'benar' && percobaan === 1, percobaan, hint: hintKe, lihat: status === 'lihat', ai: aiDipakai, jawaban: riwayat,
          })}>Lanjut</button>
        )}
      </div>

      {!selesai && (
        <KakDeret
          mode="mediasi"
          aksiCepat={AKSI_MEDIASI}
          onPakai={() => setAiDipakai((n) => n + 1)}
          konteks={{
            tahap_rmt: 3, modul: modulJudul, judul: soal.judul, cerita: soal.cerita, langkah: b.tahap,
            pertanyaan: b.tanya, opsi: b.opsi, jawaban_siswa: riwayat, kunci: kunciTeks,
          }}
        />
      )}
    </div>
  )
}

export default function Soal({ soal, id, modeUjiCoba, modulJudul, onSelesai }) {
  const [idx, setIdx] = useState(0)
  const [tahapRating, setTahapRating] = useState(false)
  const mulai = useRef(Date.now())
  const durasi = useRef(0)
  const catatan = useRef([])

  const selesaiBagian = (hasil) => {
    catatan.current[idx] = hasil
    if (idx + 1 < soal.bagian.length) setIdx(idx + 1)
    else { durasi.current = Math.round((Date.now() - mulai.current) / 1000); setTahapRating(true) }
  }

  if (tahapRating) {
    return (
      <RatingBeban modeUjiCoba={modeUjiCoba} onKirim={({ paas, persepsi }) => {
        const c = catatan.current
        onSelesai({
          soal_id: id,
          benar: c.every((x) => x.benarPertama) ? 1 : 0,
          skor_bagian: +(c.filter((x) => x.benarPertama).length / c.length).toFixed(2),
          waktu_detik: durasi.current,
          butuh_bantuan: c.some((x) => x.hint > 0 || x.lihat || x.ai > 0) ? 1 : 0,
          hint_dipakai: c.reduce((t, x) => t + x.hint, 0),
          ai_dipakai: c.reduce((t, x) => t + (x.ai || 0), 0),
          paas, persepsi, detail: c,
        })
      }} />
    )
  }

  return (
    <section className="kartu soal">
      <div className="kepala-soal">
        <p className="chip chip-soal">🎯 Soal {soal.konteks ? `· ${soal.konteks}` : ''}</p>
        {modeUjiCoba && soal.status !== 'siap' && <span className="lencana">uji coba</span>}
      </div>
      <h2>{soal.judul}</h2>
      {soal.cerita && <div className="cerita"><Teks>{soal.cerita}</Teks></div>}
      {soal.visual && <Visual v={soal.visual} />}
      <Bagian key={idx} b={soal.bagian[idx]} nomor={idx + 1} total={soal.bagian.length} soal={soal} modulJudul={modulJudul} onSelesai={selesaiBagian} />
    </section>
  )
}
