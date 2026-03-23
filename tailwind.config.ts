import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'gold-light': '#E8C97A',
        dark: '#0F0F0F',
        surface: '#1A1A1A',
        surface2: '#222222',
        border: '#2E2E2E',
        gctext: '#F0EDE6',
        muted: '#888880',
        gcgreen: '#4CAF7D',
        gcred: '#E05C5C',
        gcamber: '#E0A03A',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config