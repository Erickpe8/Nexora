/**
 * Migra la BD de Railway usando db.remote.env en la raíz del monorepo.
 * Uso: copia db.remote.env.example → db.remote.env y pega MYSQL_URL (+ DB_SSL=true).
 */
const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const envFile = path.join(root, 'db.remote.env')

if (!fs.existsSync(envFile)) {
  console.error('❌ Falta db.remote.env en la raíz del proyecto.')
  console.error('   Copia db.remote.env.example → db.remote.env')
  console.error('   y pega MYSQL_URL=mysql://… desde Railway → MySQL → Connect.')
  process.exit(1)
}

require('dotenv').config({ path: envFile })

if (!process.env.MYSQL_URL && !process.env.DB_HOST) {
  console.error('❌ db.remote.env no define MYSQL_URL ni DB_HOST.')
  process.exit(1)
}

console.log('🔗 Migrando base de datos remota (Railway)…\n')
execSync('npx ts-node src/infrastructure/database/sincronizarEsquema.ts', {
  cwd: path.join(root, 'backend'),
  stdio: 'inherit',
  env: { ...process.env },
})

console.log('\n✅ Migración terminada. Prueba registro en Vercel de nuevo.')
