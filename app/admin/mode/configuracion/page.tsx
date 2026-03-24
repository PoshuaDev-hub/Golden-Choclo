"use client";
import React, { useState } from 'react';
import { 
  Store, 
  Clock, 
  Bell, 
  ShieldCheck, 
  Save,
  AlertCircle,
  Info,
  Power
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [mensajeCierre, setMensajeCierre] = useState("Esta semana no se atenderá el fin de semana por descanso del equipo.");
  
  // Estados para los horarios editables
  const [horarioSemana, setHorarioSemana] = useState("12:00 - 20:00");
  const [horarioFinde, setHorarioFinde] = useState("CERRADO");

  const handleSave = () => {
    // Aquí conectarás con Supabase en el futuro
    alert("¡Configuración de Golden Choclo actualizada!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-24 antialiased font-sans selection:bg-golden-main selection:text-black">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER DINÁMICO */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-heading text-4xl font-black italic tracking-tighter uppercase leading-none">
              CONFIG <span className="text-golden-main">GC</span>
            </h1>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2 italic">
              Panel de Control Central • Patagonia
            </p>
          </div>
          <button 
            onClick={handleSave}
            className="w-full md:w-auto bg-golden-main text-black px-8 py-4 rounded-[1.8rem] font-black shadow-xl shadow-golden-main/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-[11px] uppercase italic"
          >
            <Save size={20} strokeWidth={2.5} />
            Guardar Cambios
          </button>
        </header>

        <div className="space-y-6">
          
          {/* SECCIÓN 1: ESTADO OPERATIVO (INTERRUPTOR MAESTRO) */}
          <section className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-8 transition-all duration-500 group hover:border-golden-main/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`p-6 rounded-[2rem] transition-all duration-700 ${
                  isOpen 
                  ? 'bg-green-500 text-black shadow-[0_0_40px_rgba(34,197,94,0.2)]' 
                  : 'bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.2)]'
                }`}>
                  <Store size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                    Estado del Local
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-3 tracking-[0.2em] italic">
                    {isOpen ? 'Catálogo recibiendo pedidos' : 'Ventas pausadas temporalmente'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch Estilo Premium */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-24 h-12 rounded-full transition-all duration-500 p-1.5 ${
                  isOpen ? 'bg-green-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-9 h-9 bg-white rounded-full transition-transform duration-500 shadow-2xl ${
                  isOpen ? 'translate-x-12' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Cuadro de Mensaje para el Cliente (Aparece cuando se apaga el local) */}
            {!isOpen && (
              <div className="animate-in fade-in zoom-in-95 duration-500 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4 text-red-400">
                  <AlertCircle size={18} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Mensaje Público de Cierre</span>
                </div>
                <textarea 
                  value={mensajeCierre}
                  onChange={(e) => setMensajeCierre(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-sm font-bold text-zinc-300 focus:outline-none focus:border-red-500/40 transition-all italic leading-relaxed"
                  rows={3}
                />
                <p className="text-[8px] text-zinc-700 mt-4 uppercase font-black italic tracking-widest text-center">
                  Este mensaje se mostrará automáticamente en el banner de la App de Clientes.
                </p>
              </div>
            )}
          </section>

          {/* SECCIÓN 2: GRID BENTO DE AJUSTES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Horarios Editables */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2.8rem] p-8 group hover:border-golden-main/20 transition-all">
              <div className="flex items-center gap-4 mb-8 text-golden-main">
                <Clock size={22} strokeWidth={2.5} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] italic">Horarios</h4>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-3 ml-2">Lunes a Viernes</label>
                  <input 
                    type="text" 
                    value={horarioSemana}
                    onChange={(e) => setHorarioSemana(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs font-black italic focus:border-golden-main/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-3 ml-2">Fines de Semana</label>
                  <input 
                    type="text" 
                    value={horarioFinde}
                    onChange={(e) => setHorarioFinde(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs font-black italic focus:border-golden-main/30 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notificaciones y Sonido */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2.8rem] p-8 flex flex-col justify-between group hover:border-blue-500/20 transition-all">
              <div className="flex items-center gap-4 mb-6 text-blue-400">
                <Bell size={22} strokeWidth={2.5} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] italic">Sistema</h4>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5">
                  <span className="text-xs text-zinc-400 font-bold italic uppercase tracking-tighter">Sonido de Pedidos</span>
                  <div className="w-12 h-6 bg-golden-main rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-black rounded-full ml-auto shadow-md" />
                  </div>
                </div>
                
                <div className="p-5 border border-white/5 rounded-2xl bg-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Info size={16} className="text-zinc-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Info Smart</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 italic leading-relaxed">
                    Al cerrar el local, el botón de compra en la web se desactiva automáticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Seguridad de Acceso */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2.8rem] p-8 md:col-span-2 group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4 mb-8 text-zinc-500">
                <ShieldCheck size={22} strokeWidth={2.5} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] italic">Seguridad</h4>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic">
                  Cambiar Clave Admin
                </button>
                <button className="flex-1 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic text-red-500">
                  Cerrar todas las sesiones
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-16 text-center opacity-20">
           <p className="text-[8px] uppercase tracking-[1em] font-black italic">PATAGONIA CORE • V 2.0.1</p>
        </div>
      </div>
    </div>
  );
}