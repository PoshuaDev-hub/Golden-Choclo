"use client";
import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Power, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductosPage() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Individual", precio: 8500, stock: true, descripcion: "Porción de 500g con carne picada" },
    { id: 2, nombre: "Familiar", precio: 22000, stock: false, descripcion: "Fuente para 4-5 personas" },
  ]);

  const toggleStock = (id: number) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, stock: !p.stock } : p
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER DE SECCIÓN */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase">
              PRODUCTOS <span className="text-golden-main">GC</span>
            </h1>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2">
              Gestión de Inventario • Patagonia
            </p>
          </div>

          <button className="bg-golden-main text-black px-6 py-4 rounded-[1.5rem] font-black shadow-xl shadow-golden-main/20 active:scale-95 transition-all hover:scale-105 flex items-center gap-2 text-xs uppercase italic">
            <Plus size={20} strokeWidth={3} />
            Nuevo Producto
          </button>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-heading text-sm font-bold italic tracking-widest uppercase text-zinc-500">
              Disponibilidad en Catálogo
            </h2>
            <span className="text-[10px] text-zinc-700 font-bold uppercase">{productos.length} Items</span>
          </div>

          <div className="grid grid-cols-1 gap-4 font-sans">
            {productos.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-golden-main/20 transition-all duration-500"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  {/* Icono Proporcional */}
                  <div className={`p-5 rounded-3xl transition-all duration-500 ${
                    prod.stock 
                    ? 'bg-golden-main/10 text-golden-main shadow-[0_0_20px_rgba(252,163,17,0.05)]' 
                    : 'bg-zinc-800/50 text-zinc-600'
                  }`}>
                    <Package size={28} strokeWidth={1.5} />
                  </div>

                  <div className="flex flex-col">
                    <p className="font-heading text-xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-golden-main transition-colors">
                      {prod.nombre}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 tracking-tight">
                      {prod.descripcion}
                    </p>
                    <p className="text-xl font-black text-golden-main italic mt-2">
                      ${prod.precio.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Acciones de Producto */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {/* Toggle de Stock Estilo Bento */}
                  <button 
                    onClick={() => toggleStock(prod.id)}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                      prod.stock 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-lg shadow-green-500/5' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20 opacity-60'
                    }`}
                  >
                    {prod.stock ? '• Disponible' : '• Agotado'}
                  </button>

                  {/* Botón Editar */}
                  <button className="p-3.5 bg-zinc-800 text-zinc-400 rounded-2xl hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>

                  {/* Botón Borrar */}
                  <button className="p-3.5 bg-zinc-800 text-zinc-400 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
           <p className="text-[8px] text-zinc-700 uppercase tracking-[0.5em] font-black italic">
              Actualización en tiempo real • Golden Choclo
           </p>
        </div>
      </div>
    </div>
  );
}