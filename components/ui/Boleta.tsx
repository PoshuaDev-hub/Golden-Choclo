"use client";
import React from 'react';
import { Printer, Share2 } from 'lucide-react';

interface Props {
  pedido: {
    id: string;
    cliente: string;
    items: string;
    total: number; // Este es el total neto (sin ajustes)
    fecha: string;
    tipo: string;
    descuento?: number;
    nota?: string;
    delivery?: number;
  };
}

export default function Boleta({ pedido }: Props) {
  // Cálculos de la boleta
  const montoDescuento = (pedido.total * (pedido.descuento || 0)) / 100;
  const totalFinal = pedido.total - montoDescuento + (pedido.delivery || 0);

  return (
    <div className="bg-white text-black p-8 rounded-sm shadow-2xl max-w-sm mx-auto font-mono text-sm relative overflow-hidden border-t-8 border-black">
      
      <div className="text-center border-b-2 border-dashed border-black/10 pb-6 mb-6">
        <h2 className="text-xl font-black italic tracking-tighter uppercase">GOLDEN CHOCLO</h2>
        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Patagonia • Puerto Aysén</p>
        <p className="text-[8px] mt-1 opacity-60 italic">Comprobante de Compra</p>
      </div>

      {/* INFO CABECERA */}
      <div className="space-y-1.5 mb-6 text-[10px] font-bold">
        <div className="flex justify-between uppercase">
          <span className="opacity-50 tracking-tighter">Orden:</span>
          <span className="text-xs">#{pedido.id}</span>
        </div>
        <div className="flex justify-between uppercase">
          <span className="opacity-50 tracking-tighter">Fecha:</span>
          <span>{pedido.fecha}</span>
        </div>
        <div className="flex justify-between uppercase">
          <span className="opacity-50 tracking-tighter">Cliente:</span>
          <span className="tracking-tight">{pedido.cliente}</span>
        </div>
        <div className="flex justify-between uppercase">
          <span className="opacity-50 tracking-tighter">Modo:</span>
          <span className="italic">{pedido.tipo}</span>
        </div>
      </div>

      {/* DETALLE DE PRODUCTOS */}
      <div className="border-b-2 border-dashed border-black/10 pb-4 mb-4">
        <p className="font-black mb-3 text-[9px] uppercase tracking-widest border-b border-black/5 w-fit">Detalle:</p>
        <div className="flex justify-between text-[11px]">
          <span className="uppercase font-bold tracking-tight w-2/3">{pedido.items}</span>
          <span className="font-black italic">${pedido.total.toLocaleString('es-CL')}</span>
        </div>
      </div>

      {/* DESGLOSE DE AJUSTES (Descuentos y Delivery) */}
      <div className="space-y-2 mb-6 border-b-2 border-dashed border-black/10 pb-4 text-[10px]">
        
        {/* Descuento */}
        {(pedido.descuento ?? 0) > 0 && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-500">
            <div className="flex justify-between text-red-600 font-black italic">
              <span>DESC. ({pedido.descuento}%):</span>
              <span>-${montoDescuento.toLocaleString('es-CL')}</span>
            </div>
            {pedido.nota && (
              <p className="text-[8px] mt-1 opacity-50 uppercase leading-tight italic">
                Motivo: &quot;{pedido.nota}&quot;
              </p>
            )}
          </div>
        )}

        {/* Delivery */}
        {(pedido.delivery ?? 0) > 0 && (
          <div className="flex justify-between font-black italic animate-in fade-in slide-in-from-right-2 duration-500">
            <span>COSTO DELIVERY:</span>
            <span>+${pedido.delivery?.toLocaleString('es-CL')}</span>
          </div>
        )}
      </div>

      {/* TOTAL FINAL */}
      <div className="text-right mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic mb-1">Total a Cobrar</p>
        <p className="text-4xl font-black italic tracking-tighter leading-none">
          ${totalFinal.toLocaleString('es-CL')}
        </p>
      </div>

      {/* PIE DE TICKET */}
      <div className="text-center space-y-3">
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black italic uppercase tracking-widest">¡Disfruta tu Choclo!</p>
          <div className="w-12 h-1 bg-black/10 rounded-full mt-2" />
        </div>
        <p className="text-[7px] opacity-40 uppercase tracking-[0.3em] font-black">
          Giro: Comidas Rápidas • Puerto Aysén
        </p>
      </div>

      {/* ACCIONES */}
      <div className="mt-10 flex gap-2 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg"
        >
          <Printer size={14} /> Imprimir
        </button>
        <button 
          onClick={() => {
            const text = `*GOLDEN CHOCLO*\nComprobante de Compra\n\nOrden: #${pedido.id}\nFecha: ${pedido.fecha}\nCliente: ${pedido.cliente}\nModo: ${pedido.tipo}\n\nDetalle:\n${pedido.items}\n\nTotal: $${totalFinal.toLocaleString('es-CL')}\n\n¡Disfruta tu Choclo!`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
          }}
          className="flex-1 bg-zinc-100 py-4 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all border border-black/5 active:scale-95"
        >
          <Share2 size={14} /> WhatsApp
        </button>
      </div>
    </div>
  );
}