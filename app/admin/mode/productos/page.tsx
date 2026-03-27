"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Package, Plus, Edit2, Trash2, X, Save, Image as ImageIcon, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GcProduct } from '@/lib/gc-data';

export default function ProductosPage() {
  const [productos, setProductos] = useState<GcProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Partial<GcProduct> | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('gc_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (loadError) setError(loadError.message);
    else setProductos((data ?? []) as GcProduct[]);
    setLoading(false);
  };

  useEffect(() => { void loadProducts(); }, []);

  const getPrice = (variants: any): number => {
    if (Array.isArray(variants) && variants.length > 0) return variants[0].price ?? 0;
    return 0;
  };

  const getFormat = (variants: any): string => {
    if (Array.isArray(variants) && variants.length > 0) return variants[0].name ?? 'Individual';
    return 'Individual';
  };

  const handleOpenModal = (prod?: GcProduct) => {
    if (prod) {
      setEditingProduct(prod);
    } else {
      setEditingProduct({ 
        name: '', 
        description: '', 
        variants: [{ name: 'Individual', price: 0 }], 
        available: true 
      });
    }
    setIsModalOpen(true);
  };

  const saveProduct = async () => {
    if (!editingProduct?.name || getPrice(editingProduct.variants) <= 0) {
      alert("Por favor rellena el nombre y un precio válido");
      return;
    }

    setLoading(true);
    const isNew = !editingProduct.id;
    
    const { error: saveError } = isNew 
      ? await supabase.from('gc_products').insert([editingProduct])
      : await supabase.from('gc_products').update(editingProduct).eq('id', editingProduct.id);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSaveSuccess(true);
      await loadProducts();
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
        setEditingProduct(null);
      }, 1500);
    }
    setLoading(false);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    const { error: delError } = await supabase.from('gc_products').delete().eq('id', productToDelete);
    if (!delError) {
      setProductos(prev => prev.filter(p => p.id !== productToDelete));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gc_img/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gc_images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('gc_images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl && editingProduct) {
      setEditingProduct({ ...editingProduct, photo_url: imageUrl });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-6 flex items-center justify-center -mt-4">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">Productos</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">CHOCLO</span>
          </div>
        </header>

        {/* GESTIÓN Y BOTÓN CENTRAL */}
        <div className="flex flex-col items-center justify-center mb-10 gap-6">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.5em] font-black italic text-center">Gestión de inventario • Patagonia</p>
          <button 
            onClick={() => handleOpenModal()}
            className="group flex items-center gap-3 px-8 py-3.5 bg-golden-main text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic hover:scale-105 active:scale-95 transition-all shadow-xl shadow-golden-main/10"
          >
            <Plus size={16} strokeWidth={3} /> Nuevo Producto
          </button>
        </div>

        {/* LISTA */}
        <div className="space-y-4">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-zinc-900/20 border border-white/5 p-5 rounded-[2.2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-golden-main/20 transition-all duration-500">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`p-4 rounded-2xl border ${prod.available ? 'bg-golden-main/10 text-golden-main border-golden-main/20' : 'bg-zinc-900 text-zinc-700 border-white/5 opacity-40'}`}>
                  <Package size={22} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-xl font-black text-white uppercase italic tracking-tighter leading-none">{prod.name}</p>
                    <span className="text-[7px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-500 font-black uppercase tracking-widest">{getFormat(prod.variants)}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight italic mt-2 opacity-70">{prod.description}</p>
                  <p className="text-lg font-black text-golden-main italic mt-1">${getPrice(prod.variants).toLocaleString('es-CL')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                <button 
                  onClick={() => void toggleStock(prod.id, prod.available)}
                  className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all border ${prod.available ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                >
                  {prod.available ? 'Disponible' : 'Agotado'}
                </button>
                <button onClick={() => handleOpenModal(prod)} className="p-3 bg-zinc-900 text-zinc-500 rounded-xl hover:text-white transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => { setProductToDelete(prod.id); setIsDeleteModalOpen(true); }} className="p-3 bg-zinc-900 text-zinc-500 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL CONFIGURAR PRODUCTO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[2.8rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-golden-main" />
              
              {!saveSuccess ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xs font-black uppercase italic tracking-widest text-golden-main">Configurar Producto</h4>
                    <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
                  </div>

                  <div className="space-y-4">
                    {/* NOMBRE - Opacidad 50% */}
                    <input 
                      type="text" placeholder="NOMBRE DEL PRODUCTO"
                      value={editingProduct?.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 text-center font-black text-white/50 focus:text-white focus:border-golden-main/40 outline-none transition-all uppercase text-xs"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      {/* PRECIO - Opacidad 50% */}
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-golden-main/30 group-focus-within:text-golden-main font-black transition-colors">$</span>
                        <input 
                          type="number" placeholder="PRECIO"
                          value={getPrice(editingProduct?.variants) || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, variants: [{...editingProduct?.variants?.[0], price: Number(e.target.value), name: getFormat(editingProduct?.variants)}]})}
                          className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 text-center font-black text-white/50 focus:text-white focus:border-golden-main/40 outline-none transition-all text-xs"
                        />
                      </div>

                      {/* FORMATO - Estilo Sólido */}
                      <select 
                        value={getFormat(editingProduct?.variants)}
                        onChange={(e) => setEditingProduct({...editingProduct, variants: [{...editingProduct?.variants?.[0], name: e.target.value, price: getPrice(editingProduct?.variants)}]})}
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 text-center font-black text-golden-main focus:border-golden-main outline-none text-[10px] uppercase appearance-none cursor-pointer"
                        style={{ textAlignLast: 'center' }}
                      >
                        <option value="Individual">Individual</option>
                        <option value="Promo Duo">Promo Duo</option>
                        <option value="Familiar">Familiar</option>
                        <option value="Degustación">Degustación</option>
                      </select>
                    </div>

                    {/* DESCRIPCIÓN - Opacidad 50% */}
                    <textarea 
                      placeholder="DESCRIPCIÓN BREVE"
                      value={editingProduct?.description ?? ''}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-5 text-center font-bold text-zinc-500 focus:text-zinc-300 focus:border-golden-main/40 outline-none transition-all italic uppercase text-[10px] h-24 resize-none"
                    />
                    
                    {/* CARGA DE IMAGEN */}
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                    {editingProduct?.photo_url && (
                      <div className="w-full h-32 bg-black/50 border border-white/5 rounded-2xl overflow-hidden mb-4">
                        <img src={editingProduct.photo_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-zinc-800/30 border border-dashed border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase italic text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                    >
                      <Upload size={16} /> {editingProduct?.photo_url ? 'Cambiar Imagen' : 'Subir desde Galería / PC'}
                    </button>

                    <button 
                      onClick={saveProduct} disabled={loading}
                      className="w-full bg-golden-main text-black py-5 rounded-2xl font-black text-[10px] uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-white active:scale-95 transition-all shadow-xl"
                    >
                      <Save size={16} strokeWidth={3} />
                      {loading ? 'Procesando...' : 'Guardar en Catálogo'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h4 className="text-sm font-black uppercase italic tracking-[0.2em] text-center text-white">Catálogo Actualizado</h4>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase mt-2 italic tracking-widest">Operación Exitosa</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALERTA ELIMINAR */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-red-500/20 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle size={32} />
              </div>
              <h4 className="text-sm font-black uppercase italic tracking-widest text-white mb-2">¿Estás seguro?</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mb-8 leading-relaxed">
                Esta acción eliminará el producto de forma permanente.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-zinc-900 text-zinc-500 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest">Cancelar</button>
                <button onClick={deleteProduct} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">Eliminar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}