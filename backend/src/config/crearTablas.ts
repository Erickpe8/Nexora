import { pool, verificarConexion } from './baseDatos'

// DDL completo de todas las tablas de Nexora
const tablas = [
  // Tabla de usuarios
  `CREATE TABLE IF NOT EXISTS usuarios (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(30) NOT NULL,
    correo       VARCHAR(255) NOT NULL UNIQUE,
    contrasena   VARCHAR(255) NOT NULL,
    creado_en    DATETIME DEFAULT NOW(),
    INDEX idx_correo (correo)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Tabla de publicaciones generadas por IA
  `CREATE TABLE IF NOT EXISTS publicaciones (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    titulo           VARCHAR(255) NOT NULL,
    resumen          TEXT NOT NULL,
    pregunta         VARCHAR(500) NOT NULL,
    etiquetas        JSON,
    generado_por_ia  BOOLEAN DEFAULT TRUE,
    creado_en        DATETIME DEFAULT NOW(),
    INDEX idx_creado_en (creado_en)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Tabla de comentarios con soporte de anidación y soft delete
  `CREATE TABLE IF NOT EXISTS comentarios (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id       INT NOT NULL,
    usuario_id           INT NOT NULL,
    comentario_padre_id  INT DEFAULT NULL,
    contenido            TEXT NOT NULL,
    eliminado            BOOLEAN DEFAULT FALSE,
    creado_en            DATETIME DEFAULT NOW(),
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (comentario_padre_id) REFERENCES comentarios(id) ON DELETE SET NULL,
    INDEX idx_publicacion (publicacion_id),
    INDEX idx_usuario (usuario_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Tabla de notificaciones
  `CREATE TABLE IF NOT EXISTS notificaciones (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT NOT NULL,
    tipo            ENUM('nueva_respuesta', 'actividad_publicacion') NOT NULL,
    descripcion     VARCHAR(255) NOT NULL,
    publicacion_id  INT DEFAULT NULL,
    comentario_id   INT DEFAULT NULL,
    leida           BOOLEAN DEFAULT FALSE,
    creado_en       DATETIME DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE SET NULL,
    INDEX idx_usuario_leida (usuario_id, leida)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]

const crearTablas = async (): Promise<void> => {
  await verificarConexion()

  console.log('🔧 Creando tablas...')

  for (const sql of tablas) {
    try {
      await pool.execute(sql)
      // Extraer nombre de tabla del DDL para el log
      const nombre = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1]
      console.log(`  ✅ Tabla '${nombre}' lista`)
    } catch (error) {
      console.error('  ❌ Error al crear tabla:', error)
      process.exit(1)
    }
  }

  console.log('✅ Todas las tablas creadas correctamente')
  process.exit(0)
}

crearTablas()
