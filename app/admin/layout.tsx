'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import NavAdmin from '@/components/ui/NavAdmin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [autorizado, setAutorizado] = useState(false)
  const esLogin = pathname === '/admin/login'

  useEffect(() => {
    const esAdmin = localStorage.getItem('gc_admin')
    if (!esAdmin && !esLogin) {
      router.replace('/admin/login')
    } else {
      setAutorizado(true)
    }
  }, [pathname, router, esLogin])

  if (!autorizado) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gc-dark)' }}>
        <div style={{ color: 'var(--gc-muted)', fontSize: 14 }}>Cargando...</div>
      </div>
    )
  }

  if (esLogin) return <>{children}</>

  return (
    <div style={{ display: 'flex', background: 'var(--gc-dark)', minHeight: '100vh' }}>
      <NavAdmin />
      {/* Contenido con margen para el sidebar en desktop */}
      <main className="md:ml-[220px] w-full pb-24 md:pb-0">
        {children}
      </main>
    </div>
  )
}