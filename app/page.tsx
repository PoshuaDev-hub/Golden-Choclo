"use client"; // Esto es necesario para usar botones y formularios en Next.js

import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Package, Plus, X } from 'lucide-react';

// Definimos cómo luce un Pedido para que TypeScript nos ayude
interface Pedido {
  id: number;
  cliente: string;
  producto: string;
  total: number;
  estado: string;
}

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 1, cliente: "Joshua (Tester)", producto: "Cocho XL", total: 15500, estado: "Entregado" }
  ]);
  const [showModal, setShowModal] = useState(false);

  // Función para agregar un pedido manual rápido
  const agregarPedidoManual = () => {
    const nuevo = {
      id: Date.now(),
      cliente: "Venta Local",
      producto: "Cocho Mediano",
      total: 8500,
      estado: "Pendiente"
    };
    setPedidos([...pedidos, nuevo]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-yellow-600/30 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500 tracking-tight">GOLDEN COCHO</h1>
          <p className="text-zinc-500 text-sm">Panel de Control Operativo</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus size={20} /> Nuevo Pedido Manual
        </button>
      </header>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<DollarSign/>} label="Ganancias" value={`$${pedidos.reduce((acc, p) => acc + p.total, 0)}`} color="text-yellow-500" />
        <StatCard icon={<ShoppingCart/>} label="Pedidos Totales" value={pedidos.length.toString()} color="text-blue-500" />
        <StatCard icon={<Package/>} label="Inversión" value="$45.000" color="text-red-500" />
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-zinc-800/30">
          <h2 className="text-xl font-semibold">Historial de Ventas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 text-zinc-500">#{pedido.id.toString().slice(-4)}</td>
                  <td className="p-4 font-medium">{pedido.cliente}</td>
                  <td className="p-4 text-zinc-300">{pedido.producto}</td>
                  <td className="p-4 text-yellow-500 font-bold">${pedido.total.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.estado === 'Entregado' ? 'bg-green-900/30 text-green-500' : 'bg-yellow-900/30 text-yellow-500'}`}>
                      {pedido.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Simple de Prueba */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-yellow-600/50 p-8 rounded-2xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">¿Registrar venta rápida?</h2>
            <p className="text-zinc-400 mb-6 text-sm">Esto agregará un "Cocho Mediano" de $8.500 al historial de hoy.</p>
            <div className="flex gap-4">
              <button onClick={agregarPedidoManual} className="flex-1 bg-yellow-600 text-black font-bold py-2 rounded-lg">Confirmar</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-zinc-800 text-white font-bold py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente pequeño para las tarjetas de stats
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-zinc-800 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black">{value}</h3>
        </div>
      </div>
    </div>
  );
}