import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

// Alamat laptop di Wi-Fi (untuk QR "Buka di HP"). Utamakan 192.168.x.x, lalu alamat lokal lain.
function ipWifi() {
  const semua = Object.values(os.networkInterfaces()).flat()
    .filter((a) => a && a.family === 'IPv4' && !a.internal && !a.address.startsWith('169.254'))
    .map((a) => a.address)
  return semua.find((a) => a.startsWith('192.168.')) || semua.find((a) => a.startsWith('10.') || a.startsWith('172.')) || semua[0] || ''
}

// Server Python (Kak Deret & analisis). HP cukup membuka aplikasi; permintaan /api diteruskan ke laptop.
const API_LOKAL = { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') } }

// mode "offline" = satu file HTML yang bisa dibuka dengan klik dua kali (tanpa server).
export default defineConfig(({ mode, command }) => {
  const offline = mode === 'offline'
  const ip = command === 'serve' ? ipWifi() : ''
  return {
    base: './',
    envDir: '../../', // baca .env dari folder utama proyek
    define: { __ALAMAT_WIFI__: JSON.stringify(ip ? `http://${ip}:5173/` : '') },
    server: { host: true, port: 5173, proxy: API_LOKAL },
    preview: { host: true, port: 4173, proxy: API_LOKAL },
    plugins: [
      react(),
      offline
        ? viteSingleFile()
        : VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon.png'],
            manifest: {
              name: 'DeretKita: Barisan & Deret Geometri',
              short_name: 'DeretKita',
              description: 'Belajar barisan dan deret geometri dalam kehidupan sehari-hari untuk siswa SMP.',
              lang: 'id',
              start_url: './',
              scope: './',
              display: 'standalone',
              orientation: 'portrait',
              background_color: '#f6f7f4',
              theme_color: '#1f5fbf',
              icons: [
                { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
            workbox: { globPatterns: ['**/*.{js,css,html,png,svg,woff2}'] },
          }),
    ],
    resolve: {
      alias: offline
        ? { 'virtual:pwa-register': fileURLToPath(new URL('./src/lib/pwa-stub.js', import.meta.url)) }
        : {},
    },
    build: offline ? { outDir: '../../coba', emptyOutDir: false, copyPublicDir: false } : {},
  }
})
