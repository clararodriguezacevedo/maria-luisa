export interface Product {
  id: string
  name: string
  quantity: number
  minQuantity: number
}

export interface DailyUsage {
  productId: string
  productName: string
  quantity: number
  date: string
  timestamp: any
  userEmail: string
}

export interface Purchase {
  productId: string
  productName: string
  quantity: number
  date: string
  timestamp?: any // Timestamp de Firebase
  userEmail?: string // Email de quien registró la compra
}

export interface PendingAction {
  type: "use" | "buy"
  items: Array<{
    productId: string
    productName: string
    quantity: number
  }>
  total: number
}

export interface NewProduct {
  name: string
  initialQuantity: number
  minQuantity: number
}

export type InventoryFilter = "all" | "out-of-stock" | "low-stock" | "normal-stock"

export interface DailyUsageGroup {
  date: string
  items: DailyUsage[]
  totalProducts: number
  totalQuantity: number
}

export interface PurchasesGroup {
    date: string
    items: Purchase[]
}