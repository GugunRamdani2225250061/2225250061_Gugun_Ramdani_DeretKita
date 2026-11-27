// Panel "Tanya Kak Deret": tutor AI sebagai MEDIATOR RMT (membimbing, tidak memberi jawaban akhir).
// Urutan jalur:
//   1) server Python (API key di server) jika tersedia
//   2) GRATIS tanpa login & tanpa API key (Pollinations, lib/gratis.js), default
//   3) DeepSeek lewat Puter.js, HANYA jika dinyalakan di Pengaturan (perlu login akun Puter)
import { useEffect, useRef, useState } from 'react'
import Teks from './Teks.jsx'
import AvatarKakDeret from './AvatarKakDeret.jsx'
import { cekAI, diAPK, tanyaAI } from '../lib/ai.js'
import { getState } from '../lib/store.js'
import { GalatJeda, sisaJeda, tanyaGratis } from '../lib/gratis.js'
import { masukPuter, sudahMasukPuter, tanyaPuter } from '../lib/puter.js'

const pengaturan = () => getState().pengaturan
const gratisDiizinkan = () => pengaturan().gratisAktif !== false
const puterDiizinkan = () => pengaturan().puterAktif === true

const KET_JALUR = {
  server: 'Membimbingmu berpikir, bukan memberi jawaban',
  gratis: 'AI gratis tanpa login',
  puter: 'DeepSeek gratis · lewat Puter',
}

export default function KakDeret({ mode = 'mediasi', konteks, aksiCepat = [], onPakai, label = 'Tanya Kak Deret', selaluBuka = false }) {
  const [buka, setBuka] = useState(selaluBuka)
  const [jalur, setJalur] = useState(null) // null | 'server' | 'gratis' | 'puter' | 'mati'
  const [alasan, setAlasan] = useState('')
  const [masuk, setMasuk] = useState(false)
  const [sedangMasuk, setSedangMasuk] = useState(false)
  const [riwayat, setRiwayat] = useState([])
  const [teks, setTeks] = useState('')
  const [muat, setMuat] = useState(false)
  const [galat, setGalat] = useState('')
  const [jeda, setJeda] = useState(0)
  const bawah = useRef(null)

  async function jalurCadangan() {
    // APK berjalan dari https://localhost yang ditolak layanan AI gratis -> arahkan ke server / versi web
    if (diAPK()) { setAlasan('apk'); setJalur('mati'); return }
    if (gratisDiizinkan()) { setJalur('gratis'); return }
    if (puterDiizinkan()) { setJalur('puter'); setMasuk(await sudahMasukPuter()); return }
    setJalur('mati')
  }

  useEffect(() => {
    if (!buka || jalur) return
    (async () => {
      const s = await cekAI()
      if (s.aktif) { setJalur('server'); return }
      setAlasan(s.alasan)
      await jalurCadangan()
    })()
  }, [buka, jalur])
  useEffect(() => { if (riwayat.length) bawah.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [riwayat, muat])
  // hitung mundur saat AI gratis "istirahat"
  useEffect(() => {
    if (jeda <= 0) return
    const t = setInterval(() => setJeda(sisaJeda()), 1000)
    return () => clearInterval(t)
  }, [jeda > 0])
  useEffect(() => { if (jeda === 0 && galat.startsWith('Kak Deret gratis sedang istirahat')) setGalat('') }, [jeda, galat])

  async function masukAkun() {
    setSedangMasuk(true); setGalat('')
    try { setMasuk(await masukPuter()) } catch (e) { setGalat(e?.message || 'Gagal masuk akun Puter. Coba lagi.') } finally { setSedangMasuk(false) }
  }

  async function kirim(isi) {
    const pesan = (isi ?? teks).trim()
    if (!pesan || muat || jeda > 0) return
    setMuat(true); setGalat(''); setTeks('')
    try {
      const data = { mode, konteks, pesan, riwayat }
      const jawaban = jalur === 'puter' ? await tanyaPuter(data) : jalur === 'gratis' ? await tanyaGratis(data) : await tanyaAI(data)
      setRiwayat((r) => [...r, { role: 'user', content: pesan }, { role: 'assistant', content: jawaban }])
      onPakai?.()
      if (jalur === 'gratis') setJeda(sisaJeda())
    } catch (e) {
      setTeks(pesan)
      if (e instanceof GalatJeda) { setJeda(e.detik); setGalat(e.message) }
      else if (jalur === 'server' && /menghubungi/i.test(e.message) && (gratisDiizinkan() || puterDiizinkan())) {
        setGalat('Server tidak tersambung. Beralih ke Kak Deret gratis…')
        await jalurCadangan()
      } else setGalat(e.message)
    } finally {
      setMuat(false)
    }
  }

  if (!buka) {
    return (
      <button className="btn-ai" onClick={() => setBuka(true)}>
        <AvatarKakDeret ukuran={42} />
        <span className="btn-ai-teks"><strong>{label}</strong><small>Bingung? Aku bantu kamu berpikir</small></span>
        <span className="btn-ai-panah" aria-hidden>›</span>
      </button>
    )
  }

  const siapObrol = jalur === 'server' || jalur === 'gratis' || (jalur === 'puter' && masuk)
  const keadaan = muat ? 'berpikir' : riwayat.length ? 'senang' : 'diam'

  return (
    <div className="panel-ai">
      <div className="panel-ai-kepala">
        <span className="kd-bingkai"><AvatarKakDeret ukuran={46} keadaan={keadaan} /></span>
        <div>
          <strong>Kak Deret {siapObrol && <span className="titik-online" title="online" />}</strong>
          <small>{KET_JALUR[jalur] || 'Membimbingmu berpikir'}</small>
        </div>
        {!selaluBuka && <button className="tutup" aria-label="Tutup Kak Deret" onClick={() => setBuka(false)}>✕</button>}
      </div>

      {jalur === null && <p className="kecil">Menghubungkan ke Kak Deret…</p>}

      {jalur === 'mati' && alasan === 'apk' && (
        <div className="umpan lihat">
          Di aplikasi APK, Kak Deret memakai <b>server</b>: buka <b>Pengaturan → Server Kak Deret</b> dan isi alamat laptop guru.
          {' '}Untuk <b>AI gratis tanpa login</b>, buka DeretKita <b>versi web online</b> di browser HP.
        </div>
      )}
      {jalur === 'mati' && alasan !== 'apk' && (
        <div className="umpan lihat">
          Kak Deret belum aktif.{' '}
          {alasan === 'atur' ? 'Alamat server belum diatur.' : alasan === 'server' ? 'Server Kak Deret tidak bisa dihubungi.' : 'API key AI belum diisi di server.'}
          {' '}Nyalakan <b>“AI gratis tanpa login”</b> di Pengaturan.
        </div>
      )}

      {jalur === 'puter' && !masuk && (
        <div className="masuk-puter">
          <p><b>Kak Deret memakai DeepSeek</b> lewat layanan <b>Puter</b>. Masuk akun Puter <b>sekali saja</b> di HP ini.</p>
          <button className="btn lebar" onClick={masukAkun} disabled={sedangMasuk}>{sedangMasuk ? 'Membuka…' : '🔐 Masuk akun Puter (gratis)'}</button>
          <small>Pakai nama pengguna samaran, jangan nama lengkap.</small>
        </div>
      )}

      {galat && <p className={`umpan ${jeda > 0 ? 'lihat' : 'salah'}`}>{jeda > 0 ? `⏳ Kak Deret gratis sedang istirahat. Coba lagi dalam ${jeda} detik ya.` : galat}</p>}

      {siapObrol && (
        <>
          <div className="obrolan" aria-live="polite">
            {riwayat.length === 0 && (
              <div className="baris-pesan ai">
                <AvatarKakDeret ukuran={30} />
                <div className="gelembung sapaan">Halo! Aku <b>Kak Deret</b> 👋 Pilih pertanyaan di bawah, atau tulis caramu berpikir. Aku akan membantumu menemukan jawabannya sendiri.</div>
              </div>
            )}
            {riwayat.map((m, i) => (m.role === 'assistant'
              ? <div key={i} className="baris-pesan ai"><AvatarKakDeret ukuran={30} keadaan="senang" /><div className="gelembung assistant"><Teks>{m.content}</Teks></div></div>
              : <div key={i} className="baris-pesan saya"><div className="gelembung user">{m.content}</div></div>))}
            {muat && (
              <div className="baris-pesan ai">
                <AvatarKakDeret ukuran={30} keadaan="berpikir" />
                <div className="gelembung assistant mengetik" role="status" aria-label="Kak Deret sedang berpikir"><i /><i /><i /></div>
              </div>
            )}
            <div ref={bawah} />
          </div>
          {riwayat.length === 0 && aksiCepat.length > 0 && (
            <div className="saran-ai">
              {aksiCepat.map((a) => <button key={a.label} onClick={() => kirim(a.pesan ?? a.label)} disabled={muat || jeda > 0}>{a.label}</button>)}
            </div>
          )}
          <div className="baris-tulis">
            <input value={teks} maxLength={500} placeholder="Tulis pertanyaan atau caramu berpikir…" aria-label="Pesan untuk Kak Deret"
              onChange={(e) => setTeks(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && kirim()} />
            <button className="btn-kirim" onClick={() => kirim()} disabled={muat || !teks.trim() || jeda > 0}
              aria-label={jeda > 0 ? `Tunggu ${jeda}s` : 'Kirim'}>
              {jeda > 0 ? <span className="jeda">{jeda}s</span>
                : <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M3 11.5 20 4l-7.5 17-2.2-7.3L3 11.5Z" fill="currentColor" /></svg>}
            </button>
          </div>
          {jalur === 'gratis' && riwayat.length > 0 && jeda > 0 && <p className="kecil">⏳ Pertanyaan berikutnya bisa dikirim dalam {jeda} detik.</p>}
        </>
      )}
    </div>
  )
}
