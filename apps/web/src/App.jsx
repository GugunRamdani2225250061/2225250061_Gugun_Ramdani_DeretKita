import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store.js'
import { kirimAntrean } from './lib/sinkron.js'
import Sidebar from './components/Sidebar.jsx'
import Masuk from './pages/Masuk.jsx'
import Beranda from './pages/Beranda.jsx'
import DaftarModul from './pages/DaftarModul.jsx'
import Modul from './pages/Modul.jsx'
import Kalkulator from './pages/Kalkulator.jsx'
import AngketMenu from './pages/AngketMenu.jsx'
import Angket from './pages/Angket.jsx'
import Dasbor from './pages/Dasbor.jsx'
import Pengaturan from './pages/Pengaturan.jsx'
import Tanya from './pages/Tanya.jsx'
import Rmt from './pages/Rmt.jsx'
import LatihanKilat from './pages/LatihanKilat.jsx'
import KartuRumus from './pages/KartuRumus.jsx'
import Kamus from './pages/Kamus.jsx'
import Lencana from './pages/Lencana.jsx'
import Bantuan from './pages/Bantuan.jsx'
import { terapkanHuruf } from './lib/fonts.js'

export default function App() {
  const { profil, pengaturan } = useStore()
  const lokasi = useLocation()

  useEffect(() => { terapkanHuruf(pengaturan.font, pengaturan.ukuranHuruf) }, [pengaturan.font, pengaturan.ukuranHuruf])

  useEffect(() => {
    if (!profil) return
    kirimAntrean(profil)
    const online = () => kirimAntrean(profil)
    window.addEventListener('online', online)
    return () => window.removeEventListener('online', online)
  }, [profil])

  const wajibMasuk = (el) => (profil ? el : <Navigate to="/masuk" replace />)
  const halamanMasuk = lokasi.pathname === '/masuk' || !profil
  // Saat belajar di dalam modul, menu disembunyikan di HP agar layar lega & siswa fokus
  const fokus = lokasi.pathname.startsWith('/modul/')

  const rute = (
    <Routes>
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/" element={wajibMasuk(<Beranda />)} />
      <Route path="/modul" element={wajibMasuk(<DaftarModul />)} />
      <Route path="/modul/:id" element={wajibMasuk(<Modul />)} />
      <Route path="/kalkulator" element={<Kalkulator />} />
      <Route path="/angket" element={wajibMasuk(<AngketMenu />)} />
      <Route path="/angket/:jenis" element={wajibMasuk(<Angket />)} />
      <Route path="/dasbor" element={<Dasbor />} />
      <Route path="/tanya" element={wajibMasuk(<Tanya />)} />
      <Route path="/rmt" element={<Rmt />} />
      <Route path="/pengaturan" element={wajibMasuk(<Pengaturan />)} />
      <Route path="/latihan" element={wajibMasuk(<LatihanKilat />)} />
      <Route path="/rumus" element={<KartuRumus />} />
      <Route path="/kamus" element={<Kamus />} />
      <Route path="/lencana" element={wajibMasuk(<Lencana />)} />
      <Route path="/bantuan" element={<Bantuan />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  if (halamanMasuk) return rute
  return (
    <div className={`shell ${fokus ? 'fokus' : ''}`}>
      <Sidebar />
      <div className="konten">{rute}</div>
    </div>
  )
}
