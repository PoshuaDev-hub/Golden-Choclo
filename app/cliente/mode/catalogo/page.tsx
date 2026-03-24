"use client";
import React, { useState } from 'react';
import { Plus, ShoppingBag, Info, Star, Clock } from 'lucide-react';
import Banner from '../../Banner'; 
import Carrito from '../../Carrito';

export default function CatalogoCliente() {
  // Estado para simular si el local está abierto (Esto vendrá de tu Configuración)
  const [isOpen] = useState(true); 

  // Datos de productos (Luego vendrán de Supabase)
  const productos = [
    { 
      id: 1, 
      nombre: "Pastel Individual", 
      precio: 8500, 
      desc: "Pino de carne artesanal, pollo, huevo y aceituna. 500g de tradición.",
      popular: true 
    },
    { 
      id: 2, 
      nombre: "Pastel Familiar", 
      precio: 22000, 
      desc: "Formato XL para compartir en familia (4-5 personas).",
      popular: false 
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pb-40 antialiased selection:bg-golden-main selection:text-black">
      {/* 1. BANNER DE ESTADO (Abierto/Cerrado) */}
      <Banner isOpen={isOpen} />

      <div className="max-w-5xl mx-auto px-6 pt-16">
        
        {/* 2. HEADER PREMIUM */}
        <header className="text-center mb-20 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-golden-main/10 blur-[80px] rounded-full" />
          
          <h1 className="font-heading text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            NUESTRO <br /> <span className="text-golden-main">MENÚ</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-8 bg-zinc-800" />
            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.6em] font-black italic">
              Puerto Aysén • Patagonia
            </p>
            <div className="h-px w-8 bg-zinc-800" />
          </div>
        </header>

        {/* 3. GRID DE PRODUCTOS (ESTILO BENTO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {productos.map((prod) => (
            <div 
              key={prod.id} 
              className="group relative bg-zinc-900/30 border border-white/5 rounded-[3.5rem] p-8 md:p-10 flex flex-col justify-between hover:border-golden-main/30 transition-all duration-500 overflow-hidden"
            >
              {/* Etiqueta Popular */}
              {prod.popular && (
                <div className="absolute top-8 right-8 bg-golden-main text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-golden-main/20">
                  <Star size={10} fill="currentColor" /> Recomendado
                </div>
              )}

              <div className="mb-12">
                {/* Placeholder de Imagen / Icono */}
                <div className="w-20 h-20 bg-black rounded-[2rem] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                   <ShoppingBag size={32} className="text-zinc-800 group-hover:text-golden-main/50 transition-colors" />
                </div>

                <h3 className="font-heading text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 leading-none group-hover:text-golden-main transition-colors">
                  {prod.nombre}
                </h3>
                
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed italic font-medium max-w-[90%]">
                  {prod.desc}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white italic tracking-tighter">${prod.precio.toLocaleString()}</span>
                  <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">CLP</span>
                </div>

                <button className="w-full bg-golden-main text-black font-black py-5 rounded-[1.8rem] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-golden-main/10 hover:shadow-golden-main/30">
                  <Plus size={22} strokeWidth={3} />
                  <span className="text-xs tracking-[0.2em] uppercase">Agregar al Pedido</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 4. FOOTER INFO SMART */}
        <footer className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] flex items-start gap-5">
            <Clock size={20} className="text-golden-main shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2 italic">Horario de Hoy</p>
              <p className="text-xs font-bold text-zinc-500 italic">Lunes a Sábado: 12:00 - 20:00 hrs</p>
            </div>
          </div>

          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] flex items-start gap-5">
            <Info size={20} className="text-golden-main shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2 italic">Despacho</p>
              <p className="text-xs font-bold text-zinc-500 italic">Repartos en todo Puerto Aysén y alrededores.</p>
            </div>
          </div>
        </footer>

      </div>

      {/* 5. CARRITO FLOTANTE (Componente separado) */}
      <Carrito total={0} cantidad={0} />
      
      {/* Estética de Marca Final */}
      <div className="mt-20 text-center pb-10">
        <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[1em] italic">
          Golden Choclo • Calidad Premium
        </p>
      </div>
    </main>
  );
}