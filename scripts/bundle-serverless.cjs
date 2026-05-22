/**
 * Empaqueta Express (backend/dist) en un solo CJS para la función Vercel.
 * bcryptjs va incluido en el bundle (sin binarios nativos; fiable en Vercel).
 */
const esbuild = require('esbuild')
const path = require('node:path')
const fs = require('node:fs')

const root = path.resolve(__dirname, '..')
const entry = path.join(root, 'backend/dist/app.js')
const outfile = path.join(root, 'api/serverless.bundle.cjs')

if (!fs.existsSync(entry)) {
  console.error('❌ Falta backend/dist/app.js — ejecuta `npm run build` en backend primero.')
  process.exit(1)
}

console.log('\n📦 Empaquetando API serverless (esbuild)…')

esbuild.buildSync({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'node',
  target: ['node20'],
  format: 'cjs',
  sourcemap: false,
  minify: false,
  logLevel: 'info',
})

console.log('✅ api/serverless.bundle.cjs generado')
