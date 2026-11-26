import { useState } from 'react'
import { Halaman } from '../components/Layout.jsx'
import Bentuk from '../components/Bentuk.jsx'
import { KAMUS } from '../content/kamus.js'

const WARNA = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#db2777', '#dc2626']

export default function Kamus() {
  const [cari, setCari] = useState('')
  const q = cari.trim().toLowerCase()
  const hasil = KAMUS.filter((k) => !q || k.istilah.toLowerCase().includes(q) || k.arti.toLowerCase().includes(q))
  return (
    <Halaman judul="📖 Kamus Istilah" warna="#2563eb">
      <input className="cari" type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="🔎 Cari istilah, mis. rasio" aria-label="Cari istilah" />
      {hasil.length === 0 && <p className="kecil">Tidak ditemukan. Coba kata lain.</p>}
      <div className="daftar-kamus">
        {hasil.map((k, i) => (
          <section key={k.istilah} className="kartu kamus-item" style={{ '--aksen': WARNA[i % WARNA.length] }}>
            <Bentuk jenis={k.bentuk} warna={WARNA[i % WARNA.length]} ukuran={40} />
            <div>
              <h3>{k.istilah}</h3>
              <p>{k.arti}</p>
              <p className="kamus-contoh">{k.contoh}</p>
            </div>
          </section>
        ))}
      </div>
    </Halaman>
  )
}
