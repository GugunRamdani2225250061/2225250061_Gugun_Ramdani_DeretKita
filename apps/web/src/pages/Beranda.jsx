import { Link } from 'react-router-dom'
import { useStore } from '../lib/store.js'
import { MODUL } from '../content/modul.js'
import { BannerPasang } from '../components/Layout.jsx'

const bintangTeks = (n) => '★'.repeat(n) + '☆'.repeat(3 - n)

export default function Beranda() {
  const { profil, progres, angket } = useStore()
  const milik = progres[profil.kode] || {}
  const selesai = MODUL.filter((m) => milik[m.id]?.selesai).length
  const sudahAngket = (j) => angket.some((a) => a.kode_siswa === profil.kode && a.jenis === j)

  return (
    <>
      <header className="kepala">
        <span className="logo" aria-hidden>▮</span>
        <h1>DeretKita</h1>
        <Link to="/pengaturan" className="tombol-ikon" aria-label="Pengaturan">⚙</Link>
      </header>
      <main className="isi">
        <section className="kartu sapa">
          <h2>Halo, {profil.nama}!</h2>
          <p>{selesai === 0 ? 'Mulai dari modul pertama, ya. Ikuti urutannya pelan-pelan.' : `Kamu sudah menyelesaikan ${selesai} dari ${MODUL.length} modul.`}</p>
          <div className="bar-progres" aria-label={`Progres ${selesai} dari ${MODUL.length}`}><span style={{ width: `${(selesai / MODUL.length) * 100}%` }} /></div>
        </section>

        <BannerPasang />

        <h2 className="judul-bagian">Modul belajar</h2>
        <ol className="daftar-modul">
          {MODUL.map((m, i) => {
            const p = milik[m.id]
            const status = p?.selesai ? bintangTeks(p.bintang) : p?.pos ? 'Lanjutkan' : `${m.menit} menit`
            return (
              <li key={m.id}>
                <Link to={`/modul/${m.id}`} className={`modul ${p?.selesai ? 'selesai' : ''}`}>
                  <span className="nomor">{i}</span>
                  <span className="info"><strong>{m.judul}</strong><small>{m.ringkas}</small></span>
                  <span className="status">{status}</span>
                </Link>
              </li>
            )
          })}
        </ol>

        <h2 className="judul-bagian">Alat & angket</h2>
        <div className="grid-alat">
          <Link to="/kalkulator" className="alat"><strong>Kalkulator Pola</strong><small>Coba sendiri nilai a, r, n</small></Link>
          <Link to="/angket/leppink" className="alat"><strong>Angket Belajar</strong><small>{sudahAngket('leppink') ? 'Sudah diisi ✔' : 'Isi setelah selesai belajar'}</small></Link>
          <Link to="/angket/sus" className="alat"><strong>Angket Aplikasi</strong><small>{sudahAngket('sus') ? 'Sudah diisi ✔' : 'Pendapatmu tentang aplikasi'}</small></Link>
          <Link to="/dasbor" className="alat"><strong>Dasbor Guru</strong><small>Hasil & unduh data</small></Link>
        </div>
      </main>
    </>
  )
}
