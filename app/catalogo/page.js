import Banner from '@/components/cliente/Banner';
import Catalogo from '@/components/cliente/Catalogo';
import Carrito from '@/components/cliente/Carrito';

export default function PaginaCatalogo() {
  // Por ahora definimos valores fijos para que el componente no de error
  const isOpen = true; 
  const totalEjemplo = 0;
  const cantidadEjemplo = 0;

  return (
    <main className="min-h-screen bg-dark-bg text-white pb-20">
      {/* Pasamos la prop isOpen al Banner */}
      <Banner isOpen={isOpen} /> 
      
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-heading text-4xl font-black italic mb-8 text-center tracking-tighter">
          NUESTRO <span className="text-golden-main">MENÚ</span>
        </h1>
        <Catalogo />
      </div>

      {/* Pasamos total y cantidad al Carrito para evitar el error de toLocaleString */}
      <Carrito total={totalEjemplo} cantidad={cantidadEjemplo} />
    </main>
  );
}