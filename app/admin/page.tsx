"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Share2, 
  Plus, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false); // Switch Maestro para abrir reservas

  const shareLink = () => {
    const url = `${window.location.origin}/tienda`;
    navigator.clipboard.writeText(url);
    alert("¡Link de la tienda copiado para enviar a tus clientes!");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-soft-gray p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Superior */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="font-heading text-3xl font-black italic text-white tracking-tighter">
              DASHBOARD <span className="text-golden-main">GOLDEN</span>
            </h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Gestión Operativa • Aysén</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={shareLink}
              className="flex-1 md:flex-none bg-dark-card border border-white/10 hover:border-golden-main/50 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Share2 size={18} className="text-golden-main" />
              <span className="text-sm font-bold">Compartir Link</span>
            </button>
            <button className="flex-1 md:flex-none bg-golden-main text-black px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black transition-transform hover:scale-105">
              <Plus size={20} />
              <span className="text-sm">Venta Manual</span>
            </button>
          </div>
        </header>

        {/* Layout Bento Box (Estética Imagen 3) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Utilidad Real (Grande) */}
          <div className="md:col-span-2 bg-golden-main rounded-3xl p-8 text-black flex flex-col justify-between h-[280px] shadow-lg shadow-golden-main/10 relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
              <div className="p-3 bg-black/10 rounded-2xl italic font-black text-xs">RESUMEN FINANCIERO</div>
              <TrendingUp size={24} />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-70 mb-1 font-heading uppercase tracking-tighter">Ganancia Neta (Mensual)</p>
              <h2 className="text-6xl font-black italic tracking-tighter">$840.500</h2>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-black/5 w-fit px-3 py-1 rounded-full">
                <ArrowUpRight size={14} /> +18.4% VS MES ANTERIOR
              </div>
            </div>
            {/* Decoración de fondo */}
            <div className="absolute -right-8 -bottom-8 text-black/5 transform -rotate-12">
               <DollarSign size={200} />
            </div>
          </div>

          {/* Card 2: Switch Maestro (Control Operativo) */}
          <div className={`md:col-span-1 rounded-3xl p-8 flex flex-col justify-between transition-colors duration-500 border ${isOpen ? 'bg-zinc-900 border-golden-main/30' : 'bg-dark-card border-white/5'}`}>
            <div className="flex justify-between items-center">
              <Calendar size={24} className={isOpen ? 'text-golden-main' : 'text-zinc-600'} />
              <div className={`w-3 h-3 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold mb-4">{isOpen ? 'RESERVAS ABIERTAS' : 'SISTEMA CERRADO'}</h3>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${isOpen ? 'bg-red-600/20 text-red-500 border border-red-600/30' : 'bg-golden-main text-black'}`}
              >
                {isOpen ? 'CERRAR ESTE FINDE' : 'ABRIR ESTE FINDE'}
              </button>
            </div>
          </div>

          {/* Card 3: Inversión (Gastos) */}
          <div className="md:col-span-1 bg-dark-card rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-zinc-500">
              <Package size={24} />
              <span className="text-[10px] font-black tracking-widest uppercase">Gastos</span>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white">$125.000</h4>
              <p className="text-zinc-500 text-xs mt-1 italic font-medium">Inversión en insumos</p>
              <button className="mt-6 text-xs font-bold text-golden-main underline decoration-golden-main/30 hover:text-white transition-colors">
                Registrar Gasto
              </button>
            </div>
          </div>

          {/* Card 4: Historial Reciente (Ancho Completo) */}
          <div className="md:col-span-4 bg-zinc-900/40 rounded-3xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading text-xl font-bold italic tracking-tighter">Últimos Pedidos</h3>
              <button className="text-xs font-bold text-zinc-500 hover:text-golden-main">VER TODO EL HISTORIAL</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((id) => (
                <div key={id} className="flex items-center justify-between p-5 bg-dark-card/40 rounded-2xl border border-white/5 hover:border-golden-main/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-heading font-black text-golden-main">
                      {id === 1 ? 'J' : 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{id === 1 ? 'Joshua Tester' : 'Ana Valenzuela'}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">Cocho Familiar • Retiro</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-golden-main">+$22.500</p>
                    <p className="text-[10px] text-zinc-600 font-bold">HOY 14:30</p>
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