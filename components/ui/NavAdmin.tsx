'use client'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, DollarSign, Settings, LogOut } from 'lucide-react'

const navItems = [
  { label: 'Resumen',   href: '/admin',              icon: LayoutDashboard },
  { label: 'Pedidos',   href: '/admin/pedidos',       icon: ShoppingBag },
  { label: 'Productos', href: '/admin/productos',     icon: Package },
  { label: 'Finanzas',  href: '/admin/finanzas',      icon: DollarSign },
  { label: 'Config',    href: '/admin/configuracion', icon: Settings },
]

export default function NavAdmin() {
  const router = useRouter()
  const pathname = usePathname()

  const cerrarSesion = () => {
    localStorage.removeItem('gc_admin')
    router.push('/admin/login')
  }

  return (
    <>
      {/* SIDEBAR — solo desktop */}
      <aside className="hidden md:flex flex-col"
        style={{
          width: 220,
          minHeight: '100vh',
          background: 'var(--gc-surface)',
          borderRight: '1px solid var(--gc-border)',
          padding: '24px 0',
          position: 'fixed',
          top: 0, left: 0,
        }}>

        {/* Logo */}
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid var(--gc-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--gc-gold)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: '#0F0F0F' }}>GC</span>
            </div>
            <div>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--gc-text)' }}>Golden Cocho</p>
              <p style={{ fontSize: 11, color: 'var(--gc-muted)' }}>Admin</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <button key={href} onClick={() => router.push(href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                  background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: active ? 'var(--gc-gold)' : 'var(--gc-muted)',
                  fontFamily: 'DM Sans', fontSize: 14,
                  transition: 'all 0.15s',
                }}>
                <Icon size={17} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Cerrar sesión */}
        <div style={{ padding: '0 12px' }}>
          <button onClick={cerrarSesion}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, border: 'none',
              cursor: 'pointer', width: '100%',
              background: 'transparent', color: 'var(--gc-red)',
              fontFamily: 'DM Sans', fontSize: 14,
            }}>
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* BOTTOM NAV — solo mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'var(--gc-surface)',
          borderTop: '1px solid var(--gc-border)',
          display: 'flex',
          padding: '8px 0 12px',
        }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <button key={href} onClick={() => router.push(href)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: active ? 'var(--gc-gold)' : 'var(--gc-muted)',
              }}>
              <Icon size={20} />
              <span style={{ fontSize: 10, fontFamily: 'DM Sans' }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}