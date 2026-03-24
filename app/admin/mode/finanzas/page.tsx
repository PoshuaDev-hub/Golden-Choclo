"use client";
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Wallet,
  Receipt,
  PiggyBank
} from 'lucide-react';

export default function FinanzasPage() {
  // Datos de ejemplo (Luego los traeremos de Supabase)
  const stats = [
    { label: 'Ventas Totales', value: 840500, icon: <TrendingUp size={24}/>, trend: '+12%', positive: true },
    { label: 'Gastos Insumos', value: 125000, icon: <TrendingDown size={24}/>, trend: '-5%', positive: false },
    { label: 'Utilidad Neta', value: 715500, icon: <PiggyBank size={24}/>, trend: '+18%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased selection:bg-golden-main selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Header de Finanzas */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase">
              FINANZAS <span className="text-golden-main">GC</span>
            </h1>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2">
              Análisis Económico • Patagonia
            </p>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3">
            <Calendar size={16} className="text-golden-main" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Marzo 2026</span>
          </div>
        </header>

        {/* Grid de Stats Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 p-7 rounded-[2.5rem] flex flex-col justify-between min-h-[160px] group hover:border-golden-main/20 transition-all">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stat.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">
                  ${stat.value.toLocaleString()}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Cuerpo Principal: Últimos Gastos y Métodos de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          
          {/* Registro de Gastos */}
          <div className="col-span-1 md:col-span-4 bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading text-lg font-bold italic tracking-widest uppercase text-zinc-400">Detalle de Gastos</h3>
              <button className="bg-white/5 hover:bg-golden-main hover:text-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all italic">
                Añadir Gasto
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { item: 'Bolsas Kraft x100', cat: 'Insumos', price: 15000, date: 'Hoy' },
                { item: 'Maíz Choclo 20kg', cat: 'Materia Prima', price: 45000, date: 'Ayer' },
                { item: 'Gas Abastible 45kg', cat: 'Servicios', price: 65000, date: '18 Mar' },
              ].map((gasto, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/40 rounded-3xl border border-white/5 group hover:border-red-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase italic leading-none">{gasto.item}</p>
                      <p className="text-[9px] text-zinc-600 uppercase font-bold mt-2 tracking-tight">{gasto.cat} • {gasto.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-red-400 italic">-${gasto.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen Métodos de Pago */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-golden-main p-8 rounded-[2.5rem] text-black shadow-xl shadow-golden-main/10 relative overflow-hidden">
              <Wallet className="absolute -right-4 -top-4 w-24 h-24 opacity-20 transform -rotate-12" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6">Caja Hoy</h4>
              <p className="text-4xl font-black italic tracking-tighter leading-none">$145.000</p>
              <p className="text-[9px] font-bold uppercase mt-4 opacity-70">Efectivo disponible</p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem]">
              <h4 className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-6">Canales</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase italic text-zinc-400">Transferencias</span>
                  <span className="text-xs font-black">70%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-golden-main h-full w-[70%]" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold uppercase italic text-zinc-400">Efectivo</span>
                  <span className="text-xs font-black">30%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white/20 h-full w-[30%]" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Mensaje Footer */}
        <div className="mt-12 text-center opacity-40">
           <p className="text-[7px] uppercase tracking-[0.8em] font-black">Golden Choclo • Financial Intelligence</p>
        </div>
      </div>
    </div>
  );
}