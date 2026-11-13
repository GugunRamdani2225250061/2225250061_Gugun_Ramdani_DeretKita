import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from './lib/store.js'
import { kirimAntrean } from './lib/sinkron.js'
import Masuk from './pages/Masuk.jsx'
import Beranda from './pages/Beranda.jsx'
import Modul from './pages/Modul.jsx'
import Kalkulator from './pages/Kalkulator.jsx'
import Angket from './pages/Angket.jsx'
import Dasbor from './pages/Dasbor.jsx'
import Pengaturan from './pages/Pengaturan.jsx'

export default function App() {
  const { profil, pengaturan } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle('huruf-besar', pengaturan.hurufBesar)
  }, [pengaturan.hurufBesar])

  useEffect(() => {
    if (!profil) return
    kirimAntrean(profil)
    const online = () => kirimAntrean(profil)
    window.addEventListener('online', online)
    return () => window.removeEventListener('online', online)
  }, [profil])

  const wajibMasuk = (el) => (profil ? el : <Navigate to="/masuk" replace />)

  return (
    <Routes>
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/" element={wajibMasuk(<Beranda />)} />
      <Route path="/modul/:id" element={wajibMasuk(<Modul />)} />
      <Route path="/kalkulator" element={<Kalkulator />} />
      <Route path="/angket/:jenis" element={wajibMasuk(<Angket />)} />
      <Route path="/dasbor" element={<Dasbor />} />
      <Route path="/pengaturan" element={wajibMasuk(<Pengaturan />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
