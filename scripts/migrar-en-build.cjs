/**
 * Durante el build en Vercel: sincroniza MySQL si MYSQL_URL está en las env del proyecto.
 * Si falla (red, credenciales), no tumba el build; el middleware lo reintenta en runtime.
 */
const { execSync } = require('node:child_process')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const backendDir = path.join(root, 'backend')

const tieneMysql =
  process.env.MYSQL_URL?.startsWith('mysql://') ||
  process.env.DATABASE_URL?.startsWith('mysql://') ||
  process.env.DB_HOST

if (!tieneMysql) {
  console.log(
    '\n⏭  Migración en build omitida (sin MYSQL_URL en Vercel). Se aplicará en el primer request.\n'
  )
  process.exit(0)
}

console.log('\n🗄️  Sincronizando esquema MySQL en build de Vercel…\n')

try {
  execSync('npx ts-node src/infrastructure/database/sincronizarEsquema.ts', {
    cwd: backendDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  })
  console.log('\n✅ Esquema MySQL listo en build.\n')
} catch (err) {
  console.warn(
    '\n⚠️  Migración en build no completó (se reintentará al primer request):',
    err?.message || err,
    '\n'
  )
}
