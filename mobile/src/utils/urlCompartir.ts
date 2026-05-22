const origenWeb = (): string => {
  const desdeEnv = process.env.EXPO_PUBLIC_WEB_URL?.replace(/\/$/, '')
  if (desdeEnv) return desdeEnv
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'https://nexora-ruddy-nine.vercel.app'
}

export const construirUrlPublicacion = (slug: string, comentarioId?: number): string => {
  const base = origenWeb()
  const ruta = `/noticia/${encodeURIComponent(slug)}`
  const ancla = comentarioId ? `#c-${comentarioId}` : ''
  return `${base}${ruta}${ancla}`
}

export const urlWhatsApp = (url: string, titulo: string): string =>
  `https://wa.me/?text=${encodeURIComponent(`${titulo}\n${url}`)}`

export const urlX = (url: string, titulo: string): string =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`

export const urlFacebook = (url: string): string =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
