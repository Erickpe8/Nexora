/**
 * Build en Vercel (y local): compila backend (tsc) y exporta web estática de Expo.
 * Si no defines EXPO_PUBLIC_API_URL, en Vercel se usa https://VERCEL_URL/api para el bundle.
 */
const { execSync } = require('node:child_process')
const path = require('node:path')

const root = path.resolve(__dirname, '..')

execSync('npm run build', {
  cwd: path.join(root, 'backend'),
  stdio: 'inherit',
  env: process.env,
})

const env = { ...process.env }
if (!env.EXPO_PUBLIC_API_URL && env.VERCEL_URL) {
  env.EXPO_PUBLIC_API_URL = `https://${env.VERCEL_URL}/api`
}

execSync('npx expo export --platform web', {
  cwd: path.join(root, 'mobile'),
  stdio: 'inherit',
  env,
})
