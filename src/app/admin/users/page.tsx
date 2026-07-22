"use client";

import { useEffect, useState, useRef } from "react";
import { getAllUsers, updateUserStatus, UserItem, UserStats } from "@/src/services/userService";
import dayjs from "dayjs";

export default function AdminUsersPage() {
  // State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<UserStats>({
    totalCustomers: 0,
    averageSpending: 0,
    activeRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all"); // all, active, vip, inactive
  const [sortBy, setSortBy] = useState("recent"); // recent, spending, name
  const [page, setPage] = useState(1);
  const limit = 10;

  // UI state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers({
        page,
        limit,
        search,
        tab,
        sortBy,
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setStats(res.data.stats);
    } catch (error) {
      console.error("Failed to load customers data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, tab, sortBy]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Click outside menu closer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actions
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      setActiveMenuId(null);
      // Reload current page
      fetchData();
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái tài khoản.");
    }
  };

  // Helper formats
  const formatCurrency = (val: number) => {
    return val.toLocaleString("vi-VN") + "đ";
  };

  const getBadgeStyle = (badgeName: string) => {
    const name = badgeName.toUpperCase();
    if (name.includes("VIP")) {
      return "bg-[#fce7ef] text-[#b73375] border border-[#f8c6d8]";
    } else if (name.includes("CHOCO")) {
      return "bg-[#fff4ef] text-[#bf5a3f] border border-[#fddbd0]";
    } else if (name.includes("VELVET") || name.includes("VANILLA")) {
      return "bg-[#fbf2ed] text-[#7d6a66] border border-[#ecdcd4]";
    }
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  // Calculate pages
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-[#a88a83]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-[#f4e8e1] bg-white py-2.5 pl-12 pr-6 text-sm text-[#5a342f] placeholder-[#a88a83] shadow-sm outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
          />
        </div>

        {/* Right Icons & Quick Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-full p-2 text-[#7d6a66] hover:bg-[#f6eae3] transition">
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#b73375]"></span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Mail */}
          <button className="rounded-full p-2 text-[#7d6a66] hover:bg-[#f6eae3] transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Settings */}
          <button className="rounded-full p-2 text-[#7d6a66] hover:bg-[#f6eae3] transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#5a342f] md:text-4xl">
            Quản lý <span className="font-serif italic text-[#8d143d] font-normal">Khách hàng</span>
          </h1>
          <p className="mt-2 text-sm text-[#8d7974]">
            Theo dõi hành trình ngọt ngào của khách hàng và tối ưu hóa trải nghiệm của họ tại Velvet & Crumb.
          </p>
        </div>
        <button className="flex items-center gap-2 self-start rounded-full border border-[#f4e8e1] bg-white px-5 py-2.5 text-sm font-bold text-[#5a342f] shadow-sm hover:bg-[#fdfaf8] active:scale-95 transition">
          <svg className="h-4 w-4 text-[#8d143d]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers Card - Brand Pink */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9c265f] to-[#b73375] p-6 text-white shadow-lg shadow-[#b73375]/15">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#fde4ee]">Tổng số khách hàng</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight">
                {stats.totalCustomers.toLocaleString("vi-VN")}
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                +12% tháng này
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#fde4ee]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
            </svg>
            <span>Tăng trưởng ổn định từ quý 3</span>
          </div>
        </div>

        {/* Average Spending Card - Light Peach */}
        <div className="rounded-3xl border border-[#f4e8e1] bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a88a83]">Chi tiêu trung bình</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-[#5a342f]">
                {formatCurrency(stats.averageSpending)}
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-[#8d7974]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fdf0f5] text-[#b73375]">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Khách hàng trung thành</span>
          </div>
        </div>

        {/* Active Rate Card - Light Peach */}
        <div className="rounded-3xl border border-[#f4e8e1] bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a88a83]">Trạng thái hoạt động</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-[#5a342f]">
                {stats.activeRate}%
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-[#8d7974]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#edfbf0] text-[#2a7a3a]">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Tương tác cao</span>
          </div>
        </div>
      </div>

      {/* Filters and Sorting controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f4e8e1] pb-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tất cả" },
            { id: "active", label: "Đang hoạt động" },
            { id: "vip", label: "VIP" },
            { id: "inactive", label: "Ngừng hoạt động" },
          ].map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setPage(1);
                }}
                className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#b73375] text-white shadow-md shadow-[#b73375]/10"
                    : "bg-[#fceae3]/60 text-[#7d6a66] hover:bg-[#fceae3] hover:text-[#5a342f]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end">
          <span className="text-xs font-semibold text-[#8d7974]">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="rounded-full border border-[#f4e8e1] bg-white px-4 py-1.5 text-xs font-bold text-[#5a342f] outline-none shadow-sm focus:border-[#b73375]"
          >
            <option value="recent">Gần đây nhất</option>
            <option value="spending">Tổng chi tiêu</option>
            <option value="name">Tên khách hàng</option>
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="overflow-hidden rounded-3xl border border-[#f4e8e1] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-[#5a342f]">
            <thead>
              <tr className="border-b border-[#f4e8e1] bg-[#fffaf8] text-xs font-bold uppercase tracking-wider text-[#a88a83]">
                <th className="px-6 py-4.5">Khách hàng</th>
                <th className="px-6 py-4.5">Liên hệ</th>
                <th className="px-6 py-4.5">Tổng chi tiêu</th>
                <th className="px-6 py-4.5">Trạng thái</th>
                <th className="px-6 py-4.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4e8e1]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b73375] border-t-transparent" />
                      <p className="text-sm font-semibold text-[#8d7974]">Đang tải danh sách khách hàng...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-sm font-semibold text-[#8d7974]">
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item._id} className="hover:bg-[#fffcfb]/60 transition">
                    {/* Customer */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#f4e8e1] bg-[#fffcfb]">
                          {item.avatar ? (
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#fce7ef] font-serif text-base font-bold text-[#b73375]">
                              {item.name[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-[#5a342f]">{item.name}</h4>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest ${getBadgeStyle(
                              item.badge
                            )}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4.5">
                      <div className="text-sm font-medium text-[#5a342f]">
                        {item.email || <span className="italic text-gray-400">Chưa thiết lập email</span>}
                      </div>
                      <div className="text-xs text-[#8d7974]">{item.phone}</div>
                    </td>

                    {/* Spending */}
                    <td className="px-6 py-4.5">
                      <div className="text-sm font-bold text-[#5a342f]">
                        {formatCurrency(item.totalSpending)}
                      </div>
                      <div className="text-xs text-[#8d7974] font-medium">
                        {item.totalOrders} đơn hàng
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4.5">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edfbf0] border border-[#d2f4da] px-2.5 py-1 text-xs font-bold text-[#2a7a3a]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2a7a3a]"></span>
                          <span>Hoạt động</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                          <span>Ngoại tuyến</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="relative px-6 py-4.5 text-right">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === item._id ? null : item._id)
                        }
                        className="rounded-full p-1.5 text-[#8d7974] hover:bg-[#f6eae3] transition"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="5" r="1.5" strokeWidth="2" />
                          <circle cx="12" cy="12" r="1.5" strokeWidth="2" />
                          <circle cx="12" cy="19" r="1.5" strokeWidth="2" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-6 top-12 z-50 w-44 rounded-2xl border border-[#f4e8e1] bg-white p-1.5 shadow-lg text-left"
                        >
                          <button
                            onClick={() => handleToggleStatus(item._id, item.isActive)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#5a342f] hover:bg-[#fff5f2] transition"
                          >
                            {item.isActive ? (
                              <>
                                <svg className="h-4 w-4 text-[#bf5a3f]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
                                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
                                </svg>
                                <span>Khóa tài khoản</span>
                              </>
                            ) : (
                              <>
                                <svg className="h-4 w-4 text-[#2a7a3a]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
                                  <path d="M7 11V7a5 5 0 019.9-1" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>Mở khóa tài khoản</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && users.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#f4e8e1] bg-[#fffaf8] px-6 py-4">
            <span className="text-xs font-semibold text-[#8d7974]">
              Hiển thị {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} trên{" "}
              {total.toLocaleString("vi-VN")} khách hàng
            </span>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8d7974] border border-transparent hover:bg-[#f6eae3] hover:text-[#5a342f] disabled:opacity-40 disabled:hover:bg-transparent transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                // Only show current, first, last, and surrounding pages
                if (totalPages > 5 && p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                  if (p === 2 && page > 3) return <span key={p} className="px-1 text-xs text-[#a88a83]">...</span>;
                  if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="px-1 text-xs text-[#a88a83]">...</span>;
                  return null;
                }

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      page === p
                        ? "bg-[#b73375] text-white shadow-md shadow-[#b73375]/10"
                        : "text-[#7d6a66] border border-[#f4e8e1]/60 bg-white hover:bg-[#f6eae3] hover:text-[#5a342f]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8d7974] border border-transparent hover:bg-[#f6eae3] hover:text-[#5a342f] disabled:opacity-40 disabled:hover:bg-transparent transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
