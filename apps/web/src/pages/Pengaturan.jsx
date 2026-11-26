import { useNavigate } from 'react-router-dom'
import { Halaman } from '../components/Layout.jsx'
import { useStore, setPengaturan, keluar } from '../lib/store.js'
import { supabaseAktif, jumlahAntrean } from '../lib/sinkron.js'
import { FONT, UKURAN } from '../lib/fonts.js'
import { useState } from 'react'
import { alamatAPI, cekAI, diAPK } from '../lib/ai.js'
import { keluarPuter } from '../lib/puter.js'

function ServerAI({ nilai }) {
  const [isi, setIsi] = useState(nilai || '')
  const [hasil, setHasil] = useState(null)
  const simpanCek = async (v) => {
    setPengaturan({ apiUrl: v.trim() })
    setHasil({ teks: 'Memeriksa…' })
    const s = await cekAI(true)
    setHasil(s.aktif
      ? { ok: true, teks: `✅ Kak Deret aktif (${s.penyedia || 'AI'}).` }
      : { ok: false, teks: s.alasan === 'key' ? '⚠️ Server terhubung, tetapi API key AI belum diisi di .env server.' : s.alasan === 'atur' ? '⚠️ Alamat belum diisi.' : '❌ Server tidak bisa dihubungi. Periksa alamat, Wi-Fi, dan pastikan mulai-api.bat berjalan.' })
  }
  return (
    <section className="kartu" id="server-ai">
      <h2>🤖 Server Kak Deret</h2>
      <p className="kecil">
        {diAPK() ? 'Aplikasi Android perlu tahu alamat server Kak Deret. ' : 'Biasanya terisi otomatis; isi hanya jika perlu. '}
        Di kelas: alamat laptop guru, mis. <code>http://192.168.1.5:8000</code> (lihat menu <b>Buka di HP</b> di laptop). Online: alamat server Render.
      </p>
      <div className="baris-isian">
        <input value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="http://192.168.1.5:8000" aria-label="Alamat server Kak Deret" inputMode="url" />
        <button className="btn kecil" onClick={() => simpanCek(isi)}>Simpan & cek</button>
      </div>
      <p className="kecil">Dipakai sekarang: <code>{alamatAPI() || '(belum diatur)'}</code>{nilai && <> · <button className="btn teks-saja" onClick={() => { setIsi(''); simpanCek('') }}>kembalikan otomatis</button></>}</p>
      {hasil && <p className={`umpan ${hasil.ok ? 'benar' : hasil.ok === false ? 'salah' : 'lihat'}`}>{hasil.teks}</p>}
    </section>
  )
}

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
    <Halaman judul="⚙️ Pengaturan" warna="#475569">
      <section className="kartu" id="tampilan">
        <h2>🔤 Jenis huruf</h2>
        <p className="kecil">Pilih huruf yang paling nyaman kamu baca.</p>
        <div className="pilih-font" role="radiogroup" aria-label="Jenis huruf">
          {FONT.map((f) => (
            <button key={f.id} role="radio" aria-checked={pengaturan.font === f.id}
              className={`font-opsi ${pengaturan.font === f.id ? 'pilih' : ''}`} style={{ fontFamily: f.css }}
              onClick={() => setPengaturan({ font: f.id })}>
              <span className="font-contoh">Aa 2, 4, 8</span>
              <strong>{f.nama}</strong>
              <small>{f.ket}</small>
            </button>
          ))}
        </div>

        <h2 className="mt">🔍 Ukuran huruf</h2>
        <div className="segmen-ukuran" role="radiogroup" aria-label="Ukuran huruf">
          {UKURAN.map((u) => (
            <button key={u.id} role="radio" aria-checked={pengaturan.ukuranHuruf === u.id}
              className={pengaturan.ukuranHuruf === u.id ? 'pilih' : ''} onClick={() => setPengaturan({ ukuranHuruf: u.id })}>
              <span style={{ fontSize: u.skala }}>A</span>{u.nama}
            </button>
          ))}
        </div>

        <div className="pratinjau">
          <small>Pratinjau</small>
          <p>Barisan <strong>3, 6, 12, 24</strong> memiliki rasio <span className="sim sim-r">r = 2</span>. Suku ke-<span className="sim sim-n">n</span> dihitung dengan U<sub>n</sub> = <span className="sim sim-a">a</span> · <span className="sim sim-r">r</span><sup>n−1</sup>.</p>
        </div>
      </section>

      <ServerAI nilai={pengaturan.apiUrl} />
      <section className="kartu">
        <Saklar label="AI gratis tanpa login" ket="Jika server Kak Deret tidak tersedia, Kak Deret memakai AI gratis tanpa login & tanpa API key (Pollinations). Batas: 1 jawaban per 45 detik per jaringan."
          nilai={pengaturan.gratisAktif !== false} onUbah={(v) => setPengaturan({ gratisAktif: v })} />
        <Saklar label="DeepSeek lewat Puter (perlu login)" ket="Pilihan tambahan: DeepSeek gratis lewat Puter.js. Siswa harus masuk akun Puter. Dipakai hanya jika “AI gratis tanpa login” dimatikan."
          nilai={pengaturan.puterAktif === true} onUbah={(v) => setPengaturan({ puterAktif: v })} />
        <button className="btn teks-saja" onClick={async () => { await keluarPuter(); alert('Sudah keluar dari akun Puter di perangkat ini.') }}>Keluar dari akun Puter</button>
      </section>

      <section className="kartu">
        <p>Masuk sebagai <strong>{profil.nama}</strong> ({profil.kode}{profil.kelas ? ` · kelas ${profil.kelas}` : ''})</p>
        <button className="btn sekunder" onClick={() => { keluar(); nav('/masuk') }}>Ganti siswa</button>
      </section>
      <section className="kartu">
        <Saklar label="Mode uji coba" ket="Menampilkan pertanyaan tingkat kesulitan setelah setiap soal (untuk uji coba soal)" nilai={pengaturan.modeUjiCoba} onUbah={(v) => setPengaturan({ modeUjiCoba: v })} />
      </section>
      <section className="kartu kecil">
        <p>Penyimpanan online (Supabase): <strong>{supabaseAktif ? 'aktif' : 'tidak aktif (data hanya di perangkat ini)'}</strong>{supabaseAktif && ` · antrean ${jumlahAntrean()}`}</p>
        <p>DeretKita v0.3 · Gugun Ramdani (2225250061) · Pendidikan Matematika</p>
      </section>
    </Halaman>
  )
}
