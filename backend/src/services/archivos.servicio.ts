import fs from 'fs/promises'
import path from 'path'
import { entorno } from '../shared/config/entorno'
import { ErrorHttp } from '../shared/errors/errorHttp'

const MAX_AVATAR_BYTES = 500_000
const MIME_PERMITIDOS = new Set(['image/jpeg', 'image/png', 'image/webp'])

const extensionPorMime = (mime: string): string => {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'jpg'
}

/** Guarda avatar: archivo en disco (local) o data URL (Vercel serverless). */
export const guardarAvatarUsuario = async (
  usuarioId: number,
  buffer: Buffer,
  mime: string
): Promise<string> => {
  if (!MIME_PERMITIDOS.has(mime)) {
    throw new ErrorHttp('Formato de imagen no permitido. Use JPEG, PNG o WebP', 400)
  }
  if (buffer.length > MAX_AVATAR_BYTES) {
    throw new ErrorHttp('La imagen no puede superar 500 KB', 400)
  }

  if (process.env.VERCEL) {
    const b64 = buffer.toString('base64')
    return `data:${mime};base64,${b64}`
  }

  const ext = extensionPorMime(mime)
  const dir = path.join(process.cwd(), 'uploads', 'avatars')
  await fs.mkdir(dir, { recursive: true })
  const nombreArchivo = `${usuarioId}.${ext}`
  await fs.writeFile(path.join(dir, nombreArchivo), buffer)

  const base =
    process.env.PUBLIC_API_URL?.replace(/\/$/, '') ||
    `http://localhost:${entorno.puerto}`
  return `${base}/uploads/avatars/${nombreArchivo}`
}
