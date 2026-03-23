"use client";
import React from 'react';
import { Plus } from 'lucide-react';

// Ejemplo de datos (Luego vendrán de Supabase)
const productosEjemplo = [
  { id: 1, nombre: "Pastel de Choclo Individual", precio: 8500, desc: "Pino artesanal y pollo" },
  { id: 2, nombre: "Pastel de Choclo Familiar", precio: 22000, desc: "Formato XL para compartir" },
];

export default function Catalogo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {productosEjemplo.map((prod) => (
        <div 
          key={prod.id} 
          className="bg-dark-card rounded-[2rem] border border-white/5 p-6 flex flex-col justify-between hover:border-golden-main/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-24 h-24 bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden">
               {/* Aquí irá la imagen del producto */}
            </div>
            <p className="font-heading text-2xl font-black text-golden-main italic">
              ${prod.precio.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold uppercase italic tracking-tighter mb-2">
              {prod.nombre}
            </h3>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              {prod.desc}
            </p>
            
            <button className="w-full bg-golden-main text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95">
              <Plus size={20} /> AGREGAR AL PEDIDO
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}