"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/src/services/userService";

type Props = {
  collapsed?: boolean;
  onToggle?: () => void;
  onCreateOrderClick?: () => void;
};

export default function AdminSidebar({
  collapsed = false,
  onToggle,
  onCreateOrderClick,
}: Props) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; avatar?: string } | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res.data?.user) {
          setAdminUser(res.data.user);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch admin user in sidebar", err);
      });
  }, []);

  const navItems = [
    {
      href: "/admin",
      label: "Tổng quan",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="1.8" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      href: "/admin/orders",
      label: "Đơn hàng",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      href: "/admin/products",
      label: "Sản phẩm",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="1.8" fill="none" />
        </svg>
      ),
    },
    {
      href: "/admin/ingredients",
      label: "Nguyên liệu",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      href: "/admin/users",
      label: "Tài khoản",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full overflow-y-auto bg-[#fffaf8] p-4 border-r border-[#f4e8e1] transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          {/* Header Brand */}
          <div className="mb-8 flex items-center justify-between px-2 pt-2">
            {!collapsed ? (
              <div>
                <Link href="/admin" className="font-serif text-xl font-bold text-[#8d143d] tracking-tight block">
                  Velvet & Crumb
                </Link>
                <span className="text-[0.65rem] font-bold tracking-widest text-[#a88a83] uppercase block mt-0.5">
                  QUẢN TRỊ VIÊN
                </span>
              </div>
            ) : (
              <div className="mx-auto font-serif text-lg font-bold text-[#8d143d]">VC</div>
            )}

            <button
              aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
              className="rounded-full p-1.5 text-[#8d7974] hover:bg-[#f5e9e2] transition"
              onClick={onToggle}
              type="button"
            >
              <svg
                className={`h-4 w-4 transform transition-transform ${collapsed ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path d="M7 6l5 4-5 4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Navigation items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3.5 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#b73375] text-white shadow-md shadow-[#b73375]/20"
                      : "text-[#7d6a66] hover:bg-[#f6eae3] hover:text-[#5a342f]"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  href={item.href}
                >
                  <span className={`shrink-0 ${isActive ? "text-white" : "text-[#7d6a66]"}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom CTA button & Profile */}
        <div className="pt-6 pb-2 border-t border-[#f4e8e1] space-y-4">
          <div>
            {!collapsed ? (
              <button
                onClick={onCreateOrderClick}
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b73375] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#b73375]/25 hover:bg-[#9c265f] transition active:scale-98"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Tạo đơn mới</span>
              </button>
            ) : (
              <button
                onClick={onCreateOrderClick}
                type="button"
                title="Tạo đơn mới"
                className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[#b73375] text-white shadow-lg shadow-[#b73375]/25 hover:bg-[#9c265f] transition"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* User Profile */}
          <div className={`flex items-center gap-3 pt-2 ${collapsed ? "justify-center" : "px-2"}`}>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#f4e8e1] bg-[#fdfaf8]">
              {adminUser?.avatar ? (
                <img
                  src={adminUser.avatar}
                  alt={adminUser.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#fce7ef] font-serif text-sm font-bold text-[#b73375]">
                  {(adminUser?.name || "MA")[0].toUpperCase()}
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-bold text-[#5a342f]">
                  {adminUser?.name || "Marie Antoinette"}
                </p>
                <p className="truncate text-xs font-semibold text-[#a88a83] uppercase tracking-wider">
                  {adminUser?.role === "admin" ? "chủ cửa hàng" : "nhân viên"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
