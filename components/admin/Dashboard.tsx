import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-dark-bg min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header con estilo Wise */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-syne text-soft-gray">Estadísticas</h1>
            <p className="text-zinc-500">Resumen operativo de Golden Cocho</p>
          </div>
          <button className="bg-golden-main text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-all">
            Nueva Venta
          </button>
        </header>

        {/* Layout Bento Box (Imagen 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta Grande: Ganancia (Color Golden) */}
          <div className="md:col-span-1 bg-golden-main p-8 rounded-3xl text-black flex flex-col justify-between h-64">
            <div className="flex justify-between">
              <span className="font-bold uppercase text-xs">Utilidad Real</span>
              <DollarSign size={20} />
            </div>
            <div>
              <h2 className="text-5xl font-black italic">$450k</h2>
              <p className="text-sm opacity-80">+12% desde la última semana</p>
            </div>
          </div>

          {/* Tarjeta: ROI / Inversión */}
          <div className="bg-dark-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start text-zinc-400">
              <TrendingUp size={24} />
              <span className="text-[10px] border border-zinc-700 px-2 py-1 rounded-full">DETALLES</span>
            </div>
            <div>
              <p className="text-4xl font-bold">283%</p>
              <p className="text-zinc-500 text-xs">Retorno de Inversión</p>
            </div>
          </div>

          {/* Tarjeta: Pedidos Pendientes */}
          <div className="bg-soft-gray p-8 rounded-3xl text-black flex flex-col justify-between">
            <div className="flex justify-between font-bold">
              <span>Pedidos</span>
              <Package />
            </div>
            <h2 className="text-6xl font-black">08</h2>
            <p className="text-xs font-medium">PENDIENTES DE ENTREGA</p>
          </div>

          {/* Fila Inferior: Historial de Ventas (Ancho completo) */}
          <div className="md:col-span-3 bg-dark-card/50 p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {/* Ejemplo de item de lista estilo premium */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-2xl transition-all border-b border-white/5 last:border-0">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-golden-main/10 flex items-center justify-center text-golden-main font-bold">J</div>
                    <div>
                      <p className="font-bold text-sm">Cliente Local #{i}</p>
                      <p className="text-xs text-zinc-500 italic">Retiro en persona</p>
                    </div>
                  </div>
                  <p className="font-black text-golden-main">+$15.500</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}