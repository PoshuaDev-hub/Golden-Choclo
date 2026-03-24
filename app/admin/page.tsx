"use client";
import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Share2, 
  Plus, 
  ArrowUpRight,
  Power,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const shareLink = () => {
    const url = `${window.location.origin}/cliente/mode/catalogo`;
    navigator.clipboard.writeText(url);
    alert("¡Link de catálogo copiado!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-24 antialiased selection:bg-golden-main selection:text-black font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. HEADER RECTO Y MINI (Sin redondeado, tamaño de página) */}
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-6 flex items-center justify-center -mt-4 md:-mt-8">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">
              PANEL
            </span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">
              CHOCLO
            </span>
          </div>
        </header>

        {/* 2. TEXTO DE GESTIÓN (Limpio y centrado) */}
        <div className="flex justify-center mb-8">
           <p className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-[0.5em] font-black italic text-center">
              Gestión Golden Choclo Patagonia
           </p>
        </div>

        {/* 3. ACCIONES: Botones Grandes */}
        <div className="flex gap-3 w-full mb-10 px-1">
          <button 
            onClick={shareLink}
            className="flex-1 bg-zinc-900/50 border border-white/5 hover:border-golden-main/30 text-golden-main px-6 py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg group"
          >
            <Share2 size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] italic">Compartir Menú</span>
          </button>
          
          <button className="flex-1 bg-golden-main text-black px-6 py-5 rounded-[2rem] flex items-center justify-center gap-3 font-black shadow-xl shadow-golden-main/20 active:scale-95 transition-all group">
            <Plus size={20} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">Venta Manual</span>
          </button>
        </div>

        {/* 4. GRID BENTO: Cards Principales */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`col-span-2 md:col-span-2 cursor-pointer rounded-[2.8rem] p-7 flex flex-col justify-between transition-all duration-700 border-2 group min-h-[185px] ${
              isOpen ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl transition-all ${isOpen ? 'bg-green-500 text-black shadow-[0_0_25px_rgba(34,197,94,0.4)]' : 'bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)]'}`}>
                <Power size={24} strokeWidth={3} />
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isOpen ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                {isOpen ? 'En Línea' : 'Offline'}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                {isOpen ? 'Abierto' : 'Cerrado'}
              </h3>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-3 italic opacity-60 leading-none italic">Toque para alternar</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-2 bg-zinc-900 border border-white/5 rounded-[2.8rem] p-7 flex flex-col justify-between relative overflow-hidden group min-h-[185px]">
            <div className="flex justify-between items-start relative z-10 text-zinc-500 group-hover:text-golden-main transition-colors">
              <p className="text-[10px] font-black uppercase tracking-widest italic leading-none">Balance Mes</p>
              <TrendingUp size={20} />
            </div>
            <div className="relative z-10 mt-4">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight">$840.500</h2>
              <div className="flex items-center gap-1 text-[9px] font-black text-green-500 uppercase mt-2 italic tracking-tighter leading-none">
                <ArrowUpRight size={14} strokeWidth={3} /> +18.4% VS ANTERIOR
              </div>
            </div>
            <DollarSign className="absolute -right-4 -bottom-4 text-white/5 w-36 h-36 transform -rotate-12 group-hover:scale-110 transition-transform opacity-40" />
          </div>

          <div className="col-span-2 md:col-span-2 bg-zinc-900 border border-white/5 rounded-[2.8rem] p-7 flex flex-col justify-between group min-h-[185px]">
            <div className="flex justify-between items-start text-zinc-500">
              <p className="text-[10px] font-black uppercase tracking-widest italic leading-none">Insumos</p>
              <Package size={20} />
            </div>
            <div className="mt-4">
              <h4 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-tight">$125.000</h4>
              <button className="text-[9px] font-black text-golden-main uppercase tracking-widest mt-4 border-b border-golden-main/30 hover:border-golden-main transition-all italic leading-none inline-block">
                Añadir gasto
              </button>
            </div>
          </div>

          {/* 5. MOVIMIENTOS RECIENTES */}
          <div className="col-span-2 md:col-span-6 bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-7 md:p-10 mt-2 shadow-2xl">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="font-heading text-sm font-bold italic tracking-widest uppercase text-zinc-500 underline underline-offset-8 decoration-golden-main/20">Movimientos</h3>
              <button className="text-[9px] font-black text-zinc-600 uppercase underline decoration-golden-main/40 italic">Ver todo</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((id) => (
                <div key={id} className="flex items-center justify-between p-5 bg-black/40 rounded-[2.2rem] border border-white/5 hover:border-golden-main/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center font-heading font-black text-golden-main text-[10px] italic border border-white/10 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                      {id % 2 === 0 ? 'JT' : 'AV'}
                    </div>
                    <div className="leading-none">
                      <p className="text-[11px] font-black text-white uppercase italic">{id % 2 === 0 ? 'Joshua' : 'Ana V.'}</p>
                      <p className="text-[9px] text-zinc-700 uppercase font-black tracking-widest italic mt-2.5">Individual • Retiro</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right leading-none">
                      <p className="text-sm font-black text-golden-main italic">+$8.500</p>
                      <p className="text-[8px] text-zinc-700 font-bold uppercase mt-1.5 tracking-tighter">14:30 PM</p>
                    </div>
                    <ChevronRight size={14} className="text-zinc-800 group-hover:text-golden-main transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}