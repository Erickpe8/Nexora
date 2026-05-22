/**
 * Script de migración incremental.
 * Agrega columnas y tablas nuevas a una base de datos ya existente sin borrar datos.
 * Seguro para ejecutar múltiples veces (idempotente).
 *
 * Uso: npm run migrar
 */
import { pool, verificarConexion } from '../../shared/database/pool'

interface MigracionSQL {
  descripcion: string
  sql: string
}

/**
 * Ejecuta un ALTER TABLE solo si la columna no existe.
 * Evita el error "Duplicate column name".
 */
const agregarColumnasSiNoExisten = async (
  tabla: string,
  columnas: { nombre: string; definicion: string }[]
): Promise<void> => {
  const [filas] = await pool.query<any[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [tabla]
  )
  const existentes = new Set(filas.map((f: any) => String(f.COLUMN_NAME).toLowerCase()))

  for (const col of columnas) {
    if (existentes.has(col.nombre.toLowerCase())) {
      console.log(`  ⏭  Columna '${tabla}.${col.nombre}' ya existe — omitida`)
      continue
    }
    await pool.execute(`ALTER TABLE \`${tabla}\` ADD COLUMN ${col.definicion}`)
    console.log(`  ✅ Columna '${tabla}.${col.nombre}' agregada`)
  }
}

const migraciones: MigracionSQL[] = [
  // Tablas nuevas completas (IF NOT EXISTS = idempotente)
  {
    descripcion: 'Crear tabla reacciones_publicacion',
    sql: `CREATE TABLE IF NOT EXISTS reacciones_publicacion (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      publicacion_id INT NOT NULL,
      usuario_id     INT NOT NULL,
      tipo           ENUM('me_gusta','fuego','mente_explotada','curioso') NOT NULL DEFAULT 'me_gusta',
      creado_en      DATETIME DEFAULT NOW(),
      FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      UNIQUE KEY uq_reaccion (publicacion_id, usuario_id),
      INDEX idx_publicacion_reaccion (publicacion_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    descripcion: 'Crear tabla likes_comentario',
    sql: `CREATE TABLE IF NOT EXISTS likes_comentario (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      comentario_id INT NOT NULL,
      usuario_id    INT NOT NULL,
      creado_en     DATETIME DEFAULT NOW(),
      FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      UNIQUE KEY uq_like (comentario_id, usuario_id),
      INDEX idx_comentario_like (comentario_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    descripcion: 'Crear tabla versiones_prompt_ia',
    sql: `CREATE TABLE IF NOT EXISTS versiones_prompt_ia (
      id        INT AUTO_INCREMENT PRIMARY KEY,
      nombre    VARCHAR(100) NOT NULL,
      version   VARCHAR(20) NOT NULL,
      plantilla TEXT NOT NULL,
      activo    BOOLEAN DEFAULT FALSE,
      creado_en DATETIME DEFAULT NOW(),
      UNIQUE KEY uq_nombre_version (nombre, version)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    descripcion: 'Crear tabla registros_generacion_ia',
    sql: `CREATE TABLE IF NOT EXISTS registros_generacion_ia (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      ejecucion_id   VARCHAR(36) NOT NULL,
      publicacion_id INT DEFAULT NULL,
      duracion_ms    INT NOT NULL DEFAULT 0,
      exito          BOOLEAN NOT NULL DEFAULT FALSE,
      mensaje_error  TEXT DEFAULT NULL,
      tokens         INT DEFAULT NULL,
      creado_en      DATETIME DEFAULT NOW(),
      FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE SET NULL,
      INDEX idx_ejecucion (ejecucion_id),
      INDEX idx_creado_en (creado_en)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    descripcion: 'Crear tabla estado_sistema (semilla post-deploy)',
    sql: `CREATE TABLE IF NOT EXISTS estado_sistema (
      clave VARCHAR(64) PRIMARY KEY,
      valor VARCHAR(255) NOT NULL,
      actualizado_en DATETIME DEFAULT NOW()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
  {
    descripcion: 'Crear tabla denuncias',
    sql: `CREATE TABLE IF NOT EXISTS denuncias (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      tipo_objetivo ENUM('comentario','publicacion') NOT NULL,
      objetivo_id   INT NOT NULL,
      autor_id      INT NOT NULL,
      motivo        ENUM('spam','acoso','contenido_inapropiado','desinformacion','otro') NOT NULL,
      detalle       VARCHAR(500) DEFAULT NULL,
      estado        ENUM('pendiente','revisada','resuelta','descartada') DEFAULT 'pendiente',
      creado_en     DATETIME DEFAULT NOW(),
      FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      INDEX idx_objetivo (tipo_objetivo, objetivo_id, creado_en),
      INDEX idx_autor (autor_id),
      INDEX idx_estado (estado)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
]

const migrarTablas = async (): Promise<void> => {
  await verificarConexion()
  console.log('🔧 Ejecutando migraciones incrementales...\n')

  // 1. Ejecutar migraciones de tablas nuevas
  for (const migracion of migraciones) {
    try {
      await pool.execute(migracion.sql)
      console.log(`  ✅ ${migracion.descripcion}`)
    } catch (error) {
      console.error(`  ❌ ${migracion.descripcion}:`, (error as Error).message)
      process.exit(1)
    }
  }

  // 2. Agregar columnas nuevas a tablas existentes
  console.log('\n🔧 Agregando columnas nuevas a tablas existentes...\n')

  await agregarColumnasSiNoExisten('publicaciones', [
    { nombre: 'proveedor_ia',         definicion: "proveedor_ia VARCHAR(50) DEFAULT 'deepseek' AFTER generado_por_ia" },
    { nombre: 'version_prompt',       definicion: 'version_prompt VARCHAR(20) DEFAULT NULL AFTER proveedor_ia' },
    { nombre: 'hash_contenido',       definicion: 'hash_contenido VARCHAR(64) DEFAULT NULL AFTER version_prompt' },
    { nombre: 'metadatos_generacion', definicion: 'metadatos_generacion JSON DEFAULT NULL AFTER hash_contenido' },
  ])

  await agregarColumnasSiNoExisten('usuarios', [
    { nombre: 'biografia', definicion: 'biografia VARCHAR(500) DEFAULT NULL AFTER contrasena' },
    { nombre: 'foto_perfil_url', definicion: 'foto_perfil_url VARCHAR(500) DEFAULT NULL AFTER biografia' },
    { nombre: 'fecha_nacimiento', definicion: 'fecha_nacimiento DATE DEFAULT NULL AFTER foto_perfil_url' },
    { nombre: 'redes_sociales', definicion: 'redes_sociales JSON DEFAULT NULL AFTER fecha_nacimiento' },
  ])

  await agregarColumnasSiNoExisten('comentarios', [
    { nombre: 'estado_moderacion', definicion: "estado_moderacion ENUM('visible','oculto') DEFAULT 'visible' AFTER eliminado" },
    { nombre: 'oculto_en',         definicion: 'oculto_en DATETIME DEFAULT NULL AFTER estado_moderacion' },
    { nombre: 'moderador_id',      definicion: 'moderador_id INT DEFAULT NULL AFTER oculto_en' },
    { nombre: 'nota_interna',      definicion: 'nota_interna VARCHAR(500) DEFAULT NULL AFTER moderador_id' },
  ])

  // 3. Agregar índice hash_contenido si no existe
  try {
    await pool.execute('ALTER TABLE publicaciones ADD INDEX idx_hash_contenido (hash_contenido)')
    console.log('  ✅ Índice idx_hash_contenido en publicaciones')
  } catch {
    console.log('  ⏭  Índice idx_hash_contenido ya existe — omitido')
  }

  // 4. Agregar índice estado_moderacion si no existe
  try {
    await pool.execute('ALTER TABLE comentarios ADD INDEX idx_estado_moderacion (estado_moderacion)')
    console.log('  ✅ Índice idx_estado_moderacion en comentarios')
  } catch {
    console.log('  ⏭  Índice idx_estado_moderacion ya existe — omitido')
  }

  // 5. Semilla: versión inicial del prompt si no existe
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
    console.log('  ✅ Semilla versiones_prompt_ia insertada')
  } catch {
    console.log('  ⏭  Semilla versiones_prompt_ia ya existe — omitida')
  }

  console.log('\n✅ Todas las migraciones completadas correctamente')
  process.exit(0)
}

void migrarTablas()
