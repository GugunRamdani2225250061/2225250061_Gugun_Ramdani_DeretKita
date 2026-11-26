// Kak Deret GRATIS TANPA LOGIN & TANPA API KEY: Pollinations.ai (tingkat "anonymous").
// Model gratisnya saat diuji (Nov 2026): openai-fast = GPT-OSS 20B. Bukan DeepSeek.
// Batas: 1 jawaban per 45 detik untuk setiap alamat IP (satu Wi-Fi sekolah = satu IP).
// Pertanyaan siswa dikirim ke layanan pihak ketiga; jangan menulis data pribadi.
import { susunPesan } from './promptRMT.js'

const URL_CHAT = 'https://text.pollinations.ai/openai'
const URL_MODEL = 'https://text.pollinations.ai/models'
const MODEL_DEFAULT = 'openai-fast'
const JEDA_DETIK = 45

let modelTerpilih = null
let terakhir = 0

async function pilihModel() {
  if (modelTerpilih) return modelTerpilih
  try {
    const r = await fetch(URL_MODEL, { signal: AbortSignal.timeout(8000) })
    const d = await r.json()
    const daftar = Array.isArray(d) ? d : d.data || d.models || []
    const gratis = daftar.filter((m) => typeof m === 'object' && (m.tier === 'anonymous' || !m.tier)).map((m) => m.name || m.id)
    modelTerpilih = gratis.find((n) => /deepseek/i.test(n)) || gratis[0] || MODEL_DEFAULT
  } catch {
    modelTerpilih = MODEL_DEFAULT
  }
  return modelTerpilih
}

/** detik yang harus ditunggu sebelum boleh bertanya lagi (0 = boleh) */
export const sisaJeda = () => Math.max(0, Math.ceil(JEDA_DETIK - (Date.now() - terakhir) / 1000))

export class GalatJeda extends Error {
  constructor(detik) {
    super(`Kak Deret gratis sedang istirahat. Coba lagi dalam ${detik} detik ya (batas gratis: 1 jawaban per 45 detik).`)
    this.detik = detik
  }
}

export function bersihkan(teks) {
  return teks
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // blok "berpikir"
    .replace(/\\\(|\\\)|\\\[|\\\]/g, '') // pembatas LaTeX \( \) \[ \]
    .replace(/\\cdot/g, '·').replace(/\\times/g, '×').replace(/\\div/g, ':')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
    .replace(/\^\{([^}]*)\}/g, '^($1)')
    .replace(/[ \t]+\n/g, '\n').trim()
}

export async function tanyaGratis({ mode, konteks, pesan, riwayat }) {
  const tunggu = sisaJeda()
  if (terakhir && tunggu > 0) throw new GalatJeda(tunggu)
  const model = await pilihModel()
  let r
  try {
    r = await fetch(URL_CHAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: susunPesan(mode, konteks, pesan, riwayat) }),
      signal: AbortSignal.timeout(90000),
    })
  } catch {
    throw new Error('Tidak bisa menghubungi Kak Deret gratis. Periksa internet.')
  }
  if (r.status === 402 || r.status === 429) {
    const detik = Number(r.headers.get('Retry-After')) || JEDA_DETIK
    terakhir = Date.now() - (JEDA_DETIK - detik) * 1000
    throw new GalatJeda(detik)
  }
  const d = await r.json().catch(() => ({}))
  if (r.status === 403) {
    // layanan gratis menolak alamat lokal (http://localhost / IP Wi-Fi) dengan verifikasi anti-bot
    throw new Error('AI gratis hanya bisa dipakai dari versi online (https). Buka DeretKita versi online di HP, atau jalankan server Kak Deret (mulai-api.bat).')
  }
  if (!r.ok) throw new Error('Kak Deret gratis sedang bermasalah. Coba lagi nanti.')
  terakhir = Date.now()
  const teks = bersihkan(d?.choices?.[0]?.message?.content || '')
  if (!teks) throw new Error('Kak Deret belum memberi jawaban. Coba ulangi pertanyaanmu.')
  return teks
}
