import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, masuk, pilihProfil } from '../lib/store.js'
import { kirimAntrean } from '../lib/sinkron.js'
import { Halaman } from '../components/Layout.jsx'

export default function Masuk() {
  const { daftarProfil } = useStore()
  const [nama, setNama] = useState('')
  const [kelas, setKelas] = useState('')
  const nav = useNavigate()

  const mulai = (e) => {
    e.preventDefault()
    if (!nama.trim()) return
    const p = masuk(nama, kelas)
    kirimAntrean(p)
    nav('/')
  }

  return (
    <Halaman judul="DeretKita" kembali={null}>
      <section className="kartu sambutan">
        <h2>Selamat datang!</h2>
        <p>Belajar <strong>barisan dan deret geometri</strong> dari kejadian sehari-hari: bakteri membelah, bola memantul, pesan berantai, dan tabungan.</p>
      </section>

      <form className="kartu" onSubmit={mulai}>
        <label className="field">
          <span>Nama panggilan</span>
          <input value={nama} maxLength={20} onChange={(e) => setNama(e.target.value)} placeholder="mis. Raka" autoComplete="off" required />
          <small>Cukup nama panggilan, jangan nama lengkap.</small>
        </label>
        <label className="field">
          <span>Kode kelas (jika ada)</span>
          <input value={kelas} maxLength={12} onChange={(e) => setKelas(e.target.value)} placeholder="mis. 9A" autoComplete="off" />
        </label>
        <button className="btn lebar" type="submit">Mulai belajar</button>
      </form>

      {daftarProfil.length > 0 && (
        <section className="kartu">
          <h3>Pernah masuk di perangkat ini</h3>
          <div className="daftar-profil">
            {daftarProfil.map((p) => (
              <button key={p.kode} className="btn sekunder" onClick={() => { pilihProfil(p); kirimAntrean(p); nav('/') }}>
                {p.nama} <small>({p.kode}{p.kelas ? ` · ${p.kelas}` : ''})</small>
              </button>
            ))}
          </div>
        </section>
      )}
    </Halaman>
  )
}
