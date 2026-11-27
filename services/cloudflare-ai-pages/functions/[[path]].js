// Cloudflare Pages Functions: meneruskan semua permintaan ke server Kak Deret yang sama
// (services/cloudflare-ai/src/index.js). Dipakai karena domain *.workers.dev diblokir
// sebagian penyedia internet di Indonesia, sedangkan *.pages.dev tidak.
import server from '../../cloudflare-ai/src/index.js'

export const onRequest = (context) => server.fetch(context.request, context.env)
