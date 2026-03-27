"use client";
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // Bloqueo de scroll y gestos táctiles de arrastre
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; 
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, []);

  return (
    <main className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center antialiased overflow-hidden touch-none">
      {/* Luz de fondo dinámica */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-golden-main/5 blur-[120px] rounded-full opacity-40" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-sm w-full animate-fade-in">
        
        {/* === CONTENEDOR DEL LOGO === */}
        <div className="mb-8 group perspective-1000">
          <div className="w-28 h-28 bg-[#14213D]/40 backdrop-blur-xl rounded-[2.2rem] flex items-center justify-center border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-105 group-hover:border-golden-main/40 group-hover:rotate-1 overflow-hidden p-0 relative">
            <div className="relative w-full h-full">
              <Image 
                src="/logo.png" 
                alt="Golden Cocho Logo" 
                fill 
                className="object-cover"
                priority 
              />
            </div>
          </div>
        </div>
        
        {/* Título y Subtítulos */}
        <div className="space-y-1 mb-10 relative">
          <h1 className="font-heading text-4xl md:text-5xl text-white font-black italic tracking-tighter uppercase leading-none">
            GOLDEN <span className="text-golden-main drop-shadow-[0_0_10px_rgba(252,163,17,0.2)]">Choclo</span>
          </h1>
          <p className="font-sans text-zinc-500 text-[9px] uppercase tracking-[0.4em] font-black opacity-70">
            • Gestión operativa premium •
          </p>
          <p className="font-sans text-zinc-500 text-[9px] uppercase tracking-[0.4em] font-black opacity-70">
            Aysén, Chile
          </p>
        </div>

        {/* Botón de Acceso */}
        <Link 
          href="/admin/login" 
          className="group relative w-full md:w-auto bg-golden-main text-black font-heading font-black px-10 py-4 rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-[0_15px_30px_-8px_rgba(252,163,17,0.3)]"
        >
          <div className="relative z-10 flex items-center justify-center">
            <span className="text-[11px] italic uppercase tracking-wider">Ingresar al Panel</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-8 flex flex-col items-center gap-2">
        <p className="text-[8px] text-zinc-700 uppercase tracking-[0.5em] font-bold">
          Región de Aysén <span className="text-zinc-900 mx-1">/</span> Patagonia
        </p>
      </footer>
    </main>
  );
}