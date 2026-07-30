import { useEffect, useRef, useState } from "react";
import { UserItem } from "@/src/services/userService";
import { formatCurrency, getBadgeStyle } from "@/src/utils/userHelper";

interface UserTableProps {
  users: UserItem[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  total: number;
  limit: number;
  onEdit: (user: UserItem) => void;
  onToggleStatus: (id: string, status: boolean) => void;
}

export default function UserTable({
  users,
  loading,
  page,
  setPage,
  total,
  limit,
  onEdit,
  onToggleStatus,
}: UserTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const totalPages = Math.ceil(total / limit) || 1;

  return (
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
                          onClick={() => {
                            onEdit(item);
                            setActiveMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#5a342f] hover:bg-[#fceae3] transition"
                        >
                          <svg className="h-4 w-4 text-[#8d7974]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Sửa thông tin</span>
                        </button>

                        <button
                          onClick={() => {
                            onToggleStatus(item._id, item.isActive);
                            setActiveMenuId(null);
                          }}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${page === p
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
  );
}
