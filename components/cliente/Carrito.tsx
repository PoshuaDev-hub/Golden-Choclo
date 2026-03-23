"use client";
import { ShoppingBag } from 'lucide-react';

export default function Carrito({ total, cantidad }: { total: number, cantidad: number }) {
  if (cantidad === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce-in">
      <button className="bg-golden-main text-black p-5 rounded-3xl shadow-[0_10px_30px_rgba(252,163,17,0.4)] flex items-center gap-4 group transition-transform active:scale-90">
        <div className="relative">
          <ShoppingBag size={24} />
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-golden-main">
            {cantidad}
          </span>
        </div>
        <div className="text-left leading-tight">
          <p className="text-[10px] font-black uppercase opacity-70 tracking-tighter">Tu Pedido</p>
          <p className="font-heading font-black text-lg">${total.toLocaleString()}</p>
        </div>
      </button>
    </div>
  );
}