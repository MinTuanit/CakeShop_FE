import apiClient from "@/src/services/apiClient";
import type {
  CreateVnpayPaymentPayload,
  CreateVnpayPaymentResponse,
  VnpayCallbackResponse,
} from "@/src/types/payment";

export function createVnpayPaymentUrl(payload: CreateVnpayPaymentPayload) {
  return apiClient.post<CreateVnpayPaymentResponse>(
    "/payments/vnpay/create-url",
    payload,
    { withCredentials: true },
  );
}

export function confirmVnpayReturn(queryString: string) {
  return apiClient.get<VnpayCallbackResponse>(
    `/payments/vnpay/return${queryString}`,
    { withCredentials: true },
  );
}
