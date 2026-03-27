"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ArrowLeft, Plus } from 'lucide-react';
import Boleta from '@/components/ui/Boleta';
import { supabase } from '@/lib/supabase';
import { formatOrderItems, GcOrder, toPedidoTipoUi } from '@/lib/gc-data';

interface Pedido {
  id: string;
  cliente: string;
  items: string;
  total: number;
  fecha: string;
  tipo: 'Retiro' | 'Delivery';
  descuento?: number;
  nota?: string;
  delivery?: number;
}

export default function ComprobantesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTiempo, setFiltroTiempo] = useState('hoy');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [costoEnvio, setCostoEnvio] = useState<number | "">(""); // Iniciamos vacío para el placeholder
  const [pedidosRecientes, setPedidosRecientes] = useState<Pedido[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hoy = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  useEffect(() => {
    const loadOrders = async () => {
      const { data, error: loadError } = await supabase
        .from('gc_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const mapped = ((data ?? []) as GcOrder[]).map((row) => ({
        id: row.folio ? `#${row.folio.toString().padStart(8, '0')}` : row.id,
        cliente: row.client_name,
        items: formatOrderItems(row.items),
        total: row.total ?? 0,
        fecha: row.created_at
          ? new Date(row.created_at).toLocaleDateString('es-CL')
          : new Date().toLocaleDateString('es-CL'),
        tipo: toPedidoTipoUi(row.delivery_type),
        descuento: row.discount ?? 0,
        nota: row.note ?? '',
        delivery: row.shipping_cost ?? 0,
      }));
      setPedidosRecientes(mapped);
    };
    void loadOrders();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    return pedidosRecientes.filter(p => {
      const coincideBusqueda = p.cliente.toLowerCase().includes(busqueda.toLowerCase()) || p.id.includes(busqueda);
      if (filtroTiempo === 'hoy') return coincideBusqueda && p.fecha === hoy;
      return coincideBusqueda;
    });
  }, [busqueda, filtroTiempo, hoy, pedidosRecientes]);

  // Enfocar el input de delivery automáticamente al seleccionar un delivery
  useEffect(() => {
    if (pedidoSeleccionado?.tipo === 'Delivery' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [pedidoSeleccionado]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-6 flex items-center justify-center -mt-4 md:-mt-8">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">COMPROBANTES</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">CHOCLO</span>
          </div>
        </header>

        {/* CONTENIDO SUPERIOR / BOTÓN VOLVER LLAMATIVO */}
        <div className="flex flex-col items-center justify-center mb-8 gap-6">
          {!pedidoSeleccionado && (
            <p className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-[0.5em] font-black italic text-center">
              Emisión de Comprobante • Patagonia
            </p>
          )}
          
          {pedidoSeleccionado && (
            <button 
              onClick={() => { setPedidoSeleccionado(null); setCostoEnvio(""); }}
              className="group flex items-center gap-3 px-6 py-2 bg-zinc-900/50 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-golden-main hover:bg-golden-main hover:text-black transition-all duration-300"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver al listado
            </button>
          )}
        </div>

        {!pedidoSeleccionado ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* FILTROS */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar justify-center">
              {['hoy', 'todos'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroTiempo(f)}
                  className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                    filtroTiempo === f ? 'bg-golden-main text-black border-golden-main' : 'bg-zinc-900 text-zinc-500 border-white/5'
                  }`}
                >
                  {f === 'hoy' ? 'Día Actual' : 'Ver Todos'}
                </button>
              ))}
            </div>

            {/* BUSCADOR */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="BUSCAR POR ID O NOMBRE..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-zinc-900/40 border border-white/5 rounded-3xl py-5 pl-8 pr-14 text-xs focus:outline-none focus:border-golden-main/30 transition-all font-black italic tracking-widest uppercase"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-golden-main transition-colors" size={20} />
            </div>

            {/* LISTADO */}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="grid grid-cols-1 gap-3">
              {pedidosFiltrados.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => setPedidoSeleccionado(p)}
                  className="bg-zinc-900/20 border border-white/5 p-6 rounded-3xl flex justify-between items-center hover:bg-zinc-900/40 hover:border-golden-main/30 transition-all group"
                >
                  <div className="text-left">
                    <p className="text-[10px] text-golden-main font-black italic uppercase tracking-tighter mb-1">PEDIDO #{p.id}</p>
                    <p className="font-heading font-black italic uppercase leading-none tracking-tight text-lg text-white">{p.cliente}</p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2 tracking-widest">{p.fecha} • <span className={p.tipo === 'Delivery' ? 'text-blue-400' : 'text-green-400'}>{p.tipo}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white italic text-lg">${p.total.toLocaleString('es-CL')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* PANEL AJUSTE DELIVERY */}
            {pedidoSeleccionado.tipo === 'Delivery' && (
              <div className="mb-8 bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center shadow-2xl">
                <div className="flex items-center gap-2 mb-4 text-golden-main">
                   <Plus size={14} strokeWidth={3} />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Agregar Costo Delivery</p>
                </div>
                
                <div className="relative w-full max-w-[200px]">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-xl">$</span>
                  <input 
                    ref={inputRef}
                    type="number" 
                    inputMode="numeric"
                    placeholder="0000"
                    value={costoEnvio}
                    onChange={(e) => setCostoEnvio(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-transparent border-b-2 border-zinc-800 py-2 pl-6 text-center text-3xl font-black text-white focus:outline-none focus:border-golden-main transition-colors placeholder:text-zinc-800"
                  />
                </div>
                <p className="mt-4 text-[8px] text-zinc-600 uppercase font-black tracking-widest">El monto se sumará automáticamente</p>
              </div>
            )}

            <Boleta 
              pedido={{
                ...pedidoSeleccionado, 
                // Aquí pasamos el total con el envío. Usamos toLocaleString para la coma en el componente Boleta.
                total: pedidoSeleccionado.total + (Number(costoEnvio) || 0),
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}