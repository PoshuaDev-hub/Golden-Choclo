import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/** Forma tipada del mapa de configuraciones de la tabla `gc_settings`. */
export type SettingsMap = Record<string, string>;

/**
 * Hook reutilizable para obtener la configuración del negocio desde `gc_settings`.
 * Transforma el array de `{ key, value }` en un objeto clave-valor para acceso directo.
 */
export function useSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('gc_settings').select('key, value');
    if (loadError) {
      setError(loadError.message);
    } else {
      // Transformar array de registros en un objeto clave-valor
      const map = Object.fromEntries((data ?? []).map(row => [row.key, row.value]));
      setSettings(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { settings, loading, error, refresh: load };
}
