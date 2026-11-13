import { useNavigate } from 'react-router-dom'
import { Halaman } from '../components/Layout.jsx'
import { useStore, setPengaturan, keluar } from '../lib/store.js'
import { supabaseAktif, jumlahAntrean } from '../lib/sinkron.js'

function Saklar({ label, ket, nilai, onUbah }) {
  return (
    <label className="saklar">
      <span><strong>{label}</strong><small>{ket}</small></span>
      <input type="checkbox" role="switch" checked={nilai} onChange={(e) => onUbah(e.target.checked)} />
    </label>
  )
}

export default function Pengaturan() {
  const { profil, pengaturan } = useStore()
  const nav = useNavigate()
  return (
    <Halaman judul="Pengaturan">
      <section className="kartu">
        <p>Masuk sebagai <strong>{profil.nama}</strong> ({profil.kode}{profil.kelas ? ` · kelas ${profil.kelas}` : ''})</p>
        <button className="btn sekunder" onClick={() => { keluar(); nav('/masuk') }}>Ganti siswa</button>
      </section>
      <section className="kartu">
        <Saklar label="Huruf besar" ket="Memperbesar semua tulisan" nilai={pengaturan.hurufBesar} onUbah={(v) => setPengaturan({ hurufBesar: v })} />
        <Saklar label="Mode uji coba" ket="Menampilkan pertanyaan tingkat kesulitan setelah setiap soal (untuk uji coba soal)" nilai={pengaturan.modeUjiCoba} onUbah={(v) => setPengaturan({ modeUjiCoba: v })} />
      </section>
      <section className="kartu kecil">
        <p>Penyimpanan online (Supabase): <strong>{supabaseAktif ? 'aktif' : 'tidak aktif (data hanya di perangkat ini)'}</strong>{supabaseAktif && ` · antrean ${jumlahAntrean()}`}</p>
        <p>DeretKita v0.1 · Gugun Ramdani (2225250061) · Pendidikan Matematika</p>
      </section>
    </Halaman>
  )
}
