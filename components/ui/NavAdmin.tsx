"use client";
import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  PlusCircle,
  Receipt // ✅ IMPORTANTE: Añadimos Receipt aquí
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function NavAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const handleLogout = () => {
    localStorage.removeItem('gc_admin');
    setIsOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Botón Hamburguesa Móvil */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-golden-main text-black rounded-xl active:scale-90 transition-transform shadow-lg shadow-golden-main/10"
      >
        <Menu size={22} />
      </button>

      {/* Sidebar con Scroll Independiente */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen lg:overflow-y-auto scrollbar-hide
      `}>
        <div className="flex flex-col min-h-full p-6">
          {/* Header del Nav */}
          <div className="flex justify-between items-center mb-10 px-2 flex-shrink-0">
            <h2 className="font-heading font-black italic text-xl tracking-tighter uppercase leading-none">
              GOLDEN <br /> <span className="text-golden-main">CHOCLO</span>
            </h2>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500">
              <X size={24} />
            </button>
          </div>

          {/* Grupo 1: GESTIÓN OPERATIVA */}
          <div className="mb-4 flex-shrink-0">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4 px-4 opacity-50 italic">Operaciones</p>
            <nav className="space-y-1">
              <NavLink href="/admin" icon={<LayoutDashboard size={20}/>} label="Resumen" active={pathname === '/admin'} onClick={() => setIsOpen(false)} />
              
              <NavLink href="/admin/mode/pedidos" icon={<ShoppingCart size={20}/>} label="Pedidos" active={pathname === '/admin/mode/pedidos'} onClick={() => setIsOpen(false)} /> 
              
              <NavLink href="/admin/mode/venta-manual" icon={<PlusCircle size={20}/>} label="Venta Manual" active={pathname === '/admin/mode/venta-manual'} onClick={() => setIsOpen(false)} />
              
              <NavLink href="/admin/mode/productos" icon={<Package size={20}/>} label="Productos" active={pathname === '/admin/mode/productos'} onClick={() => setIsOpen(false)} />
              
              {/* ✅ OPCIÓN: Comprobantes con icono Receipt */}
              <NavLink href="/admin/mode/comprobante" icon={<Receipt size={20}/>} label="Comprobantes" active={pathname === '/admin/mode/comprobante'} onClick={() => setIsOpen(false)} />
              
              <NavLink href="/admin/mode/finanzas" icon={<DollarSign size={20}/>} label="Finanzas" active={pathname === '/admin/mode/finanzas'} onClick={() => setIsOpen(false)} />
            </nav>
          </div>

          <div className="h-px bg-white/5 w-full my-4 flex-shrink-0" />

          {/* Grupo 2: CONFIGURACIÓN */}
          <div className="flex-1 overflow-y-auto">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4 px-4 opacity-50 italic">Ajustes</p>
            <NavLink href="/admin/mode/configuracion" icon={<Settings size={20}/>} label="Configuración" active={pathname === '/admin/mode/configuracion'} onClick={() => setIsOpen(false)} />
          </div>

          {/* Grupo 3: SALIDA */}
          <div className="mt-auto pt-6 border-t border-white/5 flex-shrink-0">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm tracking-tight italic">Cerrar Sesión</span>
            </button>
            <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.4em] text-center mt-6 italic opacity-50">
              Aysén • Patagonia
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay Móvil */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" />
      )}
    </>
  );
}

function NavLink({ href, icon, label, onClick, active }: { href: string, icon: any, label: string, onClick: () => void, active: boolean }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
        active 
        ? 'bg-golden-main/10 text-golden-main shadow-[inset_0_0_10px_rgba(252,163,17,0.05)] border border-golden-main/10' 
        : 'text-zinc-400 hover:bg-white/5 hover:text-golden-main'
      }`}
    >
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
}