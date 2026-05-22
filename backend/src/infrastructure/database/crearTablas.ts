import { pool, verificarConexion } from '../../shared/database/pool'

const tablas = [
  `CREATE TABLE IF NOT EXISTS usuarios (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(30) NOT NULL,
    correo            VARCHAR(255) NOT NULL UNIQUE,
    contrasena        VARCHAR(255) NOT NULL,
    biografia         VARCHAR(500) DEFAULT NULL,
    foto_perfil_url   VARCHAR(500) DEFAULT NULL,
    fecha_nacimiento  DATE DEFAULT NULL,
    redes_sociales    JSON DEFAULT NULL,
    creado_en         DATETIME DEFAULT NOW(),
    INDEX idx_correo (correo)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS versiones_prompt_ia (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    version      VARCHAR(20) NOT NULL,
    plantilla    TEXT NOT NULL,
    activo       BOOLEAN DEFAULT FALSE,
    creado_en    DATETIME DEFAULT NOW(),
    UNIQUE KEY uq_nombre_version (nombre, version)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS publicaciones (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    titulo               VARCHAR(255) NOT NULL,
    resumen              TEXT NOT NULL,
    pregunta             VARCHAR(500) NOT NULL,
    etiquetas            JSON,
    generado_por_ia      BOOLEAN DEFAULT TRUE,
    proveedor_ia         VARCHAR(50) DEFAULT 'deepseek',
    version_prompt       VARCHAR(20) DEFAULT NULL,
    hash_contenido       VARCHAR(64) DEFAULT NULL,
    metadatos_generacion JSON DEFAULT NULL,
    creado_en            DATETIME DEFAULT NOW(),
    INDEX idx_creado_en (creado_en),
    INDEX idx_hash_contenido (hash_contenido)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS registros_generacion_ia (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    ejecucion_id    VARCHAR(36) NOT NULL,
    publicacion_id  INT DEFAULT NULL,
    duracion_ms     INT NOT NULL DEFAULT 0,
    exito           BOOLEAN NOT NULL DEFAULT FALSE,
    mensaje_error   TEXT DEFAULT NULL,
    tokens          INT DEFAULT NULL,
    creado_en       DATETIME DEFAULT NOW(),
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE SET NULL,
    INDEX idx_ejecucion (ejecucion_id),
    INDEX idx_creado_en (creado_en)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS comentarios (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id       INT NOT NULL,
    usuario_id           INT NOT NULL,
    comentario_padre_id  INT DEFAULT NULL,
    contenido            TEXT NOT NULL,
    eliminado            BOOLEAN DEFAULT FALSE,
    estado_moderacion    ENUM('visible','oculto') DEFAULT 'visible',
    oculto_en            DATETIME DEFAULT NULL,
    moderador_id         INT DEFAULT NULL,
    nota_interna         VARCHAR(500) DEFAULT NULL,
    creado_en            DATETIME DEFAULT NOW(),
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (comentario_padre_id) REFERENCES comentarios(id) ON DELETE SET NULL,
    INDEX idx_publicacion (publicacion_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado_moderacion (estado_moderacion)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

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

  `CREATE TABLE IF NOT EXISTS denuncias (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    tipo_objetivo   ENUM('comentario','publicacion') NOT NULL,
    objetivo_id     INT NOT NULL,
    autor_id        INT NOT NULL,
    motivo          ENUM('spam','acoso','contenido_inapropiado','desinformacion','otro') NOT NULL,
    detalle         VARCHAR(500) DEFAULT NULL,
    estado          ENUM('pendiente','revisada','resuelta','descartada') DEFAULT 'pendiente',
    creado_en       DATETIME DEFAULT NOW(),
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_objetivo (tipo_objetivo, objetivo_id, creado_en),
    INDEX idx_autor (autor_id),
    INDEX idx_estado (estado)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS estado_sistema (
    clave VARCHAR(64) PRIMARY KEY,
    valor VARCHAR(255) NOT NULL,
    actualizado_en DATETIME DEFAULT NOW()
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]

const crearTablas = async (): Promise<void> => {
  await verificarConexion()

  console.log('🔧 Creando tablas...')

  for (const sql of tablas) {
    try {
      await pool.execute(sql)
      const nombre = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1]
      console.log(`  ✅ Tabla '${nombre}' lista`)
    } catch (error) {
      console.error('  ❌ Error al crear tabla:', error)
      process.exit(1)
    }
  }

  // Semilla: versión inicial del prompt de DeepSeek
  try {
    await pool.execute(
      `INSERT IGNORE INTO versiones_prompt_ia (nombre, version, plantilla, activo) VALUES (?, ?, ?, ?)`,
      [
        'deepseek-noticias-tecnologia',
        '1.0.0',
        `Eres un editor de noticias tecnológicas. Genera exactamente {{cantidad}} publicaciones sobre noticias tecnológicas actuales y relevantes de las últimas 24 horas.\n\nPara cada publicación incluye:\n- titulo: título claro, informativo y atractivo (máx. 100 caracteres)\n- resumen: resumen objetivo de máximo 300 palabras\n- pregunta: pregunta controversial que invite al debate técnico\n- etiquetas: array de 2-3 categorías (ej: "IA", "programación", "hardware", "startups", "ciberseguridad")\n\nResponde ÚNICAMENTE con un array JSON válido, sin texto adicional.`,
        true,
      ]
    )
    console.log(`  ✅ Semilla 'versiones_prompt_ia' lista`)
  } catch (error) {
    console.warn('  ⚠️  Semilla versiones_prompt_ia ya existe o falló:', (error as Error).message)
  }

  console.log('✅ Todas las tablas creadas correctamente')
  process.exit(0)
}

void crearTablas()
