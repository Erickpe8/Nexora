# Diseño Técnico — [Nombre del Módulo]

## Arquitectura general
[Descripción de alto nivel de cómo funciona este módulo y cómo se integra con el resto del sistema.]

## Componentes frontend

### Pantallas
- `[NombrePantalla]` — [descripción breve]

### Componentes
- `[NombreComponente]` — [descripción breve]

### Hooks
- `use[Nombre]` — [descripción breve]

### Servicios
- `servicio[Nombre]` — [descripción breve]

## Flujo técnico

### [Flujo principal]
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Endpoints del backend

| Método | Ruta              | Auth | Descripción          |
|--------|-------------------|------|----------------------|
| GET    | `/api/[recurso]`  | Sí   | [descripción]        |
| POST   | `/api/[recurso]`  | Sí   | [descripción]        |

## Estructura de datos

### Tabla `[nombre_tabla]` (MySQL)
```sql
id          INT AUTO_INCREMENT PRIMARY KEY
campo_uno   VARCHAR(255) NOT NULL
campo_dos   TEXT
creado_en   DATETIME DEFAULT NOW()
```

### Tipos TypeScript
```typescript
interface [NombreTipo] {
  id: number
  campoUno: string
  campoDos: string
  creadoEn: string
}
```

## WebSocket (si aplica)
- Canal: `[nombre_canal]`
- Eventos: `[nombre_evento]` → payload: `[tipo]`

## Seguridad
- [Consideraciones de seguridad relevantes para este módulo]
