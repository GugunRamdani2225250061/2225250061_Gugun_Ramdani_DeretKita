// Tombol "Pasang Aplikasi" (PWA). Android/Chrome memakai event beforeinstallprompt;
// iPhone harus lewat menu Bagikan -> Tambahkan ke Layar Utama.
import { useEffect, useReducer } from 'react'

let tertunda = null
const pendengar = new Set()
const beritahu = () => pendengar.forEach((f) => f())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); tertunda = e; beritahu() })
  window.addEventListener('appinstalled', () => { tertunda = null; beritahu() })
}

export function useInstall() {
  const [, paksa] = useReducer((x) => x + 1, 0)
  useEffect(() => { pendengar.add(paksa); return () => pendengar.delete(paksa) }, [])
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
  return {
    bisaPasang: Boolean(tertunda),
    standalone,
    ios,
    async pasang() {
      if (!tertunda) return
      tertunda.prompt()
      await tertunda.userChoice
      tertunda = null
      beritahu()
    },
  }
}
