import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cariModul, MODUL } from '../content/modul.js'
import { SOAL } from '../content/soal.js'
import { useStore, getState, getProgres, setProgres, simpanJawaban, simpanRefleksi } from '../lib/store.js'
import { antre } from '../lib/sinkron.js'
import { Halaman } from '../components/Layout.jsx'
import Segmen from '../components/Segmen.jsx'
import Soal from '../components/Soal.jsx'
import KakDeret from '../components/KakDeret.jsx'
import RmtTahap from '../components/RmtTahap.jsx'
import { tahapLangkah } from '../content/rmt.js'

function hitungBintang(kode, modul) {
  const terakhir = {}
  for (const j of getState().jawaban) if (j.kode_siswa === kode && j.modul_id === modul.id) terakhir[j.soal_id] = j
  const skor = modul.soal.map((id) => terakhir[id]?.skor_bagian ?? 0)
  const rata = skor.reduce((a, b) => a + b, 0) / (skor.length || 1)
  return rata >= 0.8 ? 3 : rata >= 0.5 ? 2 : 1
}

// key = id modul, supaya state direset saat pindah ke modul berikutnya
export default function ModulHalaman() {
  const { id } = useParams()
  return <Modul key={id} id={id} />
}

function Modul({ id }) {
  const modul = cariModul(id)
  const nav = useNavigate()
  const { profil, pengaturan } = useStore()
  const langkah = useMemo(() => modul ? [
    ...modul.segmen.map((s) => ({ tipe: 'segmen', s })),
    ...modul.soal.map((sid) => ({ tipe: 'soal', id: sid })),
    { tipe: 'refleksi' },
    { tipe: 'selesai' },
  ] : [], [modul])

  const awal = modul ? getProgres(modul.id) : { pos: 0 }
  const [pos, setPos] = useState(awal.selesai ? 0 : Math.min(awal.pos || 0, langkah.length - 2))
  const [siap, setSiap] = useState(false)
  const [teksRefleksi, setTeksRefleksi] = useState('')
  const onSiap = useCallback((v) => setSiap(v), [])

  useEffect(() => { window.scrollTo(0, 0) }, [pos])
  if (!modul) return <Halaman judul="Tidak ditemukan"><p>Modul tidak ada.</p></Halaman>

  // siap direset di sini (bukan di useEffect), karena efek anak (Segmen) berjalan lebih dulu
  const pindah = (baru) => { setSiap(false); setPos(baru) }
  const maju = () => {
    const baru = pos + 1
    pindah(baru)
    if (langkah[baru].tipe !== 'selesai') setProgres(modul.id, { pos: baru })
  }
  const l = langkah[pos]
  const idxModul = MODUL.findIndex((m) => m.id === modul.id)
  const berikut = MODUL[idxModul + 1]
  const persen = Math.round((pos / (langkah.length - 1)) * 100)

  let konten
  if (l.tipe === 'segmen') {
    konten = (
      <>
        <Segmen key={pos} s={l.s} onSiap={onSiap} />
        <div className="navigasi">
          {pos > 0 && langkah[pos - 1].tipe === 'segmen' && <button className="btn sekunder" onClick={() => pindah(pos - 1)}>← Kembali</button>}
          <button className="btn" disabled={!siap} onClick={maju}>Lanjut →</button>
        </div>
      </>
    )
  } else if (l.tipe === 'soal') {
    konten = (
      <Soal key={pos} id={l.id} soal={SOAL[l.id]} modeUjiCoba={pengaturan.modeUjiCoba} modulJudul={modul.judul} onSelesai={(hasil) => {
        const row = simpanJawaban({ ...hasil, modul_id: modul.id })
        antre('jawaban', row, profil)
        maju()
      }} />
    )
  } else if (l.tipe === 'refleksi') {
    const simpan = () => {
      if (teksRefleksi.trim()) antre('refleksi', simpanRefleksi(modul.id, teksRefleksi.trim()), profil)
      setProgres(modul.id, { pos: 0, selesai: true, bintang: hitungBintang(profil.kode, modul) })
      maju()
    }
    konten = (
      <section className="kartu">
        <p className="label-jenis">Refleksi</p>
        <h2>{modul.refleksi}</h2>
        <textarea rows={4} value={teksRefleksi} onChange={(e) => setTeksRefleksi(e.target.value)} placeholder="Tulis dengan kata-katamu sendiri…" />
        {teksRefleksi.trim().length >= 10 && (
          <KakDeret
            mode="refleksi"
            label="Minta tanggapan Kak Deret"
            aksiCepat={[{ label: 'Kirim refleksiku', pesan: teksRefleksi.trim() }]}
            konteks={{ tahap_rmt: 3, modul: modul.judul, pertanyaan_refleksi: modul.refleksi }}
          />
        )}
        <div className="navigasi">
          <button className="btn sekunder" onClick={simpan}>Lewati</button>
          <button className="btn" disabled={!teksRefleksi.trim()} onClick={simpan}>Simpan</button>
        </div>
      </section>
    )
  } else {
    const b = getProgres(modul.id).bintang
    konten = (
      <section className="kartu selesai-modul">
        <div className="bintang-besar" aria-label={`${b} bintang`}>
          {[0, 1, 2].map((i) => <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>{i < b ? '★' : '☆'}</span>)}
        </div>
        <h2>🎉 Modul selesai!</h2>
        <p>{b === 3 ? 'Hebat, hampir semua langkah benar pada percobaan pertama.' : b === 2 ? 'Bagus! Ulangi modul ini jika ingin lebih yakin.' : 'Tidak apa-apa. Coba ulangi materinya pelan-pelan, lalu kerjakan lagi.'}</p>
        <div className="navigasi kolom">
          {berikut && <button className="btn" onClick={() => nav(`/modul/${berikut.id}`)}>Lanjut: {berikut.judul}</button>}
          {!berikut && <Link className="btn" to="/angket/leppink">Isi angket belajar</Link>}
          <button className="btn sekunder" onClick={() => pindah(0)}>Ulangi modul</button>
          <Link className="btn teks-saja" to="/">Kembali ke beranda</Link>
        </div>
      </section>
    )
  }

  return (
    <Halaman judul={`${modul.ikon} ${modul.judul}`} warna={modul.warna}>
      <div className="bar-progres tipis" aria-label={`Progres modul ${persen}%`}><span style={{ width: `${persen}%` }} /></div>
      {l.tipe !== 'selesai' && <RmtTahap tahap={tahapLangkah(l)} />}
      {konten}
    </Halaman>
  )
}
