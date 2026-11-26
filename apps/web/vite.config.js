import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'

// mode "offline" = satu file HTML yang bisa dibuka dengan klik dua kali (tanpa server).
export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'
  return {
    base: './',
    envDir: '../../', // baca .env dari folder utama proyek
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
