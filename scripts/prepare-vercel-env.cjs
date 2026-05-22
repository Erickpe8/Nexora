/**
 * Genera .env.vercel en la raíz para deploy (no mezcla localhost de Docker).
 */
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const root = path.resolve(__dirname, '..')
const URL_API_PROD = 'https://nexora-ruddy-nine.vercel.app/api'
const destino = path.join(root, '.env.vercel')
const backendEnv = path.join(root, 'backend', '.env')

const parsear = (contenido) => {
  const m = new Map()
  for (const linea of contenido.split(/\r?\n/)) {
    const t = linea.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq <= 0) continue
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    m.set(t.slice(0, eq).trim(), val)
  }
  return m
}

const leerBackend = () => {
  if (!fs.existsSync(backendEnv)) {
    console.error('Falta backend/.env')
    process.exit(1)
  }
  return parsear(fs.readFileSync(backendEnv, 'utf8'))
}

const main = () => {
  const b = leerBackend()
  const dbHost = b.get('DB_HOST') || 'localhost'
  const esLocal =
    dbHost === 'localhost' || dbHost === '127.0.0.1' || dbHost.startsWith('192.168.')

  const lineas = [
    '# Generado por npm run vercel:prepare — edita DB_* si sigue en local',
    `EXPO_PUBLIC_API_URL=${URL_API_PROD}`,
    '',
    esLocal
      ? '# ⚠️ Pon aquí el host de MySQL en la nube (Railway, PlanetScale, etc.)'
      : '# MySQL en la nube',
    `DB_HOST=${esLocal ? '' : dbHost}`,
    `DB_PUERTO=${esLocal ? '3306' : b.get('DB_PUERTO') || '3306'}`,
    `DB_NOMBRE=${b.get('DB_NOMBRE') || 'nexora'}`,
    `DB_USUARIO=${esLocal ? '' : b.get('DB_USUARIO') || ''}`,
    `DB_CONTRASENA=${esLocal ? '' : b.get('DB_CONTRASENA') || ''}`,
    '',
    `JWT_SECRETO=${b.get('JWT_SECRETO') || ''}`,
    `JWT_EXPIRACION=${b.get('JWT_EXPIRACION') || '7d'}`,
    '',
    `DEEPSEEK_API_KEY=${b.get('DEEPSEEK_API_KEY') || ''}`,
    `DEEPSEEK_URL=${b.get('DEEPSEEK_URL') || 'https://api.deepseek.com/v1/chat/completions'}`,
    '',
    `CRON_SECRET=${b.get('CRON_SECRET') || crypto.randomBytes(32).toString('hex')}`,
    `INTERNO_API_KEY=${b.get('INTERNO_API_KEY') || 'nexora_interno_dev'}`,
    '',
    'NODE_ENV=production',
    '',
  ]

  fs.writeFileSync(destino, lineas.join('\n'), 'utf8')
  console.log(`✅ Creado ${path.relative(root, destino)}`)
  if (esLocal) {
    console.warn(
      '\n⚠️  DB_HOST era local. Abre .env.vercel y completa DB_HOST, DB_USUARIO y DB_CONTRASENA del proveedor en la nube.'
    )
    console.warn('   Sin eso, /api/salud seguirá con mysql: "error".\n')
  } else {
    console.log('   Revisa el archivo y ejecuta: npm run vercel:env\n')
  }
}

main()
