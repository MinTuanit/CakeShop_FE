"use client";

import axios from "axios";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/src/components/Footer";
import { confirmVnpayReturn } from "@/src/services/paymentService";
import type { VnpayCallbackResponse } from "@/src/types/payment";
import { formatCurrency } from "@/src/utils/products";

type ResultState = "loading" | "success" | "failed";

function apiMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (message) {
      return message;
    }
  }

  return fallback;
}

function VnpayReturnContent() {
  const searchParams = useSearchParams();
  const queryString = useMemo(() => searchParams.toString(), [searchParams]);
  const [state, setState] = useState<ResultState>("loading");
  const [message, setMessage] = useState("Đang xác nhận thanh toán VNPay...");
  const [result, setResult] = useState<VnpayCallbackResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    async function confirmPayment() {
      if (!queryString) {
        setState("failed");
        setMessage("Thiếu dữ liệu trả về từ VNPay.");
        return;
      }

      setState("loading");
      setMessage("Đang xác nhận thanh toán VNPay...");

      try {
        const response = await confirmVnpayReturn(`?${queryString}`);

        if (!mounted) {
          return;
        }

        setResult(response.data);
        setState(response.data.success ? "success" : "failed");
        setMessage(
          response.data.success
            ? "Thanh toán VNPay thành công."
            : "Thanh toán VNPay chưa hoàn tất.",
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState("failed");
        setMessage(apiMessage(error, "Không thể xác nhận thanh toán VNPay."));
      }
    }

    void confirmPayment();

    return () => {
      mounted = false;
    };
  }, [queryString]);

  const isSuccess = state === "success";
  const accentClass = isSuccess ? "text-[#2f7560]" : "text-[#b4235d]";
  const badgeClass = isSuccess
    ? "bg-[#eef7f1] text-[#2f7560]"
    : "bg-[#fff0f5] text-[#b4235d]";

  return (
    <main className="min-h-screen bg-[#fbf5f1] text-[#4f342f]">
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl items-center px-5 py-14">
        <div className="w-full rounded-lg bg-white p-7 shadow-[0_18px_42px_rgba(108,63,57,0.08)] ring-1 ring-[#efe4df] sm:p-9">
          <div
            className={`grid h-12 w-12 place-items-center rounded-full text-xl font-bold ${badgeClass}`}
          >
            {state === "loading" ? "..." : isSuccess ? "✓" : "!"}
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#b73375]">
            VNPay
          </p>
          <h1 className={`mt-3 font-serif text-4xl font-bold ${accentClass}`}>
            {message}
          </h1>

          {result && (
            <dl className="mt-6 grid gap-3 rounded-lg border border-[#eaded8] bg-[#fbf8f5] p-5 text-sm">
              {result.orderId && (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8d7974]">Mã đơn</dt>
                  <dd className="break-all font-bold text-[#5a342f]">
                    {result.orderId}
                  </dd>
                </div>
              )}
              {result.amount !== undefined && (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8d7974]">Số tiền</dt>
                  <dd className="font-bold text-[#c33a78]">
                    {formatCurrency(result.amount)}
                  </dd>
                </div>
              )}
              {result.responseCode && (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8d7974]">Mã phản hồi</dt>
                  <dd className="font-bold text-[#5a342f]">
                    {result.responseCode}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center rounded-full bg-[#c33a78] px-7 text-sm font-bold text-white"
              href="/overview#san-pham"
            >
              Tiếp tục mua bánh
            </Link>
            <Link
              className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-bold text-[#2f7560] ring-1 ring-[#d7e3dc]"
              href="/orders"
            >
              Xem lịch sử đơn hàng
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function VnpayReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#fbf5f1] text-[#7f5149]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Đang xác nhận VNPay
          </p>
        </main>
      }
    >
      <VnpayReturnContent />
    </Suspense>
  );
}
