interface UserFiltersProps {
  tab: string;
  setTab: (tab: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  setPage: (page: number) => void;
}

export default function UserFilters({
  tab,
  setTab,
  sortBy,
  setSortBy,
  setPage,
}: UserFiltersProps) {
  return (
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
  );
}
