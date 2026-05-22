/**
 * URLs públicas para compartir noticias y comentarios.
 * `PUBLIC_WEB_URL` debe ser el origen web (Vercel) sin barra final.
 */
export const construirUrlPublicacion = (slug: string, comentarioId?: number): string => {
  const base =
    process.env.PUBLIC_WEB_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8081')
  const ruta = `/noticia/${encodeURIComponent(slug)}`
  const ancla = comentarioId ? `#c-${comentarioId}` : ''
  return `${base}${ruta}${ancla}`
}
