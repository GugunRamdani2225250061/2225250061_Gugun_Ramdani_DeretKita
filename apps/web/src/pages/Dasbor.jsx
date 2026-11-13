import { useState } from 'react'
import { Halaman } from '../components/Layout.jsx'
import { useStore, hapusSemuaData } from '../lib/store.js'
import { ringkasPerSoal, keCSV, unduh, rata } from '../lib/statistik.js'
import { SOAL } from '../content/soal.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const f = (v, d = 2) => (v === null || v === undefined ? '-' : (+v).toFixed(d).replace('.', ','))

export default function Dasbor() {
  const { jawaban, angket, refleksi } = useStore()
  const [py, setPy] = useState(null)
  const [pesanPy, setPesanPy] = useState('')
  const per = ringkasPerSoal(jawaban)
  const siswa = [...new Set(jawaban.map((j) => j.kode_siswa))]
  const lep = angket.filter((a) => a.jenis === 'leppink')
  const sus = angket.filter((a) => a.jenis === 'sus')
  const tanggal = new Date().toISOString().slice(0, 10)

  const analisisPython = async () => {
    setPesanPy('Menghubungi server Python…')
    try {
      const res = await fetch(`${API}/analisis`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: jawaban, angket }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setPy(await res.json())
      setPesanPy('')
    } catch {
      setPesanPy(`Server Python belum berjalan di ${API}. Jalankan "mulai-api.bat" lalu coba lagi. Ringkasan di atas tetap bisa dipakai.`)
    }
  }

  return (
    <Halaman judul="Dasbor Guru / Peneliti">
      <section className="kartu">
        <h2>Ringkasan</h2>
        <div className="grid-angka">
          <div><strong>{siswa.length}</strong><small>siswa</small></div>
          <div><strong>{jawaban.length}</strong><small>soal dikerjakan</small></div>
          <div><strong>{f(rata(jawaban.map((j) => j.paas)), 1)}</strong><small>rata-rata Paas (1–9)</small></div>
        </div>
        <p className="kecil">Data tersimpan di perangkat ini. Unduh CSV dari setiap perangkat, lalu analisis dengan Python.</p>
      </section>

      <section className="kartu">
        <h2>Per soal</h2>
        {per.length === 0 ? <p>Belum ada data. Kerjakan beberapa soal dulu.</p> : (
          <div className="gulir-x">
            <table className="tabel data">
              <thead><tr><th>Soal</th><th>n</th><th>p</th><th>Waktu (s)</th><th>Paas</th><th>Persepsi</th><th>Bantuan</th></tr></thead>
              <tbody>
                {per.map((s) => (
                  <tr key={s.soal_id} className={s.paas >= 7 || s.persepsi >= 3.5 ? 'perhatian' : ''}>
                    <td title={SOAL[s.soal_id]?.judul}>{s.soal_id}</td><td>{s.n}</td><td>{f(s.p)}</td>
                    <td>{f(s.waktu, 0)}</td><td>{f(s.paas, 1)}</td><td>{f(s.persepsi, 1)}</td><td>{f(s.bantuan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="kecil">p = proporsi benar pada percobaan pertama. Persepsi: 1 terlalu mudah, 2 sesuai, 3 sulit, 4 terlalu sulit. Baris berwarna = perlu direvisi.</p>
      </section>

      <section className="kartu">
        <h2>Angket</h2>
        <p>Leppink ({lep.length} siswa): IL {f(rata(lep.map((a) => a.skor.IL)), 1)} · EL {f(rata(lep.map((a) => a.skor.EL)), 1)} · GL {f(rata(lep.map((a) => a.skor.GL)), 1)} <small>(skala 0–10)</small></p>
        <p>SUS ({sus.length} siswa): {f(rata(sus.map((a) => a.skor.SUS)), 1)} <small>(≥ 68 = dapat diterima)</small></p>
        <p>Refleksi tertulis: {refleksi.length}</p>
      </section>

      <section className="kartu">
        <h2>Unduh & analisis</h2>
        <div className="navigasi kolom">
          <button className="btn" disabled={!jawaban.length} onClick={() => unduh(`uji_coba_${tanggal}.csv`, keCSV(jawaban), 'text/csv')}>Unduh CSV uji coba</button>
          <button className="btn sekunder" onClick={() => unduh(`deretkita_semua_${tanggal}.json`, JSON.stringify({ jawaban, angket, refleksi }, null, 2), 'application/json')}>Unduh semua data (JSON)</button>
          <button className="btn sekunder" disabled={!jawaban.length} onClick={analisisPython}>Analisis dengan Python</button>
        </div>
        {pesanPy && <p className="umpan lihat">{pesanPy}</p>}
        {py && (
          <div className="gulir-x">
            <h3>Hasil Python</h3>
            <table className="tabel data">
              <thead><tr><th>Soal</th><th>p</th><th>Kategori</th><th>Rekomendasi</th></tr></thead>
              <tbody>{py.butir.soal.map((s) => <tr key={s.soal_id}><td>{s.soal_id}</td><td>{f(s.p)}</td><td>{s.kategori}</td><td>{s.rekomendasi}</td></tr>)}</tbody>
            </table>
            <p className="kecil">Rata-rata Paas: {f(py.butir.ringkasan.rata_paas)} · Korelasi p–Paas: {f(py.butir.ringkasan.korelasi_p_paas)}</p>
          </div>
        )}
      </section>

      <section className="kartu bahaya">
        <h2>Hapus data</h2>
        <p>Menghapus semua jawaban, angket, dan progres di perangkat ini. Unduh CSV dulu!</p>
        <button className="btn merah" onClick={() => { if (confirm('Yakin menghapus SEMUA data di perangkat ini? Tidak bisa dibatalkan.')) hapusSemuaData() }}>Hapus semua data</button>
      </section>
    </Halaman>
  )
}
