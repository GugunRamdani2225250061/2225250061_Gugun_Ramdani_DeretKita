// Menghubungi Kak Deret lewat API Python. API key DeepSeek TIDAK ada di sini (hanya di server).
export const alamatAPI = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let statusAktif = null

/** { aktif: boolean, alasan?: 'server' | 'key' } */
export async function cekAI() {
  if (statusAktif) return statusAktif
  try {
    const r = await fetch(`${alamatAPI}/ai/status`, { signal: AbortSignal.timeout(5000) })
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
    throw new Error('Tidak bisa menghubungi server Kak Deret. Periksa internet.')
  }
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.detail || `Server error ${r.status}`)
  return d.jawaban
}
