/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Fondos
        fondo: '#0F0F0F',
        tarjeta: '#1A1A1A',
        elevado: '#242424',

        // Auth (pantallas login/registro — mobile-first)
        'auth-canvas': '#09090b',
        'auth-surface': '#111113',
        'auth-elevated': '#18181b',
        'auth-stroke': '#27272a',
        'auth-muted': '#a1a1aa',
        'auth-subtle': '#d4d4d8',

        // Textos
        base: '#F0F0F0',
        secundario: '#9A9A9A',
        deshabilitado: '#555555',

        // Acento
        acento: '#6C63FF',
        'acento-claro': '#8B85FF',

        // Estados
        exito: '#4CAF50',
        error: '#F44336',
        advertencia: '#FF9800',
        info: '#2196F3',

        // Bordes
        borde: '#2A2A2A',
        'borde-foco': '#6C63FF',
      },
    },
  },
  plugins: [],
}
