// LOBI UTAMA
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store.js'
import { MODUL } from '../content/modul.js'
import { BannerPasang } from '../components/Layout.jsx'
import LatarMatematika from '../components/LatarMatematika.jsx'
import GridModul from '../components/GridModul.jsx'
import Rumus from '../components/Rumus.jsx'
import Bentuk from '../components/Bentuk.jsx'

function CincinProgres({ selesai, total }) {
  const r = 52, kel = 2 * Math.PI * r, persen = selesai / total
  return (
    <div className="cincin" role="img" aria-label={`${selesai} dari ${total} modul selesai`}>
      <svg viewBox="0 0 120 120">
        <defs>
          <linearGradient id="gCincin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde047" /><stop offset=".5" stopColor="#4ade80" /><stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} className="cincin-dasar" />
        <circle cx="60" cy="60" r={r} className="cincin-isi" stroke="url(#gCincin)"
          strokeDasharray={kel} strokeDashoffset={kel * (1 - persen)} />
      </svg>
      <div className="cincin-teks"><b>{Math.round(persen * 100)}%</b><small>{selesai}/{total} modul</small></div>
    </div>
  )
}

export default function Beranda() {
  const { profil, progres, jawaban } = useStore()
  const milik = progres[profil.kode] || {}
  const selesai = MODUL.filter((m) => milik[m.id]?.selesai).length
  const bintang = MODUL.reduce((t, m) => t + (milik[m.id]?.selesai ? milik[m.id].bintang : 0), 0)
  const soalSaya = jawaban.filter((j) => j.kode_siswa === profil.kode).length
  const berikut = MODUL.find((m) => !milik[m.id]?.selesai) || MODUL[0]
  const sedangJalan = Boolean(milik[berikut.id]?.pos)

  return (
    <main className="lobi">
      <LatarMatematika />

      <section className="hero">
        <div className="hero-teks">
          <p className="hero-sapa">Halo, {profil.nama}! 👋</p>
          <h1>Petualangan <span className="pelangi">Deret Geometri</span></h1>
          <p className="hero-sub">Temukan pola <b>dikali</b> di sekitarmu: bakteri membelah, bola memantul, pesan berantai, dan tabungan berlipat.</p>
          <Link className="btn btn-besar" to={`/modul/${berikut.id}`} style={{ '--aksen': berikut.warna }}>
            ▶ {selesai === MODUL.length ? 'Ulangi' : sedangJalan ? 'Lanjutkan' : 'Mulai'}: {berikut.judul}
          </Link>
        </div>
        <CincinProgres selesai={selesai} total={MODUL.length} />
      </section>

      <div className="statistik-lobi">
        <div style={{ '--aksen': '#f59e0b' }}><span>⭐</span><b>{bintang}</b><small>bintang</small></div>
        <div style={{ '--aksen': '#10b981' }}><span>✅</span><b>{selesai}</b><small>modul selesai</small></div>
        <div style={{ '--aksen': '#ec4899' }}><span>🎯</span><b>{soalSaya}</b><small>soal dikerjakan</small></div>
      </div>

      <BannerPasang />

      <section className="pita-rumus" aria-label="Rumus penting">
        <div className="kartu-rumus" style={{ '--aksen': '#0891b2' }}>
          <small>Suku ke-n</small><Rumus nama="Un" />
        </div>
        <div className="kartu-rumus" style={{ '--aksen': '#d97706' }}>
          <small>Jumlah n suku</small><Rumus nama="Sn" />
        </div>
        <div className="kartu-rumus" style={{ '--aksen': '#7c3aed' }}>
          <small>Rasio</small><Rumus nama="r" />
        </div>
      </section>

      <div className="judul-lobi">
        <Bentuk jenis="segienam" warna="#6366f1" ukuran={28} />
        <h2>Peta Petualangan</h2>
      </div>
      <GridModul progres={milik} />

      <div className="judul-lobi">
        <Bentuk jenis="bola" warna="#ec4899" ukuran={28} />
        <h2>Teman Belajar</h2>
      </div>
      <div className="grid-pintas">
        <Link to="/tanya" className="pintas" style={{ '--aksen': '#4f46e5' }}>
          <span className="pintas-ikon">🤖</span><strong>Tanya Kak Deret</strong><small>Tutor AI yang membimbingmu berpikir</small>
        </Link>
        <Link to="/kalkulator" className="pintas" style={{ '--aksen': '#0891b2' }}>
          <span className="pintas-ikon">🧮</span><strong>Kalkulator Pola</strong><small>Ubah a, r, n dan lihat polanya</small>
        </Link>
        <Link to="/rmt" className="pintas" style={{ '--aksen': '#059669' }}>
          <span className="pintas-ikon">🧠</span><strong>Model RMT</strong><small>3 tahap cara belajar di sini</small>
        </Link>
      </div>
    </main>
  )
}
