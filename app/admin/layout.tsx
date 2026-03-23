import NavAdmin from '@/components/ui/NavAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark-bg font-sans">
      <NavAdmin />
      <main className="flex-1 w-full lg:ml-0">
        {children}
      </main>
    </div>
  );
}