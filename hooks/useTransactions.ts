import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { GcTransaction } from '@/lib/gc-data';

/**
 * Hook reutilizable para obtener los registros financieros de `gc_transactions`.
 * Por defecto devuelve todas las transacciones ordenadas de más reciente a más antigua.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<GcTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('gc_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (loadError) {
      setError(loadError.message);
    } else {
      setTransactions((data ?? []) as GcTransaction[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { transactions, loading, error, refresh: load };
}
