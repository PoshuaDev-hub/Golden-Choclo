"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { 
  User, Truck, ShoppingBag, Plus, Minus, ArrowRight,
  ChevronLeft, AlertCircle, CreditCard, Banknote, MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type CartItem = { id: string; nombre: string; precio: number; cantidad: number };

export default function FormularioPedido() {
  const router = useRouter();
  
  const [cliente, setCliente] = useState({ 
    nombre: '', tel: '', ig: '', dir: '', 
    tipo: 'Retiro', metodoPago: 'transferencia' 
  });
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<CartItem[]>([]);
  const [deliveryCost, setDeliveryCost] = useState(2000); // Dinámico desde la BD
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [closingMessage, setClosingMessage] = useState('Estamos preparando la mejor cosecha.');
  const [bankInfo, setBankInfo] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderFolio, setOrderFolio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: prods }, { data: settings }] = await Promise.all([
        supabase.from('gc_products').select('*').eq('available', true),
        supabase.from('gc_settings').select('key, value')
      ]);

      // Cargar productos
      const mapped = (prods ?? []).map((p: any) => ({
        id: p.id,
        nombre: p.name,
        precio: p.variants?.[0]?.price ?? 0,
        cantidad: 0
      }));
      setProductosDisponibles(mapped);

      // Cargar configuraciones
      const costSetting = settings?.find(s => s.key === 'delivery_cost')?.value;
      const openSetting = settings?.find(s => s.key === 'is_open')?.value;
      const messageSetting = settings?.find(s => s.key === 'closing_message')?.value;
      const bankSetting = settings?.find(s => s.key === 'bank_info')?.value;
      
      if (costSetting) setDeliveryCost(Number(costSetting));
      setIsOpen(openSetting === 'true');
      setClosingMessage(messageSetting || 'Estamos preparando la mejor cosecha.');
      setBankInfo(bankSetting || '');

      setLoading(false);
    };
    void fetchData();
  }, []);

  const toggleProduct = (prod: CartItem, delta: number) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) {
        const nuevaCant = existe.cantidad + delta;
        if (nuevaCant <= 0) return prev.filter(item => item.id !== prod.id);
        return prev.map(item => item.id === prod.id ? { ...item, cantidad: nuevaCant } : item);
      }
      if (delta > 0) return [...prev, { ...prod, cantidad: 1 }];
      return prev;
    });
  };

  const totalPedido = useMemo(() => {
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    return cliente.tipo === 'Delivery' ? subtotal + deliveryCost : subtotal;
  }, [carrito, cliente.tipo, deliveryCost]);

  const enviarPedido = async () => {
    if (!cliente.nombre || !cliente.tel || (cliente.tipo === 'Delivery' && !cliente.dir)) {
      alert("Por favor, completa los campos marcados como obligatorios.");
      return;
    }
    if (carrito.length === 0) {
      alert("Tu orden debe tener al menos un producto.");
      return;
    }

    setSaving(true);
    try {
      const folio = await generateNextFolio(supabase);
      const { error } = await supabase.from('gc_orders').insert({
        folio,
        client_name: cliente.nombre,
        client_phone: cliente.tel,
        client_address: cliente.tipo === 'Delivery' ? cliente.dir : 'Retiro en Local',
        items: carrito,
        total: totalPedido,
        delivery_type: cliente.tipo.toLowerCase(),
        payment_method: cliente.metodoPago,
        status: 'pendiente',
        source: 'web',
        note: cliente.ig ? `Instagram: ${cliente.ig}` : ''
      });

      if (!error) {
        setOrderFolio(`#${folio.toString().padStart(8, '0')}`);
        setShowConfirmation(true);
      } else {
        alert("Hubo un problema al procesar tu pedido.");
      }
    } catch (err) {
      alert("Error al generar folio: " + (err as Error).message);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-golden-main border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (!isOpen) return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8 text-7xl animate-bounce">🌽</div>
      <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase mb-4 leading-none">
        LOCAL <span className="text-golden-main">CERRADO</span>
      </h1>
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] max-w-xs italic mb-8">
        {closingMessage}
      </p>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-20 font-sans antialiased">
      <div className="max-w-xl mx-auto">
        
        {/* VOLVER AL MENÚ - MÁS GRANDE */}
        <button onClick={() => router.back()} className="flex items-center gap-3 text-zinc-500 mb-10 hover:text-white transition-all group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform"/>
          <span className="text-[12px] font-black uppercase tracking-[0.2em] italic">Volver al Menú</span>
        </button>

        {/* HEADER - TÍTULO MÁS CHICO */}
        <header className="mb-14 border-l-2 border-golden-main pl-5">
          <h1 className="font-heading text-3xl font-black italic tracking-tighter uppercase leading-none">
            TU <span className="text-golden-main">ORDEN</span>
          </h1>
          <p className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mt-2 font-bold italic">Completa los pasos para finalizar</p>
        </header>

        {/* 1. QUIÉN RECIBE */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6 px-1">
            <User size={14} className="text-golden-main" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">1. Datos Personales</h3>
          </div>
          <div className="space-y-3">
            <div className="relative">
               <p className="absolute -top-2 left-5 bg-black px-2 text-[6px] font-black text-zinc-700 uppercase tracking-widest">Nombre del cliente</p>
               <input type="text" placeholder="EJ: JUAN PÉREZ" onChange={(e) => setCliente({...cliente, nombre: e.target.value})} className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl py-5 text-center font-black text-white/60 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-800 uppercase text-xs" />
            </div>
            <div className="relative">
               <p className="absolute -top-2 left-5 bg-black px-2 text-[6px] font-black text-zinc-700 uppercase tracking-widest">Número de contacto</p>
               <input type="tel" placeholder="EJ: +56 9 1234 5678" onChange={(e) => setCliente({...cliente, tel: e.target.value})} className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl py-5 text-center font-black text-white/60 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-800 text-xs" />
            </div>
            <div className="relative">
               <p className="absolute -top-2 left-5 bg-black px-2 text-[6px] font-black text-zinc-700 uppercase tracking-widest">Red Social (Opcional)</p>
               <input type="text" placeholder="@USUARIO" onChange={(e) => setCliente({...cliente, ig: e.target.value})} className="w-full bg-zinc-900/10 border border-white/5 rounded-2xl py-4 text-center font-black text-white/30 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-900 uppercase text-[9px]" />
            </div>
          </div>
        </section>

        {/* 2. CÓMO ENTREGAMOS - BOTONES MENOS ALTOS */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6 px-1">
            <Truck size={14} className="text-golden-main" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">2. Método de Entrega</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['Retiro', 'Delivery'].map((t) => (
              <button key={t} onClick={() => setCliente({...cliente, tipo: t})} className={`py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest italic border transition-all ${cliente.tipo === t ? 'bg-white text-black border-white shadow-lg' : 'bg-zinc-900/40 border-white/5 text-zinc-600'}`}>
                {t === 'Retiro' ? 'Retiro Local' : 'Delivery'}
              </button>
            ))}
          </div>
          {cliente.tipo === 'Delivery' && (
            <div className="animate-in slide-in-from-top-4 duration-500 pt-2">
              <input type="text" placeholder="INGRESA TU DIRECCIÓN EXACTA" onChange={(e) => setCliente({...cliente, dir: e.target.value})} className="w-full bg-black border border-golden-main/20 rounded-2xl py-5 text-center font-black text-white outline-none text-xs uppercase transition-all focus:border-golden-main" />
              <div className="mt-3 flex items-center gap-2 justify-center text-golden-main/60">
                <AlertCircle size={10} />
                <p className="text-[7px] font-black uppercase italic tracking-[0.2em]">Recargo por despacho: ${deliveryCost.toLocaleString('es-CL')}</p>
              </div>
            </div>
          )}
        </section>

        {/* 3. PAGO - BOTONES MÁS PEQUEÑOS */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6 px-1">
            <CreditCard size={14} className="text-golden-main" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">3. Forma de Pago</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setCliente({...cliente, metodoPago: 'transferencia'})} className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${cliente.metodoPago === 'transferencia' ? 'bg-golden-main border-golden-main text-black shadow-lg shadow-golden-main/10' : 'bg-zinc-900/40 border-white/5 text-zinc-600'}`}>
              <CreditCard size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest italic">Transferencia</span>
            </button>
            <button onClick={() => setCliente({...cliente, metodoPago: 'efectivo'})} className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${cliente.metodoPago === 'efectivo' ? 'bg-golden-main border-golden-main text-black shadow-lg shadow-golden-main/10' : 'bg-zinc-900/40 border-white/5 text-zinc-600'}`}>
              <Banknote size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest italic">Efectivo</span>
            </button>
          </div>
        </section>

        {/* 4. CARRITO */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 px-1">
            <ShoppingBag size={14} className="text-golden-main" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">4. Resumen y Cantidad</h3>
          </div>
          <div className="space-y-3">
            {productosDisponibles.map((prod) => {
              const item = carrito.find(i => i.id === prod.id);
              const cant = item ? item.cantidad : 0;
              return (
                <div key={prod.id} className="bg-zinc-900/20 border border-white/5 rounded-[2rem] p-5 flex items-center justify-between transition-all hover:bg-zinc-900/40">
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase italic text-white leading-none">{prod.nombre}</p>
                    <p className="text-[9px] font-bold text-zinc-600 mt-2 tracking-widest">${prod.precio.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-black/60 p-2 rounded-2xl border border-white/5">
                    <button onClick={() => toggleProduct(prod, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-white transition-all"><Minus size={12}/></button>
                    <span className="font-black text-sm min-w-[20px] text-center">{cant}</span>
                    <button onClick={() => toggleProduct(prod, 1)} className="w-8 h-8 rounded-lg bg-golden-main/10 flex items-center justify-center text-golden-main hover:bg-golden-main hover:text-black transition-all"><Plus size={12}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TOTAL Y CONFIRMAR */}
        <div className="mt-20 pt-10 border-t border-dashed border-zinc-800 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic mb-2">Total a pagar</p>
                <h2 className="text-5xl font-black italic tracking-tighter text-white">${totalPedido.toLocaleString('es-CL')}</h2>
                {cliente.tipo === 'Delivery' && <p className="text-[8px] font-black text-golden-main uppercase mt-2 italic tracking-widest">+ Recargo por despacho</p>}
            </div>

            <button 
              onClick={enviarPedido} 
              disabled={saving || carrito.length === 0} 
              className="w-full bg-golden-main text-black py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-golden-main/20 disabled:opacity-20 uppercase italic tracking-widest text-xs"
            >
              {saving ? 'Procesando...' : 'Confirmar Pedido'}
              <ArrowRight size={18} strokeWidth={3} />
            </button>
            <p className="text-[7px] text-zinc-800 uppercase font-black tracking-[0.3em] mt-8 italic">Golden Choclo • Artisan Tradition</p>
        </div>

      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/90 animate-in fade-in duration-300">
          <div className="bg-white text-black w-full max-w-sm rounded-sm p-8 shadow-2xl relative flex flex-col max-h-[85vh] font-mono border-t-[12px] border-golden-main">
            <div className="text-center mb-6">
              <h4 className="text-lg font-black uppercase tracking-tighter">¡Pedido Confirmado!</h4>
              <p className="text-[9px] font-bold text-zinc-500 uppercase">Golden Choclo</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <p className="text-sm font-black">Gracias por tu preferencia</p>
                <p className="text-xs">Tu número de pedido es:</p>
                <p className="text-2xl font-black text-golden-main">{orderFolio}</p>
              </div>
              
              {cliente.metodoPago === 'transferencia' && bankInfo && (
                <div className="border-t border-dashed border-zinc-300 pt-4">
                  <p className="text-xs font-bold mb-2">Datos para Transferencia:</p>
                  <div className="text-[10px] bg-zinc-100 p-3 rounded whitespace-pre-line">
                    {bankInfo}
                  </div>
                </div>
              )}
              
              <div className="border-t border-dashed border-zinc-300 pt-4 text-center">
                <p className="text-xs font-bold">Te contactaremos pronto para confirmar el estado de tu pedido.</p>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/cliente/mode/catalogo')}
              className="w-full bg-golden-main text-black py-3 rounded font-black text-sm uppercase"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      )}
    </main>
  );
} 