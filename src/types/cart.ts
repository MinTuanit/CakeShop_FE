export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock?: number;
  isAvailable: boolean;
}

export interface CartItem {
  product: CartProduct | null;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
