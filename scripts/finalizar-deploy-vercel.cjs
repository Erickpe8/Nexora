/**
 * Tras pegar MYSQL_URL en db.remote.env:
 *   npm run vercel:finalizar
 *
 * Hace: tablas remotas + actualiza .env.vercel + sube env a Vercel (requiere vercel login).
 */
const fs = require('node:fs')
const path = require('node:path')
const { execSync, spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const dbRemote = path.join(root, 'db.remote.env')
const envVercel = path.join(root, '.env.vercel')
const vercelBin = path.join(root, 'node_modules', 'vercel', 'dist', 'index.js')

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

const ejecutarVercel = (args) => {
  if (fs.existsSync(vercelBin)) {
    return spawnSync('node', [vercelBin, ...args], { cwd: root, shell: false, encoding: 'utf8' })
  }
  return spawnSync('npx', ['vercel@latest', ...args], { cwd: root, shell: true, encoding: 'utf8' })
}

const main = () => {
  if (!fs.existsSync(dbRemote)) {
    console.error('\n❌ Crea db.remote.env desde db.remote.env.example')
    console.error('   Railway → MySQL → copia MYSQL_URL → pégala en db.remote.env\n')
    process.exit(1)
  }

  const remoto = parsear(fs.readFileSync(dbRemote, 'utf8'))
  const mysqlUrl = remoto.get('MYSQL_URL') || remoto.get('DATABASE_URL')
  if (!mysqlUrl?.startsWith('mysql://')) {
    console.error('❌ db.remote.env debe tener MYSQL_URL=mysql://...')
    process.exit(1)
  }

  if (!fs.existsSync(envVercel)) {
    execSync('node scripts/prepare-vercel-env.cjs', { cwd: root, stdio: 'inherit' })
  }

  let vercelEnv = fs.readFileSync(envVercel, 'utf8')
  const lineasExtra = [`MYSQL_URL=${mysqlUrl}`]
  if (remoto.get('DB_SSL')) lineasExtra.push(`DB_SSL=${remoto.get('DB_SSL')}`)

  if (!vercelEnv.includes('MYSQL_URL=')) {
    vercelEnv = vercelEnv.trimEnd() + '\n\n' + lineasExtra.join('\n') + '\n'
  } else {
    vercelEnv = vercelEnv.replace(/MYSQL_URL=.*/g, `MYSQL_URL=${mysqlUrl}`)
  }
  fs.writeFileSync(envVercel, vercelEnv, 'utf8')
  console.log('✅ .env.vercel actualizado con MYSQL_URL')

  console.log('\n🗄️  Sincronizando esquema MySQL (tablas + migraciones)…')
  const envTablas = { ...process.env, MYSQL_URL: mysqlUrl, NODE_ENV: 'production' }
  if (remoto.get('DB_SSL')) envTablas.DB_SSL = remoto.get('DB_SSL')
  execSync('npm run migrar', {
    cwd: path.join(root, 'backend'),
    stdio: 'inherit',
    env: envTablas,
  })

  const login = ejecutarVercel(['whoami'])
  if (login.status !== 0) {
    console.error('\n⚠️  Falta login en Vercel. En esta terminal ejecuta:')
    console.error('   npx vercel login')
    console.error('   npx vercel link')
    console.error('   npm run vercel:env\n')
    process.exit(0)
  }

  console.log('\n📤 Subiendo variables a Vercel…')
  execSync('node scripts/vercel-env-push.cjs', { cwd: root, stdio: 'inherit' })
  console.log('\n✅ Listo. En vercel.com → Deployments → Redeploy')
  console.log('   Tras el redeploy: 4 posts al primer acceso al sitio (semilla automática).')
  console.log('   Luego: cron cada hora en punto (4 posts por ciclo).')
  console.log('   Opcional manual: npm run vercel:sembrar-feed (requiere CRON_SECRET en .env.vercel)')
  console.log('   Prueba: https://nexora-ruddy-nine.vercel.app/api/salud\n')
}

main()
