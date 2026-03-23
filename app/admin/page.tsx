'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShoppingBag, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Order, Transaction, Product } from '@/lib/types'

type ResumenDia = {
  pedidosPendientes: number
  gananciaDia: number
  stockCritico: number
}

export default function AdminDashboard() {
  const [resumen, setResumen] = useState<ResumenDia>({ pedidosPendientes: 0, gananciaDia: 0, stockCritico: 0 })
  const [grafico, setGrafico] = useState<any[]>([])
  const [storeOpen, setStoreOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [togglingStore, setTogglingStore] = useState(false)

  const cargarDatos = async () => {
    setLoading(true)
    const hoy = new Date().toISOString().split('T')[0]

    // Pedidos pendientes
    const { data: pedidos } = await supabase
      .from('gc_orders')
      .select('*')
      .eq('status', 'pendiente')

    // Ganancia del día (ingresos - gastos de hoy)
    const { data: txHoy } = await supabase
      .from('gc_transactions')
      .select('*')
      .eq('date', hoy)

    const gananciaDia = (txHoy || []).reduce((acc: number, tx: Transaction) => {
      return tx.type === 'income' ? acc + tx.amount : acc - tx.amount
    }, 0)

    // Stock crítico (productos agotados)
    const { data: productos } = await supabase
      .from('gc_products')
      .select('*')
      .eq('available', false)

    // Estado del local
    const { data: setting } = await supabase
      .from('gc_settings')
      .select('value')
      .eq('key', 'store_open')
      .single()

    setStoreOpen(setting?.value === 'true')
    setResumen({
      pedidosPendientes: pedidos?.length || 0,
      gananciaDia,
      stockCritico: productos?.length || 0,
    })

    // Gráfico últimos 7 días
    const dias = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const { data: txSemana } = await supabase
      .from('gc_transactions')
      .select('*')
      .gte('date', dias[0])
      .lte('date', dias[6])

    const datosGrafico = dias.map(dia => {
      const txDia = (txSemana || []).filter((tx: Transaction) => tx.date === dia)
      const ingresos = txDia.filter((t: Transaction) => t.type === 'income').reduce((a: number, t: Transaction) => a + t.amount, 0)
      const gastos = txDia.filter((t: Transaction) => t.type === 'expense').reduce((a: number, t: Transaction) => a + t.amount, 0)
      const label = new Date(dia + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' })
      return { dia: label, Ingresos: ingresos, Gastos: gastos }
    })

    setGrafico(datosGrafico)
    setLoading(false)
  }

  const toggleStore = async () => {
    setTogglingStore(true)
    const nuevoEstado = !storeOpen
    await supabase
      .from('gc_settings')
      .update({ value: String(nuevoEstado) })
      .eq('key', 'store_open')
    setStoreOpen(nuevoEstado)
    setTogglingStore(false)
  }

  useEffect(() => { cargarDatos() }, [])

  const formatCLP = (n: number) =>
    n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

  return (
    <div style={{ padding: '24px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700, color: 'var(--gc-gold)' }}>
            Resumen del día
          </h1>
          <p style={{ fontSize: 13, color: 'var(--gc-muted)', marginTop: 2 }}>
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={cargarDatos} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gc-muted)' }}>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Switch Maestro */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: 'var(--gc-text)' }}>
            {storeOpen ? '🟢 Reservas abiertas' : '🔴 Reservas cerradas'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--gc-muted)', marginTop: 2 }}>
            {storeOpen ? 'Los clientes pueden hacer pedidos' : 'La web muestra "Volvemos pronto"'}
          </p>
        </div>
        <button onClick={toggleStore} disabled={togglingStore}
          className={storeOpen ? 'btn-outline' : 'btn-gold'}
          style={{ fontSize: 13, padding: '8px 16px', minWidth: 110, opacity: togglingStore ? 0.6 : 1 }}>
          {togglingStore ? '...' : storeOpen ? 'Cerrar' : 'Abrir'}
        </button>
      </div>

      {/* Tarjetas resumen */}
      {loading ? (
        <p style={{ color: 'var(--gc-muted)', fontSize: 14 }}>Cargando datos...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {/* Pedidos pendientes */}
            <div className="card" style={{ textAlign: 'center' }}>
              <ShoppingBag size={20} style={{ color: 'var(--gc-amber)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 26, fontFamily: 'Syne', fontWeight: 700, color: 'var(--gc-text)' }}>
                {resumen.pedidosPendientes}
              </p>
              <p style={{ fontSize: 11, color: 'var(--gc-muted)', marginTop: 4 }}>Pendientes</p>
            </div>

            {/* Ganancia del día */}
            <div className="card" style={{ textAlign: 'center' }}>
              <TrendingUp size={20} style={{ color: 'var(--gc-green)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 20, fontFamily: 'Syne', fontWeight: 700, color: resumen.gananciaDia >= 0 ? 'var(--gc-green)' : 'var(--gc-red)' }}>
                {formatCLP(resumen.gananciaDia)}
              </p>
              <p style={{ fontSize: 11, color: 'var(--gc-muted)', marginTop: 4 }}>Utilidad hoy</p>
            </div>

            {/* Stock crítico */}
            <div className="card" style={{ textAlign: 'center' }}>
              <AlertTriangle size={20} style={{ color: resumen.stockCritico > 0 ? 'var(--gc-red)' : 'var(--gc-green)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 26, fontFamily: 'Syne', fontWeight: 700, color: resumen.stockCritico > 0 ? 'var(--gc-red)' : 'var(--gc-green)' }}>
                {resumen.stockCritico}
              </p>
              <p style={{ fontSize: 11, color: 'var(--gc-muted)', marginTop: 4 }}>Agotados</p>
            </div>
          </div>

          {/* Gráfico semanal */}
          <div className="card">
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: 'var(--gc-text)', marginBottom: 16 }}>
              Ingresos vs Gastos — últimos 7 días
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={grafico} barGap={4}>
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#888880' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888880' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                contentStyle={{ background: 'var(--gc-surface2)', border: '1px solid var(--gc-border)', borderRadius: 8, fontSize: 12 }}
                formatter={(value: unknown) => [formatCLP(value as number), '']}                />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--gc-muted)' }} />
                <Bar dataKey="Ingresos" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gastos" fill="#E05C5C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}