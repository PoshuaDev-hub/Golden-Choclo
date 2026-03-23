"use client";
import { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, DollarSign, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function NavAdmin() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Resumen', icon: <LayoutDashboard size={20}/>, href: '/admin' },
    { name: 'Pedidos', icon: <ShoppingCart size={20}/>, href: '/admin/pedidos' },
    { name: 'Productos', icon: <Package size={20}/>, href: '/admin/productos' },
    { name: 'Finanzas', icon: <DollarSign size={20}/>, href: '/admin/finanzas' },
    { name: 'Config', icon: <Settings size={20}/>, href: '/admin/config' },
  ];

  return (
    <>
      {/* Botón Hamburguesa para Móvil */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-golden-main text-black rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-heading font-black italic text-xl">GOLDEN <span className="text-golden-main">COCHO</span></h2>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-golden-main transition-all group"
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Aysén • Chile</p>
          </div>
        </div>
      </aside>

      {/* Overlay para cerrar en móvil al tocar fuera */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
}