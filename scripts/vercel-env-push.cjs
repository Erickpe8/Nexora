/**
 * Sube .env.vercel (raíz) al proyecto Vercel enlazado.
 *
 *   npm run vercel:prepare   # genera .env.vercel desde backend/.env
 *   npm run vercel:env:dry
 *   npm run vercel:env
 */
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const archivoVercel = path.join(root, '.env.vercel')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const soloProduction = args.includes('--production-only')
const entornos = soloProduction ? ['production'] : ['production', 'preview', 'development']

const parsearEnv = (contenido) => {
  const mapa = new Map()
  for (const linea of contenido.split(/\r?\n/)) {
    const t = linea.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq <= 0) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!val) continue
    mapa.set(key, val)
  }
  return mapa
}

const hostEsLocal = (host) =>
  !host ||
  host === 'localhost' ||
  host === '127.0.0.1' ||
  /^192\.168\./.test(host) ||
  /^10\./.test(host)

const validar = (vars) => {
  const errores = []
  const requeridas = ['EXPO_PUBLIC_API_URL', 'JWT_SECRETO', 'DEEPSEEK_API_KEY']
  for (const k of requeridas) {
    if (!vars.has(k)) errores.push(`Falta ${k} en .env.vercel`)
  }
  const mysqlUrl = vars.get('MYSQL_URL') || vars.get('DATABASE_URL')
  const tieneDb =
    mysqlUrl?.startsWith('mysql://') ||
    (vars.has('DB_HOST') && vars.has('DB_USUARIO') && vars.has('DB_CONTRASENA'))
  if (!tieneDb) {
    errores.push('Falta MYSQL_URL (recomendado) o DB_HOST + DB_USUARIO + DB_CONTRASENA')
  }
  const api = vars.get('EXPO_PUBLIC_API_URL') || ''
  if (!api.startsWith('https://')) {
    errores.push('EXPO_PUBLIC_API_URL debe ser https://…/api')
  }
  const host = vars.get('DB_HOST') || ''
  if (!mysqlUrl && hostEsLocal(host)) {
    errores.push(`DB_HOST="${host}" no sirve en Vercel. Usa MYSQL_URL de Railway en db.remote.env`)
  }
  return errores
}

const vercelBin = path.join(root, 'node_modules', 'vercel', 'dist', 'index.js')

const ejecutarVercel = (args, opts = {}) => {
  if (fs.existsSync(vercelBin)) {
    return spawnSync('node', [vercelBin, ...args], { cwd: root, shell: false, ...opts })
  }
  return spawnSync('npx', ['vercel@latest', ...args], { cwd: root, shell: true, ...opts })
}

const tieneVercelCli = () => ejecutarVercel(['--version'], { encoding: 'utf8' }).status === 0
const proyectoEnlazado = () => {
  const dir = path.join(root, '.vercel')
  return (
    fs.existsSync(path.join(dir, 'project.json')) || fs.existsSync(path.join(dir, 'repo.json'))
  )
}

const esSensible = (key) => /SECRET|PASSWORD|CONTRASENA|KEY|URL/i.test(key)

const subirClave = (key, value) => {
  if (dryRun) {
    const preview =
      esSensible(key) && value.length > 8
        ? `${value.slice(0, 4)}…(${value.length} chars)`
        : value
    console.log(`  ${key}=${preview}  →  [${entornos.join(', ')}]`)
    return true
  }
  for (const env of entornos) {
    ejecutarVercel(['env', 'rm', key, env, '--yes'], { stdio: 'ignore' })
    const args = ['env', 'add', key, env, '--value', value, '--yes']
    if (esSensible(key)) args.push('--sensitive')
    const r = ejecutarVercel(args, { encoding: 'utf8' })
    if (r.status !== 0) {
      console.error(`❌ Falló ${key} (${env})`, r.stderr || r.stdout || '')
      return false
    }
  }
  console.log(`✅ ${key} → ${entornos.join(', ')}`)
  return true
}

const main = () => {
  if (!fs.existsSync(archivoVercel)) {
    console.error('No existe .env.vercel. Ejecuta: npm run vercel:prepare')
    console.error('Luego edita DB_* con tu MySQL en la nube.')
    process.exit(1)
  }

  if (!tieneVercelCli()) {
    console.error('npm install && npx vercel login && npx vercel link')
    process.exit(1)
  }
  if (!proyectoEnlazado() && !dryRun) {
    console.error('vercel link  (desde la raíz del repo)')
    process.exit(1)
  }

  const vars = parsearEnv(fs.readFileSync(archivoVercel, 'utf8'))
  vars.set('NODE_ENV', 'production')

  const errores = validar(vars)
  if (errores.length) {
    console.error('\n❌ .env.vercel incompleto o inválido:\n')
    errores.forEach(e => console.error(`   - ${e}`))
    console.error('\nEdita .env.vercel y vuelve a intentar.\n')
    process.exit(1)
  }

  console.log(dryRun ? `\n[dry-run] ${vars.size} variables:\n` : `\nSubiendo ${vars.size} variables…\n`)

  let ok = 0
  for (const [key, value] of vars) {
    if (subirClave(key, value)) ok += 1
  }

  console.log(dryRun ? '\nnpm run vercel:env' : `\nListo ${ok}/${vars.size}. Redeploy en Vercel.`)
}

main()
