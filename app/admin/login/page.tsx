'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (clave === 'floki') {
        localStorage.setItem('gc_admin', 'true')
        router.push('/admin')
      } else {
        setError('Clave incorrecta. Inténtalo de nuevo.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--gc-dark)' }}>
      
      <div className="w-full max-w-sm">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--gc-surface)', border: '2px solid var(--gc-gold)' }}>
            <span style={{ fontFamily: 'Syne', fontSize: 28, color: 'var(--gc-gold)', fontWeight: 700 }}>
              GC
            </span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 700, color: 'var(--gc-text)' }}>
            Golden Cocho
          </h1>
          <p style={{ fontSize: 13, color: 'var(--gc-muted)', marginTop: 4 }}>
            Panel de administración
          </p>
        </div>

        {/* Card login */}
        <div className="card">
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label>Clave de acceso</label>
              <input
                type="password"
                placeholder="••••••"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoFocus
                required
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--gc-red)', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-gold w-full"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, fontSize: 15 }}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gc-muted)', marginTop: 24 }}>
          Solo para uso del equipo Golden Cocho
        </p>
      </div>
    </div>
  )
}