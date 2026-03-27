"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Search, Clock, CheckCircle2, Truck, MoreVertical, 
  Receipt, MessageSquare, Percent, Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  formatOrderItems,
  GcOrder,
  orderCreatedTime,
  toPedidoEstadoUi,
  toPedidoTipoUi,
} from '@/lib/gc-data';

type PedidoUi = {
  id: string;
  cliente: string;
  items: string;
  total: number;
  hora: string;
  estado: 'pendientes' | 'listo' | 'entregado';
  tipo: 'Retiro' | 'Delivery';
  descuento: number;
  nota: string;
  delivery: number;
  sourceStatus: 'pendiente' | 'confirmado' | 'listo' | 'entregado';
  paymentMethod: string;
};

export default function PedidosPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pendientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [pedidoEditando, setPedidoEditando] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pedidos, setPedidos] = useState<PedidoUi[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const { data, error: loadError } = await supabase
        .from('gc_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (loadError) {
        setError(loadError.message);
        setLoading(false);
        return;
      }

      const mapped = ((data ?? []) as GcOrder[]).map((row) => ({
        id: row.folio ? `#${row.folio.toString().padStart(8, '0')}` : `#${row.id.toString().slice(-8).padStart(8, '0')}`,
        rawId: row.id,
        cliente: row.client_name,
        items: formatOrderItems(row.items),
        total: row.total ?? 0,
        hora: orderCreatedTime(row.created_at),
        estado: toPedidoEstadoUi(row.status),
        tipo: toPedidoTipoUi(row.delivery_type),
        descuento: row.discount ?? 0,
        nota: row.note ?? '',
        delivery: row.shipping_cost ?? 0,
        sourceStatus: row.status ?? 'pendiente',
        paymentMethod: row.payment_method ?? 'No especificado',
      }));
      setPedidos(mapped);
      setLoading(false);
    };

    void loadOrders();
  }, []);

  const pedidosFiltrados = useMemo(
    () =>
      pedidos.filter((p) => {
        const matchesTab = activeTab === 'todos' || p.estado === activeTab;
        const matchesSearch =
          p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm);
        return matchesTab && matchesSearch;
      }),
    [activeTab, pedidos, searchTerm]
  );

  const toDbStatus = (estadoUi: PedidoUi['estado']): PedidoUi['sourceStatus'] => {
    if (estadoUi === 'listo') return 'listo';
    if (estadoUi === 'entregado') return 'entregado';
    return 'pendiente';
  };

  const avanzarEstado = async (pedido: PedidoUi) => {
    let nuevoEstado: PedidoUi['estado'] = pedido.estado;
    if (pedido.estado === 'pendientes') nuevoEstado = 'listo';
    else if (pedido.estado === 'listo') nuevoEstado = 'entregado';

    if (nuevoEstado === pedido.estado) {
      // Si ya está entregado, el botón de boleta redirige
      router.push(`/admin/mode/comprobante?id=${pedido.id}`);
      return;
    }

    const { error: updateError } = await supabase
      .from('gc_orders')
      .update({ status: toDbStatus(nuevoEstado) })
      .eq('id', (pedido as any).rawId);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: nuevoEstado } : p)));
  };

  const actualizarPedido = async (id: string, campos: Partial<PedidoUi>) => {
    const pActual = pedidos.find(p => p.id === id);
    if (!pActual) return;
    
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, ...campos } : p)));
    
    const payload: Record<string, number | string> = {};
    if (typeof campos.delivery === 'number') payload.shipping_cost = campos.delivery;
    if (typeof campos.descuento === 'number') payload.discount = campos.descuento;
    if (typeof campos.nota === 'string') payload.note = campos.nota;
    
    if (Object.keys(payload).length === 0) return;

    const { error: updateError } = await supabase.from('gc_orders').update(payload).eq('id', (pActual as any).rawId);
    if (updateError) setError(updateError.message);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans">
      <div className="max-w-2xl mx-auto">
        
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-4 flex items-center justify-center -mt-4">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">Pedidos</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">CHOCLO</span>
          </div>
        </header>

        <p className="text-[7px] text-zinc-600 uppercase tracking-[0.5em] font-black italic text-center mb-6">Panel Operativo</p>

        <div className="space-y-4 mb-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="BUSCAR CLIENTE O ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-3.5 pl-5 pr-12 text-[10px] focus:outline-none focus:border-golden-main/30 transition-all font-black italic tracking-widest uppercase"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {['todos', 'pendientes', 'listo', 'entregado'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-golden-main text-black border-golden-main shadow-md shadow-golden-main/10' 
                    : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:text-white'
                }`}
              >
                {tab === 'listo' ? 'Por Entregar' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {pedidosFiltrados.map((p) => (
            <div key={p.id} className="bg-zinc-900/20 border border-white/5 rounded-[2.2rem] p-5 relative group transition-all">
              
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest italic leading-none mb-1">Orden de Venta</span>
                  <span className="text-lg font-black italic tracking-tighter text-golden-main leading-none">#{p.id}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`text-[7px] px-2 py-1 rounded-lg font-black uppercase italic ${p.tipo === 'Delivery' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {p.tipo}
                  </span>
                   <span className={`text-[7px] px-2 py-1 rounded-lg font-black uppercase italic ${p.paymentMethod === 'transferencia' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'}`}>
                    {p.paymentMethod}
                  </span>
                  <button 
                    onClick={() => setPedidoEditando(pedidoEditando === p.id ? null : p.id)}
                    className="p-2 bg-zinc-900/50 rounded-xl text-zinc-600 hover:text-golden-main"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{p.cliente}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight italic bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    {p.items}
                  </span>
                  {p.nota && (
                    <span className="text-[8px] font-bold text-golden-main/60 uppercase tracking-tight italic bg-golden-main/5 px-2 py-1 rounded-md border border-golden-main/10">
                      &quot;{p.nota}&quot;
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white italic tracking-tighter leading-none">
                    ${(p.total + p.delivery - (p.total * (p.descuento / 100))).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[7px] text-zinc-600 font-bold uppercase mt-1 italic tracking-widest">
                    {p.hora} • {p.estado === 'entregado' ? 'Finalizado' : 'En Cola'}
                  </span>
                </div>

                <button 
                  onClick={() => void avanzarEstado(p)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    p.estado === 'pendientes' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    p.estado === 'listo' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    'bg-golden-main text-black border-transparent shadow-lg shadow-golden-main/20'
                  }`}
                >
                  {p.estado === 'pendientes' && <><Clock size={12}/> Preparar</>}
                  {p.estado === 'listo' && <><CheckCircle2 size={12}/> Entregar</>}
                  {p.estado === 'entregado' && <><Receipt size={12}/> Ver Boleta</>}
                </button>
              </div>

              {pedidoEditando === p.id && (
                <div className="mt-5 pt-5 border-t border-dashed border-white/10 animate-in slide-in-from-top-2 grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[7px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Truck size={8}/> Delivery
                    </label>
                    <input 
                      type="number" 
                      placeholder="$ 0"
                      value={p.delivery || ''}
                      onChange={(e) => void actualizarPedido(p.id, { delivery: Number(e.target.value) })}
                      className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-[10px] font-black text-blue-400 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[7px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Percent size={8}/> Descuento
                    </label>
                    <input 
                      type="number" 
                      placeholder="%"
                      value={p.descuento || ''}
                      onChange={(e) => void actualizarPedido(p.id, { descuento: Number(e.target.value) })}
                      className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-[10px] font-black text-red-400 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[7px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <MessageSquare size={8}/> Nota Boleta
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="EJ: SIN CEBOLLA..."
                        value={p.nota}
                        onChange={(e) => void actualizarPedido(p.id, { nota: e.target.value })}
                        className="flex-1 bg-black border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold text-zinc-300 focus:outline-none italic uppercase"
                      />
                      <button 
                        onClick={() => setPedidoEditando(null)}
                        className="px-4 bg-zinc-800 rounded-xl text-[8px] font-black uppercase hover:bg-zinc-700 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {pedidosFiltrados.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-800 uppercase font-black tracking-[0.5em] italic opacity-20">No hay pedidos</div>
        )}
      </div>
    </div>
  );
}