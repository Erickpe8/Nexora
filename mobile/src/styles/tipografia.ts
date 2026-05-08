// Escala tipográfica de Nexora
export const tipografia = {
  // Tamaños
  tamanos: {
    xs:   12,
    sm:   14,
    base: 16,
    lg:   18,
    xl:   20,
    xxl:  24,
    xxxl: 30,
  },

  // Pesos
  pesos: {
    normal:   '400' as const,
    medio:    '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },

  // Altura de línea
  lineaAltura: {
    ajustada:  1.2,
    normal:    1.5,
    relajada:  1.75,
  },
} as const
