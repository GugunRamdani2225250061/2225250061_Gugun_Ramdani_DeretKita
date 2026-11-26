import { Halaman } from '../components/Layout.jsx'
import { useStore } from '../lib/store.js'
import { MODUL } from '../content/modul.js'

export default function Lencana() {
  const { profil, progres, jawaban, refleksi, angket, latihan } = useStore()
  const milik = progres[profil.kode] || {}
  const selesai = MODUL.filter((m) => milik[m.id]?.selesai)
  const jw = jawaban.filter((j) => j.kode_siswa === profil.kode)
  const ai = jw.reduce((t, j) => t + (j.ai_dipakai || 0), 0)
  const lat = latihan?.[profil.kode] || { terbaik: 0, sesi: 0 }

  const DAFTAR = [
    { ikon: '🚀', nama: 'Pemula', ket: 'Masuk ke DeretKita', dapat: true },
    { ikon: '🧭', nama: 'Penjelajah', ket: 'Selesaikan 1 modul', dapat: selesai.length >= 1 },
    { ikon: '🗺️', nama: 'Setengah Jalan', ket: 'Selesaikan 4 modul', dapat: selesai.length >= 4 },
    { ikon: '👑', nama: 'Juara Deret', ket: 'Selesaikan semua modul', dapat: selesai.length === MODUL.length },
    { ikon: '⭐', nama: 'Bintang Tiga', ket: 'Dapat 3 bintang di sebuah modul', dapat: selesai.some((m) => milik[m.id].bintang === 3) },
    { ikon: '🎯', nama: 'Tepat Sasaran', ket: '5 soal benar pada percobaan pertama', dapat: jw.filter((j) => j.benar === 1).length >= 5 },
    { ikon: '🤖', nama: 'Rajin Bertanya', ket: 'Bertanya ke Kak Deret 3 kali', dapat: ai >= 3 },
    { ikon: '✍️', nama: 'Pemikir Reflektif', ket: 'Tulis 3 refleksi', dapat: refleksi.filter((r) => r.kode_siswa === profil.kode).length >= 3 },
    { ikon: '⚡', nama: 'Kilat', ket: 'Skor 8+ di Latihan Kilat', dapat: lat.terbaik >= 8 },
    { ikon: '🔁', nama: 'Tekun', ket: 'Main Latihan Kilat 5 kali', dapat: lat.sesi >= 5 },
    { ikon: '📝', nama: 'Penyumbang Data', ket: 'Isi kedua angket', dapat: ['leppink', 'sus'].every((j) => angket.some((a) => a.kode_siswa === profil.kode && a.jenis === j)) },
  ]
  const jumlah = DAFTAR.filter((d) => d.dapat).length

  return (
    <Halaman judul="🏅 Lencana" warna="#d97706">
      <section className="kartu lencana-ringkas">
        <strong>{jumlah}/{DAFTAR.length}</strong> lencana terkumpul
        <div className="bar-progres"><span style={{ width: `${(jumlah / DAFTAR.length) * 100}%` }} /></div>
      </section>
      <div className="grid-lencana">
        {DAFTAR.map((d) => (
          <div key={d.nama} className={`lencana-item ${d.dapat ? 'dapat' : ''}`}>
            <span className="lencana-ikon" aria-hidden>{d.ikon}</span>
            <strong>{d.nama}</strong>
            <small>{d.ket}</small>
            {!d.dapat && <span className="kunci" aria-label="belum didapat">🔒</span>}
          </div>
        ))}
      </div>
    </Halaman>
  )
}
