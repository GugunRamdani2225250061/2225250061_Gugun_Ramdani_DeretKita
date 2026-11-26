// Menu vertikal di kiri. Layar lebar: ikon + nama. HP: kolom ikon ramping.
import { NavLink } from 'react-router-dom'
import { useStore } from '../lib/store.js'
import Bentuk from './Bentuk.jsx'

export const MENU = [
  { ke: '/', ikon: '🏠', nama: 'Lobi', akhir: true },
  { ke: '/modul', ikon: '📚', nama: 'Modul' },
  { ke: '/tanya', ikon: '🤖', nama: 'Kak Deret' },
  { ke: '/kalkulator', ikon: '🧮', nama: 'Kalkulator' },
  { ke: '/rmt', ikon: '🧠', nama: 'Model RMT' },
  { ke: '/angket', ikon: '📝', nama: 'Angket' },
  { ke: '/dasbor', ikon: '📊', nama: 'Dasbor Guru' },
  { ke: '/pengaturan', ikon: '⚙️', nama: 'Pengaturan' },
]

export default function Sidebar() {
  const { profil } = useStore()
  return (
    <nav className="sidebar" aria-label="Menu utama">
      <div className="sb-logo">
        <Bentuk jenis="kubus" warna="#fbbf24" ukuran={38} />
        <span className="sb-judul">Deret<b>Kita</b></span>
      </div>
      <ul>
        {MENU.map((m) => (
          <li key={m.ke}>
            <NavLink to={m.ke} end={m.akhir} className={({ isActive }) => `sb-item ${isActive ? 'aktif' : ''}`} title={m.nama}>
              <span className="sb-ikon" aria-hidden>{m.ikon}</span>
              <span className="sb-nama">{m.nama}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {profil && (
        <div className="sb-profil" title={`${profil.nama} (${profil.kode})`}>
          <span className="sb-avatar">{profil.nama.slice(0, 1).toUpperCase()}</span>
          <span className="sb-nama"><b>{profil.nama}</b><small>{profil.kode}</small></span>
        </div>
      )}
      <div className="sb-hiasan" aria-hidden>
        <Bentuk jenis="segitiga" warna="#f472b6" ukuran={30} />
        <Bentuk jenis="bola" warna="#38bdf8" ukuran={30} />
        <Bentuk jenis="tabung" warna="#34d399" ukuran={30} />
      </div>
    </nav>
  )
}
