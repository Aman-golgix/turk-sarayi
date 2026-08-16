export type PriceType = "single" | "sizes" | "portions";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  priceType: PriceType;
  price?: number;
  sizes?: { label: string; price: number }[];
  portions?: { label: string; price: number }[];
  image: string;
  dietary?: ("veg" | "non-veg" | "spicy" | "weekend-special")[];
  note?: string;
}

export interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
  instructions?: string;
}

export interface CustomerSession {
  tableNumber: number;
  customerName: string;
  phone: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
  instructions?: string;
  lineTotal: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  customerName: string;
  phone: string;
  items: OrderItem[];
  orderInstructions?: string;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  createdAt: string;
}

export interface OrderSubmission {
  tableNumber: number;
  customerName: string;
  phone: string;
  items: CartItem[];
  orderInstructions?: string;
}
