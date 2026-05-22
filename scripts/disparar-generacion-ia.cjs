/**
 * Dispara un ciclo de 4 publicaciones IA en producción (post-deploy manual).
 * Uso: npm run vercel:sembrar-feed
 * Requiere CRON_SECRET en .env.vercel o variable de entorno.
 */
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const envVercel = path.join(root, '.env.vercel')
const urlPorDefecto = 'https://nexora-ruddy-nine.vercel.app'

const leerSecreto = () => {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET
  if (!fs.existsSync(envVercel)) return null
  for (const linea of fs.readFileSync(envVercel, 'utf8').split(/\r?\n/)) {
    const t = linea.trim()
    if (t.startsWith('CRON_SECRET=')) return t.slice('CRON_SECRET='.length).trim()
  }
  return null
}

const main = async () => {
  const secreto = leerSecreto()
  if (!secreto) {
    console.error('❌ Define CRON_SECRET en .env.vercel o en el entorno')
    process.exit(1)
  }

  const base = (process.env.VERCEL_PRODUCTION_URL || urlPorDefecto).replace(/\/$/, '')
  const url = `${base}/api/internal/cron/generate-news?modo=ejecutar`

  console.log(`\n🤖 Disparando generación IA → ${url}\n`)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secreto}`,
      'X-Cron-Origen': 'manual',
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(55000),
  })

  const cuerpo = await res.text()
  console.log(`Estado: ${res.status}`)
  console.log(cuerpo.slice(0, 2000))

  if (!res.ok) process.exit(1)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
