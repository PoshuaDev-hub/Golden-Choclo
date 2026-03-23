"use client";
export default function Banner({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`w-full py-3 px-4 text-center transition-colors duration-500 sticky top-0 z-50 shadow-lg ${
      isOpen ? 'bg-green-600 text-white' : 'bg-red-900/80 text-zinc-300 backdrop-blur-md'
    }`}>
      <p className="font-heading text-xs md:text-sm font-black italic tracking-widest uppercase">
        {isOpen 
          ? "🟢 ¡Estamos tomando reservas para este finde! Haz tu pedido aquí." 
          : "🔴 Preparando algo rico. Volvemos pronto — síguenos en @GoldenChoclo"} 
      </p>
    </div>
  );
}