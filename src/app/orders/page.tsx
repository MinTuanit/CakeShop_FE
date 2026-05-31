"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/src/components/Footer";
import ShopHeader from "@/src/components/ShopHeader";
import apiClient from "@/src/services/apiClient";
import { getMyOrders } from "@/src/services/orderService";
import type { Order, OrderItem, OrderStatus } from "@/src/types/order";
import type { User } from "@/src/types/user";
import { formatCategory, formatCurrency } from "@/src/utils/products";

type UserResponse = User | { user?: User } | null | undefined;
type OrderFilter = "all" | OrderStatus;

type StatusMeta = {
  label: string;
  description: string;
  badgeClass: string;
  dotClass: string;
};

const statusMeta: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: "Chờ xử lý",
    description: "Tiệm đã nhận đơn và đang kiểm tra thông tin.",
    badgeClass: "bg-[#fff8df] text-[#8a6420]",
    dotClass: "bg-[#d99a2b]",
  },
  confirmed: {
    label: "Đã xác nhận",
    description: "Đơn hàng đã được xác nhận.",
    badgeClass: "bg-[#eef7f1] text-[#2f7560]",
    dotClass: "bg-[#2f7560]",
  },
  preparing: {
    label: "Đang chuẩn bị",
    description: "Bếp đang chuẩn bị bánh và phụ kiện.",
    badgeClass: "bg-[#fff0f5] text-[#b73375]",
    dotClass: "bg-[#c33a78]",
  },
  shipping: {
    label: "Đang giao",
    description: "Đơn hàng đang trên đường giao tới bạn.",
    badgeClass: "bg-[#edf5ff] text-[#285f9d]",
    dotClass: "bg-[#3978b8]",
  },
  completed: {
    label: "Hoàn tất",
    description: "Đơn hàng đã được giao thành công.",
    badgeClass: "bg-[#e9f7ef] text-[#20724b]",
    dotClass: "bg-[#20724b]",
  },
  cancelled: {
    label: "Đã hủy",
    description: "Đơn hàng đã bị hủy.",
    badgeClass: "bg-[#fff0f0] text-[#b42323]",
    dotClass: "bg-[#b42323]",
  },
};

const statusSteps: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "Nhận đơn" },
  { value: "confirmed", label: "Xác nhận" },
  { value: "preparing", label: "Chuẩn bị" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
];

const statusFilters: Array<{ value: OrderFilter; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "preparing", label: "Đang chuẩn bị" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã hủy" },
];

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa có thời gian";
  }

  return dateTimeFormatter.format(date);
}

function compactOrderId(id: string) {
  if (id.length <= 12) {
    return id;
  }

  return `${id.slice(0, 6)}...${id.slice(-6)}`;
}

function initials(name?: string) {
  return (name || "MT")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function OrderItemImage({ item }: { item: OrderItem }) {
  if (item.imageUrl) {
    return (
      <div
        aria-label={item.name}
        className="h-16 w-16 shrink-0 rounded-lg bg-[#eaded8] bg-cover bg-center shadow-sm"
        role="img"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />
    );
  }

  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#f1d7cb,#8d143d)] font-serif text-base font-bold text-white shadow-sm">
      {initials(item.name)}
    </div>
  );
}

function OrderStatusTrack({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="mt-5 rounded-lg border border-[#f3caca] bg-[#fff6f6] px-4 py-3 text-sm font-semibold text-[#9c2626]">
        Đơn hàng đã hủy, tiến trình giao hàng đã dừng.
      </div>
    );
  }

  const activeIndex = statusSteps.findIndex((step) => step.value === status);

  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-5">
      {statusSteps.map((step, index) => {
        const isActive = index <= activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <div
            className={`rounded-lg border px-3 py-3 ${
              isActive
                ? "border-[#d9c9c2] bg-[#fffaf7]"
                : "border-[#eee3de] bg-[#fbf8f5] text-[#a59591]"
            }`}
            key={step.value}
          >
            <div className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[0.7rem] font-bold ${
                  isActive
                    ? "bg-[#c33a78] text-white"
                    : "bg-[#e5dbd6] text-[#8d7974]"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-xs font-bold ${
                  isCurrent ? "text-[#8d143d]" : "text-[#5a342f]"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const meta = statusMeta[order.status];

  return (
    <article className="rounded-lg bg-white p-5 shadow-[0_16px_38px_rgba(108,63,57,0.08)] ring-1 ring-[#efe4df] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-bold ${meta.badgeClass}`}
            >
              <span className={`mr-2 h-2 w-2 rounded-full ${meta.dotClass}`} />
              {meta.label}
            </span>
            <span className="text-xs font-semibold text-[#9d7d76]">
              {formatDateTime(order.createdAt)}
            </span>
          </div>

          <h2 className="mt-3 text-xl font-bold text-[#5a342f]">
            Đơn #{compactOrderId(order._id)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8d7974]">
            {meta.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-64">
          <div className="rounded-lg border border-[#f0e5e0] px-4 py-3">
            <p className="text-xs font-semibold text-[#9d7d76]">Sản phẩm</p>
            <p className="mt-1 text-lg font-extrabold text-[#5a342f]">
              {order.totalItems}
            </p>
          </div>
          <div className="rounded-lg border border-[#f0e5e0] px-4 py-3">
            <p className="text-xs font-semibold text-[#9d7d76]">Tổng tiền</p>
            <p className="mt-1 text-lg font-extrabold text-[#c33a78]">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <OrderStatusTrack status={order.status} />

      <div className="mt-6 grid gap-6 border-t border-[#f0e5e0] pt-5 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              className="grid grid-cols-[4rem_1fr] gap-3 border-b border-[#f3ebe6] pb-4 last:border-b-0 last:pb-0"
              key={`${order._id}-${item.product}`}
            >
              <OrderItemImage item={item} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eef7f1] px-3 py-1 text-[0.68rem] font-bold text-[#2f7560]">
                    {formatCategory(item.category)}
                  </span>
                  <span className="rounded-full bg-[#fbf1eb] px-3 py-1 text-[0.68rem] font-bold text-[#8d5b50]">
                    x{item.quantity}
                  </span>
                </div>
                <Link
                  className="mt-2 block text-sm font-bold leading-5 text-[#5a342f] transition hover:text-[#b73375]"
                  href={`/products/${item.product}`}
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs font-semibold text-[#9d7d76]">
                  {formatCurrency(item.price)} mỗi sản phẩm
                </p>
                <p className="mt-2 text-sm font-extrabold text-[#c33a78]">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs font-bold text-[#9d7d76]">Người nhận</dt>
            <dd className="mt-1 font-bold text-[#5a342f]">
              {order.customerName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-[#9d7d76]">Số điện thoại</dt>
            <dd className="mt-1 font-bold text-[#5a342f]">{order.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-[#9d7d76]">Địa chỉ giao</dt>
            <dd className="mt-1 leading-6 text-[#6f5b57]">
              {order.deliveryAddress}
            </dd>
          </div>
          {order.note && (
            <div>
              <dt className="text-xs font-bold text-[#9d7d76]">Ghi chú</dt>
              <dd className="mt-1 leading-6 text-[#6f5b57]">{order.note}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("all");

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const [userResponse, ordersResponse] = await Promise.all([
          apiClient.get<UserResponse>("/users/me", { withCredentials: true }),
          getMyOrders(),
        ]);

        if (!mounted) {
          return;
        }

        setUser(resolveUser(userResponse.data));
        setOrders(ordersResponse.data);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        const status = axios.isAxiosError(loadError)
          ? loadError.response?.status
          : undefined;

        if (status === 401 || status === 403) {
          router.push("/login");
          return;
        }

        setError(apiMessage(loadError, "Không thể tải lịch sử đặt hàng."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      mounted = false;
    };
  }, [router]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  const counts = useMemo(() => {
    return orders.reduce<Record<OrderFilter, number>>(
      (result, order) => {
        result.all += 1;
        result[order.status] += 1;
        return result;
      },
      {
        all: 0,
        pending: 0,
        confirmed: 0,
        preparing: 0,
        shipping: 0,
        completed: 0,
        cancelled: 0,
      },
    );
  }, [orders]);

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled",
  ).length;
  const completedOrders = counts.completed;
  const latestOrder = orders[0];

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fbf5f1] text-[#7f5149]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-[#c43d7c]/20" />
          <p className="text-sm font-semibold">Đang tải lịch sử đặt hàng</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf5f1] text-[#4f342f]">
      <ShopHeader onLogout={handleLogout} user={user} />

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-[#b73375]">
              Lịch sử đặt hàng
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#5a342f] sm:text-5xl">
              Theo dõi đơn bánh của bạn
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8d7974]">
              Xem lại các đơn đã đặt, trạng thái xử lý, thông tin giao hàng và
              danh sách sản phẩm trong từng đơn.
            </p>
          </div>

          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#c33a78] px-6 text-sm font-bold text-white shadow-[0_14px_26px_rgba(195,58,120,0.18)] transition hover:-translate-y-0.5"
            href="/overview#san-pham"
          >
            Đặt thêm bánh
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white px-5 py-4 shadow-[0_14px_30px_rgba(108,63,57,0.07)] ring-1 ring-[#efe4df]">
            <p className="text-xs font-bold text-[#9d7d76]">Tổng số đơn</p>
            <p className="mt-2 text-3xl font-extrabold text-[#5a342f]">
              {orders.length}
            </p>
          </div>
          <div className="rounded-lg bg-white px-5 py-4 shadow-[0_14px_30px_rgba(108,63,57,0.07)] ring-1 ring-[#efe4df]">
            <p className="text-xs font-bold text-[#9d7d76]">Đang xử lý</p>
            <p className="mt-2 text-3xl font-extrabold text-[#c33a78]">
              {activeOrders}
            </p>
          </div>
          <div className="rounded-lg bg-white px-5 py-4 shadow-[0_14px_30px_rgba(108,63,57,0.07)] ring-1 ring-[#efe4df]">
            <p className="text-xs font-bold text-[#9d7d76]">Đã hoàn tất</p>
            <p className="mt-2 text-3xl font-extrabold text-[#2f7560]">
              {completedOrders}
            </p>
          </div>
        </div>

        {latestOrder && (
          <div className="mt-5 rounded-lg border border-[#eaded8] bg-[#fffaf7] px-5 py-4 text-sm text-[#6f5b57]">
            Đơn mới nhất:{" "}
            <strong className="text-[#5a342f]">
              #{compactOrderId(latestOrder._id)}
            </strong>{" "}
            đang ở trạng thái{" "}
            <strong className="text-[#8d143d]">
              {statusMeta[latestOrder.status].label}
            </strong>
            .
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-[#f2c3d4] bg-[#fff0f5] px-5 py-4 text-sm font-semibold text-[#b4235d]">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {statusFilters.map((item) => {
            const active = filter === item.value;

            return (
              <button
                className={`h-10 shrink-0 rounded-full px-4 text-sm font-bold transition ${
                  active
                    ? "bg-[#5a342f] text-white"
                    : "bg-white text-[#7f6d69] ring-1 ring-[#eaded8] hover:bg-[#fff7fa] hover:text-[#b73375]"
                }`}
                key={item.value}
                onClick={() => setFilter(item.value)}
                type="button"
              >
                {item.label} ({counts[item.value]})
              </button>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[#eaded8] bg-white px-6 py-14 text-center shadow-[0_18px_42px_rgba(108,63,57,0.08)]">
            <h2 className="text-2xl font-bold text-[#8d143d]">
              Chưa có đơn hàng nào
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8d7974]">
              Khi bạn đặt bánh hoặc thanh toán VNPay, đơn hàng sẽ xuất hiện ở
              đây để tiện theo dõi trạng thái.
            </p>
            <Link
              className="mt-7 inline-flex h-11 items-center rounded-full bg-[#c33a78] px-7 text-sm font-bold text-white"
              href="/overview#san-pham"
            >
              Chọn sản phẩm
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[#eaded8] bg-white px-6 py-10 text-center shadow-[0_18px_42px_rgba(108,63,57,0.08)]">
            <h2 className="text-xl font-bold text-[#5a342f]">
              Không có đơn trong trạng thái này
            </h2>
            <p className="mt-3 text-sm text-[#8d7974]">
              Chọn bộ lọc khác để xem toàn bộ lịch sử đặt hàng.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
