export const tiempoRelativo = (iso: string): string => {
  const fecha = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
  const seg = Math.floor((Date.now() - fecha.getTime()) / 1000)
  if (seg < 60) return 'hace un momento'
  const min = Math.floor(seg / 60)
  if (min < 60) return min === 1 ? 'hace 1 minuto' : `hace ${min} minutos`
  const h = Math.floor(min / 60)
  if (h < 24) return h === 1 ? 'hace 1 hora' : `hace ${h} horas`
  const d = Math.floor(h / 24)
  if (d < 7) return d === 1 ? 'hace 1 día' : `hace ${d} días`
  return fecha.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
}
