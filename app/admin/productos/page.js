import ProductosAdmin from '@/components/admin/Productos';

export default function ProductosPage() {
  return (
    <div className="p-6 md:p-10">
      <header className="mb-10">
        <h1 className="font-heading text-3xl font-black italic tracking-tighter">
          PRODUCTOS <span className="text-golden-main">GC</span>
        </h1>
      </header>
      
      <ProductosAdmin />
    </div>
  );
}