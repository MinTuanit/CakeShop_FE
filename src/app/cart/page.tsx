"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/src/components/Footer";
import ShopHeader from "@/src/components/ShopHeader";
import apiClient from "@/src/services/apiClient";
import {
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "@/src/services/cartService";
import type { Cart, CartItem, CartProduct } from "@/src/types/cart";
import type { User } from "@/src/types/user";
import { formatCategory, formatCurrency } from "@/src/utils/products";

type UserResponse = User | { user?: User } | null | undefined;

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

function CartProductImage({ product }: { product: CartProduct }) {
  if (product.imageUrl) {
    return (
      <div
        aria-label={product.name}
        className="h-24 w-24 shrink-0 rounded-lg bg-[#eaded8] bg-cover bg-center shadow-sm"
        role="img"
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
    );
  }

  return (
    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#f1d7cb,#8d143d)] font-serif text-xl font-bold text-white shadow-sm">
      {initials(product.name)}
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionProductId, setActionProductId] = useState("");
  const [clearing, setClearing] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const cartItems = useMemo(
    () => cart?.items.filter((item) => item.product) ?? [],
    [cart],
  );
  const hasItems = cartItems.length > 0;

  useEffect(() => {
    let mounted = true;

    async function loadCart() {
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

        setUser(resolveUser(userResponse.data));
        setCart(cartResponse.data);
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

        setError(apiMessage(loadError, "Không thể tải giỏ hàng."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadCart();

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

  const handleUpdateQuantity = async (item: CartItem, nextQuantity: number) => {
    const product = item.product;

    if (!product) {
      return;
    }

    if (nextQuantity < 1) {
      await handleRemoveItem(product._id);
      return;
    }

    setActionProductId(product._id);
    setError("");

    try {
      const response = await updateCartItem(product._id, nextQuantity);
      setCart(response.data);
    } catch (updateError) {
      setError(
        apiMessage(updateError, "Không thể cập nhật số lượng sản phẩm."),
      );
    } finally {
      setActionProductId("");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setActionProductId(productId);
    setError("");

    try {
      const response = await removeCartItem(productId);
      setCart(response.data);
    } catch (removeError) {
      setError(apiMessage(removeError, "Không thể xóa sản phẩm khỏi giỏ."));
    } finally {
      setActionProductId("");
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    setError("");

    try {
      const response = await clearCart();
      setCart(response.data);
    } catch (clearError) {
      setError(apiMessage(clearError, "Không thể làm trống giỏ hàng."));
    } finally {
      setClearing(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage("Nhập mã ưu đãi trước khi áp dụng.");
      return;
    }

    setCouponMessage("Mã ưu đãi sẽ được kiểm tra trong chương trình hợp lệ.");
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f1ec] text-[#7f5149]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-[#c43d7c]/20" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Đang mở giỏ hàng
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
            Giỏ hàng CakeShopMT
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-[#5a342f] sm:text-5xl">
                Giỏ hàng của bạn
              </h1>
              <p className="mt-3 text-sm text-[#8d7974]">
                Bạn đang có {cart?.totalItems ?? 0} sản phẩm trong giỏ.
              </p>
            </div>

            {hasItems && (
              <button
                className="h-11 rounded-md border border-[#f0c5d4] bg-white px-5 text-sm font-bold text-[#b73375] transition hover:bg-[#fff0f5] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={clearing}
                onClick={handleClearCart}
                type="button"
              >
                Làm trống giỏ
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-[#f2c3d4] bg-[#fff0f5] px-5 py-4 text-sm font-semibold text-[#b4235d]">
              {error}
            </div>
          )}

          {!hasItems ? (
            <div className="mt-8 rounded-lg border border-[#eaded8] bg-white px-6 py-14 text-center shadow-[0_18px_42px_rgba(108,63,57,0.08)]">
              <h2 className="text-2xl font-bold text-[#8d143d]">
                Giỏ hàng đang trống
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8d7974]">
                Chọn bánh kem hoặc phụ kiện yêu thích rồi quay lại đây để điều
                chỉnh số lượng và đặt hóa đơn.
              </p>
              <Link
                className="mt-7 inline-flex h-11 items-center rounded-full bg-[#c33a78] px-7 text-sm font-bold text-white"
                href="/overview#san-pham"
              >
                Chọn sản phẩm
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {cartItems.map((item) => {
                const product = item.product!;
                const updating = actionProductId === product._id;
                const hasStockLimit = typeof product.stock === "number";
                const reachedStockLimit =
                  hasStockLimit && item.quantity >= Number(product.stock);

                return (
                  <article
                    className="grid gap-4 rounded-lg bg-white p-4 shadow-[0_16px_38px_rgba(108,63,57,0.08)] ring-1 ring-[#efe4df] sm:grid-cols-[6rem_1fr_auto]"
                    key={product._id}
                  >
                    <CartProductImage product={product} />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#eef7f1] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#2f7560]">
                          {formatCategory(product.category)}
                        </span>
                        {hasStockLimit && (
                          <span className="rounded-full bg-[#fff8df] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#8a6420]">
                            Còn {product.stock}
                          </span>
                        )}
                      </div>

                      <Link
                        className="mt-3 block text-lg font-bold text-[#5a342f] transition hover:text-[#b73375]"
                        href={`/products/${product._id}`}
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-[#8d7974]">
                        {formatCurrency(product.price)} mỗi sản phẩm
                      </p>
                      <p className="mt-3 text-base font-extrabold text-[#c33a78]">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="grid grid-cols-[2rem_2.4rem_2rem] overflow-hidden rounded-full bg-[#f3efec] text-sm font-bold text-[#5a342f]">
                        <button
                          aria-label={`Giảm số lượng ${product.name}`}
                          className="grid h-8 place-items-center transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={updating}
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          type="button"
                        >
                          -
                        </button>
                        <span className="grid h-8 place-items-center">
                          {item.quantity}
                        </span>
                        <button
                          aria-label={`Tăng số lượng ${product.name}`}
                          className="grid h-8 place-items-center transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                          disabled={updating || reachedStockLimit}
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          type="button"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-xs font-bold uppercase tracking-[0.08em] text-[#b73375] transition hover:text-[#8d143d] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={updating}
                        onClick={() => handleRemoveItem(product._id)}
                        type="button"
                      >
                        Xóa
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-white p-6 shadow-[0_18px_42px_rgba(108,63,57,0.1)] ring-1 ring-[#efe4df]">
            <h2 className="text-xl font-bold text-[#5a342f]">
              Tóm tắt đơn hàng
            </h2>

            <label className="mt-6 block">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                Mã ưu đãi
              </span>
              <div className="mt-2 grid grid-cols-[1fr_auto] overflow-hidden rounded-md border border-[#eaded8] bg-[#fbf8f5]">
                <input
                  className="h-11 bg-transparent px-4 text-sm text-[#5f4b48] outline-none placeholder:text-[#b8aaa6]"
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="Nhập mã của bạn..."
                  value={coupon}
                />
                <button
                  className="h-11 bg-[#f7d6c9] px-4 text-xs font-bold text-[#8d143d] transition hover:bg-[#f2c3d4]"
                  onClick={handleApplyCoupon}
                  type="button"
                >
                  Áp dụng
                </button>
              </div>
              {couponMessage && (
                <span className="mt-2 block text-xs font-semibold text-[#8d7974]">
                  {couponMessage}
                </span>
              )}
            </label>

            <dl className="mt-7 space-y-3 border-t border-[#f0e5e0] pt-5 text-sm">
              <div className="flex justify-between gap-4 text-[#7f6d69]">
                <dt>Tạm tính</dt>
                <dd className="font-bold text-[#5a342f]">
                  {formatCurrency(cart?.totalPrice ?? 0)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-[#7f6d69]">
                <dt>Phí vận chuyển</dt>
                <dd className="font-bold text-[#2f7560]">Miễn phí</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#f0e5e0] pt-4 text-base font-extrabold text-[#5a342f]">
                <dt>Tổng cộng</dt>
                <dd className="text-[#c33a78]">
                  {formatCurrency(cart?.totalPrice ?? 0)}
                </dd>
              </div>
            </dl>

            <Link
              aria-disabled={!hasItems}
              className={`mt-7 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_14px_26px_rgba(195,58,120,0.22)] transition ${
                hasItems
                  ? "bg-[#c33a78] hover:-translate-y-0.5"
                  : "pointer-events-none bg-[#caaebb] opacity-50"
              }`}
              href="/checkout"
            >
              Tiến hành thanh toán
            </Link>

            <p className="mt-4 text-center text-xs font-semibold text-[#9d7d76]">
              Thanh toán an toàn khi đặt bánh.
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
