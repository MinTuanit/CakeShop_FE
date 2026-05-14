import apiClient from "@/src/services/apiClient";
import type { Cart } from "@/src/types/cart";

export function getMyCart() {
  return apiClient.get<Cart>("/cart", { withCredentials: true });
}

export function addCartItem(productId: string, quantity = 1) {
  return apiClient.post<Cart>(
    "/cart/items",
    { productId, quantity },
    { withCredentials: true },
  );
}

export function updateCartItem(productId: string, quantity: number) {
  return apiClient.patch<Cart>(
    `/cart/items/${productId}`,
    { quantity },
    { withCredentials: true },
  );
}

export function removeCartItem(productId: string) {
  return apiClient.delete<Cart>(`/cart/items/${productId}`, {
    withCredentials: true,
  });
}

export function clearCart() {
  return apiClient.delete<Cart>("/cart", { withCredentials: true });
}
