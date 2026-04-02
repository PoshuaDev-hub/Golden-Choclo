"use client";
import React, { useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  pedido: {
    id: string;
    cliente: string;
    items: string;
    total: number;
    fecha: string;
    tipo: string;
    descuento?: number;
    nota?: string;
    delivery?: number;
  };
}

export default function Boleta({ pedido }: Props) {
  // El ref apunta SOLO al área de impresión (sin los botones)
  const areaRef = useRef<HTMLDivElement>(null);
  const [descargando, setDescargando] = useState(false);

  // Cálculos
  const montoDescuento = (pedido.total * (pedido.descuento || 0)) / 100;
  const totalFinal = pedido.total - montoDescuento + (pedido.delivery || 0);

  const handleDownloadPNG = async () => {
    if (!areaRef.current || descargando) return;
    setDescargando(true);
    try {
      const dataUrl = await toPng(areaRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 3, // alta resolución
        style: {
          borderRadius: '0',
          margin: '0',
        }
      });
      
      const link = document.createElement('a');
      link.download = `comprobante-${pedido.id.replace(/[^0-9]/g, '')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generando PNG:', err);
      alert('No se pudo generar el comprobante. Intenta en otro dispositivo o navegador.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">

      {/* ── ÁREA DE IMPRESIÓN ── capturada por html2canvas ── */}
      <div
        ref={areaRef}
        data-boleta
        className="bg-white text-black p-8 font-mono text-sm relative border-t-8 border-black"
      >
        {/* CABECERA */}
        <div className="text-center border-b-2 border-dashed border-black/10 pb-6 mb-6">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">GOLDEN CHOCLO</h2>
          <p className="text-[10px] uppercase font-black tracking-[0.2em]">Patagonia • Puerto Aysén</p>
          <p className="text-[8px] mt-1 opacity-60 italic">Comprobante de Compra</p>
        </div>

        {/* META */}
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

        {/* DETALLE — cada producto en su propia línea */}
        <div className="border-b-2 border-dashed border-black/10 pb-4 mb-4">
          <p className="font-black mb-3 text-[9px] uppercase tracking-widest border-b border-black/5 w-fit">
            Detalle:
          </p>
          <div className="flex justify-between text-[11px] gap-3">
            <span className="uppercase font-bold tracking-tight whitespace-pre-line leading-relaxed flex-1">
              {pedido.items}
            </span>
            <span className="font-black italic shrink-0">
              ${pedido.total.toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        {/* AJUSTES */}
        <div className="space-y-2 mb-6 border-b-2 border-dashed border-black/10 pb-4 text-[10px]">
          {(pedido.descuento ?? 0) > 0 && (
            <div>
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
          {(pedido.delivery ?? 0) > 0 && (
            <div className="flex justify-between font-black italic">
              <span>COSTO DELIVERY:</span>
              <span>+${pedido.delivery?.toLocaleString('es-CL')}</span>
            </div>
          )}
        </div>

        {/* TOTAL */}
        <div className="text-right mb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic mb-1">
            Total a Cobrar
          </p>
          <p className="text-4xl font-black italic tracking-tighter leading-none">
            ${totalFinal.toLocaleString('es-CL')}
          </p>
        </div>

        {/* PIE */}
        <div className="text-center space-y-3">
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black italic uppercase tracking-widest">¡Disfruta tu Choclo!</p>
            <div className="w-12 h-1 bg-black/10 rounded-full mt-2" />
          </div>
          <p className="text-[7px] opacity-40 uppercase tracking-[0.3em] font-black">
            Giro: Comidas Rápidas • Puerto Aysén
          </p>
        </div>
      </div>

      {/* ── BOTÓN — fuera del área capturada ── */}
      <div className="mt-4">
        <button
          onClick={handleDownloadPNG}
          disabled={descargando}
          className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {descargando
            ? <><Loader2 size={14} className="animate-spin" /> Generando...</>
            : <><Download size={14} /> Guardar PNG</>
          }
        </button>
      </div>

    </div>
  );
}