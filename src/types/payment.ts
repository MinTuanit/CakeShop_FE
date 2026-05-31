export type PaymentStatus = "pending" | "success" | "failed";

export interface CreateVnpayPaymentPayload {
  orderId: string;
  bankCode?: string;
  locale?: "vn" | "en";
}

export interface CreateVnpayPaymentResponse {
  paymentUrl: string;
  paymentId: string;
  orderId: string;
  txnRef: string;
  amount: number;
  status: PaymentStatus;
  expiresAt: string;
}

export interface VnpayCallbackResponse {
  success: boolean;
  code: string;
  message: string;
  orderId?: string;
  txnRef?: string;
  amount?: number;
  responseCode?: string;
  transactionStatus?: string;
}
