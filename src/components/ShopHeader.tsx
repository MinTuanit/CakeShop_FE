"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@/src/types/user";

type ShopHeaderProps = {
  user: User | null;
  onLogout: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export default function ShopHeader({
  onLogout,
  onSearchChange,
  searchValue = "",
  user,
}: ShopHeaderProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#eaded8] bg-[#f8f1ec]/92 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link className="font-serif text-xl font-bold text-[#8d143d]" href="/overview">
          Tiệm Bánh MT
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-[#7d6a66] md:flex">
          <Link className="transition hover:text-[#b73375]" href="/overview#san-pham">
            Sản phẩm
          </Link>
          <Link className="transition hover:text-[#b73375]" href="/overview#diem-xuyet">
            Chế biến
          </Link>
          <Link className="transition hover:text-[#b73375]" href="/cau-chuyen">
            Câu chuyện
          </Link>
          <Link className="transition hover:text-[#b73375]" href="/lien-he">
            Liên hệ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {onSearchChange && (
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
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm bánh hôm nay..."
                type="search"
                value={searchValue}
              />
            </label>
          )}

          <Link
            aria-label="Giỏ hàng"
            className="grid h-9 w-9 place-items-center rounded-full text-[#9a2a54] transition hover:bg-white"
            href="/cart"
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
          </Link>

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
                    {user?.phone || "Chưa cập nhật số điện thoại"}
                  </p>
                </div>

                <button
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-[#6c514c] transition hover:bg-[#fff7fa] hover:text-[#b73375]"
                  onClick={() => setAccountDetailsOpen((current) => !current)}
                  type="button"
                >
                  <span>Thông tin tài khoản</span>
                  <span className="text-lg leading-none">
                    {accountDetailsOpen ? "-" : "+"}
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
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onLogout();
                  }}
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
  );
}
