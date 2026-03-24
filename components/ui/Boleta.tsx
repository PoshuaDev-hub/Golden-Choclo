"use client";
import React from 'react';
import { Printer, Download, Share2 } from 'lucide-react';

interface Props {
  pedido: {
    id: string;
    cliente: string;
    items: string;
    total: number;
    fecha: string;
    tipo: string;
  };
}

export default function Boleta({ pedido }: Props) {
  return (
    <div className="bg-white text-black p-8 rounded-sm shadow-2xl max-w-sm mx-auto font-mono text-sm relative overflow-hidden">
      {/* Efecto de corte de ticket arriba */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[url('https://www.transparenttextures.com/patterns/zigzag.png')] opacity-10" />
      
      <div className="text-center border-b-2 border-dashed border-black/10 pb-6 mb-6">
        <h2 className="text-xl font-black italic tracking-tighter">GOLDEN CHOCLO</h2>
        <p className="text-[10px] uppercase font-bold tracking-widest">Patagonia • Puerto Aysén</p>
        <p className="text-[9px] mt-1">Giro: Comidas Rápidas</p>
      </div>

      <div className="space-y-2 mb-6 text-[11px]">
        <div className="flex justify-between">
          <span>ORDEN:</span>
          <span className="font-bold">#{pedido.id}</span>
        </div>
        <div className="flex justify-between">
          <span>FECHA:</span>
          <span>{pedido.fecha}</span>
        </div>
        <div className="flex justify-between">
          <span>CLIENTE:</span>
          <span className="font-bold uppercase">{pedido.cliente}</span>
        </div>
        <div className="flex justify-between">
          <span>MODO:</span>
          <span>{pedido.tipo}</span>
        </div>
      </div>

      <div className="border-b-2 border-dashed border-black/10 pb-4 mb-4">
        <p className="font-bold mb-2 text-[10px]">DETALLE:</p>
        <div className="flex justify-between">
          <span className="uppercase">{pedido.items}</span>
          <span className="font-bold">${pedido.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="text-right mb-8">
        <p className="text-[10px] font-bold">TOTAL PAGADO</p>
        <p className="text-3xl font-black italic tracking-tighter">${pedido.total.toLocaleString()}</p>
      </div>

      <div className="text-center space-y-2">
        <p className="text-[10px] font-bold italic">¡Gracias por preferirnos!</p>
        <p className="text-[8px] opacity-50 uppercase tracking-[0.2em]">Sigue tu pedido en @goldenchoclo</p>
      </div>

      {/* Botones de acción (No se imprimen si usas CSS de impresión) */}
      <div className="mt-8 flex gap-2 print:hidden">
        <button className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase active:scale-95 transition-all">
          <Printer size={14} /> Imprimir
        </button>
        <button className="flex-1 bg-zinc-100 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase active:scale-95 transition-all border border-black/5">
          <Share2 size={14} /> WhatsApp
        </button>
      </div>
    </div>
  );
}