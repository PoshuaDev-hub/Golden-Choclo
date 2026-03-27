"use client";
import React, { useEffect, useState } from 'react';
import { Plus, ShoppingBag, Star, Clock, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { GcProduct } from '@/lib/gc-data';

export default function CatalogoCliente() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [horario, setHorario] = useState('Cargando...');
  const [closingMessage, setClosingMessage] = useState('Estamos preparando la mejor cosecha.');
  const [productos, setProductos] = useState<GcProduct[]>([]);
  const [popularIds, setPopularIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // 1. Consultar Configuración (Estado y Horario)
      const { data: settings } = await supabase.from('gc_settings').select('key, value');
      
      const openVal = settings?.find(s => s.key === 'is_open')?.value;
      const horarioVal = settings?.find(s => s.key === 'business_hours')?.value;
      const messageVal = settings?.find(s => s.key === 'closing_message')?.value;
      const whatsappVal = settings?.find(s => s.key === 'whatsapp_number')?.value;
      const instagramVal = settings?.find(s => s.key === 'instagram')?.value;
      
      setIsOpen(openVal === 'true');
      setHorario(horarioVal || 'Lunes a Sábado: 12:00 - 20:00');
      setClosingMessage(messageVal || 'Estamos preparando la mejor cosecha.');
      setWhatsapp(whatsappVal || '');
      setInstagram(instagramVal || '');

      // 2. Consultar Productos
      const { data: prods } = await supabase
        .from('gc_products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      // 3. Lógica Automática de "Populares" (Basado en historial real)
      const { data: popularData } = await supabase.from('gc_orders').select('items');
      const counts: Record<string, number> = {};
      
      popularData?.forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            counts[item.id] = (counts[item.id] || 0) + (item.cantidad || 1);
          });
        }
      });
      
      const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 2);
      setPopularIds(sortedIds);
      setProductos((prods ?? []) as GcProduct[]);
      setLoading(false);
    };

    void fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-golden-main/20 border-t-golden-main rounded-full animate-spin" />
    </div>
  );

  if (!isOpen) return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8 text-7xl animate-bounce">🌽</div>
      <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase mb-4 leading-none">
        LOCAL <span className="text-golden-main">CERRADO</span>
      </h1>
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] max-w-xs italic mb-8">
        {closingMessage} <br /> Revisa nuestro horario de atención abajo.
      </p>
      <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 px-6 py-3 rounded-full opacity-60">
        <Clock size={14} className="text-golden-main" />
        <span className="text-[9px] font-black uppercase italic">{horario}</span>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white pb-40 antialiased font-sans">
      
      <div className="max-w-5xl mx-auto px-5 pt-12">
        
        {/* HEADER REDISEÑADO - OPTIMIZADO PARA MOBILE */}
        <header className="text-center mb-16 relative">
          <div className="inline-block mb-6">
            <span className="text-golden-main text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.4em] italic border border-golden-main/20">
              Patagonia
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] flex flex-col items-center">
            <span className="text-white opacity-40 text-xl md:text-4xl mb-1">MENÚ</span>
            <span className="tracking-tight text-center">
              GOLDEN <span className="text-golden-main">CHOCLO</span>
            </span>
          </h1>
        </header>

        {/* LINKS SOCIALES */}
        {(whatsapp || instagram) && (
          <div className="flex justify-center gap-4 mb-12">
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-green-400 hover:bg-green-500 hover:text-white transition-all"
              >
                <span className="text-sm">💬</span>
                <span className="text-xs font-black uppercase">WhatsApp</span>
              </a>
            )}
            {instagram && (
              <a 
                href={`https://instagram.com/${instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full text-pink-400 hover:bg-pink-500 hover:text-white transition-all"
              >
                <span className="text-sm">📷</span>
                <span className="text-xs font-black uppercase">Instagram</span>
              </a>
            )}
          </div>
        )}

        {/* LISTA DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {productos.map((prod) => (
            <div 
              key={prod.id} 
              className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-7 md:p-10 flex flex-col justify-between hover:border-golden-main/20 transition-all duration-500 shadow-2xl"
            >
              {popularIds.includes(prod.id) && (
                <div className="absolute top-6 right-6 bg-golden-main text-black text-[7px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  <Star size={9} fill="currentColor" /> El más vendido
                </div>
              )}

              <div className="mb-8 text-center md:text-left">
                <div className="w-14 h-14 bg-black rounded-2xl border border-white/5 flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:scale-105 transition-transform duration-500">
                   <ShoppingBag size={24} className="text-zinc-800 group-hover:text-golden-main/50" />
                </div>

                <h3 className="font-heading text-2xl md:text-4xl font-black uppercase italic tracking-tight mb-3 leading-none group-hover:text-golden-main transition-colors">
                  {prod.name}
                </h3>
                
                <p className="text-zinc-500 text-[11px] md:text-sm leading-relaxed italic font-medium opacity-80 line-clamp-3">
                  {prod.description}
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white italic tracking-tighter">
                      ${(prod.variants as any)?.[0]?.price?.toLocaleString('es-CL')}
                    </span>
                    <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">CLP</span>
                  </div>
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md italic">
                    {(prod.variants as any)?.[0]?.name}
                  </span>
                </div>

                <button 
                  onClick={() => router.push('/cliente/mode/formulario')}
                  className="w-full bg-golden-main text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-golden-main/5"
                >
                  <Plus size={18} strokeWidth={4} />
                  <span className="text-[9px] tracking-[0.2em] uppercase italic">Comprar ahora</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER INFO */}
        <footer className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
          <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="w-10 h-10 rounded-full bg-golden-main/10 flex items-center justify-center text-golden-main shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-white mb-1 italic">Horario de Atención</p>
              <p className="text-[10px] font-bold text-zinc-500 italic uppercase">{horario}</p>
            </div>
          </div>

          <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] flex items-center gap-5">
            <div className="w-10 h-10 rounded-full bg-golden-main/10 flex items-center justify-center text-golden-main shrink-0">
              <Info size={18} />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-white mb-1 italic">Despacho Patagonia</p>
              <p className="text-[10px] font-bold text-zinc-500 italic uppercase">Repartos en todo el radio urbano de Aysén.</p>
            </div>
          </div>
        </footer>

      </div>

      <div className="mt-16 text-center pb-8 opacity-10">
        <p className="text-[6px] text-white font-black uppercase tracking-[1.5em] italic">
          GOLDEN CHOCLO • ARTISAN PREMIUM
        </p>
      </div>
    </main>
  );
}