import multer from 'multer'

const almacen = multer.memoryStorage()

export const middlewareSubidaAvatar = multer({
  storage: almacen,
  limits: { fileSize: 500_000, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('Formato de imagen no permitido'))
      return
    }
    cb(null, true)
  },
}).single('foto')
