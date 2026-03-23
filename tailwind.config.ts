import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Añadido por seguridad si usas carpeta src
  ],
  theme: {
    extend: {
      colors: {
        // Colores de la Imagen de Referencia (Principales)
        'golden-main': '#FCA311',
        'dark-bg': '#000000',
        'dark-card': '#14213D',
        'soft-gray': '#E5E5E5',
        
        // Tus colores base para estados y textos
        gold: '#C9A84C',
        dark: '#0F0F0F',
        surface: '#1A1A1A',
        gctext: '#F0EDE6',
        muted: '#888880',
        gcgreen: '#4CAF7D', // Para estado "Entregado"
        gcred: '#E05C5C',   // Para "Gastos"
        gcamber: '#E0A03A', // Para "Pendiente"
      },
        // Dentro de extend en tailwind.config.ts 
        fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        heading: ['var(--font-syne)', 'sans-serif'],
        },
      borderRadius: {
        // Para lograr el look "Bento Box" de la imagen 3
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config