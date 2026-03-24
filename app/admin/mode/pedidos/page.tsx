"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MoreVertical,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function PedidosPage() {
  const [activeTab, setActiveTab] = useState('pendientes');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo basados en tu estructura actual
  const [pedidos, setPedidos] = useState([
    { id: '1024', cliente: 'Joshua Dev', items: '2x Individual', total: 17000, hora: '14:30', estado: 'pendientes', tipo: 'Retiro' },
    { id: '1023', cliente: 'Ana Valdés', items: '1x Familiar', total: 22000, hora: '13:15', estado: 'listo', tipo: 'Delivery' },
    { id: '1022', cliente: 'Cristian R.', items: '3x Individual', total: 25500, hora: '12:45', estado: 'entregado', tipo: 'Retiro' },
  ]);

  // Filtrado por Tab y Buscador
  const pedidosFiltrados = pedidos.filter(p => {
    const matchesTab = activeTab === 'todos' || p.estado === activeTab;
    const matchesSearch = p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  // Función para mover el pedido en el flujo
  const avanzarEstado = (id: string, estadoActual: string) => {
    let nuevoEstado = estadoActual;
    if (estadoActual === 'pendientes') nuevoEstado = 'listo';
    else if (estadoActual === 'listo') nuevoEstado = 'entregado';
    
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER: Lupa a la derecha */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-auto">
            <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase leading-none">
              PEDIDOS <span className="text-golden-main">GC</span>
            </h1>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2 italic">
              Panel Operativo • Patagonia
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Buscar por cliente o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-3.5 pl-5 pr-12 text-xs focus:outline-none focus:border-golden-main/30 transition-all font-sans italic"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-golden-main transition-colors" size={18} />
          </div>
        </header>

        {/* TABS DE ESTADO */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['todos', 'pendientes', 'listo', 'entregado'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab 
                ? 'bg-golden-main text-black border-golden-main shadow-lg shadow-golden-main/20' 
                : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:text-white'
              }`}
            >
              {tab === 'listo' ? 'Listo p/ Asignar' : tab}
            </button>
          ))}
        </div>

        {/* LISTA DE PEDIDOS BENTO */}
        <div className="space-y-4">
          {pedidosFiltrados.map((p) => (
            <div 
              key={p.id} 
              className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-golden-main/10 transition-all duration-500"
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                {/* ID LIMPIO: Sin cuadro, solo texto potente */}
                <div className="flex flex-col items-center justify-center min-w-[45px]">
                  <span className="text-[8px] font-black text-zinc-800 uppercase tracking-tighter mb-1">Orden</span>
                  <span className="font-heading text-2xl font-black text-golden-main italic leading-none">#{p.id}</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-2xl font-black text-white uppercase italic leading-none tracking-tighter">
                      {p.cliente}
                    </h2>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${
                      p.tipo === 'Delivery' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {p.tipo}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <p className="text-[10px] font-black text-zinc-400 uppercase italic tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                      {p.items}
                    </p>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase">{p.hora} PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACCIONES Y TOTAL */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-3xl font-black text-white italic tracking-tighter leading-none">
                    ${p.total.toLocaleString()}
                  </p>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.2em] mt-2">
                    Transacción Exitosa
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => avanzarEstado(p.id, p.estado)}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all border ${
                      p.estado === 'pendientes' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      p.estado === 'listo' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-lg shadow-green-500/10' :
                      'bg-zinc-800 text-zinc-600 border-transparent opacity-30 cursor-default'
                    }`}
                  >
                    {p.estado === 'pendientes' && <><Clock size={14}/> Preparar</>}
                    {p.estado === 'listo' && <><CheckCircle2 size={14}/> Entregar</>}
                    {p.estado === 'entregado' && <><Truck size={14}/> Finalizado</>}
                  </button>
                  
                  <button className="p-3.5 bg-zinc-800/50 text-zinc-600 rounded-2xl hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pedidosFiltrados.length === 0 && (
          <div className="py-20 text-center text-zinc-800 uppercase font-black tracking-[0.5em] italic opacity-20">
            No hay pedidos en esta lista
          </div>
        )}
      </div>
    </div>
  );
}