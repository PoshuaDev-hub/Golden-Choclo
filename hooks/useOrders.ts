import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { GcOrder } from '@/lib/gc-data';

/**
 * Hook reutilizable para obtener los pedidos del mes actual y el anterior.
 * Devuelve además la función `refresh` para recargar manualmente.
 */
export function useOrders() {
  const [orders, setOrders] = useState<GcOrder[]>([]);
  const [lastMonthOrders, setLastMonthOrders] = useState<GcOrder[]>([]);
  const [lastFolio, setLastFolio] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const firstDayLast = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

    const [currentRes, prevRes, lastFolioRes] = await Promise.all([
      supabase
        .from('gc_orders')
        .select('*')
        .gte('created_at', firstDayCurrent)
        .order('created_at', { ascending: false }),
      supabase
        .from('gc_orders')
        .select('*')
        .gte('created_at', firstDayLast)
        .lt('created_at', firstDayCurrent),
      supabase
        .from('gc_orders')
        .select('folio')
        .order('folio', { ascending: false })
        .limit(1),
    ]);

    if (currentRes.error) {
      setError(currentRes.error.message);
    } else {
      setOrders((currentRes.data ?? []) as GcOrder[]);
    }
    // Los errores en mes anterior no bloquean la carga principal
    if (!prevRes.error) {
      setLastMonthOrders((prevRes.data ?? []) as GcOrder[]);
    }
    setLastFolio(lastFolioRes.data?.[0]?.folio ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { orders, lastMonthOrders, lastFolio, loading, error, refresh: load };
}
