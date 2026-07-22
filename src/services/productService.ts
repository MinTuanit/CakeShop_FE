import apiClient from "@/src/services/apiClient";
import type { Product, CreateProductPayload, UpdateProductPayload } from "@/src/types/product";

export function getProducts(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  return apiClient.get<Product[]>("/products", { params });
}

export function getProduct(id: string) {
  return apiClient.get<Product>(`/products/${id}`);
}

export function createProduct(payload: CreateProductPayload) {
  return apiClient.post<Product>("/products", payload);
}

export function updateProduct(id: string, payload: UpdateProductPayload) {
  return apiClient.patch<Product>(`/products/${id}`, payload);
}

export function deleteProduct(id: string) {
  return apiClient.delete<{ message: string }>(`/products/${id}`);
}
