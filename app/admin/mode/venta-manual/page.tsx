"use client";
import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  //Instagram, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Save,
  Trash2
} from 'lucide-react';

export default function VentaManualPage() {
  const [cliente, setCliente] = useState({ nombre: '', tel: '', ig: '', dir: '', tipo: 'Retiro' });
  const [carrito, setCarrito] = useState([
    { id: 1, nombre: 'Individual', precio: 8500, cantidad: 1 },
  ]);

  const productosDisponibles = [
    { id: 1, nombre: 'Individual', precio: 8500 },
    { id: 2, nombre: 'Familiar', precio: 22000 },
  ];

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const actualizarCantidad = (id: number, delta: number) => {
    setCarrito(carrito.map(item => 
      item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase leading-none">
            VENTA <span className="text-golden-main">MANUAL</span>
          </h1>
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2 italic">
            Registro Interno • Golden Choclo
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA 1 & 2: CLIENTE Y SELECCIÓN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* DATOS DEL CLIENTE */}
            <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <User size={18} className="text-golden-main" />
                <h3 className="font-heading text-sm font-black uppercase italic tracking-widest text-zinc-400">Datos del Cliente</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Nombre completo" 
                  className="bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold italic outline-none focus:border-golden-main/30 transition-all"
                />
                <input 
                  type="text" placeholder="Teléfono (+56 9...)" 
                  className="bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold italic outline-none focus:border-golden-main/30 transition-all"
                />
                <input 
                  type="text" placeholder="Instagram (Opcional)" 
                  className="bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold italic outline-none focus:border-golden-main/30 transition-all"
                />
                <select className="bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-black italic outline-none text-zinc-400">
                  <option>Retiro en Local</option>
                  <option>Delivery</option>
                </select>
                <input 
                  type="text" placeholder="Dirección (Solo si es Delivery)" 
                  className="md:col-span-2 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-bold italic outline-none focus:border-golden-main/30 transition-all"
                />
              </div>
            </section>

            {/* SELECCIÓN DE PRODUCTOS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productosDisponibles.map(prod => (
                <button 
                  key={prod.id}
                  className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group hover:border-golden-main/40 transition-all active:scale-95"
                >
                  <div className="text-left">
                    <p className="font-heading text-lg font-black uppercase italic tracking-tighter leading-none group-hover:text-golden-main transition-colors">
                      {prod.nombre}
                    </p>
                    <p className="text-golden-main font-black text-sm mt-2">${prod.precio.toLocaleString()}</p>
                  </div>
                  <Plus className="text-zinc-700 group-hover:text-white transition-colors" />
                </button>
              ))}
            </section>
          </div>

          {/* COLUMNA 3: RESUMEN Y PAGO */}
          <div className="lg:col-span-1">
            <div className="bg-golden-main text-black rounded-[3rem] p-8 sticky top-24 shadow-2xl shadow-golden-main/20">
              <div className="flex items-center gap-3 mb-8 border-b border-black/10 pb-4">
                <ShoppingCart size={24} strokeWidth={2.5} />
                <h3 className="font-heading text-xl font-black uppercase italic tracking-tighter">Resumen</h3>
              </div>

              <div className="space-y-6 mb-10">
                {carrito.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-black uppercase italic text-sm leading-none">{item.nombre}</p>
                      <p className="text-[10px] font-bold mt-1 opacity-70">${item.precio.toLocaleString()} c/u</p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/10 rounded-xl p-1">
                      <button onClick={() => actualizarCantidad(item.id, -1)} className="p-1 hover:bg-black/10 rounded-lg"><Minus size={14}/></button>
                      <span className="font-black text-sm">{item.cantidad}</span>
                      <button onClick={() => actualizarCantidad(item.id, 1)} className="p-1 hover:bg-black/10 rounded-lg"><Plus size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-black/20 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total a cobrar</p>
                  <p className="text-4xl font-black italic tracking-tighter leading-none">${total.toLocaleString()}</p>
                </div>
              </div>

              <button className="w-full bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-xl">
                <Save size={20} />
                REGISTRAR VENTA
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}