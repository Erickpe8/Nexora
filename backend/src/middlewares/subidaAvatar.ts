import type { Request } from 'express'
import multer from 'multer'

const MIME_PERMITIDOS = new Set(['image/jpeg', 'image/png', 'image/webp'])

const almacen = multer.memoryStorage()

export const middlewareSubidaAvatar = multer({
  storage: almacen,
  limits: { fileSize: 500_000, files: 1 },
  fileFilter: (_req: Request, file, cb) => {
    if (!MIME_PERMITIDOS.has(file.mimetype)) {
      cb(new Error('Formato de imagen no permitido'))
      return
    }
    cb(null, true)
  },
}).single('foto')
