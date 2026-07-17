"use client";

function RevenueCard() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#fce7ef] to-[#fff4f8] p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-[#8d7974]">Tổng doanh thu tháng này</div>
          <div className="mt-3 text-3xl font-bold text-[#7c153f]">128.450.000đ</div>
          <div className="mt-1 text-xs text-[#8d7974]">Mục tiêu: 150.000.000đ · Đạt: 85%</div>
        </div>
        <div className="h-16 w-40 rounded-lg bg-white/60" />
      </div>
    </div>
  );
}

function SimpleChart() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-[#7d6a66]">Xu hướng doanh thu</div>
      <div className="mt-4 h-40 w-full">
        <svg viewBox="0 0 200 60" className="h-full w-full">
          <path d="M0 40 C 30 30, 60 20, 90 30 C 120 40, 150 10, 200 30" fill="none" stroke="#d37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5a342f]">Báo cáo doanh thu</h1>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-[#b73375] px-4 py-2 text-sm font-semibold text-white">Xuất báo cáo</button>
            <div className="rounded-full bg-white px-3 py-2 text-sm text-[#7d6a66]">Tháng 10, 2023</div>
          </div>
        </div>

        <RevenueCard />

        <div className="grid grid-cols-2 gap-6">
          <SimpleChart />

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-[#7d6a66]">Sản phẩm bán chạy</div>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm">Bánh Kem Socola</span>
                <span className="text-xs text-[#7d6a66]">120 bán</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm">Donut Matcha</span>
                <span className="text-xs text-[#7d6a66]">98 bán</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm">Macaron Mix</span>
                <span className="text-xs text-[#7d6a66]">72 bán</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-[#7d6a66]">Đơn hàng gần đây</div>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Minh Anh</div>
                <div className="text-xs text-[#8d7974]">2 sản phẩm · 450.000đ</div>
              </div>
              <div className="text-sm rounded-full bg-[#e9f7ef] px-3 py-1 text-[#2a7a3a]">Thành công</div>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Hoàng Long</div>
                <div className="text-xs text-[#8d7974]">5 sản phẩm · 1.200.000đ</div>
              </div>
              <div className="text-sm rounded-full bg-[#fff4ef] px-3 py-1 text-[#bf5a3f]">Hoàn tất</div>
            </li>
          </ul>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-[#7d6a66]">Cảnh báo nguyên liệu</div>
          <div className="mt-4 space-y-3 text-sm text-[#8d7974]">
            <div className="flex items-center justify-between">
              <span>Sốt socola</span>
              <strong className="text-[#5a342f]">Hết</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Bột mỳ</span>
              <strong className="text-[#5a342f]">Còn 2kg</strong>
            </div>
          </div>
          <button className="mt-4 w-full rounded-xl bg-[#b73375] px-4 py-2 text-sm font-semibold text-white">Đặt hàng ngay</button>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-[#7d6a66]">Số đơn hàng mới</div>
          <div className="mt-3 text-3xl font-bold text-[#5a342f]">1,248</div>
          <div className="mt-2 text-xs text-[#8d7974]">Hôm nay: 42 đơn</div>
        </div>
      </aside>
    </div>
  );
}
