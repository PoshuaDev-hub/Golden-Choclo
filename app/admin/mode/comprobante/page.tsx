"use client";
import React, { useState } from 'react';
import { Search, Receipt, ArrowLeft } from 'lucide-react';
import Boleta from '@/components/ui/Boleta';

export default function ComprobantesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

  // Ejemplo de pedidos listos para generar boleta
  const pedidosRecientes = [
    { id: '1024', cliente: 'Joshua Dev', items: '2x Individual', total: 17000, fecha: '24/03/2026', tipo: 'Retiro' },
    { id: '1023', cliente: 'Ana Valdés', items: '1x Familiar', total: 22000, fecha: '24/03/2026', tipo: 'Delivery' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase leading-none">
              COMPROBANTES <span className="text-golden-main">GC</span>
            </h1>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2 italic">
              Emisión de Tickets • Patagonia
            </p>
          </div>
          {pedidoSeleccionado && (
            <button 
              onClick={() => setPedidoSeleccionado(null)}
              className="p-3 bg-zinc-900 rounded-2xl text-golden-main hover:bg-golden-main hover:text-black transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          )}
        </header>

        {!pedidoSeleccionado ? (
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-golden-main transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por ID o Nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-zinc-900/40 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-golden-main/30 transition-all font-sans italic"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-4">Pedidos Recientes</p>
              {pedidosRecientes.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => setPedidoSeleccionado(p)}
                  className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center hover:border-golden-main/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Receipt className="text-zinc-700 group-hover:text-golden-main transition-colors" />
                    <div className="text-left">
                      <p className="font-heading font-black italic uppercase leading-none tracking-tight">#{p.id} - {p.cliente}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase mt-2 tracking-widest">{p.fecha} • {p.tipo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-golden-main italic">${p.total.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <Boleta pedido={pedidoSeleccionado} />
            <p className="text-center text-[10px] text-zinc-600 mt-8 font-bold uppercase tracking-widest">
              Vista previa del comprobante digital
            </p>
          </div>
        )}
      </div>
    </div>
  );
}