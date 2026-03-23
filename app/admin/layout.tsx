"use client";
import { usePathname } from 'next/navigation';
import NavAdmin from '@/components/ui/NavAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Si la ruta es el login, no mostramos el NavAdmin
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <NavAdmin />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}