import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

// Configuración de la fuente para títulos (Imagen de referencia 3)
const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne', 
  weight: ['400', '700', '800'],
})

// Configuración de la fuente para el cuerpo (Lectura clara)
const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Golden Cocho',
  description: 'Pastel de Choclo artesanal — Región de Aysén',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-dark-bg text-white antialiased">
        {children}
      </body>
    </html>
  )
}