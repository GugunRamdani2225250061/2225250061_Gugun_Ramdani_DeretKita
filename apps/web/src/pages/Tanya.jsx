import { Halaman } from '../components/Layout.jsx'
import KakDeret from '../components/KakDeret.jsx'
import AvatarKakDeret from '../components/AvatarKakDeret.jsx'

const SARAN = [
  { label: 'Apa bedanya barisan dan deret?' },
  { label: 'Kenapa pangkatnya n − 1?' },
  { label: 'Contoh barisan geometri di sekitarku?' },
  { label: 'Bagaimana cara mencari rasio?' },
]

export default function Tanya() {
  return (
    <Halaman judul="🤖 Tanya Kak Deret" warna="#4f46e5">
      <section className="hero-kd">
        <div className="hero-kd-avatar"><AvatarKakDeret ukuran={104} melambai /></div>
        <div>
          <p className="hero-kd-sapa">Hai, aku Kak Deret! 👋</p>
          <p>Tanyakan apa saja tentang <b>barisan dan deret geometri</b>. Aku tidak langsung memberi jawaban, tetapi membantumu <b>berpikir sendiri</b> dengan pertanyaan pemandu.</p>
          <div className="hero-kd-tag"><span>🧠 Mediator RMT</span><span>💬 Bahasa Indonesia</span><span>🆓 Gratis</span></div>
        </div>
      </section>
      <KakDeret mode="tanya" selaluBuka aksiCepat={SARAN} konteks={{}} />
    </Halaman>
  )
}
