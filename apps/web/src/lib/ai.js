// Menghubungi Kak Deret lewat API Python. API key TIDAK ada di sini (hanya di server).

// Menentukan alamat server Python secara otomatis:
// 1. VITE_API_URL di .env (mis. server Render untuk web online)
// 2. Dibuka dari server aplikasi di laptop (port 5173/4173), termasuk dari HP lewat Wi-Fi
//    -> pakai "/api" yang diteruskan ke server Python di laptop (HP tidak perlu pengaturan apa pun)
// 3. Dibuka lewat alamat IP lain -> server Python di komputer yang sama (port 8000)
// 4. Selain itu (file lokal) -> http://localhost:8000
function tentukanAPI() {
  const env = import.meta.env.VITE_API_URL
  if (env) return env.replace(/\/$/, '')
  if (typeof location === 'undefined') return 'http://localhost:8000'
  const { protocol, hostname, port } = location
  if (protocol.startsWith('http') && (import.meta.env.DEV || port === '5173' || port === '4173')) return '/api'
  if (protocol.startsWith('http') && hostname && hostname !== 'localhost' && !hostname.endsWith('github.io')) return `${protocol}//${hostname}:8000`
  return 'http://localhost:8000'
}

export const alamatAPI = tentukanAPI()

let statusAktif = null

/** { aktif: boolean, alasan?: 'server' | 'key' } */
export async function cekAI() {
  if (statusAktif) return statusAktif
  try {
    const r = await fetch(`${alamatAPI}/ai/status`, { signal: AbortSignal.timeout(6000) })
    if (!r.ok) return { aktif: false, alasan: 'server' }
    const d = await r.json()
    if (d.aktif) statusAktif = d
    return d.aktif ? d : { aktif: false, alasan: 'key' }
  } catch {
    return { aktif: false, alasan: 'server' }
  }
}

export async function tanyaAI({ mode, konteks, pesan, riwayat }) {
  let r
  try {
    r = await fetch(`${alamatAPI}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, konteks, pesan, riwayat }),
      signal: AbortSignal.timeout(60000),
    })
  } catch {
    throw new Error('Tidak bisa menghubungi server Kak Deret. Periksa internet / Wi-Fi.')
  }
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.detail || `Server error ${r.status}`)
  return d.jawaban
}
