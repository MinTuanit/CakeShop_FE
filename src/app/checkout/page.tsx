"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Footer from "@/src/components/Footer";
import ShopHeader from "@/src/components/ShopHeader";
import apiClient from "@/src/services/apiClient";
import { getMyCart } from "@/src/services/cartService";
import { createOrderFromCart } from "@/src/services/orderService";
import type { Cart } from "@/src/types/cart";
import type { Order } from "@/src/types/order";
import type { User } from "@/src/types/user";
import { formatCurrency } from "@/src/utils/products";

type UserResponse = User | { user?: User } | null | undefined;

type CheckoutForm = {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  note: string;
};

type SummaryItem = {
  key: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  subtotal: number;
};

function resolveUser(payload: UserResponse): User | null {
  if (!payload) {
    return null;
  }

  if (typeof payload === "object" && "user" in payload) {
    return payload.user ?? null;
  }

  return payload as User;
}

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

function initials(name?: string) {
  return (name || "MT")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SummaryImage({ imageUrl, name }: { imageUrl?: string; name: string }) {
  if (imageUrl) {
    return (
      <div
        aria-label={name}
        className="h-16 w-16 shrink-0 rounded-lg bg-[#eaded8] bg-cover bg-center shadow-sm"
        role="img"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    );
  }

  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#f1d7cb,#8d143d)] font-serif text-base font-bold text-white shadow-sm">
      {initials(name)}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    deliveryAddress: "",
    note: "",
    phone: "",
  });

  const cartItems = useMemo(
    () => cart?.items.filter((item) => item.product) ?? [],
    [cart],
  );
  const summaryItems: SummaryItem[] = useMemo(() => {
    if (confirmedOrder) {
      return confirmedOrder.items.map((item) => ({
        key: item.product,
        imageUrl: item.imageUrl,
        name: item.name,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));
    }

    return cartItems.map((item) => ({
      key: item.product!._id,
      imageUrl: item.product?.imageUrl,
      name: item.product?.name ?? "Sản phẩm",
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));
  }, [cartItems, confirmedOrder]);
  const totalItems = confirmedOrder?.totalItems ?? cart?.totalItems ?? 0;
  const totalPrice = confirmedOrder?.totalPrice ?? cart?.totalPrice ?? 0;
  const canSubmit = totalItems > 0 && !confirmedOrder;

  useEffect(() => {
    let mounted = true;

    async function loadCheckout() {
      setLoading(true);
      setError("");

      try {
        const [userResponse, cartResponse] = await Promise.all([
          apiClient.get<UserResponse>("/users/me", { withCredentials: true }),
          getMyCart(),
        ]);

        if (!mounted) {
          return;
        }

        const currentUser = resolveUser(userResponse.data);
        setUser(currentUser);
        setCart(cartResponse.data);
        setForm((current) => ({
          customerName: current.customerName || currentUser?.name || "",
          deliveryAddress:
            current.deliveryAddress || currentUser?.address || "",
          note: current.note,
          phone: current.phone || currentUser?.phone || "",
        }));
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        const status = axios.isAxiosError(loadError)
          ? loadError.response?.status
          : undefined;

        if (status === 401 || status === 403) {
          router.push("/login");
          return;
        }

        setError(apiMessage(loadError, "Không thể tải thông tin thanh toán."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadCheckout();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      router.push("/login");
    }
  };

  const updateField =
    (field: keyof CheckoutForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("Giỏ hàng chưa có sản phẩm để đặt hóa đơn.");
      return;
    }

    const payload = {
      customerName: form.customerName.trim(),
      deliveryAddress: form.deliveryAddress.trim(),
      note: form.note.trim() || undefined,
      phone: form.phone.trim(),
    };

    if (!payload.customerName || !payload.phone || !payload.deliveryAddress) {
      setError("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ giao hàng.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await createOrderFromCart(payload);
      setConfirmedOrder(response.data);
      setCart(null);
    } catch (submitError) {
      setError(apiMessage(submitError, "Không thể tạo đơn hàng."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fbf5f1] text-[#7f5149]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-[#c43d7c]/20" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Đang mở trang thanh toán
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf5f1] text-[#4f342f]">
      <ShopHeader onLogout={handleLogout} user={user} />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_24rem] lg:px-8 lg:py-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b73375]">
            Đặt hóa đơn
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#5a342f] sm:text-5xl">
            Hoàn tất đơn hàng
          </h1>
          <p className="mt-3 text-sm text-[#8d7974]">
            Xác nhận thông tin giao bánh và phụ kiện trước khi gửi đơn.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-[#f2c3d4] bg-[#fff0f5] px-5 py-4 text-sm font-semibold text-[#b4235d]">
              {error}
            </div>
          )}

          {confirmedOrder ? (
            <div className="mt-8 rounded-lg bg-white p-7 shadow-[0_18px_42px_rgba(108,63,57,0.08)] ring-1 ring-[#efe4df]">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eef7f1] text-xl font-bold text-[#2f7560]">
                ✓
              </div>
              <h2 className="mt-5 text-2xl font-bold text-[#8d143d]">
                Đơn hàng đã được ghi nhận
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8d7974]">
                Mã đơn {confirmedOrder._id} đang ở trạng thái chờ xử lý. Tiệm
                sẽ dùng thông tin bạn vừa nhập để chuẩn bị và giao hàng.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-11 items-center rounded-full bg-[#c33a78] px-7 text-sm font-bold text-white"
                  href="/overview#san-pham"
                >
                  Tiếp tục mua bánh
                </Link>
                <Link
                  className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-bold text-[#2f7560] ring-1 ring-[#d7e3dc]"
                  href="/cart"
                >
                  Về giỏ hàng
                </Link>
              </div>
            </div>
          ) : (
            <form
              className="mt-8 space-y-6"
              id="checkout-form"
              onSubmit={handleSubmit}
            >
              <section className="rounded-lg bg-white p-6 shadow-[0_16px_38px_rgba(108,63,57,0.08)] ring-1 ring-[#efe4df]">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0f5] text-[#b73375]">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21s7-5.2 7-12A7 7 0 0 0 5 9c0 6.8 7 12 7 12Z" />
                      <circle cx="12" cy="9" r="2" />
                    </svg>
                  </span>
                  <h2 className="text-xl font-bold text-[#5a342f]">
                    Địa chỉ giao hàng
                  </h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                      Tên người nhận
                    </span>
                    <input
                      className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
                      onChange={updateField("customerName")}
                      placeholder="Nguyễn Minh Vân"
                      value={form.customerName}
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                      Số điện thoại
                    </span>
                    <input
                      className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
                      onChange={updateField("phone")}
                      placeholder="0909123456"
                      value={form.phone}
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                      Ghi chú
                    </span>
                    <input
                      className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
                      onChange={updateField("note")}
                      placeholder="Giao trước 18h"
                      value={form.note}
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                      Địa chỉ giao hàng
                    </span>
                    <textarea
                      className="mt-2 min-h-24 w-full resize-none rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 py-3 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
                      onChange={updateField("deliveryAddress")}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                      value={form.deliveryAddress}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-lg bg-white p-6 shadow-[0_16px_38px_rgba(108,63,57,0.08)] ring-1 ring-[#efe4df]">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0f5] text-[#b73375]">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect height="14" rx="2" width="18" x="3" y="5" />
                      <path d="M3 10h18" />
                    </svg>
                  </span>
                  <h2 className="text-xl font-bold text-[#5a342f]">
                    Thanh toán an toàn
                  </h2>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#d85691] bg-[#fff7fa]"
                        : "border-[#eaded8] bg-[#fbf8f5]"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#5a342f]">
                        Thanh toán khi nhận bánh
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#8d7974]">
                        Xác nhận với tiệm trước khi giao.
                      </span>
                    </span>
                    <input
                      checked={paymentMethod === "cod"}
                      className="mt-1 h-4 w-4 accent-[#c33a78]"
                      name="payment"
                      onChange={() => setPaymentMethod("cod")}
                      type="radio"
                    />
                  </label>

                  <label
                    className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition ${
                      paymentMethod === "wallet"
                        ? "border-[#d85691] bg-[#fff7fa]"
                        : "border-[#eaded8] bg-[#fbf8f5]"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#5a342f]">
                        Ví điện tử
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#8d7974]">
                        Ghi nhận đơn trước, thanh toán theo hướng dẫn.
                      </span>
                    </span>
                    <input
                      checked={paymentMethod === "wallet"}
                      className="mt-1 h-4 w-4 accent-[#c33a78]"
                      name="payment"
                      onChange={() => setPaymentMethod("wallet")}
                      type="radio"
                    />
                  </label>
                </div>
              </section>
            </form>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-white p-6 shadow-[0_18px_42px_rgba(108,63,57,0.1)] ring-1 ring-[#efe4df]">
            <h2 className="text-xl font-bold text-[#5a342f]">
              Tóm tắt đơn hàng
            </h2>

            {summaryItems.length === 0 ? (
              <div className="mt-6 rounded-lg border border-[#eaded8] bg-[#fbf8f5] px-4 py-6 text-center">
                <p className="text-sm font-semibold text-[#8d7974]">
                  Chưa có sản phẩm trong giỏ.
                </p>
                <Link
                  className="mt-4 inline-flex h-10 items-center rounded-full bg-[#c33a78] px-5 text-xs font-bold text-white"
                  href="/overview#san-pham"
                >
                  Chọn sản phẩm
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {summaryItems.map((item) => (
                  <div
                    className="grid grid-cols-[4rem_1fr] gap-3 border-b border-[#f0e5e0] pb-4 last:border-b-0"
                    key={item.key}
                  >
                    <SummaryImage imageUrl={item.imageUrl} name={item.name} />
                    <div>
                      <p className="text-sm font-bold leading-5 text-[#5a342f]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#9d7d76]">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="mt-2 text-sm font-extrabold text-[#c33a78]">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <dl className="mt-7 space-y-3 border-t border-[#f0e5e0] pt-5 text-sm">
              <div className="flex justify-between gap-4 text-[#7f6d69]">
                <dt>Tạm tính</dt>
                <dd className="font-bold text-[#5a342f]">
                  {formatCurrency(totalPrice)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-[#7f6d69]">
                <dt>Phí vận chuyển</dt>
                <dd className="font-bold text-[#2f7560]">Miễn phí</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#f0e5e0] pt-4 text-base font-extrabold text-[#5a342f]">
                <dt>Tổng cộng</dt>
                <dd className="text-[#c33a78]">
                  {formatCurrency(totalPrice)}
                </dd>
              </div>
            </dl>

            {!confirmedOrder && (
              <button
                className="mt-7 h-12 w-full rounded-full bg-[#c33a78] text-sm font-bold text-white shadow-[0_14px_26px_rgba(195,58,120,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canSubmit || submitting}
                form="checkout-form"
                type="submit"
              >
                {submitting
                  ? "Đang gửi đơn..."
                  : `Xác nhận đặt hóa đơn ${formatCurrency(totalPrice)}`}
              </button>
            )}

            <p className="mt-4 text-center text-xs font-semibold text-[#9d7d76]">
              Thông tin đơn hàng được gửi bảo mật tới tiệm.
            </p>
          </div>

          <div className="mt-5 rounded-lg bg-[#ffe2d8] px-5 py-4 text-sm text-[#7f5149] shadow-[0_12px_28px_rgba(108,63,57,0.08)]">
            <p className="font-bold text-[#8d143d]">Bạn cần hỗ trợ?</p>
            <p className="mt-1 leading-6">
              Ghi rõ thời gian giao, nội dung viết trên bánh hoặc phụ kiện cần
              kèm theo trong phần ghi chú.
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
