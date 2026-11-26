// Halaman "Buka di HP": QR code agar aplikasi langsung terbuka di smartphone.
import { useEffect, useState } from 'react'
import qrcode from 'qrcode-generator'
import { Halaman } from '../components/Layout.jsx'
import { cekAI } from '../lib/ai.js'

const ALAMAT_ONLINE = 'https://gugunramdani2225250061.github.io/2225250061_Gugun_Ramdani_DeretKita/'
// APK terbaru dibuat otomatis oleh GitHub Actions (.github/workflows/apk.yml)
const ALAMAT_APK = 'https://github.com/GugunRamdani2225250061/2225250061_Gugun_Ramdani_DeretKita/releases/latest/download/DeretKita.apk'
// diisi otomatis oleh server aplikasi di laptop (vite.config.js); kosong di versi online
const ALAMAT_WIFI = typeof __ALAMAT_WIFI__ !== 'undefined' ? __ALAMAT_WIFI__ : ''

function KodeQR({ teks }) {
  const qr = qrcode(0, 'M')
  qr.addData(teks)
  qr.make()
  return <div className="kode-qr" role="img" aria-label={`Kode QR untuk ${teks}`} dangerouslySetInnerHTML={{ __html: qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true }) }} />
}

function KartuAlamat({ judul, alamat, warna, children }) {
  const [tersalin, setTersalin] = useState(false)
  const salin = async () => {
    try { await navigator.clipboard.writeText(alamat); setTersalin(true); setTimeout(() => setTersalin(false), 2000) } catch { /* abaikan */ }
  }
  return (
    <section className="kartu kartu-hp" style={{ '--aksen': warna }}>
      <h2>{judul}</h2>
      <KodeQR teks={alamat} />
      <p className="alamat-hp">{alamat}</p>
      <button className="btn sekunder kecil" onClick={salin}>{tersalin ? '✓ Tersalin' : '📋 Salin alamat'}</button>
      {children}
    </section>
  )
}

export default function BukaDiHP() {
  const [ai, setAi] = useState(null)
  useEffect(() => { cekAI().then(setAi) }, [])
  const diLaptop = Boolean(ALAMAT_WIFI)

  return (
    <Halaman judul="📱 Buka di HP" warna="#0d9488" lebar>
      <p>Arahkan <strong>kamera HP</strong> ke kode QR, lalu ketuk tautan yang muncul.</p>
      <div className="grid-hp">
        {diLaptop && (
          <KartuAlamat judul="📶 Lewat Wi-Fi (bersama laptop ini)" alamat={ALAMAT_WIFI} warna="#0d9488">
            <ol className="langkah-hp">
              <li>Sambungkan HP ke <strong>Wi-Fi yang sama</strong> dengan laptop.</li>
              <li>Pindai QR. Semua fitur jalan, termasuk <strong>Kak Deret</strong> {ai?.aktif ? '✅ (aktif)' : '(aktif jika mulai-api.bat berjalan & key terisi)'}.</li>
              <li>Jika tidak terbuka: izinkan Node.js di Windows Firewall ("Allow") saat pertama menjalankan.</li>
            </ol>
            <p className="kecil">📲 Memakai <b>aplikasi APK</b>? Di APK buka Pengaturan → Server Kak Deret, isi: <code>{ALAMAT_WIFI.replace(':5173/', ':8000')}</code></p>
          </KartuAlamat>
        )}
        <KartuAlamat judul="📲 Unduh aplikasi Android (APK)" alamat={ALAMAT_APK} warna="#16a34a">
          <ol className="langkah-hp">
            <li>Pindai QR di HP Android → file <b>DeretKita.apk</b> terunduh.</li>
            <li>Buka file itu → izinkan <em>"Instal dari sumber tidak dikenal"</em> → <b>Instal</b>.</li>
            <li>Tanpa Play Store. Semua fitur jalan offline; Kak Deret butuh alamat server (Pengaturan).</li>
          </ol>
        </KartuAlamat>
        <KartuAlamat judul="🌐 Versi online (dari mana saja)" alamat={ALAMAT_ONLINE} warna="#7c3aed">
          <ol className="langkah-hp">
            <li>Buka di <strong>Chrome</strong> (Android) atau <strong>Safari</strong> (iPhone).</li>
            <li>Tekan <strong>Pasang</strong> / menu ⋮ → <em>Instal aplikasi</em> (iPhone: Bagikan → <em>Tambahkan ke Layar Utama</em>).</li>
            <li>Bisa dipakai tanpa internet. Kak Deret di versi ini butuh server online (lihat panduan AI, Render.com).</li>
          </ol>
        </KartuAlamat>
      </div>
      {!diLaptop && <p className="kecil">Tip: jalankan <code>mulai-semua.bat</code> di laptop untuk mendapat QR Wi-Fi, sehingga Kak Deret bisa dipakai di HP siswa tanpa server online.</p>}
    </Halaman>
  )
}
