import apiClient from "@/src/services/apiClient";
import type {
  CreateOrderFromCartPayload,
  CreateOrderPayload,
  Order,
} from "@/src/types/order";

export function createOrder(payload: CreateOrderPayload) {
  return apiClient.post<Order>("/orders", payload, { withCredentials: true });
}

export function createOrderFromCart(payload: CreateOrderFromCartPayload) {
  return apiClient.post<Order>("/orders/from-cart", payload, {
    withCredentials: true,
  });
}

export function getMyOrders() {
  return apiClient.get<Order[]>("/orders", { withCredentials: true });
}

export function getMyOrder(orderId: string) {
  return apiClient.get<Order>(`/orders/${orderId}`, { withCredentials: true });
}
