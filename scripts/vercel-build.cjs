/**
 * Build en Vercel: instala devDependencies (tsc, types, expo) y compila.
 * Vercel usa NODE_ENV=production en install y omite devDependencies si no se fuerza.
 */
const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const backendDir = path.join(root, 'backend')
const mobileDir = path.join(root, 'mobile')

const instalarDev = (dir, etiqueta) => {
  console.log(`\n📦 ${etiqueta}: npm install --include=dev …`)
  execSync('npm install --include=dev', {
    cwd: dir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  })
}

try {
  instalarDev(backendDir, 'backend')
  console.log('\n🔨 backend: tsc …')
  execSync('npm run build', {
    cwd: backendDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  })
  execSync('node scripts/migrar-en-build.cjs', {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
  console.log('\n📦 serverless: bundle API para Vercel …')
  execSync('node scripts/bundle-serverless.cjs', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  })
} catch {
  console.error('\n❌ Falló backend (install, tsc o bundle serverless).')
  process.exit(1)
}

const env = { ...process.env }
const urlProdPorDefecto = 'https://nexora-ruddy-nine.vercel.app/api'
if (env.VERCEL && env.VERCEL_URL) {
  env.EXPO_PUBLIC_API_URL = `https://${env.VERCEL_URL}/api`
} else if (!env.EXPO_PUBLIC_API_URL) {
  env.EXPO_PUBLIC_API_URL = urlProdPorDefecto
}

try {
  instalarDev(mobileDir, 'mobile')
  console.log('\n🌐 mobile: expo export --platform web …')
  execSync('npx expo export --platform web', {
    cwd: mobileDir,
    stdio: 'inherit',
    env: { ...env, NODE_ENV: 'production' },
  })
} catch {
  console.error('\n❌ Falló mobile (install o expo export).')
  process.exit(1)
}

const distDir = path.join(mobileDir, 'dist')
const faviconPng = path.join(mobileDir, 'assets', 'favicon.png')
const faviconSvg = path.join(mobileDir, 'assets', 'favicon.svg')
const indexHtml = path.join(distDir, 'index.html')

if (fs.existsSync(faviconPng)) {
  fs.copyFileSync(faviconPng, path.join(distDir, 'favicon.png'))
}

if (fs.existsSync(faviconSvg)) {
  fs.copyFileSync(faviconSvg, path.join(distDir, 'favicon.svg'))
}

if (fs.existsSync(indexHtml)) {
  let html = fs.readFileSync(indexHtml, 'utf8')
  const enlaces = []
  if (fs.existsSync(path.join(distDir, 'favicon.svg')) && !html.includes('favicon.svg')) {
    enlaces.push('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />')
  }
  if (enlaces.length) {
    html = html.replace('</head>', `  ${enlaces.join('\n  ')}\n</head>`)
    fs.writeFileSync(indexHtml, html)
  }
  console.log('\n🎨 Favicon listo en mobile/dist (PNG para Expo + SVG opcional en HTML)')
}

console.log('\n✅ Build listo: backend/dist + mobile/dist')
