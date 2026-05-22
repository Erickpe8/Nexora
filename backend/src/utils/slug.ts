export const generarSlugDesdeTitulo = (titulo: string, id?: number): string => {
  const base = titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  const slug = base || 'noticia'
  return id ? `${slug}-${id}` : slug
}
