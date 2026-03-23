"use client";
import { useState } from 'react';

export default function VentaManual() {
  return (
    <div className="bg-dark-card p-6 rounded-3xl border border-white/5">
      <h3 className="font-heading text-xl font-bold mb-6 text-golden-main italic">Registrar Pedido Manual</h3>
      <div className="space-y-4 text-sm">
        <div>
          <label className="text-zinc-500 block mb-2 uppercase font-black text-[10px]">Nombre del Cliente</label>
          <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-white" placeholder="Ej: Vecino Juan" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-500 block mb-2 uppercase font-black text-[10px]">Producto</label>
            <select className="w-full bg-black border border-white/10 p-3 rounded-xl text-white">
              <option>Cocho Individual</option>
              <option>Cocho Familiar</option>
            </select>
          </div>
          <div>
            <label className="text-zinc-500 block mb-2 uppercase font-black text-[10px]">Total a Cobrar</label>
            <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-white" type="number" placeholder="$0" />
          </div>
        </div>
        <button className="w-full bg-golden-main text-black font-black py-3 rounded-xl mt-4">
          GUARDAR EN HISTORIAL
        </button>
      </div>
    </div>
  );
}