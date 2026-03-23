import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}