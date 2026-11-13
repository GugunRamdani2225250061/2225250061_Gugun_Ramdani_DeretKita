import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Halaman } from '../components/Layout.jsx'
import { useStore, simpanAngket } from '../lib/store.js'
import { antre } from '../lib/sinkron.js'
import { skorLeppink, skorSUS } from '../lib/statistik.js'

// Instrumen E (Leppink dkk., 2013) dan F (SUS) dari docs/INSTRUMEN.md
const ANGKET = {
  leppink: {
    judul: 'Angket Belajar',
    petunjuk: 'Geser dari 0 (sama sekali tidak setuju) sampai 10 (sangat setuju).',
    min: 0, maks: 10, awal: 5,
    butir: [
      'Materi pada pelajaran ini sangat rumit.',
      'Soal-soal pada pelajaran ini sangat rumit.',
      'Rumus dan konsep pada pelajaran ini sangat rumit.',
      'Penjelasan dalam aplikasi ini sangat tidak jelas.',
      'Penjelasan dalam aplikasi ini kurang efektif untuk belajar.',
      'Penjelasan dalam aplikasi ini penuh dengan kata-kata yang tidak jelas.',
      'Pelajaran ini benar-benar menambah pemahamanku tentang barisan dan deret geometri.',
      'Pelajaran ini benar-benar menambah pemahamanku tentang rumus-rumus yang dibahas.',
      'Pelajaran ini benar-benar menambah pengetahuanku tentang penggunaan matematika dalam kehidupan sehari-hari.',
      'Pelajaran ini benar-benar menambah pemahamanku tentang konsep yang dibahas.',
    ],
  },
  sus: {
    judul: 'Angket Aplikasi',
    petunjuk: '1 = sangat tidak setuju, 5 = sangat setuju.',
    min: 1, maks: 5, awal: null,
    butir: [
      'Saya ingin sering memakai aplikasi ini.',
      'Aplikasi ini terlalu rumit.',
      'Aplikasi ini mudah digunakan.',
      'Saya butuh bantuan orang lain untuk memakai aplikasi ini.',
      'Fitur-fitur aplikasi ini menyatu dengan baik.',
      'Banyak hal yang tidak konsisten di aplikasi ini.',
      'Kebanyakan teman saya akan cepat bisa memakai aplikasi ini.',
      'Aplikasi ini membingungkan.',
      'Saya percaya diri saat memakai aplikasi ini.',
      'Saya harus belajar banyak hal dulu sebelum bisa memakai aplikasi ini.',
    ],
  },
}

export default function Angket() {
  const { jenis } = useParams()
  const a = ANGKET[jenis]
  const { profil } = useStore()
  const [jawab, setJawab] = useState(() => a ? a.butir.map(() => a.awal) : [])
  const [hasil, setHasil] = useState(null)
  if (!a) return <Halaman judul="Angket"><p>Angket tidak ditemukan.</p></Halaman>

  const lengkap = jawab.every((v) => v !== null)
  const kirim = () => {
    const skor = jenis === 'sus' ? { SUS: skorSUS(jawab) } : skorLeppink(jawab)
    antre('angket', simpanAngket(jenis, jawab, skor), profil)
    setHasil(skor)
  }
  const ubah = (i, v) => setJawab((j) => j.map((x, k) => (k === i ? v : x)))

  if (hasil) {
    return (
      <Halaman judul={a.judul}>
        <section className="kartu selesai-modul">
          <h2>Terima kasih!</h2>
          <p>Jawabanmu sudah tersimpan.</p>
          <Link className="btn" to="/">Kembali ke beranda</Link>
        </section>
      </Halaman>
    )
  }

  return (
    <Halaman judul={a.judul}>
      <section className="kartu"><p>{a.petunjuk} Tidak ada jawaban benar atau salah.</p></section>
      {a.butir.map((b, i) => (
        <section key={i} className="kartu butir">
          <p><strong>{i + 1}.</strong> {b}</p>
          {a.maks === 10 ? (
            <label className="slider">
              <input type="range" min={a.min} max={a.maks} value={jawab[i]} onChange={(e) => ubah(i, +e.target.value)} aria-label={`Butir ${i + 1}`} />
              <output>{jawab[i]}</output>
            </label>
          ) : (
            <div className="skala-lima" role="radiogroup" aria-label={`Butir ${i + 1}`}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} role="radio" aria-checked={jawab[i] === v} className={jawab[i] === v ? 'pilih' : ''} onClick={() => ubah(i, v)}>{v}</button>
              ))}
            </div>
          )}
        </section>
      ))}
      <button className="btn lebar" disabled={!lengkap} onClick={kirim}>{lengkap ? 'Kirim jawaban' : 'Jawab semua butir dulu'}</button>
    </Halaman>
  )
}
