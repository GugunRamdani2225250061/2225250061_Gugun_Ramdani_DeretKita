// Menu vertikal di kiri. Layar lebar: ikon + nama + kartu kecil. HP: kolom ikon ramping.
import { useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../lib/store.js'
import { MODUL } from '../content/modul.js'
import { FONT } from '../lib/fonts.js'
import Bentuk from './Bentuk.jsx'

export const GRUP_MENU = [
  {
    judul: 'Belajar', item: [
      { ke: '/', ikon: '🏠', nama: 'Lobi', akhir: true },
      { ke: '/modul', ikon: '📚', nama: 'Modul' },
      { ke: '/latihan', ikon: '⚡', nama: 'Latihan Kilat' },
      { ke: '/rumus', ikon: '📐', nama: 'Kartu Rumus' },
      { ke: '/kamus', ikon: '📖', nama: 'Kamus' },
    ],
  },
  {
    judul: 'Teman Belajar', item: [
      { ke: '/tanya', ikon: '🤖', nama: 'Kak Deret' },
      { ke: '/kalkulator', ikon: '🧮', nama: 'Kalkulator' },
      { ke: '/rmt', ikon: '🧠', nama: 'Model RMT' },
    ],
  },
  {
    judul: 'Saya', item: [
      { ke: '/lencana', ikon: '🏅', nama: 'Lencana' },
      { ke: '/angket', ikon: '📝', nama: 'Angket' },
      { ke: '/pengaturan', ikon: '⚙️', nama: 'Pengaturan' },
      { ke: '/bantuan', ikon: '❓', nama: 'Bantuan' },
    ],
  },
  { judul: 'Guru', item: [{ ke: '/dasbor', ikon: '📊', nama: 'Dasbor Guru' }] },
]

const RUMUS_KILAT = [
  ['Suku ke-n', 'Uₙ = a · rⁿ⁻¹'],
  ['Rasio', 'r = U₂ : U₁'],
  ['Jumlah n suku', 'Sₙ = a(rⁿ − 1) : (r − 1)'],
  ['Pangkat', '2⁵ = 2·2·2·2·2 = 32'],
  ['Turun 20%', 'r = 0,8'],
  ['Pola bakteri', '1, 2, 4, 8, 16, …'],
]

export default function Sidebar() {
  const { profil, progres, pengaturan } = useStore()
  const milik = profil ? progres[profil.kode] || {} : {}
  const selesai = MODUL.filter((m) => milik[m.id]?.selesai).length
  const bintang = MODUL.reduce((t, m) => t + (milik[m.id]?.selesai ? milik[m.id].bintang : 0), 0)
  const [judulR, isiR] = useMemo(() => RUMUS_KILAT[Math.floor(Math.random() * RUMUS_KILAT.length)], [])
  const font = FONT.find((f) => f.id === pengaturan.font) || FONT[0]

  return (
    <nav className="sidebar" aria-label="Menu utama">
      <div className="sb-logo">
        <Bentuk jenis="kubus" warna="#fbbf24" ukuran={38} />
        <span className="sb-judul">Deret<b>Kita</b></span>
      </div>

      {profil && (
        <div className="sb-progres" title={`${selesai}/${MODUL.length} modul selesai, ${bintang} bintang`}>
          <div className="sb-progres-angka"><span>📈 {selesai}/{MODUL.length} modul</span><span>⭐ {bintang}</span></div>
          <div className="sb-bar"><span style={{ width: `${(selesai / MODUL.length) * 100}%` }} /></div>
        </div>
      )}

      {GRUP_MENU.map((g) => (
        <div key={g.judul} className="sb-grup">
          <p className="sb-grup-judul">{g.judul}</p>
          <ul>
            {g.item.map((m) => (
              <li key={m.ke}>
                <NavLink to={m.ke} end={m.akhir} className={({ isActive }) => `sb-item ${isActive ? 'aktif' : ''}`} title={m.nama}>
                  <span className="sb-ikon" aria-hidden>{m.ikon}</span>
                  <span className="sb-nama">{m.nama}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="sb-rumus" aria-label={`Rumus kilat: ${judulR} ${isiR}`}>
        <small>💡 Rumus kilat · {judulR}</small>
        <b>{isiR}</b>
      </div>

      <Link to="/pengaturan" className="sb-font" title="Ganti jenis huruf">
        <span className="sb-ikon" aria-hidden>Aa</span>
        <span className="sb-nama">Huruf: {font.nama}</span>
      </Link>

      {profil && (
        <div className="sb-profil" title={`${profil.nama} (${profil.kode})`}>
          <span className="sb-avatar">{profil.nama.slice(0, 1).toUpperCase()}</span>
          <span className="sb-nama"><b>{profil.nama}</b><small>{profil.kode}</small></span>
        </div>
      )}
      <div className="sb-hiasan" aria-hidden>
        <Bentuk jenis="segitiga" warna="#f472b6" ukuran={26} />
        <Bentuk jenis="bola" warna="#38bdf8" ukuran={26} />
        <Bentuk jenis="tabung" warna="#34d399" ukuran={26} />
        <Bentuk jenis="kerucut" warna="#fbbf24" ukuran={26} />
        <Bentuk jenis="segienam" warna="#a78bfa" ukuran={26} />
      </div>
    </nav>
  )
}
