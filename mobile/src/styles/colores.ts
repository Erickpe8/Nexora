// Paleta de colores del tema oscuro de Nexora
export const colores = {
  // Fondos
  fondoPrincipal:     '#0F0F0F',
  fondoTarjeta:       '#1A1A1A',
  fondoElevado:       '#242424',

  // Textos
  textoBase:          '#F0F0F0',
  textoSecundario:    '#9A9A9A',
  textoDeshabilitado: '#555555',

  // Acento
  acento:             '#6C63FF',
  acentoClaro:        '#8B85FF',

  // Estados
  exito:              '#4CAF50',
  error:              '#F44336',
  advertencia:        '#FF9800',
  info:               '#2196F3',

  // Bordes
  borde:              '#2A2A2A',
  bordeFoco:          '#6C63FF',

  // Overlay
  overlay:            'rgba(0, 0, 0, 0.6)',
} as const

export type ColorNexora = keyof typeof colores
