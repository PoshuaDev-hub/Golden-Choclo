"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Wallet, Receipt, PiggyBank, Plus, ChevronDown, X, Save, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GcOrder, GcTransaction } from '@/lib/gc-data';

export default function FinanzasPage() {
  // 1. Filtro dinámico empezando desde Enero 2026
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(2026);
  const [orders, setOrders] = useState<GcOrder[]>([]);
  const [transactions, setTransactions] = useState<GcTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Estados para el Modal de Gasto
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false);
  const [nuevoGasto, setNuevoGasto] = useState({ monto: '', desc: '' });
  const [showValidationError, setShowValidationError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // 3. Carga de Datos por Mes
  const loadFinanceData = async () => {
    setLoading(true);
    const firstDay = new Date(anioSeleccionado, mesSeleccionado, 1).toISOString();
    const lastDay = new Date(anioSeleccionado, mesSeleccionado + 1, 0, 23, 59, 59).toISOString();

    const [orderData, trxData] = await Promise.all([
      supabase.from('gc_orders').select('*').gte('created_at', firstDay).lte('created_at', lastDay),
      supabase.from('gc_transactions').select('*').gte('created_at', firstDay).lte('created_at', lastDay).order('created_at', { ascending: false }),
    ]);

    if (orderData.error) setError(orderData.error.message);
    setOrders((orderData.data ?? []) as GcOrder[]);
    setTransactions((trxData.data ?? []) as GcTransaction[]);
    setLoading(false);
  };

  useEffect(() => { void loadFinanceData(); }, [mesSeleccionado, anioSeleccionado]);

  // 4. Cálculos
  const ventasTotales = useMemo(() => orders.reduce((acc, o) => acc + (o.total ?? 0), 0), [orders]);
  const gastosInsumos = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  , [transactions]);
  const utilidad = ventasTotales - gastosInsumos;

  const stats = [
    { label: 'Ventas Totales', value: ventasTotales, icon: <TrendingUp size={18}/>, positive: true },
    { label: 'Gastos Mes', value: gastosInsumos, icon: <TrendingDown size={18}/>, positive: false },
    { label: 'Utilidad Neta', value: utilidad, icon: <PiggyBank size={18}/>, positive: utilidad >= 0 },
  ];

  // 5. Función para abrir modal limpiando datos previos
  const abrirModalGasto = () => {
    setNuevoGasto({ monto: '', desc: '' });
    setSaveSuccess(false);
    setShowValidationError(false);
    setIsGastoModalOpen(true);
  };

  const guardarGasto = async () => {
    if (!nuevoGasto.monto || !nuevoGasto.desc) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 3000);
      return;
    }
    setSaving(true);
    const { error: insError } = await supabase.from('gc_transactions').insert({
      amount: Number(nuevoGasto.monto),
      description: nuevoGasto.desc,
      type: 'expense',
      created_at: new Date().toISOString()
    });

    if (!insError) {
      setSaveSuccess(true);
      await loadFinanceData();
      setTimeout(() => {
        setIsGastoModalOpen(false);
      }, 1500);
    }
    setSaving(false);
  };

  // Genera opciones desde Enero 2026 hasta el mes actual
  const mesesOpciones = useMemo(() => {
    const res = [];
    const fechaInicio = new Date(2026, 0, 1);
    const fechaFin = new Date();
    let temp = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
    while (temp >= fechaInicio) {
      res.push({ 
        label: temp.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
        m: temp.getMonth(),
        y: temp.getFullYear()
      });
      temp.setMonth(temp.getMonth() - 1);
    }
    return res;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER MINI */}
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-6 flex items-center justify-center -mt-4">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">Finanzas</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">CHOCLO</span>
          </div>
        </header>

        {/* GESTIÓN Y FILTRO (Ancho corregido) */}
        <div className="flex flex-col items-center justify-center mb-8 gap-4">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.5em] font-black italic text-center leading-none">Análisis económico • Patagonia</p>
          <div className="relative group w-64 md:w-72"> {/* Ancho aumentado aquí */}
            <select 
              value={`${mesSeleccionado}-${anioSeleccionado}`}
              onChange={(e) => {
                const [m, y] = e.target.value.split('-').map(Number);
                setMesSeleccionado(m);
                setAnioSeleccionado(y);
              }}
              className="w-full appearance-none bg-zinc-900/50 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest italic text-golden-main outline-none cursor-pointer pr-12 hover:border-golden-main/30 transition-all text-center"
              style={{ textAlignLast: 'center' }}
            >
              {mesesOpciones.map((opt) => (
                <option key={`${opt.m}-${opt.y}`} value={`${opt.m}-${opt.y}`} className="bg-zinc-900 text-white">{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-golden-main pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-900/20 border border-white/5 p-5 rounded-[2rem] group hover:border-golden-main/20 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{stat.icon}</div>
                <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest italic leading-none">Status Ok</span>
              </div>
              <p className="text-[8px] text-zinc-500 uppercase font-black mb-1 italic">{stat.label}</p>
              <h2 className="text-3xl font-black italic tracking-tighter text-white group-hover:text-golden-main transition-colors leading-none">${stat.value.toLocaleString('es-CL')}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 bg-zinc-900/10 border border-white/5 rounded-[2.5rem] p-6 md:p-8">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-[10px] font-black italic tracking-[0.2em] uppercase text-zinc-500">Gastos Registrados</h3>
              <button onClick={abrirModalGasto} className="flex items-center gap-2 bg-golden-main text-black px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all italic active:scale-95 shadow-lg shadow-golden-main/10">
                <Plus size={12} strokeWidth={3} /> Nuevo Gasto
              </button>
            </div>
            <div className="space-y-3">
              {transactions.length === 0 && <p className="text-center py-10 text-[10px] uppercase font-black text-zinc-700 italic tracking-widest">Sin movimientos</p>}
              {transactions.map((gasto) => (
                <div key={gasto.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-red-500/20 transition-all">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-red-500 transition-colors"><Receipt size={18} /></div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase italic leading-none">{gasto.description}</p>
                      <p className="text-[8px] text-zinc-600 uppercase font-black mt-2 tracking-widest italic opacity-60">{new Date(gasto.created_at).toLocaleDateString('es-CL')}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-red-500 italic">-${gasto.amount?.toLocaleString('es-CL')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-golden-main p-8 rounded-[2.8rem] text-black shadow-2xl relative overflow-hidden group border border-black/5">
              <Wallet className="absolute -right-4 -top-4 w-24 h-24 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 italic opacity-70">Caja</h4>
              <p className="text-5xl font-black italic tracking-tighter leading-none">${Math.max(utilidad, 0).toLocaleString('es-CL')}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <p className="text-[8px] font-black uppercase italic opacity-60">Balance Disponible</p>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2.5rem]">
              <h4 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-6 italic text-center">Distribución de Pagos</h4>
              <div className="space-y-5">
                {[{ label: 'Transferencias', method: 'transferencia' }, { label: 'Efectivo', method: 'efectivo' }].map((item, i) => {
                  const count = orders.filter(o => o.payment_method === item.method).length;
                  const perc = orders.length > 0 ? (count / orders.length) * 100 : 0;
                  return (
                    <div key={i} className="space-y-2 text-left">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase italic">
                        <span className="text-zinc-500">{item.label}</span>
                        <span className="text-golden-main">{perc.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className={`bg-golden-main h-full transition-all duration-1000`} style={{ width: `${perc}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL GASTO OPTIMIZADO */}
        {isGastoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-golden-main" />
              {!saveSuccess ? (
                <>
                  <button onClick={() => setIsGastoModalOpen(false)} className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors"><X size={18}/></button>
                  <h4 className="text-xs font-black uppercase italic tracking-widest text-center mb-8 text-golden-main">Insertar Gasto</h4>
                  <div className="space-y-4 text-center">
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-golden-main/30 group-focus-within:text-golden-main font-black transition-colors">$</span>
                      <input 
                        type="number" inputMode="numeric" placeholder="MONTO"
                        value={nuevoGasto.monto}
                        onChange={(e) => setNuevoGasto({...nuevoGasto, monto: e.target.value})}
                        className="w-full bg-black border border-white/5 rounded-2xl py-4 text-center font-black text-white focus:border-golden-main/40 outline-none"
                      />
                    </div>
                    <input 
                      type="text" placeholder="DESCRIPCIÓN DEL GASTO"
                      value={nuevoGasto.desc}
                      onChange={(e) => setNuevoGasto({...nuevoGasto, desc: e.target.value})}
                        className="w-full bg-black border border-white/5 rounded-2xl py-4 text-center font-black text-white focus:border-golden-main/40 outline-none"
                    />
                    {showValidationError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-center gap-2 animate-bounce">
                        <AlertTriangle size={12} className="text-red-500" />
                        <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter">Inserta datos válidos</span>
                      </div>
                    )}
                    <button 
                      onClick={guardarGasto} disabled={saving}
                      className="w-full bg-golden-main text-black py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
                    >
                      <Save size={14} strokeWidth={3} />
                      {saving ? 'PROCESANDO...' : 'Confirmar Gasto'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={32} className="text-green-500" /></div>
                  <h4 className="text-sm font-black uppercase italic tracking-[0.2em] text-center text-white leading-none">Gasto registrado</h4>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase mt-2 italic tracking-widest">Éxito</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-16 text-center opacity-20"><p className="text-[6px] uppercase tracking-[1.5em] font-black italic">PATAGONIA CORE • FINANCIAL SYSTEM</p></div>
      </div>
    </div>
  );
}