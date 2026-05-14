"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/src/components/Footer";
import ProductVisual from "@/src/components/ProductVisual";
import ShopHeader from "@/src/components/ShopHeader";
import apiClient from "@/src/services/apiClient";
import type { Product } from "@/src/types/product";
import type { User } from "@/src/types/user";
import {
  formatCategory,
  formatCurrency,
  isProductAvailable,
  productRequiresStock,
} from "@/src/utils/products";

type UserResponse = User | { user?: User } | null | undefined;

const craftNotes = [
  {
    title: "Nghệ thuật tạo hình tinh tế",
    description:
      "Đội ngũ thợ bánh lành nghề của chúng tôi tỉ mỉ tạo hình từng chiếc bánh, từ những đường nét trang trí đến cách phối màu hài hòa, mang đến vẻ đẹp nghệ thuật độc đáo cho mỗi sản phẩm.",
    icon: "✦",
  },
  {
    title: "Phủ kem mịn màng",
    description:
      "Kem bơ tươi được đánh bông kỹ lưỡng, phủ đều lên bánh để tạo nên lớp áo mịn màng và hương vị béo ngậy đặc trưng.",
    icon: "✧",
  },
  {
    title: "Nguyên liệu theo mùa",
    description:
      "Chocolate, trái cây và vanilla được chọn theo mùa để giữ hương vị tốt nhất.",
    icon: "☰",
  },
];

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

function mergeCategories(current: string[], products: Product[]) {
  const nextCategories = products
    .map((product) => product.category)
    .filter(Boolean);

  return Array.from(new Set([...current, ...nextCategories])).sort((a, b) =>
    formatCategory(a).localeCompare(formatCategory(b), "vi"),
  );
}

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() || selectedCategory || minPrice.trim() || maxPrice.trim(),
      ),
    [maxPrice, minPrice, search, selectedCategory],
  );
  const priceRangeError = useMemo(() => {
    const normalizedMinPrice = minPrice.trim();
    const normalizedMaxPrice = maxPrice.trim();

    if (
      normalizedMinPrice &&
      normalizedMaxPrice &&
      Number(normalizedMinPrice) > Number(normalizedMaxPrice)
    ) {
      return "Khoáº£ng giÃ¡ chÆ°a há»£p lá»‡.";
    }

    return "";
  }, [maxPrice, minPrice]);
  const displayedProductError = priceRangeError || productError;
  const isProductsLoading = productsLoading && !priceRangeError;
  const visibleProducts = priceRangeError ? [] : products;

  useEffect(() => {
    apiClient
      .get<UserResponse>("/users/me", { withCredentials: true })
      .then((res) => {
        setUser(resolveUser(res.data));
        setAuthLoading(false);
      })
      .catch(() => {
        setAuthError(
          "Báº¡n chÆ°a Ä‘Äƒng nháº­p hoáº·c phiÃªn Ä‘Äƒng nháº­p Ä‘Ã£ háº¿t háº¡n.",
        );
        setAuthLoading(false);
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    const normalizedMinPrice = minPrice.trim();
    const normalizedMaxPrice = maxPrice.trim();

    if (priceRangeError) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setProductsLoading(true);
      setProductError("");

      apiClient
        .get<Product[]>("/products", {
          params: {
            category: selectedCategory || undefined,
            maxPrice: normalizedMaxPrice || undefined,
            minPrice: normalizedMinPrice || undefined,
            search: search.trim() || undefined,
          },
          signal: controller.signal,
          withCredentials: true,
        })
        .then((res) => {
          setProducts(res.data);
          setCategories((current) => mergeCategories(current, res.data));
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return;
          }

          setProducts([]);
          setProductError(
            apiMessage(error, "Không thể tải sản phẩm. Vui lòng thử lại sau."),
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setProductsLoading(false);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [maxPrice, minPrice, priceRangeError, search, selectedCategory]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      router.push("/login");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f1ec] text-[#7f5149]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-[#c43d7c]/20" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Đang xác thực tài khoản
          </p>
        </div>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f1ec] px-5 text-[#7f5149]">
        <div className="rounded-lg bg-white p-8 text-center shadow-[0_20px_50px_rgba(114,65,55,0.14)]">
          <p className="mb-5 text-sm font-semibold text-[#b73375]">
            {authError}
          </p>
          <Link
            className="inline-flex h-11 items-center rounded-full bg-[#b73375] px-7 text-sm font-bold text-white"
            href="/login"
          >
            Đăng nhập lại
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f1ec] text-[#4f342f]">
      <ShopHeader
        onLogout={handleLogout}
        onSearchChange={setSearch}
        searchValue={search}
        user={user}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <span className="inline-flex rounded-full bg-[#f7d6c9] px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#b73375]">
            Nghệ thuật mùa mới
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold italic leading-[0.94] text-[#8d143d] sm:text-7xl">
            CakeShop
            <br />
            MT
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#7f6d69]">
            Khám phá danh sách bánh đang có trong bộ, cập nhật trực tiếp từ hệ
            thống sản phẩm để bạn chọn đúng hướng vị, kích thước và khoảng giá.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              className="inline-flex h-12 items-center rounded-full bg-[#c33a78] px-7 text-sm font-bold text-white shadow-[0_14px_26px_rgba(195,58,120,0.22)] transition hover:-translate-y-0.5"
              href="#san-pham"
            >
              Xem sản phẩm
            </a>
            <Link
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-[#2f7560] shadow-sm ring-1 ring-[#d7e3dc] transition hover:-translate-y-0.5"
              href="/cau-chuyen"
            >
              Câu chuyện của chúng tôi
            </Link>
          </div>
        </div>

        <div className="relative min-h-[34rem]">
          <div className="absolute right-0 top-0 h-[31rem] w-full max-w-[34rem] rounded-lg bg-[linear-gradient(135deg,#521716,#b22f46_48%,#edc28b)] shadow-[0_30px_70px_rgba(89,21,20,0.22)] sm:right-6" />
          <div className="absolute right-8 top-14 hidden font-['Brush_Script_MT','Segoe_Script',cursive] text-5xl text-white/85 sm:block">
            Signature
          </div>
          <div className="absolute bottom-20 right-7 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_47%_28%,#fff2e0_0_6%,#f2c0a9_7%_11%,transparent_12%),radial-gradient(circle_at_30%_36%,#fff2e0_0_5%,#f2c0a9_6%_10%,transparent_11%),radial-gradient(circle_at_66%_37%,#fff2e0_0_5%,#f2c0a9_6%_10%,transparent_11%),repeating-radial-gradient(circle_at_50%_42%,#e52638_0_4px,#c8172c_5px_8px)] shadow-[0_28px_48px_rgba(80,18,12,0.3)] sm:right-20" />
          <div className="absolute bottom-14 right-0 h-24 w-[26rem] rounded-[50%] bg-[#8c653f] opacity-90 shadow-[0_18px_28px_rgba(77,43,25,0.22)] sm:right-8" />
          <div className="absolute bottom-11 right-2 h-7 w-[25rem] rounded-full bg-[#f4d5a8] sm:right-10" />
          <div className="absolute bottom-20 left-0 max-w-[18rem] rounded-lg bg-white p-5 shadow-[0_18px_40px_rgba(108,63,57,0.14)] lg:left-8">
            {/* <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e6f3ec] text-[#2f7560]">
                âœ¦
              </div>
              <div>
                <p className="text-sm font-bold text-[#673a34]">
                  Sáº£n pháº©m cáº­p nháº­t tá»« API
                </p>
                <p className="mt-1 text-xs leading-5 text-[#8d7974]">
                  Danh sÃ¡ch bÃªn dÆ°á»›i pháº£n Ã¡nh dá»¯ liá»‡u má»›i nháº¥t tá»« backend.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
        id="san-pham"
      >
        <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-sans text-4xl font-extrabold text-[#8d143d]">
              Sản phẩm trong tiệm
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f6d69]">
              Tìm theo tên bánh, chọn thể loại và giới hạn khoảng giá để xem
              đúng món đang phù hợp với dạp của bạn.
            </p>
          </div>
          <p className="text-sm font-bold text-[#2f7560]">
            {isProductsLoading
              ? "Đang tải..."
              : `${visibleProducts.length} sản phẩm`}
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-lg border border-[#eaded8] bg-white/72 p-4 shadow-[0_14px_34px_rgba(108,63,57,0.08)] md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.7fr_0.7fr_auto]">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
              Tìm kiếm
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tên bánh, hương vị..."
              type="search"
              value={search}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
              Thể loại
            </span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm font-semibold text-[#5f4b48] outline-none transition focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
              onChange={(event) => setSelectedCategory(event.target.value)}
              value={selectedCategory}
            >
              <option value="">Tất cả</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
              Giá từ
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
              min="0"
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
              type="number"
              value={minPrice}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9d7d76]">
              Giá đến
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#eaded8] bg-[#fbf8f5] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#b8aaa6] focus:border-[#c33a78] focus:bg-white focus:ring-4 focus:ring-[#c33a78]/12"
              min="0"
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="500000"
              type="number"
              value={maxPrice}
            />
          </label>

          <button
            className="h-11 self-end rounded-md border border-[#d7e3dc] bg-[#eef7f1] px-5 text-sm font-bold text-[#2f7560] transition hover:bg-[#d9eee2] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasActiveFilters}
            onClick={resetFilters}
            type="button"
          >
            Xóa lọc
          </button>
        </div>

        {displayedProductError && (
          <div className="mb-6 rounded-lg border border-[#f2c3d4] bg-[#fff0f5] px-5 py-4 text-sm font-semibold text-[#b4235d]">
            {displayedProductError}
          </div>
        )}

        {isProductsLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="h-[26rem] animate-pulse rounded-lg bg-white/70 shadow-[0_18px_42px_rgba(108,63,57,0.08)]"
                key={index}
              />
            ))}
          </div>
        )}

        {!isProductsLoading &&
          !displayedProductError &&
          visibleProducts.length === 0 && (
            <div className="rounded-lg border border-[#eaded8] bg-white px-6 py-14 text-center shadow-[0_18px_42px_rgba(108,63,57,0.08)]">
              <h3 className="text-xl font-bold text-[#673a34]">
                Chưa tìm thấy sản phẩm phù hợp
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8d7974]">
                Hãy thử đổi từ khóa, thể loại hoặc khoảng giá để xem thêm lựa
                chọn từ bộ.
              </p>
            </div>
          )}

        {!isProductsLoading &&
          !displayedProductError &&
          visibleProducts.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const available = isProductAvailable(product);
                const hasStock = productRequiresStock(product);

                return (
                  <Link
                    className="group flex min-h-[27rem] flex-col overflow-hidden rounded-lg bg-white shadow-[0_18px_42px_rgba(108,63,57,0.1)] ring-1 ring-[#efe4df] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(108,63,57,0.16)]"
                    href={`/products/${product._id}`}
                    key={product._id}
                  >
                    <ProductVisual className="h-52" product={product} />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#eef7f1] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#2f7560]">
                          {formatCategory(product.category)}
                        </span>
                        {hasStock && available && typeof product.stock === "number" && (
                          <span className="rounded-full bg-[#fff8df] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#8a6420]">
                            Còn {product.stock}
                          </span>
                        )}
                        {!available && (
                          <span className="rounded-full bg-[#fff0f5] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#b4235d]">
                            Tạm hết
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 font-sans text-2xl font-extrabold leading-tight text-[#6d2b31]">
                        {product.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#8d7974]">
                        {product.description ||
                          "Bánh thủ công mới trong bộ sưu tập CakeShopMT."}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                        <span className="text-base font-extrabold text-[#c33a78]">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="inline-flex h-10 items-center rounded-full bg-[#8d143d] px-4 text-xs font-bold text-white transition group-hover:bg-[#2f7560]">
                          Chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
      </section>

      <section
        className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20"
        id="diem-xuyet"
      >
        <div>
          <h2 className="font-sans text-4xl font-extrabold text-[#8d143d]">
            Điểm xuyết nghệ thuật
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#7f6d69]">
            Mỗi chiếc bánh là một tác phẩm thủ công, nơi sự tỉ mỉ trong từng công đoạn tạo nên hương vị và vẻ đẹp đặc trưng của CakeShopMT.
          </p>

          <div className="mt-9 space-y-6">
            {craftNotes.map((note) => (
              <article className="flex gap-4" key={note.title}>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ffe0e7] font-bold text-[#c33a78]">
                  {note.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#673a34]">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#8d7974]">
                    {note.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <article className="flex min-h-[24rem] items-center justify-center rounded-lg bg-[#eef3f1] p-8 shadow-[0_18px_42px_rgba(108,63,57,0.09)]">
            <div className="relative h-56 w-40 rounded-lg bg-[#5e1c12] shadow-[0_18px_28px_rgba(58,24,16,0.22)]">
              <div className="absolute left-4 right-4 top-5 h-24 rounded-sm bg-[#f7f2eb] p-3 text-center">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[#6d2b31]">
                  Cocoa Jar
                </p>
                <p className="mt-2 text-[0.5rem] leading-3 text-[#8d7974]">
                  Dark chocolate blend
                </p>
              </div>
              <div className="absolute -top-5 left-1/2 h-7 w-24 -translate-x-1/2 rounded-t-lg bg-[#3b120b]" />
            </div>
          </article>
          <article className="relative min-h-[24rem] overflow-hidden rounded-lg bg-[#14201f] p-8 shadow-[0_18px_42px_rgba(108,63,57,0.09)]">
            <div className="absolute right-10 top-10 h-72 w-5 rotate-45 rounded-full bg-[#d3a84f] shadow-[0_4px_0_#805621]" />
            <div className="absolute right-16 top-24 h-24 w-44 rotate-[-18deg] rounded-[55%_45%_42%_58%] bg-[linear-gradient(135deg,#ffd777,#b47b2b)] shadow-[0_18px_20px_rgba(0,0,0,0.28)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%)]" />
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
