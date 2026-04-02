import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { GcProduct } from '@/lib/gc-data';

/**
 * Hook reutilizable para obtener la lista de productos del catálogo.
 * @param onlyAvailable - Si es `true` (por defecto), solo retorna productos disponibles.
 */
export function useProducts(onlyAvailable = false) {
  const [products, setProducts] = useState<GcProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('gc_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (onlyAvailable) {
      query = query.eq('available', true);
    }

    const { data, error: loadError } = await query;

    if (loadError) {
      setError(loadError.message);
    } else {
      setProducts((data ?? []) as GcProduct[]);
    }
    setLoading(false);
  }, [onlyAvailable]);

  useEffect(() => { void load(); }, [load]);

  return { products, loading, error, refresh: load };
}
