export interface Product {
  _id: string;
  code?: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  unit?: string;
  flavor?: string;
  size?: string;
  imageUrl?: string;
  images?: string[];
  mainIngredients?: string[];
  stock?: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  sku?: string;
}

export interface CreateProductPayload {
  code?: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  unit?: string;
  flavor?: string;
  size?: string;
  imageUrl?: string;
  images?: string[];
  mainIngredients?: string[];
  stock?: number;
  isAvailable?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

