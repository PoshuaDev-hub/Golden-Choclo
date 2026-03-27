export type GcProduct = {
  id: string;
  name: string;
  description: string | null;
  variants: unknown;
  photo_url: string | null;
  available: boolean | null;
  created_at: string | null;
};

export type GcOrder = {
  id: string;
  folio: number | null;
  source: 'web' | 'manual' | null;
  client_name: string;
  client_phone: string | null;
  client_address: string | null;
  items: unknown;
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

type ItemShape = {
  nombre?: string;
  name?: string;
  cantidad?: number;
  quantity?: number;
};

export const toPedidoEstadoUi = (status: GcOrder['status']) => {
  if (status === 'listo') return 'listo';
  if (status === 'entregado') return 'entregado';
  return 'pendientes';
};

export const toPedidoTipoUi = (deliveryType: GcOrder['delivery_type']) =>
  deliveryType === 'delivery' ? 'Delivery' : 'Retiro';

export const formatOrderItems = (items: unknown): string => {
  if (!Array.isArray(items) || items.length === 0) return 'Sin items';
  return items
    .map((raw) => {
      const item = raw as ItemShape;
      const qty = item.cantidad ?? item.quantity ?? 1;
      const name = item.nombre ?? item.name ?? 'Item';
      return `${qty}x ${name}`;
    })
    .join(', ');
};

export const sumOrderItems = (items: unknown): number => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((acc, raw) => {
    const item = raw as { precio?: number; price?: number; cantidad?: number; quantity?: number };
    const qty = item.cantidad ?? item.quantity ?? 1;
    const price = item.precio ?? item.price ?? 0;
    return acc + qty * price;
  }, 0);
};

export const orderCreatedTime = (createdAt: string | null): string => {
  if (!createdAt) return '--:--';
  return new Date(createdAt).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const generateNextFolio = async (supabase: any): Promise<number> => {
  const { data, error } = await supabase
    .from('gc_orders')
    .select('folio')
    .order('folio', { ascending: false })
    .limit(1);

  if (error) throw error;
  const lastFolio = data?.[0]?.folio ?? 0;
  return lastFolio + 1;
};
