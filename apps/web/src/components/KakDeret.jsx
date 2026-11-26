// Panel "Tanya Kak Deret": tutor AI (DeepSeek) sebagai MEDIATOR RMT.
// Ia membimbing dengan pertanyaan pemandu, tidak memberi jawaban akhir.
import { useEffect, useRef, useState } from 'react'
import Teks from './Teks.jsx'
import { cekAI, tanyaAI } from '../lib/ai.js'

export default function KakDeret({ mode = 'mediasi', konteks, aksiCepat = [], onPakai, label = 'Tanya Kak Deret', selaluBuka = false }) {
  const [buka, setBuka] = useState(selaluBuka)
  const [status, setStatus] = useState(null)
  const [riwayat, setRiwayat] = useState([])
  const [teks, setTeks] = useState('')
  const [muat, setMuat] = useState(false)
  const [galat, setGalat] = useState('')
  const bawah = useRef(null)

  useEffect(() => { if (buka && !status) cekAI().then(setStatus) }, [buka, status])
  useEffect(() => { if (riwayat.length) bawah.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [riwayat, muat])

  async function kirim(isi) {
    const pesan = (isi ?? teks).trim()
    if (!pesan || muat) return
    setMuat(true); setGalat(''); setTeks('')
    try {
      const jawaban = await tanyaAI({ mode, konteks, pesan, riwayat })
      setRiwayat((r) => [...r, { role: 'user', content: pesan }, { role: 'assistant', content: jawaban }])
      onPakai?.()
    } catch (e) {
      setGalat(e.message)
      setTeks(pesan)
    } finally {
      setMuat(false)
    }
  }

  if (!buka) return <button className="btn-ai" onClick={() => setBuka(true)}>🤖 {label}</button>

  return (
    <div className="panel-ai">
      <div className="panel-ai-kepala">
        <span className="avatar-ai" aria-hidden>🤖</span>
        <div><strong>Kak Deret</strong><small>Membimbingmu berpikir, bukan memberi jawaban</small></div>
        {!selaluBuka && <button className="tutup" aria-label="Tutup Kak Deret" onClick={() => setBuka(false)}>✕</button>}
      </div>

      {status === null && <p className="kecil">Menghubungkan ke Kak Deret…</p>}
      {status && !status.aktif && (
        <div className="umpan lihat">
          Kak Deret belum aktif.{' '}
          {status.alasan === 'server'
            ? 'Server Python belum berjalan atau belum online (jalankan mulai-api.bat).'
            : 'API key DeepSeek belum diisi di file .env server.'}
          <br /><small>Panduan: docs/PANDUAN_AI_DEEPSEEK.md</small>
        </div>
      )}

      {status?.aktif && (
        <>
          <div className="obrolan" aria-live="polite">
            {riwayat.map((m, i) => (
              <div key={i} className={`gelembung ${m.role}`}>{m.role === 'assistant' ? <Teks>{m.content}</Teks> : m.content}</div>
            ))}
            {muat && <div className="gelembung assistant mengetik">Kak Deret sedang berpikir<span>…</span></div>}
            <div ref={bawah} />
          </div>
          {galat && <p className="umpan salah">{galat}</p>}
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
