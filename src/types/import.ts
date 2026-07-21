export type IngredientStatus = "stable" | "low" | "critical";

export interface ImportItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  quantity?: number;
  unit?: string;
  supplier?: string;
  importDate?: string;
  product?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: IngredientStatus;
  imageUrl?: string;
}

export interface CreateImportPayload {
  name: string;
  price: number;
  description?: string;
  category: string;
  quantity?: number;
  unit?: string;
  supplier?: string;
  importDate?: string;
  product?: string;
}
