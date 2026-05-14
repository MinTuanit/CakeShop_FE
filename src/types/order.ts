export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  status: OrderStatus;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  customerName: string;
  phone: string;
  deliveryAddress: string;
  note?: string;
}

export interface CreateOrderFromCartPayload {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  note?: string;
}
