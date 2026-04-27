"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/src/components/Footer";
import apiClient from "../../services/apiClient";
import type { User } from "../../types/user";

const bestSellers = [
  {
    name: "Bánh Mây Matcha",
    description: "Kem matcha mịn, hạnh nhân rang và lớp mousse trà xanh.",
    price: "1.600.000đ",
    tone: "matcha",
  },
  {
    name: "Confetti Lune",
    description: "Chocolate đen, kem vani và hạt đường rực rỡ.",
    price: "1.420.000đ",
    tone: "confetti",
  },
  {
    name: "Gold Amber",
    description: "Caramel mặn, bơ Pháp và sponge cake mềm.",
    price: "1.880.000đ",
    tone: "caramel",
  },
];

const craftNotes = [
  {
    title: "Mềm Xốp Đúng Thuật",
    description: "Bông lan được đánh chậm để giữ độ ẩm và kết cấu mềm.",
    icon: "✦",
  },
  {
    title: "Phủ Mịn Chuẩn",
    description: "Lớp kem được chà phẳng thủ công cho từng đơn đặt hàng.",
    icon: "✧",
  },
  {
    title: "Bộ Dụng Cụ Pha Vị Cao Cấp",
    description: "Chocolate, trái cây và vanilla được chọn theo mùa.",
    icon: "☰",
  },
];

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get("/users/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user ?? res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        setLoading(false);
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setAccountMenuOpen(false);
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f1ec] text-[#7f5149]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-[#c43d7c]/20" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">
            Đang chuẩn bị tiệm bánh
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f1ec] px-5 text-[#7f5149]">
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_20px_50px_rgba(114,65,55,0.14)]">
          <p className="mb-5 text-sm font-semibold text-[#b73375]">{error}</p>
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
      <header className="sticky top-0 z-40 border-b border-[#eaded8] bg-[#f8f1ec]/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link className="font-serif text-xl font-bold text-[#8d143d]" href="/">
            Tiệm Bánh MT
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-[#7d6a66] md:flex">
            <a className="transition hover:text-[#b73375]" href="#ban-chay">
              Bánh ngọt
            </a>
            <a className="transition hover:text-[#b73375]" href="#diem-xuyet">
              Phụ kiện
            </a>
            <a className="transition hover:text-[#b73375]" href="#diem-xuyet">
              Chế biến
            </a>
            <a className="transition hover:text-[#b73375]" href="#ban-chay">
              Câu chuyện cửa hàng
            </a>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden h-9 items-center gap-2 rounded-full bg-[#e9dfda] px-4 text-[#8b7470] sm:flex">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="w-40 bg-transparent text-xs outline-none placeholder:text-[#a79591]"
                placeholder="Tìm bánh hôm nay..."
                type="search"
              />
            </label>
            <button
              aria-label="Giỏ hàng"
              className="grid h-9 w-9 place-items-center rounded-full text-[#9a2a54] transition hover:bg-white"
              type="button"
            >
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
                <path d="M6 8h14l-1.5 9h-11z" />
                <path d="M6 8 5 4H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="17" cy="20" r="1" />
              </svg>
            </button>
            <div className="relative">
              <button
                aria-expanded={accountMenuOpen}
                aria-label="Tài khoản"
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-bold text-[#b73375] shadow-sm transition hover:bg-[#fff7fa]"
                onClick={() => setAccountMenuOpen((open) => !open)}
                type="button"
              >
                {(user?.name || user?.phone || "MT").slice(0, 1).toUpperCase()}
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-[#eaded8] bg-white shadow-[0_22px_50px_rgba(88,45,39,0.16)]">
                  <div className="border-b border-[#f0e5e0] px-5 py-4">
                    <p className="text-sm font-bold text-[#5a342f]">
                      {user?.name || "Tài khoản CakeShopMT"}
                    </p>
                    <p className="mt-1 text-xs text-[#8d7974]">
                      {user?.phone}
                    </p>
                  </div>

                  <button
                    className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-[#6c514c] transition hover:bg-[#fff7fa] hover:text-[#b73375]"
                    onClick={() =>
                      setAccountDetailsOpen((current) => !current)
                    }
                    type="button"
                  >
                    <span>Thông tin tài khoản</span>
                    <span className="text-lg leading-none">
                      {accountDetailsOpen ? "−" : "+"}
                    </span>
                  </button>

                  {accountDetailsOpen && (
                    <div className="mx-4 mb-3 rounded-xl bg-[#f8f1ec] px-4 py-3 text-xs text-[#75625d]">
                      <div className="flex justify-between gap-4">
                        <span>Họ tên</span>
                        <strong className="text-right text-[#5a342f]">
                          {user?.name || "Chưa cập nhật"}
                        </strong>
                      </div>
                      <div className="mt-2 flex justify-between gap-4">
                        <span>Số điện thoại</span>
                        <strong className="text-right text-[#5a342f]">
                          {user?.phone || "Chưa cập nhật"}
                        </strong>
                      </div>
                      <div className="mt-2 flex justify-between gap-4">
                        <span>Vai trò</span>
                        <strong className="text-right text-[#5a342f]">
                          {user?.role || "Khách hàng"}
                        </strong>
                      </div>
                    </div>
                  )}

                  <button
                    className="flex w-full items-center justify-between border-t border-[#f0e5e0] px-5 py-3 text-left text-sm font-bold text-[#b73375] transition hover:bg-[#fff0f5]"
                    onClick={handleLogout}
                    type="button"
                  >
                    <span>Đăng xuất</span>
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
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <span className="inline-flex rounded-full bg-[#f7d6c9] px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#b73375]">
            Nghệ thuật mùa mới
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold italic leading-[0.94] text-[#8d143d] sm:text-7xl">
            Velvet
            <br />
            Framboise
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#7f6d69]">
            Sự giao thoa từ dâu rừng đỏ tươi và Madagascar vanilla nhẹ nhàng,
            phủ phần nhung đỏ thủ công cho mỗi chiếc bánh trong ngày.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              className="inline-flex h-12 items-center rounded-full bg-[#c33a78] px-7 text-sm font-bold text-white shadow-[0_14px_26px_rgba(195,58,120,0.22)] transition hover:-translate-y-0.5"
              href="#ban-chay"
            >
              Đặt hàng ngay
            </a>
            <a
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-[#c33a78] shadow-sm ring-1 ring-[#eaded8] transition hover:-translate-y-0.5"
              href="#diem-xuyet"
            >
              Khám phá sản phẩm
            </a>
          </div>
        </div>

        <div className="relative min-h-[34rem]">
          <div className="absolute right-0 top-0 h-[31rem] w-full max-w-[34rem] rounded-[1.25rem] bg-[linear-gradient(135deg,#65030c,#b90f25_50%,#f6d9c2)] shadow-[0_30px_70px_rgba(89,21,20,0.22)] sm:right-6" />
          <div className="absolute right-8 top-14 hidden font-['Brush_Script_MT','Segoe_Script',cursive] text-5xl text-white/85 sm:block">
            Signature
          </div>
          <div className="absolute bottom-20 right-7 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_47%_28%,#fff2e0_0_6%,#f2c0a9_7%_11%,transparent_12%),radial-gradient(circle_at_30%_36%,#fff2e0_0_5%,#f2c0a9_6%_10%,transparent_11%),radial-gradient(circle_at_66%_37%,#fff2e0_0_5%,#f2c0a9_6%_10%,transparent_11%),repeating-radial-gradient(circle_at_50%_42%,#e52638_0_4px,#c8172c_5px_8px)] shadow-[0_28px_48px_rgba(80,18,12,0.3)] sm:right-20" />
          <div className="absolute bottom-14 right-0 h-24 w-[26rem] rounded-[50%] bg-[#b17b48] opacity-90 shadow-[0_18px_28px_rgba(77,43,25,0.22)] sm:right-8" />
          <div className="absolute bottom-11 right-2 h-7 w-[25rem] rounded-full bg-[#f4d5a8] sm:right-10" />
          <div className="absolute bottom-20 left-0 max-w-[18rem] rounded-xl bg-white p-5 shadow-[0_18px_40px_rgba(108,63,57,0.14)] lg:left-8">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0f5] text-[#c33a78]">
                ✦
              </div>
              <div>
                <p className="text-sm font-bold text-[#673a34]">
                  Lựa chọn của đầu bếp năm 2026
                </p>
                <p className="mt-1 text-xs leading-5 text-[#8d7974]">
                  Mỗi lát bánh được hoàn thiện trong ngày để giữ mùi thơm và
                  độ mềm chuẩn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
        id="ban-chay"
      >
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-['Segoe_UI',Arial,sans-serif] text-4xl font-extrabold text-[#8d143d]">
              Sản phẩm bán chạy nhất
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f6d69]">
              Những sáng tạo được khách yêu thích, từ lớp mousse đậm vị đến
              phần trang trí thủ công đầy cảm hứng.
            </p>
          </div>
          <a
            className="text-sm font-bold text-[#b73375] transition hover:text-[#8d143d]"
            href="#diem-xuyet"
          >
            Xem tất cả bộ sưu tập +
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <article className="relative min-h-[31rem] overflow-hidden rounded-2xl bg-[#2c120c] p-8 shadow-[0_22px_52px_rgba(70,38,31,0.14)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,184,105,0.2),rgba(32,14,10,0)_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.18))]" />
            <div className="absolute bottom-12 left-1/2 h-80 w-80 -translate-x-1/2 rounded-[48%] bg-[repeating-radial-gradient(ellipse_at_50%_100%,#7b2e18_0_8px,#b85a22_9px_14px,#3a160e_15px_20px)] shadow-[0_30px_55px_rgba(12,4,2,0.45)]" />
            <div className="absolute bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[conic-gradient(from_190deg,#2b0e08,#9b3d18,#f08a35,#5a1a0c,#2b0e08)] blur-[1px]" />
            <div className="relative z-10">
              <span className="rounded-full bg-white/10 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#ffd7c4]">
                Chocolate thủ công
              </span>
              <h3 className="mt-5 max-w-sm font-serif text-4xl font-bold italic text-white">
                Ganache Núi Lửa
              </h3>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2">
            {bestSellers.map((product, index) => (
              <article
                className={
                  index === 0
                    ? "grid gap-5 rounded-2xl bg-white p-5 shadow-[0_18px_42px_rgba(108,63,57,0.11)] sm:col-span-2 sm:grid-cols-[10rem_1fr]"
                    : "rounded-2xl bg-white p-5 shadow-[0_18px_42px_rgba(108,63,57,0.11)]"
                }
                key={product.name}
              >
                <div
                  className={`h-36 rounded-xl ${
                    product.tone === "matcha"
                      ? "bg-[radial-gradient(circle_at_50%_42%,#d7edb9_0_18%,#7a9f44_19%_40%,#26421e_41%_100%)]"
                      : product.tone === "confetti"
                        ? "bg-[radial-gradient(circle_at_50%_45%,#111_0_48%,transparent_49%),radial-gradient(circle_at_20%_20%,#e83b7f_0_2px,transparent_3px),radial-gradient(circle_at_60%_35%,#2bd6ff_0_2px,transparent_3px),radial-gradient(circle_at_72%_68%,#f8d63d_0_2px,transparent_3px),#070707]"
                        : "bg-[radial-gradient(circle_at_50%_35%,#f8c073_0_24%,#d06422_25%_64%,#5a2512_65%_100%)]"
                  }`}
                />
                <div className="flex h-full flex-col">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#bd9b93]">
                    Bộ sưu tập signature
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-bold text-[#6d2b31]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#8d7974]">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-sm font-bold text-[#c33a78]">
                      {product.price}
                    </span>
                    <button
                      aria-label={`Thêm ${product.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0f5] text-[#c33a78] transition hover:bg-[#c33a78] hover:text-white"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20"
        id="diem-xuyet"
      >
        <div>
          <h2 className="font-['Segoe_UI',Arial,sans-serif] text-4xl font-extrabold text-[#8d143d]">
            Điểm xuyết hoàn hảo
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#7f6d69]">
            Những món kết hợp cho trải nghiệm thưởng thức trọn vẹn, từ nguyên
            liệu trang trí đến dụng cụ phục vụ tinh tế.
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
          <article className="flex min-h-[24rem] items-center justify-center rounded-2xl bg-[#eef3f1] p-8 shadow-[0_18px_42px_rgba(108,63,57,0.09)]">
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
          <article className="relative min-h-[24rem] overflow-hidden rounded-2xl bg-[#14201f] p-8 shadow-[0_18px_42px_rgba(108,63,57,0.09)]">
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
