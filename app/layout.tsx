import type { Metadata, Viewport } from 'next' // Importamos el tipo Viewport
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne', 
  weight: ['400', '700', '800'],
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Golden Cocho',
  description: 'Pastel de Choclo artesanal — Región de Aysén',
}

// --- CONFIGURACIÓN PARA BLOQUEAR ZOOM (IOS/ANDROID) ---
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      {/* bg-black asegura el contraste total con el glassmorphism */}
      <body className="font-sans bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}