"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { 
  TrendingUp, DollarSign, Package, Share2, Plus, 
  ArrowUpRight, ArrowDownRight, Power, ChevronRight, X, Save, AlertTriangle, CheckCircle2,
  Wallet, Calculator, Receipt
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GcOrder, GcTransaction } from '@/lib/gc-data';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastFolio, setLastFolio] = useState<number>(0);
  const [orders, setOrders] = useState<GcOrder[]>([]);
  const [transactions, setTransactions] = useState<GcTransaction[]>([]);
  const [lastMonthOrders, setLastMonthOrders] = useState<GcOrder[]>([]);
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false);
  const [isCajaModalOpen, setIsCajaModalOpen] = useState(false);
  const [nuevoGasto, setNuevoGasto] = useState({ monto: '', desc: '' });
  const [showValidationError, setShowValidationError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const now = new Date();
    const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const firstDayLast = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

    const [currentOrders, prevOrders, trxData, settingsData, lastOrderData] = await Promise.all([
      supabase.from('gc_orders').select('*').gte('created_at', firstDayCurrent).order('created_at', { ascending: false }),
      supabase.from('gc_orders').select('*').gte('created_at', firstDayLast).lt('created_at', firstDayCurrent),
      supabase.from('gc_transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('gc_settings').select('key,value').in('key', ['is_open']),
      supabase.from('gc_orders').select('folio').order('folio', { ascending: false }).limit(1),
    ]);

    setOrders((currentOrders.data ?? []) as GcOrder[]);
    setLastMonthOrders((prevOrders.data ?? []) as GcOrder[]);
    setTransactions((trxData.data ?? []) as GcTransaction[]);
    setIsOpen(settingsData.data?.find((s) => s.key === 'is_open')?.value === 'true');
    const maxFolio = lastOrderData.data?.[0]?.folio ?? 0;
    setLastFolio(maxFolio);
  };

  useEffect(() => { void loadData(); }, []);

  const toggleStoreStatus = async () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    await supabase.from('gc_settings').upsert({ key: 'is_open', value: newStatus.toString() });
  };

  const resumenHoy = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = orders.filter(o => o.created_at?.startsWith(hoy));
    const totalVentas = ventasHoy.reduce((acc, o) => acc + (o.total ?? 0), 0);
    return { list: ventasHoy, total: totalVentas };
  }, [orders]);

  const { balance, diffPercentage, isPositive } = useMemo(() => {
    const currentTotal = orders.reduce((acc, o) => acc + (o.total ?? 0), 0);
    const lastTotal = lastMonthOrders.reduce((acc, o) => acc + (o.total ?? 0), 0);
    if (lastTotal === 0) return { balance: currentTotal, diffPercentage: 0, isPositive: true };
    const diff = ((currentTotal - lastTotal) / lastTotal) * 100;
    return { balance: currentTotal, diffPercentage: Math.abs(Math.round(diff * 10) / 10), isPositive: diff >= 0 };
  }, [orders, lastMonthOrders]);

  const insumosTotal = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount ?? 0), 0)
  , [transactions]);

  const guardarGasto = async () => {
    if (!nuevoGasto.monto || !nuevoGasto.desc) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 3000);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('gc_transactions').insert([
      { amount: Number(nuevoGasto.monto), description: nuevoGasto.desc, type: 'expense' }
    ]);
    if (!error) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => {
        setIsGastoModalOpen(false);
        setSaveSuccess(false);
        setNuevoGasto({ monto: '', desc: '' });
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-24 antialiased font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. HEADER MAESTRO (Corregido para llegar a ambos lados) */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 py-4 flex items-center justify-center px-6">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.7] md:scale-[0.8]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">PANEL</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">CHOCLO</span>
          </div>
        </header>

        {/* Espaciador para el header fijo */}
        <div className="h-20" />

        <p className="text-[7px] text-zinc-500 uppercase tracking-[0.5em] font-black italic text-center mb-8">Gestión Golden Choclo Patagonia</p>

        <div className="flex gap-3 mb-10">
          <button className="flex-1 bg-zinc-900/50 border border-white/5 text-golden-main py-5 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all text-center">
            <Share2 size={18} />
            <span className="text-[10px] font-black uppercase italic tracking-widest">Compartir</span>
          </button>
          
          <Link href="/admin/mode/venta-manual" className="flex-1 bg-golden-main text-black py-5 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-golden-main/10 text-center">
            <Plus size={20} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase italic tracking-widest">Venta Manual</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div onClick={toggleStoreStatus} className={`col-span-2 md:col-span-2 rounded-[2.8rem] p-7 flex flex-col justify-between transition-all duration-700 border-2 min-h-[185px] cursor-pointer ${isOpen ? 'bg-green-500/10 border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.05)]' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl ${isOpen ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}>
                <Power size={24} strokeWidth={3} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isOpen ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{isOpen ? 'Online' : 'Offline'}</span>
            </div>
            <div>
              <h3 className="text-3xl font-black italic uppercase">{isOpen ? 'Abierto' : 'Cerrado'}</h3>
              <p className="text-[8px] text-zinc-600 uppercase font-black italic mt-2 opacity-60">Control Central</p>
              <p className="text-[8px] text-zinc-500 uppercase font-black italic mt-1">Último folio: #{(lastFolio || 0).toString().padStart(8, '0')}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-2 bg-zinc-900 border border-white/5 rounded-[2.8rem] p-7 flex flex-col justify-between relative overflow-hidden min-h-[185px]">
            <div className="flex justify-between items-start text-zinc-500 relative z-10">
              <p className="text-[9px] font-black uppercase italic">Balance Mes</p>
              <TrendingUp size={18} />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">${balance.toLocaleString('es-CL')}</h2>
              <div className={`flex items-center gap-1 text-[8px] font-black uppercase mt-3 italic ${isPositive ? 'text-green-500' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                {diffPercentage}% VS ANTERIOR
              </div>
            </div>
            <DollarSign className="absolute -right-6 -bottom-6 text-white/5 w-32 h-32 transform -rotate-12 opacity-30" />
          </div>

          <div className="col-span-2 md:col-span-2 bg-zinc-900 border border-white/5 rounded-[2.8rem] p-7 flex flex-col justify-between min-h-[185px]">
            <div className="flex justify-between items-start text-zinc-500">
              <p className="text-[9px] font-black uppercase italic">Egresos Mes</p>
              <Package size={18} />
            </div>
            <div>
              <h4 className="text-4xl font-black italic text-white">${insumosTotal.toLocaleString('es-CL')}</h4>
              <button 
                onClick={() => setIsGastoModalOpen(true)} 
                className="bg-golden-main/10 text-golden-main px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest mt-4 border border-golden-main/20 hover:bg-golden-main hover:text-black transition-all italic"
              >
                + Añadir Gasto
              </button>
            </div>
          </div>

          <div className="col-span-2 md:col-span-6 bg-zinc-900/30 border border-white/5 rounded-[3rem] p-6 md:p-8 mt-2 shadow-2xl">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic leading-none">Movimientos del Día</h3>
              <button 
                onClick={() => setIsCajaModalOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter border border-white/5 transition-all flex items-center gap-2"
              >
                <Wallet size={14} className="text-golden-main" />
                Caja
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {orders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-black/40 rounded-[2rem] border border-white/5 group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="text-[9px] font-black text-zinc-700 italic w-8 leading-none text-center">#{order.id.toString().slice(-3)}</div>
                    <div className="leading-none text-left">
                      <p className="text-[10px] font-black text-white uppercase italic">{order.client_name}</p>
                      <p className={`text-[7px] uppercase font-black tracking-[0.1em] mt-2 ${order.delivery_type === 'delivery' ? 'text-blue-400' : 'text-zinc-600'}`}>{order.delivery_type}</p>
                    </div>
                  </div>
                  <div className="text-right leading-none">
                    <p className="text-sm font-black text-golden-main italic leading-none">+${(order.total ?? 0).toLocaleString('es-CL')}</p>
                    <p className="text-[7px] text-zinc-700 font-bold uppercase mt-1.5">{new Date(order.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL CAJA (Estilo Ticket/Boleta) */}
        {isCajaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/90 animate-in fade-in duration-300">
            <div className="bg-[#f4f4f4] text-black w-full max-w-sm rounded-sm p-8 shadow-2xl relative flex flex-col max-h-[85vh] font-mono border-t-[12px] border-golden-main">
              <button onClick={() => setIsCajaModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-black"><X size={20}/></button>
              
              <div className="text-center mb-6">
                <h4 className="text-lg font-black uppercase tracking-tighter">GOLDEN CHOCLO</h4>
                <p className="text-[9px] font-bold text-zinc-500 uppercase">Reporte Operativo Diario</p>
                <div className="border-b border-dashed border-zinc-300 my-4" />
                <p className="text-[10px] font-bold uppercase">{new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {resumenHoy.list.map((o) => (
                  <div key={o.id} className="flex justify-between items-start text-[10px] leading-tight">
                    <span className="uppercase text-zinc-600">ID:{o.id.toString().slice(-4)} • {o.client_name?.slice(0,15)}</span>
                    <span className="font-bold">${o.total?.toLocaleString('es-CL')}</span>
                  </div>
                ))}
                {resumenHoy.list.length === 0 && <p className="text-center text-[10px] text-zinc-400 uppercase italic py-10">Sin operaciones registradas</p>}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-dashed border-zinc-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold">TOTAL VENTAS</span>
                  <span className="text-xl font-black">${resumenHoy.total.toLocaleString('es-CL')}</span>
                </div>
                <p className="text-[8px] text-zinc-400 text-center mt-6 italic">--- FIN DEL REPORTE ---</p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL GASTO */}
        {isGastoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/90 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-golden-main" />
              {!saveSuccess ? (
                <>
                  <button onClick={() => setIsGastoModalOpen(false)} className="absolute right-6 top-6 text-zinc-500 hover:text-white"><X size={18}/></button>
                  <h4 className="text-xs font-black uppercase italic tracking-widest text-center mb-8 text-golden-main">Insertar Gasto</h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-golden-main font-black">$</span>
                      <input 
                        type="number" inputMode="numeric" placeholder="Monto"
                        value={nuevoGasto.monto}
                        onChange={(e) => setNuevoGasto({...nuevoGasto, monto: e.target.value})}
                        className="w-full bg-black border border-white/5 rounded-2xl py-4 text-center font-black text-white focus:border-golden-main/40 outline-none placeholder:text-zinc-800"
                      />
                    </div>
                    <input 
                      type="text" placeholder="Descripción breve"
                      value={nuevoGasto.desc}
                      onChange={(e) => setNuevoGasto({...nuevoGasto, desc: e.target.value})}
                      className="w-full bg-black border border-white/5 rounded-2xl py-4 text-center font-bold text-zinc-300 focus:border-golden-main/40 outline-none italic uppercase text-[10px]"
                    />
                    {showValidationError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-center gap-2 animate-bounce">
                        <AlertTriangle size={12} className="text-red-500" />
                        <span className="text-[8px] font-black uppercase text-red-500">Datos inválidos</span>
                      </div>
                    )}
                    <button 
                      onClick={guardarGasto} disabled={loading}
                      className="w-full bg-golden-main text-black py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95 shadow-xl"
                    >
                      <Save size={14} strokeWidth={3} />
                      {loading ? 'Guardando...' : 'Confirmar Gasto'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={32} className="text-green-500" /></div>
                  <h4 className="text-sm font-black uppercase italic tracking-[0.2em] text-center text-white">Gasto registrado</h4>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase mt-2 italic tracking-widest text-center">Con éxito</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 text-center opacity-10">
           <p className="text-[6px] uppercase tracking-[1.5em] font-black italic">PATAGONIA CORE • V 2.5</p>
        </div>
      </div>
    </div>
  );
}