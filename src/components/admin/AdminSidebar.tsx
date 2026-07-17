import Link from "next/link";

type Props = {
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function AdminSidebar({ collapsed = false, onToggle }: Props) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full overflow-hidden bg-white p-3 shadow-sm transition-width duration-200 ${collapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_35%_25%,#ffd2a5,#d94b69_42%,#14546a_100%)] grid place-items-center text-sm font-bold text-white">MT</div>
              {!collapsed && (
                <span className="text-sm font-semibold text-[#5a342f]">Danh mục quản lý</span>
              )}
            </div>

            <button
              aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
              className="-mr-1 rounded p-1 text-sm text-[#7d6a66] hover:bg-[#f8f1ec]"
              onClick={onToggle}
              type="button"
            >
              <svg
                className={`h-4 w-4 transform transition-transform ${collapsed ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path d="M7 6l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1">
            <Link
              className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#5a342f] hover:bg-[#fff7fa] ${collapsed ? "justify-center" : ""}`}
              href="/admin"
            >
              <span className="h-8 w-8 rounded-full bg-[#fbe6ef] grid place-items-center text-[#b73375]">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1" strokeWidth="1.5" />
                  <rect x="13" y="3" width="8" height="8" rx="1" strokeWidth="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1" strokeWidth="1.5" />
                  <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth="1.5" />
                </svg>
              </span>
              {!collapsed && <span>Tổng quan</span>}
            </Link>

            <Link
              className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#7d6a66] hover:bg-[#fff7fa] ${collapsed ? "justify-center" : ""}`}
              href="/admin/orders"
            >
              <span className="h-8 w-8 rounded-full bg-[#fff0f5] grid place-items-center text-[#bf5a3f]">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 6h13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 12h13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 18h13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="2" y="4" width="4" height="16" rx="1" strokeWidth="1.5" />
                </svg>
              </span>
              {!collapsed && <span>Đơn hàng</span>}
            </Link>

            <Link
              className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#7d6a66] ${collapsed ? "justify-center" : ""}`}
              href="/admin/products"
            >
              <span className="h-8 w-8 rounded-full bg-[#fff4ef] grid place-items-center text-[#7d6a66]">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="1.2" />
                </svg>
              </span>
              {!collapsed && <span>Sản phẩm</span>}
            </Link>

            <Link
              className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#7d6a66] ${collapsed ? "justify-center" : ""}`}
              href="/admin/ingredients"
            >
              <span className="h-8 w-8 rounded-full bg-[#fff7f3] grid place-items-center text-[#7d6a66]">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2c2.21 0 4 1.79 4 4 0 3.31-4 7-4 7s-4-3.69-4-7c0-2.21 1.79-4 4-4z" strokeWidth="1.5" />
                  <path d="M6 18c1.5-2 4-3 6-3s4.5 1 6 3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {!collapsed && <span>Nguyên liệu</span>}
            </Link>

            <Link
              className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-[#7d6a66] ${collapsed ? "justify-center" : ""}`}
              href="/admin/settings"
            >
              <span className="h-8 w-8 rounded-full bg-[#f3eefb] grid place-items-center text-[#7d6a66]">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" strokeWidth="1.2" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.3-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 6.37 2.27l.06.06c.5.5 1.2.7 1.82.33.5-.28 1.08-.28 1.58 0 .62.37 1.32.17 1.82-.33l.06-.06A2 2 0 0 1 14 2.27l.06.06c.5.5 1.2.7 1.82.33.5-.28 1.08-.28 1.58 0 .62.37 1.32.17 1.82-.33l.06-.06A2 2 0 0 1 21.73 6.37l-.06.06c-.28.5-.28 1.08 0 1.58.37.62.17 1.32-.33 1.82l-.06.06A2 2 0 0 1 19.4 15z" strokeWidth="0.6" />
                </svg>
              </span>
              {!collapsed && <span>Cài đặt</span>}
            </Link>
          </nav>
        </div>

        <div className="mt-4 text-center text-xs text-[#8d7974]">v.1.0</div>
      </div>
    </aside>
  );
}

