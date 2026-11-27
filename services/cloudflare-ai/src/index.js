// Server Kak Deret di Cloudflare Workers (GRATIS, online 24 jam, bisa dipakai dari HP/APK di mana saja).
// AI dijalankan oleh Cloudflare Workers AI lewat "binding" env.AI, jadi TIDAK ADA API key di kode/aplikasi.
// API-nya sama dengan server Python (services/api):  GET /ai/status   POST /ai   GET /health
import { susunPesan } from '../../../apps/web/src/lib/promptRMT.js'

// Urutan model (cadangan jika satu gagal / kuota). DeepSeek R1 distill = gratis di paket Free.
export const MODEL_DEFAULT = [
  '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/qwen/qwen3-30b-a3b-fp8',
]

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } })

export function daftarModel(env) {
  const atur = (env?.AI_MODEL || '').split(',').map((m) => m.trim()).filter(Boolean)
  return atur.length ? atur : MODEL_DEFAULT
}

/** Ambil teks jawaban dari berbagai bentuk respons Workers AI, buang blok "berpikir" DeepSeek R1. */
export function teksJawaban(hasil) {
  let t = typeof hasil === 'string' ? hasil
    : hasil?.response ?? hasil?.result?.response ?? hasil?.choices?.[0]?.message?.content ?? ''
  if (typeof t !== 'string') t = JSON.stringify(t)
  t = t.replace(/<think>[\s\S]*?<\/think>/gi, '')
  if (/<think>/i.test(t)) t = t.split(/<\/?think>/i).pop() // blok berpikir tidak tertutup
  return t.replace(/\\\(|\\\)|\\\[|\\\]/g, '').trim()
}

// ---- pembatas sederhana per perangkat (per IP), agar adil untuk satu kelas ----
const catatan = new Map()
export function cekBatas(ip, sekarang = Date.now(), batas = 20) {
  const daftar = (catatan.get(ip) || []).filter((t) => sekarang - t < 10 * 60 * 1000)
  if (daftar.length >= batas) return false
  daftar.push(sekarang)
  catatan.set(ip, daftar)
  if (catatan.size > 5000) catatan.clear()
  return true
}

async function tanya(request, env) {
  let data
  try { data = await request.json() } catch { return json({ detail: 'Format permintaan salah.' }, 400) }
  const { mode = 'mediasi', konteks = {}, pesan = '', riwayat = [] } = data || {}
  let messages
  try { messages = susunPesan(mode, konteks, String(pesan).slice(0, 500), Array.isArray(riwayat) ? riwayat : []) } catch { return json({ detail: 'mode tidak dikenal' }, 400) }

  const ip = request.headers.get('CF-Connecting-IP') || 'lokal'
  if (!cekBatas(ip, Date.now(), Number(env.AI_BATAS_PER_10_MENIT || 20))) {
    return json({ detail: 'Kamu sudah banyak bertanya. Coba pikirkan dulu, lalu tanya lagi beberapa menit lagi.' }, 429)
  }

  let galat = null
  for (const model of daftarModel(env)) {
    try {
      // DeepSeek R1 "berpikir" dulu sebelum menjawab -> beri ruang token lebih banyak
      const max_tokens = model.includes('deepseek-r1') ? 1500 : 500
      const hasil = await env.AI.run(model, { messages, max_tokens, temperature: 0.5 })
      const teks = teksJawaban(hasil)
      if (teks) return json({ jawaban: teks, model })
    } catch (e) {
      galat = e
    }
  }
  const pesanGalat = String(galat?.message || '')
  if (/neuron|limit|quota|429|capacity/i.test(pesanGalat)) return json({ detail: 'Kuota AI gratis hari ini sudah habis. Coba lagi besok.' }, 429)
  return json({ detail: 'Kak Deret sedang bermasalah. Coba lagi sebentar.' }, 502)
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    if (pathname === '/health') return json({ status: 'ok', ai: Boolean(env.AI) })
    if (pathname === '/ai/status') {
      return json({ aktif: Boolean(env.AI), penyedia: 'Cloudflare Workers AI', model: daftarModel(env)[0] })
    }
    if (pathname === '/ai' && request.method === 'POST') {
      if (!env.AI) return json({ detail: 'AI belum tersambung (binding AI di wrangler.toml).' }, 503)
      return tanya(request, env)
    }
    if (pathname.startsWith('/analisis')) {
      return json({ detail: 'Analisis statistik hanya tersedia di server Python di laptop (mulai-api.bat).' }, 404)
    }
    return json({ detail: 'Tidak ditemukan' }, 404)
  },
}
