"use client";
import React, { useEffect, useState } from 'react';
import { 
  Store, 
  Clock, 
  ShieldCheck, 
  Save,
  Key,
  Truck,
  DollarSign,
  CheckCircle2,
  X,
  Share2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ConfiguracionPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [mensajeCierre, setMensajeCierre] = useState("");
  const [horarioSemana, setHorarioSemana] = useState("");
  const [horarioFinde, setHorarioFinde] = useState("");
  const [costoEnvio, setCostoEnvio] = useState("");
  const [datosBancarios, setDatosBancarios] = useState("");
  const [whatsappNumero, setWhatsappNumero] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  // Estados de UI
  const [showSecurityModel, setShowSecurityModel] = useState(false);
  const [savingSection, setSavingSection] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState('');
  const [claves, setClaves] = useState({ actual: '', maestra: '', nueva: '' });

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error: loadError } = await supabase.from('gc_settings').select('key,value');
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const map = new Map((data ?? []).map((item) => [item.key, item.value]));
      
      setIsOpen(map.get('is_open') !== 'false');
      setMensajeCierre(map.get('closing_message') ?? "Cerrado por descanso.");
      setHorarioSemana(map.get('weekday_hours') ?? "CERRADO");
      setHorarioFinde(map.get('weekend_hours') ?? "12:00 - 22:00");
      setCostoEnvio(map.get('delivery_cost') ?? "2000");
      setDatosBancarios(map.get('bank_info') ?? "");
      setWhatsappNumero(map.get('whatsapp_number') ?? "");
      setInstagramHandle(map.get('instagram') ?? "");
    };
    void loadSettings();
  }, []);

  const upsertSetting = async (key: string, value: string) =>
    supabase.from('gc_settings').upsert({ key, value }, { onConflict: 'key' });

  const handleSave = async (seccion: string) => {
    setSavingSection(seccion);
    setError('');
    
    let ops = [];
    switch (seccion) {
      case 'Horarios':
        ops = [
          upsertSetting('weekday_hours', horarioSemana),
          upsertSetting('weekend_hours', horarioFinde),
        ];
        break;
      case 'Logistica':
        ops = [upsertSetting('delivery_cost', costoEnvio)];
        break;
      case 'Transferencias':
        ops = [upsertSetting('bank_info', datosBancarios)];
        break;
      case 'Redes':
        ops = [
          upsertSetting('whatsapp_number', whatsappNumero),
          upsertSetting('instagram', instagramHandle),
        ];
        break;
      case 'Estado':
        ops = [upsertSetting('is_open', String(isOpen))];
        break;
      case 'Mensaje':
        ops = [upsertSetting('closing_message', mensajeCierre)];
        break;
      case 'Seguridad':
        ops = [upsertSetting('admin_password', claves.nueva)];
        break;
    }

    const results = await Promise.all(ops);
    const failed = results.find((r) => r.error);
    
    if (failed?.error) {
      setError(failed.error.message);
    } else {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2500);
      
      if (seccion === 'Seguridad') {
        setShowSecurityModel(false);
        setClaves({ actual: '', maestra: '', nueva: '' });
      }
    }
    setSavingSection('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans selection:bg-golden-main selection:text-black">
      <div className="max-w-xl mx-auto">
        
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-0 py-1 mb-6 flex items-center justify-center -mt-4 md:-mt-8">
          <div className="flex flex-col items-center justify-center leading-[0.7] text-center scale-[0.55] md:scale-[0.7]"> 
            <span className="font-heading text-lg font-black italic tracking-tighter uppercase text-white opacity-60">Configuración</span>
            <span className="font-heading text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-golden-main">CHOCLO</span>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center mb-8 gap-2">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.5em] font-black italic text-center uppercase">Gestión de Plataforma</p>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* SECCIÓN 1: ESTADO OPERATIVO */}
          <section className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${isOpen ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}>
                  <Store size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase italic tracking-tighter leading-none">Servicio</h3>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest italic mt-1.5">{isOpen ? 'En línea' : 'Pausado'}</p>
                </div>
              </div>

              {/* INTERRUPTOR REDISEÑADO */}
              <button 
                onClick={() => {
                  const next = !isOpen;
                  setIsOpen(next);
                  void upsertSetting('is_open', String(next));
                  setShowSuccessToast(true);
                  setTimeout(() => setShowSuccessToast(false), 2000);
                }}
                className={`group relative w-16 h-8 rounded-full transition-all duration-500 border-2 ${isOpen ? 'bg-green-500/10 border-green-500/50' : 'bg-zinc-900 border-white/10'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-500 shadow-sm ${isOpen ? 'translate-x-8 bg-green-500' : 'translate-x-0 bg-zinc-700'}`} />
              </button>
            </div>

            {!isOpen && (
              <div className="animate-in fade-in zoom-in-95 pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">Mensaje de Cierre</label>
                  <button 
                    onClick={() => handleSave('Mensaje')}
                    className="text-[8px] font-black text-golden-main uppercase tracking-widest border-b border-golden-main/30 hover:border-golden-main transition-all italic"
                  >
                    {savingSection === 'Mensaje' ? '...' : 'Actualizar'}
                  </button>
                </div>
                <textarea 
                  value={mensajeCierre}
                  onChange={(e) => setMensajeCierre(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-bold text-zinc-300 focus:outline-none focus:border-golden-main/30 transition-all italic placeholder:text-zinc-800"
                  rows={2}
                />
              </div>
            )}
          </section>

          {/* SECCIÓN 2: LOGÍSTICA */}
          <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between mb-6 px-1 text-left">
              <div className="flex items-center gap-3 text-orange-400">
                <Truck size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest italic text-white/40">Logística</h4>
              </div>
              <button onClick={() => handleSave('Logistica')} className="text-orange-400 hover:scale-110 active:scale-95 transition-all">
                <Save size={18} />
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-[7px] text-zinc-600 font-black uppercase tracking-widest text-center block italic">Valor de despacho</label>
              <div className="relative group max-w-[160px] mx-auto">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50 group-focus-within:text-orange-400 transition-colors" size={14} />
                <input 
                  type="number" 
                  value={costoEnvio}
                  onChange={(e) => setCostoEnvio(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 text-center font-black italic focus:border-orange-500/30 outline-none text-white transition-all text-xs"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: TRANSFERENCIAS */}
          <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between mb-6 px-1 text-left">
              <div className="flex items-center gap-3 text-purple-400">
                <Key size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest italic text-white/40">Transferencias</h4>
              </div>
              <button onClick={() => handleSave('Transferencias')} className="text-purple-400 hover:scale-110 active:scale-95 transition-all">
                <Save size={18} />
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-[7px] text-zinc-600 font-black uppercase tracking-widest text-center block italic">Datos bancarios para pagos</label>
              <textarea 
                value={datosBancarios}
                onChange={(e) => setDatosBancarios(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-bold text-zinc-300 focus:outline-none focus:border-purple-500/30 transition-all italic placeholder:text-zinc-800"
                rows={3}
                placeholder="Banco: Banco Estado&#10;Cuenta: 123456789&#10;Titular: Golden Choclo Ltda."
              />
            </div>
          </section>

          {/* SECCIÓN 5: REDES SOCIALES */}
          <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between mb-6 px-1 text-left">
              <div className="flex items-center gap-3 text-cyan-400">
                <Share2 size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest italic text-white/40">Redes Sociales</h4>
              </div>
              <button onClick={() => handleSave('Redes')} className="text-cyan-400 hover:scale-110 active:scale-95 transition-all">
                <Save size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={whatsappNumero}
                onChange={(e) => setWhatsappNumero(e.target.value)}
                placeholder="WhatsApp (ej. 569XXXXXXXX)"
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-3 text-[10px] font-black italic focus:border-cyan-500/30 outline-none text-center"
              />
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="Instagram @usuario"
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-3 text-[10px] font-black italic focus:border-cyan-500/30 outline-none text-center"
              />
            </div>
          </section>

          {/* SECCIÓN 4: HORARIOS */}
          <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between mb-6 px-1 text-left">
              <div className="flex items-center gap-3 text-golden-main/80">
                <Clock size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest italic text-white/40">Horarios</h4>
              </div>
              <button onClick={() => handleSave('Horarios')} className="text-golden-main hover:scale-110 active:scale-95 transition-all">
                <Save size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 text-left">
                <label className="text-[7px] text-zinc-600 font-black uppercase tracking-widest ml-1">Semana</label>
                <input 
                  type="text" 
                  value={horarioSemana}
                  onChange={(e) => setHorarioSemana(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-4 text-[9px] font-black italic focus:border-golden-main/30 outline-none text-center"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[7px] text-zinc-600 font-black uppercase tracking-widest ml-1">Finde</label>
                <input 
                  type="text" 
                  value={horarioFinde}
                  onChange={(e) => setHorarioFinde(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-4 text-[9px] font-black italic focus:border-golden-main/30 outline-none text-center"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: SEGURIDAD ADMIN */}
          <section className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6">
            <div className="flex items-center gap-3 mb-6 text-zinc-500 px-1 text-left">
              <ShieldCheck size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-widest italic text-white/40">Seguridad</h4>
            </div>
            
            {showSecurityModel ? (
              <div className="space-y-3 animate-in slide-in-from-top-2">
                <input 
                  type="password" placeholder="CLAVE ACTUAL" value={claves.actual}
                  onChange={(e) => setClaves({...claves, actual: e.target.value})}
                  className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-[9px] font-black tracking-widest focus:border-golden-main/40 outline-none opacity-50 focus:opacity-100 transition-all text-center uppercase" 
                />
                <input 
                  type="password" placeholder="CLAVE MAESTRA" value={claves.maestra}
                  onChange={(e) => setClaves({...claves, maestra: e.target.value})}
                  className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-[9px] font-black tracking-widest focus:border-golden-main/40 outline-none opacity-50 focus:opacity-100 transition-all text-center uppercase" 
                />
                <input 
                  type="password" placeholder="NUEVA CLAVE" value={claves.nueva}
                  onChange={(e) => setClaves({...claves, nueva: e.target.value})}
                  className="w-full bg-black border border-white/5 rounded-xl px-4 py-4 text-[9px] font-black tracking-widest focus:border-golden-main/40 outline-none opacity-50 focus:opacity-100 transition-all text-center uppercase" 
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowSecurityModel(false)} className="flex-1 py-3 text-[8px] font-black uppercase bg-zinc-800 rounded-xl">Cancelar</button>
                  <button onClick={() => handleSave('Seguridad')} className="flex-1 py-3 text-[8px] font-black uppercase bg-golden-main text-black rounded-xl italic">Confirmar</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowSecurityModel(true)}
                className="w-full bg-white/5 border border-white/5 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <Key size={12} /> Modificar Acceso
              </button>
            )}
          </section>

        </div>

        <div className="mt-12 text-center opacity-20">
          <p className="text-[7px] uppercase tracking-[1.5em] font-black italic text-zinc-500">
            {savingSection ? `Actualizando ${savingSection}...` : 'PATAGONIA CORE • V 2.6.0'}
          </p>
        </div>

        {/* BURBUJA DE ÉXITO REDISEÑADA (MÁS PEQUEÑA) */}
        {showSuccessToast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-golden-main text-black px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_10px_40px_rgba(255,200,0,0.2)] border border-black/10">
              <CheckCircle2 size={14} strokeWidth={3} />
              <span className="text-[8px] font-black uppercase italic tracking-widest">Guardado con éxito</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}