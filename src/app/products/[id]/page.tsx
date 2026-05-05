"use client";

import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/src/components/Footer";
import ProductVisual from "@/src/components/ProductVisual";
import ShopHeader from "@/src/components/ShopHeader";
import apiClient from "@/src/services/apiClient";
import type { Product } from "@/src/types/product";
import type { User } from "@/src/types/user";
import {
  formatCategory,
  formatCurrency,
  getProductImages,
  isProductAvailable,
  productRequiresStock,
} from "@/src/utils/products";

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

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const [userResponse, productResponse] = await Promise.all([
          apiClient.get<UserResponse>("/users/me", { withCredentials: true }),
          apiClient.get<Product>(`/products/${productId}`, {
            withCredentials: true,
          }),
        ]);

        if (!mounted) {
          return;
        }

        setUser(resolveUser(userResponse.data));
        setProduct(productResponse.data);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        const status = axios.isAxiosError(loadError)
          ? loadError.response?.status
          : undefined;

        if (status === 401 || status === 403) {
          setError("Bạn cần đăng nhập để xem chi tiết sản phẩm.");
          router.push("/login");
          return;
        }

        setError(apiMessage(loadError, "Không thể tải chi tiết sản phẩm."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (productId) {
      void loadProduct();
    }

    return () => {
      mounted = false;
    };
  }, [productId, router]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f1ec] text-[#7f5149]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-[#c43d7c]/20" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Đang mở trang sản phẩm
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f8f1ec] text-[#4f342f]">
        <ShopHeader onLogout={handleLogout} user={user} />
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-3xl place-items-center px-5 py-16">
          <div className="rounded-lg bg-white p-8 text-center shadow-[0_20px_50px_rgba(114,65,55,0.14)]">
            <h1 className="text-2xl font-bold text-[#8d143d]">
              Không mở được sản phẩm
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#8d7974]">
              {error || "Sản phẩm không tồn tại."}
            </p>
            <Link
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#b73375] px-7 text-sm font-bold text-white"
              href="/overview#san-pham"
            >
              Quay lại sản phẩm
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const images = getProductImages(product);
  const galleryImages = images.slice(1, 4);
  const available = isProductAvailable(product);
  const mainIngredients = product.mainIngredients ?? [];
  const hasStock = productRequiresStock(product);

  return (
    <main className="min-h-screen bg-[#f8f1ec] text-[#4f342f]">
      <ShopHeader onLogout={handleLogout} user={user} />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2f7560] transition hover:text-[#8d143d]"
            href="/overview#san-pham"
          >
            <span aria-hidden="true">←</span>
            Quay lại danh sách
          </Link>

          <ProductVisual
            className="mt-7 aspect-[1.08] rounded-lg shadow-[0_24px_60px_rgba(88,45,39,0.18)]"
            labelClassName="h-20 w-20 text-2xl"
            product={product}
          />

          {galleryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {galleryImages.map((imageUrl) => (
                <div
                  aria-label={`${product.name} gallery`}
                  className="aspect-square rounded-lg bg-[#efe4df] bg-cover bg-center shadow-sm"
                  key={imageUrl}
                  role="img"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ))}
            </div>
          )}
        </div>

        <article className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#eef7f1] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#2f7560]">
              {formatCategory(product.category)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${available
                ? "bg-[#fff8df] text-[#8a6420]"
                : "bg-[#fff0f5] text-[#b4235d]"
                }`}
            >
              {available ? "Đang bán" : "Tạm hết"}
            </span>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#8d143d] sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-extrabold text-[#c33a78]">
            {formatCurrency(product.price)}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#7f6d69]">
            {product.description ||
              "Sản phẩm thủ công của CakeShopMT, phù hợp cho những dịp cần một chiếc bánh được chuẩn bị chỉn chu."}
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#eaded8] bg-white/72 p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                Hương vị
              </dt>
              <dd className="mt-2 text-sm font-bold text-[#5a342f]">
                {product.flavor || "Theo công thức tiệm"}
              </dd>
            </div>
            <div className="rounded-lg border border-[#eaded8] bg-white/72 p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                Kích thước
              </dt>
              <dd className="mt-2 text-sm font-bold text-[#5a342f]">
                {product.size || "Tùy chọn khi đặt"}
              </dd>
            </div>
            {hasStock ? (
              <div className="rounded-lg border border-[#eaded8] bg-white/72 p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                  Tồn kho
                </dt>
                <dd className="mt-2 text-sm font-bold text-[#5a342f]">
                  {typeof product.stock === "number"
                    ? `${product.stock} sản phẩm`
                    : "Chưa cập nhật"}
                </dd>
              </div>
            ) : (
              <div className="rounded-lg border border-[#eaded8] bg-white/72 p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
                  Nguyên liệu chính
                </dt>
                <dd className="mt-2 text-sm font-bold text-[#5a342f]">
                  {mainIngredients.length > 0
                    ? mainIngredients.join(", ")
                    : "Chưa cập nhật"}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              className="h-12 rounded-full bg-[#c33a78] px-8 text-sm font-bold text-white shadow-[0_14px_26px_rgba(195,58,120,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!available}
              type="button"
            >
              Thêm vào giỏ
            </button>
            <Link
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-[#2f7560] shadow-sm ring-1 ring-[#d7e3dc] transition hover:-translate-y-0.5"
              href="/overview#san-pham"
            >
              Xem thêm bánh
            </Link>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}
