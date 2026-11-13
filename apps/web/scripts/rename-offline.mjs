// Mengganti nama hasil build offline: coba/index.html -> coba/DeretKita.html
import { renameSync, existsSync, rmSync } from 'node:fs'
const asal = new URL('../../../coba/index.html', import.meta.url)
const tujuan = new URL('../../../coba/DeretKita.html', import.meta.url)
if (existsSync(tujuan)) rmSync(tujuan)
renameSync(asal, tujuan)
console.log('Selesai: coba/DeretKita.html (klik dua kali untuk membuka)')
