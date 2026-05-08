# Hook — Validar TypeScript

## Propósito
Asegurar que el código TypeScript del proyecto mantiene un tipado estricto, coherente y sin atajos que comprometan la seguridad de tipos.

## Reglas de tipado

### Prohibido
- [ ] Uso de `any` sin comentario justificativo
- [ ] Uso de `as any` para silenciar errores de tipos
- [ ] Funciones sin tipo de retorno cuando el tipo no es obvio
- [ ] Props de componentes sin interface o type definido
- [ ] Respuestas de API sin tipo definido (usar los tipos de `src/types/`)
- [ ] `@ts-ignore` sin comentario explicativo

### Obligatorio
- [ ] Todas las interfaces y types en `src/types/` (frontend) o `src/types/` (backend)
- [ ] Props de cada componente tipadas con interface propia
- [ ] Estado de hooks tipado explícitamente
- [ ] Respuestas de servicios tipadas con los tipos del módulo
- [ ] Parámetros de navegación tipados con los tipos de `src/types/navegacion.ts`
- [ ] El objeto `req.usuario` en el backend tipado con `UsuarioToken`

## Patrones correctos

### Componente
```typescript
interface PropsTarjetaPublicacion {
  publicacion: Publicacion
  onPress: (id: number) => void
}

const TarjetaPublicacion = ({ publicacion, onPress }: PropsTarjetaPublicacion) => {
  // ...
}
```

### Hook
```typescript
interface EstadoFeed {
  publicaciones: Publicacion[]
  cargando: boolean
  error: string | null
}

const useFeed = (): EstadoFeed & { cargar: () => Promise<void> } => {
  // ...
}
```

### Servicio
```typescript
const obtenerFeed = async (pagina: number): Promise<RespuestaFeed> => {
  const { data } = await cliente.get<RespuestaFeed>(`/publicaciones?pagina=${pagina}`)
  return data
}
```

## Señales de alerta
- Más de 3 usos de `any` en un archivo
- Interfaces definidas dentro de componentes en lugar de en `types/`
- Respuestas de `axios` sin tipo genérico (`axios.get<Tipo>()`)
- Estados de `useState` sin tipo explícito cuando no es inferible
- Parámetros de funciones sin tipo cuando no son obvios por contexto
