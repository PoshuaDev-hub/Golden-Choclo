"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { 
  User, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Save,
  Trash2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GcProduct, generateNextFolio } from '@/lib/gc-data';

type CartItem = { id: string; nombre: string; precio: number; cantidad: number };

export default function VentaManualPage() {
  const [cliente, setCliente] = useState({ nombre: '', tel: '', ig: '', dir: '', tipo: 'Retiro', metodoPago: 'transferencia' });
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<CartItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error: loadError } = await supabase
        .from('gc_products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const mapped = ((data ?? []) as GcProduct[]).map((p) => ({
        id: p.id,
        nombre: p.name,
        precio: Array.isArray(p.variants) && p.variants.length > 0
            ? ((p.variants[0] as { price?: number }).price ?? 0)
            : 0,
        cantidad: 1,
      }));
      setProductosDisponibles(mapped);
    };
    void loadProducts();
  }, []);

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );

  const actualizarCantidad = (id: string, delta: number) => {
    setCarrito(carrito.map(item => 
      item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
    ));
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const agregarAlCarrito = (prod: CartItem) => {
    const existe = carrito.find(item => item.id === prod.id);
    if (existe) {
      actualizarCantidad(prod.id, 1);
    } else {
      setCarrito([...carrito, { ...prod, cantidad: 1 }]);
    }
  };

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      setError('Agrega al menos un producto al carrito.');
      return;
    }

    if (!cliente.nombre.trim() || !cliente.tel.trim()) {
      const confirmar = confirm("ADVERTENCIA: ¿Seguro que quieres agregar un pedido sin información?");
      if (!confirmar) return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const folio = await generateNextFolio(supabase);
      const deliveryType = cliente.tipo === 'Delivery' ? 'delivery' : 'retiro';
      const payloadItems = carrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      }));

      const { error: insertError } = await supabase.from('gc_orders').insert({
        folio,
        source: 'manual',
        client_name: cliente.nombre || 'Cliente Manual',
        client_phone: cliente.tel || null,
        client_address: cliente.dir || null,
        items: payloadItems,
        delivery_type: deliveryType,
        total,
        status: 'pendiente',
        payment_method: cliente.metodoPago,
        note: cliente.ig ? `IG: ${cliente.ig}` : null,
      });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      setMessage('Venta registrada correctamente.');
      setCliente({ nombre: '', tel: '', ig: '', dir: '', tipo: 'Retiro', metodoPago: 'transferencia' });
      setCarrito([]);
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error al generar folio: ' + (err as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans text-center">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. HEADER */}
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-6 flex items-center justify-center -mt-4 md:-mt-8">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">Venta</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">Manual</span>
          </div>
        </header>

        <div className="flex justify-center mb-8">
           <p className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-[0.5em] font-black italic leading-none">
             Registro manual • Golden Choclo
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-center gap-3 mb-2 px-2">
                <User size={16} className="text-golden-main opacity-90" />
                <h3 className="text-[10px] font-black uppercase italic tracking-[0.3em] text-zinc-500">Datos del Cliente</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Inputs con opacidad 50% y placeholders centrados */}
                <input 
                  type="text" placeholder="NOMBRE COMPLETO" 
                  value={cliente.nombre}
                  onChange={(e) => setCliente((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 text-center font-black text-white/50 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-700"
                />
                <input 
                  type="text" placeholder="TELÉFONO (+56 9...)" 
                  value={cliente.tel}
                  onChange={(e) => setCliente((prev) => ({ ...prev, tel: e.target.value }))}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 text-center font-black text-white/50 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-700"
                />
                <input 
                  type="text" placeholder="INSTAGRAM (OPCIONAL)" 
                  value={cliente.ig}
                  onChange={(e) => setCliente((prev) => ({ ...prev, ig: e.target.value }))}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 text-center font-black text-white/50 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-700"
                />
                
                {/* SELECT CENTRADO Y CORREGIDO PARA MOBILE */}
                <div className="relative">
                  <select
                    value={cliente.tipo}
                    onChange={(e) => setCliente((prev) => ({ ...prev, tipo: e.target.value }))}
                    className="w-full bg-black/80 border border-white/10 rounded-2xl p-4 text-center font-black italic uppercase outline-none text-golden-main cursor-pointer appearance-none"
                    style={{ textAlignLast: 'center' }}
                  >
                    <option className="bg-zinc-900" value="Retiro">RETIRO EN LOCAL</option>
                    <option className="bg-zinc-900" value="Delivery">DELIVERY</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                    <Plus size={10} className="rotate-45" /> 
                  </div>
                </div>

                {/* SELECT MÉTODO DE PAGO */}
                <div className="relative">
                  <select
                    value={cliente.metodoPago}
                    onChange={(e) => setCliente((prev) => ({ ...prev, metodoPago: e.target.value }))}
                    className="w-full bg-black/80 border border-white/10 rounded-2xl p-4 text-center font-black italic uppercase outline-none text-golden-main cursor-pointer appearance-none"
                    style={{ textAlignLast: 'center' }}
                  >
                    <option className="bg-zinc-900" value="transferencia">TRANSFERENCIA</option>
                    <option className="bg-zinc-900" value="efectivo">EFECTIVO</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                    <Plus size={10} className="rotate-45" /> 
                  </div>
                </div>

                <input 
                  type="text" placeholder="DIRECCIÓN DE DESPACHO" 
                  value={cliente.dir}
                  onChange={(e) => setCliente((prev) => ({ ...prev, dir: e.target.value }))}
                  className="md:col-span-2 w-full bg-black/50 border border-white/5 rounded-2xl py-4 text-center font-black text-white/50 focus:text-white focus:border-golden-main/40 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
            </section>

            <div className="px-2">
              <h3 className="text-[10px] font-black uppercase italic tracking-[0.3em] text-zinc-600 mb-4">Catálogo Rápido</h3>
            </div>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {productosDisponibles.map(prod => (
                <button 
                  key={prod.id}
                  onClick={() => agregarAlCarrito(prod)}
                  className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group hover:border-golden-main/30 transition-all active:scale-95"
                >
                  <div className="text-left">
                    <p className="font-heading text-xl font-black uppercase italic tracking-tighter leading-none group-hover:text-golden-main transition-colors">
                      {prod.nombre}
                    </p>
                    <p className="text-golden-main font-black text-xs mt-2 italic">${prod.precio.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-zinc-700 group-hover:text-golden-main group-hover:bg-golden-main/10 transition-all">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                </button>
              ))}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-golden-main text-black rounded-[2.8rem] p-8 sticky top-24 shadow-2xl shadow-golden-main/10 border border-black/5">
              <div className="flex items-center justify-center gap-3 mb-8 border-b border-black/10 pb-6">
                <ShoppingCart size={20} strokeWidth={3} />
                <h3 className="font-heading text-xl font-black uppercase italic tracking-tighter">Resumen</h3>
              </div>

              <div className="space-y-4 mb-10 min-h-[100px]">
                {carrito.length === 0 && (
                  <p className="text-[10px] font-black uppercase text-center opacity-40 py-4 italic tracking-widest text-center">Carrito vacío</p>
                )}
                {carrito.map(item => (
                  <div key={item.id} className="bg-black/5 p-4 rounded-2xl border border-black/5 flex items-center gap-4">
                    <button 
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-black/30 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex-1 text-left">
                      <p className="font-black uppercase italic text-[11px] leading-none mb-1">{item.nombre}</p>
                      <p className="text-[9px] font-bold opacity-60 tracking-widest">${item.precio.toLocaleString('es-CL')}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-black/10 rounded-xl p-1.5">
                      <button onClick={() => actualizarCantidad(item.id, -1)} className="hover:scale-125 transition-transform"><Minus size={12} strokeWidth={3}/></button>
                      <span className="font-black text-xs min-w-[20px] text-center">{item.cantidad}</span>
                      <button onClick={() => actualizarCantidad(item.id, 1)} className="hover:scale-125 transition-transform"><Plus size={12} strokeWidth={3}/></button>
                    </div>
                  </div>
                ))}
              </div>

              {error && <p className="text-red-700 font-black text-[9px] uppercase text-center mb-4 bg-red-700/10 p-2 rounded-lg italic tracking-widest">{error}</p>}
              {message && <p className="text-green-800 font-black text-[9px] uppercase text-center mb-4 bg-green-800/10 p-2 rounded-lg italic tracking-widest">{message}</p>}

              <div className="border-t-2 border-dashed border-black/20 pt-6 mb-8">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 italic mb-1">Total Neto</p>
                  <p className="text-4xl font-black italic tracking-tighter leading-none">${total.toLocaleString('es-CL')}</p>
              </div>

              <button
                onClick={() => void registrarVenta()}
                disabled={saving}
                className="w-full bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all active:scale-95 shadow-xl text-[11px] uppercase italic tracking-widest disabled:opacity-50"
              >
                <Save size={18} strokeWidth={3} />
                {saving ? 'GUARDANDO...' : 'REGISTRAR VENTA'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center opacity-20">
           <p className="text-[7px] uppercase tracking-[1.5em] font-black italic">PATAGONIA CORE • VENTA DIRECTA</p>
        </div>
      </div>
    </div>
  );
}