"use client";
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function FormularioPedido({ items }: { items: any[] }) {
  const [nombre, setNombre] = useState('');
  const [entrega, setEntrega] = useState('retiro'); // retiro o delivery [cite: 71]

  const enviarWhatsApp = () => {
    const telefonoNegocio = "569XXXXXXXX"; // Tu número configurado [cite: 52]
    const detalle = items.map(i => `${i.cant}x ${i.nombre}`).join(', ');
    const mensaje = `Hola! Soy ${nombre}, quiero pedir: ${detalle}. Método: ${entrega}.`;
    
    window.open(`https://wa.me/${telefonoNegocio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="bg-dark-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
      <h3 className="font-heading text-xl font-bold italic text-golden-main uppercase">Datos de Entrega</h3>
      
      <div className="space-y-4 font-sans">
        <input 
          type="text" 
          placeholder="¿A nombre de quién?" 
          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white focus:border-golden-main transition-all outline-none"
          onChange={(e) => setNombre(e.target.value)}
        />
        
        <div className="flex gap-2 p-1 bg-black rounded-2xl border border-white/5">
          <button 
            onClick={() => setEntrega('retiro')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${entrega === 'retiro' ? 'bg-golden-main text-black' : 'text-zinc-500'}`}
          >Retiro</button>
          <button 
            onClick={() => setEntrega('delivery')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${entrega === 'delivery' ? 'bg-golden-main text-black' : 'text-zinc-500'}`}
          >Delivery</button>
        </div>
      </div>

      <button 
        onClick={enviarWhatsApp}
        className="w-full bg-green-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
      >
        <Send size={20} /> ENVIAR PEDIDO POR WHATSAPP
      </button>
    </div>
  );
}