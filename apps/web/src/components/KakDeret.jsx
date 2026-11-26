// Panel "Tanya Kak Deret": tutor AI sebagai MEDIATOR RMT (membimbing, tidak memberi jawaban akhir).
// Jalur GABUNGAN: 1) server Python (API key di server) jika tersedia,
//                 2) jika tidak, DeepSeek GRATIS lewat Puter.js (siswa masuk akun Puter sekali).
import { useEffect, useRef, useState } from 'react'
import Teks from './Teks.jsx'
import { cekAI, diAPK, tanyaAI } from '../lib/ai.js'
import { getState } from '../lib/store.js'
import { masukPuter, sudahMasukPuter, tanyaPuter } from '../lib/puter.js'

const puterDiizinkan = () => getState().pengaturan.puterAktif !== false

export default function KakDeret({ mode = 'mediasi', konteks, aksiCepat = [], onPakai, label = 'Tanya Kak Deret', selaluBuka = false }) {
  const [buka, setBuka] = useState(selaluBuka)
  const [jalur, setJalur] = useState(null) // null | 'server' | 'puter' | 'mati'
  const [alasan, setAlasan] = useState('')
  const [masuk, setMasuk] = useState(false)
  const [sedangMasuk, setSedangMasuk] = useState(false)
  const [riwayat, setRiwayat] = useState([])
  const [teks, setTeks] = useState('')
  const [muat, setMuat] = useState(false)
  const [galat, setGalat] = useState('')
  const bawah = useRef(null)

  async function pakaiPuter() {
    setJalur('puter')
    setMasuk(await sudahMasukPuter())
  }

  useEffect(() => {
    if (!buka || jalur) return
    (async () => {
      const s = await cekAI()
      if (s.aktif) { setJalur('server'); return }
      setAlasan(s.alasan)
      if (puterDiizinkan()) await pakaiPuter()
      else setJalur('mati')
    })()
  }, [buka, jalur])
  useEffect(() => { if (riwayat.length) bawah.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [riwayat, muat])

  async function masukAkun() {
    setSedangMasuk(true); setGalat('')
    try { setMasuk(await masukPuter()) } catch (e) { setGalat(e?.message || 'Gagal masuk akun Puter. Coba lagi.') } finally { setSedangMasuk(false) }
  }

  async function kirim(isi) {
    const pesan = (isi ?? teks).trim()
    if (!pesan || muat) return
    setMuat(true); setGalat(''); setTeks('')
    try {
      const data = { mode, konteks, pesan, riwayat }
      const jawaban = jalur === 'puter' ? await tanyaPuter(data) : await tanyaAI(data)
      setRiwayat((r) => [...r, { role: 'user', content: pesan }, { role: 'assistant', content: jawaban }])
      onPakai?.()
    } catch (e) {
      setTeks(pesan)
      if (jalur === 'server' && /menghubungi/i.test(e.message) && puterDiizinkan()) {
        setGalat('Server tidak tersambung. Beralih ke DeepSeek gratis lewat Puter…')
        await pakaiPuter()
      } else setGalat(e.message)
    } finally {
      setMuat(false)
    }
  }

  if (!buka) return <button className="btn-ai" onClick={() => setBuka(true)}>🤖 {label}</button>

  const siapObrol = jalur === 'server' || (jalur === 'puter' && masuk)

  return (
    <div className="panel-ai">
      <div className="panel-ai-kepala">
        <span className="avatar-ai" aria-hidden>🤖</span>
        <div>
          <strong>Kak Deret</strong>
          <small>{jalur === 'puter' ? 'DeepSeek gratis · lewat Puter' : jalur === 'server' ? 'Membimbingmu berpikir, bukan memberi jawaban' : 'Membimbingmu berpikir'}</small>
        </div>
        {!selaluBuka && <button className="tutup" aria-label="Tutup Kak Deret" onClick={() => setBuka(false)}>✕</button>}
      </div>

      {jalur === null && <p className="kecil">Menghubungkan ke Kak Deret…</p>}

      {jalur === 'mati' && (
        <div className="umpan lihat">
          Kak Deret belum aktif.{' '}
          {alasan === 'atur' ? 'Alamat server belum diatur (Pengaturan → Server Kak Deret).'
            : alasan === 'server' ? 'Server Kak Deret tidak bisa dihubungi.'
              : 'API key AI belum diisi di server.'}
          {' '}Atau nyalakan <b>“DeepSeek gratis lewat Puter”</b> di Pengaturan.
        </div>
      )}

      {jalur === 'puter' && !masuk && (
        <div className="masuk-puter">
          <p><b>Kak Deret memakai DeepSeek gratis</b> lewat layanan <b>Puter</b>. Masuk (atau daftar gratis) akun Puter <b>sekali saja</b> di HP ini.</p>
          <button className="btn lebar" onClick={masukAkun} disabled={sedangMasuk}>{sedangMasuk ? 'Membuka…' : '🔐 Masuk akun Puter (gratis)'}</button>
          <small>Pakai nama pengguna samaran, jangan nama lengkap. Setiap akun punya kuota gratis bulanan.</small>
          {diAPK() && <small><b>Di aplikasi APK</b>, jendela masuk Puter bisa tidak terbuka. Lebih mudah: isi <b>Pengaturan → Server Kak Deret</b> dengan alamat laptop guru.</small>}
        </div>
      )}

      {galat && <p className="umpan salah">{galat}</p>}

      {siapObrol && (
        <>
          <div className="obrolan" aria-live="polite">
            {riwayat.map((m, i) => (
              <div key={i} className={`gelembung ${m.role}`}>{m.role === 'assistant' ? <Teks>{m.content}</Teks> : m.content}</div>
            ))}
            {muat && <div className="gelembung assistant mengetik">Kak Deret sedang berpikir<span>…</span></div>}
            <div ref={bawah} />
          </div>
          {riwayat.length === 0 && aksiCepat.length > 0 && (
            <div className="saran-ai">
              {aksiCepat.map((a) => <button key={a.label} onClick={() => kirim(a.pesan ?? a.label)} disabled={muat}>{a.label}</button>)}
            </div>
          )}
          <div className="baris-isian">
            <input value={teks} maxLength={500} placeholder="Tulis pertanyaan atau caramu berpikir…" aria-label="Pesan untuk Kak Deret"
              onChange={(e) => setTeks(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && kirim()} />
            <button className="btn kecil" onClick={() => kirim()} disabled={muat || !teks.trim()}>Kirim</button>
          </div>
        </>
      )}
    </div>
  )
}
