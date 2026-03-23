"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (clave === 'floki') {
        localStorage.setItem('gc_admin', 'true');
        router.push('/admin');
      } else {
        setError('Clave incorrecta. Inténtalo de nuevo.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 antialiased overflow-hidden pb-24">
      {/* Luz de fondo dinámica sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-golden-main/5 blur-[120px] rounded-full opacity-40" />
      </div>

      <div className="w-full max-w-[340px] z-10 flex flex-col items-center animate-fade-in">
        {/* === LOGO ESTILO APP === */}
        <div className="flex flex-col items-center mb-8 group">
          <div className="w-24 h-24 bg-[#14213D]/40 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl transition-all duration-700 group-hover:scale-105 overflow-hidden p-0 relative mb-4">
            <Image 
              src="/logo.png" 
              alt="Golden Cocho Logo" 
              fill 
              className="object-cover"
              priority 
            />
          </div>
          <h1 className="font-heading text-2xl font-black italic text-white tracking-tighter uppercase">
            ADMIN <span className="text-golden-main">LOGIN</span>
          </h1>
          <p className="font-sans text-zinc-600 text-[8px] uppercase tracking-[0.4em] mt-1 font-bold">
            Gestión Operativa • Aysén
          </p>
        </div>

        {/* Card de Login Compacta */}
        <div className="w-full bg-dark-card/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 block">
                Contraseña de Acceso
              </label>
              <div className="relative group">
              <input
                type="password"
                placeholder="••••••••"
                // Eliminamos md:text-sm y dejamos text-base fijo para engañar al navegador
                // Ajustamos el p-3 para que se vea compacto aunque la letra sea de 16px
                className="w-full bg-black/40 border border-white/10 p-3 pr-10 rounded-xl text-white text-base outline-none focus:border-golden-main/40 focus:ring-1 focus:ring-golden-main/10 transition-all font-sans"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoFocus
                required
              />
                <Lock 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-golden-main transition-colors" 
                  size={16} 
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 p-3 rounded-xl text-red-500 text-[10px] font-bold animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-golden-main disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-heading font-black py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-golden-main/5 text-xs tracking-wide"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "INGRESAR AL PANEL"
              )}
            </button>
          </form>
        </div>

        {/* Footer Ajustado (Más pequeño y discreto) */}
        <footer className="fixed bottom-6 flex flex-col items-center gap-1 opacity-50">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.6em] font-bold text-center">
            Personal Autorizado <span className="text-zinc-800 mx-1">•</span> Patagonia Chilena
          </p>
        </footer>
      </div>
    </main>
  );
}