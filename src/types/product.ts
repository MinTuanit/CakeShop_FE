export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  flavor?: string;
  size?: string;
  imageUrl?: string;
  images?: string[];
  mainIngredients?: string[];
  stock?: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
