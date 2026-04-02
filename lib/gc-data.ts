import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =============================================
// TIPOS BASE — GOLDEN CHOCLO
// Mapeados directamente contra el esquema de Supabase.
// =============================================

/** Variante de un producto (formato + precio). */
export type ProductVariant = {
  name: string;
  price: number;
};

/** Representa un producto del catálogo en la tabla `gc_products`. */
export type GcProduct = {
  id: string;
  name: string;
  description: string | null;
  variants: ProductVariant[] | null;
  photo_url: string | null;
  available: boolean | null;
  created_at: string | null;
};

/** Representa un pedido completo de la tabla `gc_orders`. */
export type GcOrder = {
  id: string;
  folio: number | null;
  source: 'web' | 'manual' | null;
  client_name: string;
  client_phone: string | null;
  client_address: string | null;
  items: OrderItem[] | unknown;
  delivery_type: 'retiro' | 'delivery' | null;
  shipping_cost: number | null;
  discount: number | null;
  discount_reason: string | null;
  total: number;
  status: 'pendiente' | 'confirmado' | 'listo' | 'entregado' | null;
  payment_method: 'transferencia' | 'efectivo' | null;
  note: string | null;
  created_at: string | null;
};

/** Representa un ítem dentro de un pedido (serializado como JSON en Supabase). */
export type OrderItem = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

/** Representa un movimiento financiero de la tabla `gc_transactions`. */
export type GcTransaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  concept: string;
  amount: number;
  date: string | null;
  note: string | null;
  order_id: string | null;
  created_at: string | null;
};

// =============================================
// HELPERS INTERNOS
// =============================================

/**
 * Forma flexible de un ítem de pedido al leerlo desde Supabase
 * (puede venir con keys en español o inglés según la fuente del pedido).
 */
type ItemShape = {
  nombre?: string;
  name?: string;
  cantidad?: number;
  quantity?: number;
  precio?: number;
  price?: number;
};

// =============================================
// FUNCIONES DE CONVERSIÓN UI
// =============================================

/**
 * Convierte el status de la BD a uno de los 3 grupos de la UI de pedidos.
 * @param status - Estado raw de Supabase.
 */
export const toPedidoEstadoUi = (status: GcOrder['status']): 'pendientes' | 'listo' | 'entregado' => {
  if (status === 'listo') return 'listo';
  if (status === 'entregado') return 'entregado';
  return 'pendientes';
};

/**
 * Convierte el tipo de entrega de la BD a una etiqueta legible para la UI.
 * @param deliveryType - Tipo raw de Supabase.
 */
export const toPedidoTipoUi = (deliveryType: GcOrder['delivery_type']): 'Delivery' | 'Retiro' =>
  deliveryType === 'delivery' ? 'Delivery' : 'Retiro';

// =============================================
// FUNCIONES DE FORMATEO
// =============================================

/**
 * Convierte el array de items de un pedido en una cadena legible.
 * Soporta campos tanto en español (nombre/cantidad) como en inglés (name/quantity).
 * @param items - Array de items o valor desconocido desde Supabase.
 */
export const formatOrderItems = (items: unknown): string => {
  if (!Array.isArray(items) || items.length === 0) return 'Sin items';
  return items
    .map((raw) => {
      const item = raw as ItemShape;
      const qty = item.cantidad ?? item.quantity ?? 1;
      const name = item.nombre ?? item.name ?? 'Item';
      return `${qty}x ${name}`;
    })
    .join('\n');
};

/**
 * Suma el total de un pedido basado en (precio × cantidad) por item.
 * Soporta campos tanto en español como en inglés.
 * @param items - Array de items o valor desconocido desde Supabase.
 */
export const sumOrderItems = (items: unknown): number => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((acc, raw) => {
    const item = raw as ItemShape;
    const qty = item.cantidad ?? item.quantity ?? 1;
    const price = item.precio ?? item.price ?? 0;
    return acc + qty * price;
  }, 0);
};

/**
 * Formatea una fecha ISO a hora legible en formato HH:MM (24h, zona Chile).
 * @param createdAt - String de fecha ISO o null.
 */
export const orderCreatedTime = (createdAt: string | null): string => {
  if (!createdAt) return '--:--';
  return new Date(createdAt).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Obtiene el siguiente número de folio correlativo consultando el último en la BD.
 * @param supabase - Instancia del cliente Supabase.
 */
export const generateNextFolio = async (supabase: SupabaseClient): Promise<number> => {
  const { data, error } = await supabase
    .from('gc_orders')
    .select('folio')
    .order('folio', { ascending: false })
    .limit(1);

  if (error) throw error;
  const lastFolio = data?.[0]?.folio ?? 0;
  return lastFolio + 1;
};

/**
 * Formatea un número de folio al formato de visualización estándar: #00000001
 * @param folio - Número o string del folio, acepta null/undefined.
 */
export const formatFolio = (folio: number | string | null | undefined): string => {
  if (!folio) return '#00000000';
  return `#${folio.toString().replace('#', '').padStart(8, '0')}`;
};

// =============================================
// ALIAS — Para compatibilidad con imports existentes
// =============================================
export type { SupabaseClient };
