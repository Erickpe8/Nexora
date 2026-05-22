/** IDs de moderador desde MODERADOR_IDS (lista separada por comas). */
export const idsModeradores = (): number[] =>
  (process.env.MODERADOR_IDS ?? '')
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => !Number.isNaN(n) && n > 0)

export const usuarioEsModerador = (usuarioId: number): boolean => {
  const ids = idsModeradores()
  if (process.env.NODE_ENV !== 'production' && ids.length === 0) {
    return true
  }
  return ids.includes(usuarioId)
}
