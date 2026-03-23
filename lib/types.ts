export type ProductVariant = {
  nombre: string
  precio: number
}

export type Product = {
  id: string
  name: string
  description: string
  variants: ProductVariant[]
  photo_url: string | null
  available: boolean
  created_at: string
}

export type OrderItem = {
  product_id: string
  product_name: string
  variant: string
  precio: number
  cantidad: number
}

export type OrderStatus = 'pendiente' | 'confirmado' | 'listo' | 'entregado'
export type DeliveryType = 'retiro' | 'delivery'
export type PaymentMethod = 'transferencia' | 'efectivo'
export type OrderSource = 'web' | 'manual'

export type Order = {
  id: string
  folio: number
  source: OrderSource
  client_name: string
  client_phone: string
  client_address: string | null
  items: OrderItem[]
  delivery_type: DeliveryType
  shipping_cost: number
  discount: number
  discount_reason: string | null
  total: number
  status: OrderStatus
  payment_method: PaymentMethod
  note: string | null
  created_at: string
}

export type TransactionType = 'income' | 'expense'
export type ExpenseCategory = 'Insumos' | 'Envases' | 'Transporte' | 'Otro'

export type Transaction = {
  id: string
  type: TransactionType
  category: string
  concept: string
  amount: number
  date: string
  note: string | null
  order_id: string | null
  created_at: string
}

export type Settings = {
  whatsapp_number: string
  business_name: string
  bank_info: string
  delivery_zone: string
  store_open: boolean
  shipping_cost: number
  instagram: string
}