import { UserStats } from "@/src/services/userService";
import { formatCurrency } from "@/src/utils/userHelper";

interface UserStatsCardsProps {
  stats: UserStats;
}

export default function UserStatsCards({ stats }: UserStatsCardsProps) {
  return (
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
  );
}
