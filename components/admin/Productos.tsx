"use client";
import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Power } from 'lucide-react';

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Individual", precio: 8500, stock: true },
    { id: 2, nombre: "Familiar", precio: 22000, stock: false },
  ]);

  const toggleStock = (id: number) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, stock: !p.stock } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold italic text-golden-main">Inventario</h2>
        <button className="bg-golden-main text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
          <Plus size={18} /> Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-dark-card border border-white/5 p-5 rounded-3xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${prod.stock ? 'bg-golden-main/10 text-golden-main' : 'bg-zinc-800 text-zinc-500'}`}>
                <Package size={20} />
              </div>
              <div>
                <p className="font-heading font-bold text-white uppercase italic">{prod.nombre}</p>
                <p className="text-golden-main font-bold">${prod.precio.toLocaleString()}</p>
              </div>
            </div>

            <button 
              onClick={() => toggleStock(prod.id)}
              className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase transition-all border ${
                prod.stock 
                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}
            >
              {prod.stock ? 'En Stock' : 'Sin Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}