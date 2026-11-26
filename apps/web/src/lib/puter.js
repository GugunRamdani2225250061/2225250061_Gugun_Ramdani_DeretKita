// Kak Deret lewat Puter.js: model DeepSeek GRATIS tanpa API key ("user-pays": setiap pengguna masuk
// dengan akun Puter miliknya sendiri dan memakai kuota gratis bulanan akun itu).
// Skrip Puter hanya dimuat saat dibutuhkan (tidak di awal), agar aplikasi tetap ringan & offline.
import { susunPesan } from './promptRMT.js'

const SKRIP = 'https://js.puter.com/v2/'
// urutan model DeepSeek yang dicoba (cadangan jika satu tidak tersedia)
export const MODEL_PUTER = ['deepseek/deepseek-v4.1-flash', 'deepseek/deepseek-v4-flash', 'deepseek/deepseek-chat-v3.1']

let pemuatan = null

export function muatPuter() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Tidak di browser'))
  if (window.puter?.ai) return Promise.resolve(window.puter)
  if (!pemuatan) {
    pemuatan = new Promise((ok, gagal) => {
      const s = document.createElement('script')
      s.src = SKRIP
      s.async = true
      s.onload = () => (window.puter?.ai ? ok(window.puter) : gagal(new Error('Puter.js tidak tersedia.')))
      s.onerror = () => { pemuatan = null; s.remove(); gagal(new Error('Tidak bisa memuat Puter.js. Periksa internet.')) }
      document.head.appendChild(s)
    })
  }
  return pemuatan
}

export async function sudahMasukPuter() {
  try { const p = await muatPuter(); return Boolean(await p.auth.isSignedIn()) } catch { return false }
}

/** Harus dipanggil dari klik tombol (membuka jendela masuk Puter). */
export async function masukPuter() {
  const p = await muatPuter()
  await p.auth.signIn()
  return Boolean(await p.auth.isSignedIn())
}

export async function keluarPuter() {
  try { const p = await muatPuter(); await p.auth.signOut() } catch { /* abaikan */ }
}

function teksJawaban(r) {
  const c = r?.message?.content ?? r?.text ?? r
  if (Array.isArray(c)) return c.map((x) => (typeof x === 'string' ? x : x?.text || '')).join('')
  return typeof c === 'string' ? c : ''
}

function pesanGalat(e) {
  const t = String(e?.message || e?.error?.message || e?.error || e || '').toLowerCase()
  if (/fund|balance|quota|limit|credit|allowance/.test(t)) return 'Kuota gratis Puter di akun ini sudah habis untuk bulan ini.'
  if (/auth|sign|login|401/.test(t)) return 'Silakan masuk akun Puter dulu.'
  return 'Kak Deret (Puter) belum bisa menjawab. Coba lagi sebentar.'
}

export async function tanyaPuter({ mode, konteks, pesan, riwayat }) {
  const p = await muatPuter()
  const messages = susunPesan(mode, konteks, pesan, riwayat)
  let galat = null
  for (const model of MODEL_PUTER) {
    try {
      const teks = teksJawaban(await p.ai.chat(messages, { model, max_tokens: 400, temperature: 0.5 })).trim()
      if (teks) return teks
    } catch (e) { galat = e }
  }
  throw new Error(pesanGalat(galat))
}
