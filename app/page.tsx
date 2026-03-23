import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Logo Central */}
      <div className="mb-8 animate-fade-in">
        <div className="w-32 h-32 bg-dark-card rounded-full flex items-center justify-center border border-golden-main/30 shadow-[0_0_50px_rgba(252,163,17,0.1)]">
          <span className="text-golden-main font-heading text-4xl font-black italic">GC</span>
        </div>
      </div>

      <h1 className="font-heading text-4xl md:text-6xl text-soft-gray mb-4 font-bold italic tracking-tighter">
        GOLDEN <span className="text-golden-main">COCHO</span>
      </h1>
      
      <p className="font-sans text-zinc-500 mb-12 max-w-xs">
        Gestión operativa premium para el mejor pastel de choclo de Aysén.
      </p>

      {/* Botón de Acceso Admin */}
      <Link 
        href="/admin/login" 
        className="group relative bg-golden-main text-black font-heading font-black px-12 py-4 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-golden-main/20"
      >
        <span className="relative z-10">INGRESAR COMO ADMIN</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </Link>

      <footer className="fixed bottom-8 text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
        Región de Aysén • Chile 
      </footer>
    </main>
  );
}