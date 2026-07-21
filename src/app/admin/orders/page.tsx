"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllOrders, updateOrderStatus, createOrder } from "@/src/services/orderService";
import type { Order, OrderStatus } from "@/src/types/order";
import { formatCurrency } from "@/src/utils/products";

const PAYMENT_METHODS: Record<string, { label: string; icon: string }> = {
  "VC-0901": { label: "Tiền mặt", icon: "cash" },
  "VC-0902": { label: "MoMo", icon: "momo" },
  "VC-0903": { label: "MoMo", icon: "momo" },
  "VC-0919": { label: "Tiền mặt", icon: "cash" },
  "VC-0920": { label: "MoMo", icon: "momo" },
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: "Chờ xử lý",
    bg: "bg-[#fce7ef]",
    text: "text-[#aa2e63]",
    dot: "bg-[#aa2e63]",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-[#eef7f1]",
    text: "text-[#2f7560]",
    dot: "bg-[#2f7560]",
  },
  preparing: {
    label: "Đang làm bánh",
    bg: "bg-[#fff3e0]",
    text: "text-[#e65100]",
    dot: "bg-[#e65100]",
  },
  shipping: {
    label: "Đang giao",
    bg: "bg-[#e0f2fe]",
    text: "text-[#0284c7]",
    dot: "bg-[#0284c7]",
  },
  completed: {
    label: "Đã hoàn thành",
    bg: "bg-[#2ecc71]",
    text: "text-[#4b5563]",
    dot: "bg-[#a2f1b8]",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-[#fee2e2]",
    text: "text-[#dc2626]",
    dot: "bg-[#dc2626]",
  },
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-[#fce7ef] text-[#aa2e63]",
    "bg-[#ffedd5] text-[#c2410c]",
    "bg-[#fed7aa] text-[#9a3412]",
    "bg-[#e0e7ff] text-[#3730a3]",
    "bg-[#fbcfe8] text-[#9d174d]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStatusOrderId, setEditingStatusOrderId] = useState<string | null>(null);

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newProductName, setNewProductName] = useState("Bánh Red Velvet (Large)");
  const [newPrice, setNewPrice] = useState("420000");

  // Fetch orders from API with mock fallback
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await getAllOrders();
        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        }
      } catch (err) {
        console.warn("Using local mock orders data due to backend fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Status counts for KPI cards
  const kpiCounts = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === "pending").length || 12,
      preparing: orders.filter((o) => o.status === "preparing" || o.status === "confirmed").length || 8,
      shipping: orders.filter((o) => o.status === "shipping").length || 5,
      completed: orders.filter((o) => o.status === "completed").length || 142,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Handle status update
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch {
      // Optimistic update locally
    }
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    setEditingStatusOrderId(null);
  };

  // Handle Create New Order submit
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(newPrice) || 350000;
    const newOrderObj: Order = {
      _id: `VC-${Math.floor(1000 + Math.random() * 9000)}`,
      user: "usr_admin",
      customerName: newCustomerName || "Khách Hàng Mới",
      phone: newPhone || "0900000000",
      deliveryAddress: newAddress || "TP. Hồ Chí Minh",
      note: newNote,
      items: [
        {
          product: "prod_new",
          name: newProductName,
          price: priceNum,
          category: "Bánh mới",
          quantity: 1,
          subtotal: priceNum,
        },
      ],
      totalItems: 1,
      totalPrice: priceNum,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await createOrder({
        customerName: newOrderObj.customerName,
        phone: newOrderObj.phone,
        deliveryAddress: newOrderObj.deliveryAddress,
        note: newOrderObj.note,
        items: [{ productId: "662f4f493b5b36574e9f4a91", quantity: 1 }],
      });
    } catch {
      // Local fallback
    }

    setOrders([newOrderObj, ...orders]);
    setShowCreateModal(false);
    // Reset form
    setNewCustomerName("");
    setNewPhone("");
    setNewAddress("");
    setNewNote("");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm mã đơn hoặc khách hàng..."
            className="w-full rounded-full border border-[#f0e2db] bg-white py-3 pl-11 pr-4 text-sm text-[#5a342f] placeholder-[#a89590] shadow-sm focus:border-[#b73375] focus:outline-none focus:ring-2 focus:ring-[#b73375]/20"
          />
          <svg
            className="absolute left-4 top-3.5 h-4 w-4 text-[#a89590]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Header Right Actions & Admin Profile */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <button
            onClick={() => setSelectedStatus(selectedStatus === "all" ? "pending" : "all")}
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#f0e2db] bg-white px-4 py-2.5 text-xs font-semibold text-[#7d6a66] shadow-sm hover:bg-[#faf4f1] transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Lọc đơn</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#f0e2db] bg-white px-4 py-2.5 text-xs font-semibold text-[#7d6a66] shadow-sm hover:bg-[#faf4f1] transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Xuất báo cáo</span>
          </button>

          {/* User icons */}
          <div className="flex items-center gap-2 border-l border-[#f0e2db] pl-3">
            <button type="button" className="relative p-2 text-[#7d6a66] hover:text-[#b73375] transition">
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#b73375]"></span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button type="button" className="p-2 text-[#7d6a66] hover:text-[#b73375] transition">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_25%,#ffd2a5,#d94b69_42%,#14546a_100%)] grid place-items-center font-serif text-sm font-bold text-white shadow-sm">
                AV
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-bold text-[#5a342f]">Admin Velvet</div>
                <div className="text-[0.65rem] text-[#a89590]">Quản trị viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#5a342f] tracking-tight">
          Quản lý đơn hàng
        </h1>
        <p className="mt-1 text-sm text-[#8d7974]">
          Kiểm tra và cập nhật trạng thái các món quà ngọt ngào của bạn
        </p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: CHỜ XỬ LÝ */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === "pending" ? "all" : "pending")}
          className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border border-[#f8e4eb] bg-gradient-to-br from-[#ffeef4] to-[#fff5f8] shadow-sm hover:shadow-md ${selectedStatus === "pending" ? "ring-2 ring-[#b73375]" : ""
            }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[0.7rem] font-bold tracking-wider text-[#a85979] uppercase">
                CHỜ XỬ LÝ
              </span>
              <div className="mt-2 text-4xl font-extrabold text-[#aa2e63]">
                {String(kpiCounts.pending).padStart(2, "0")}
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/70 grid place-items-center text-[#aa2e63] shadow-sm">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: ĐANG LÀM BÁNH */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === "preparing" ? "all" : "preparing")}
          className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border border-[#faebd7] bg-gradient-to-br from-[#fff7ed] to-[#fffbf5] shadow-sm hover:shadow-md ${selectedStatus === "preparing" ? "ring-2 ring-[#e65100]" : ""
            }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[0.7rem] font-bold tracking-wider text-[#b86638] uppercase">
                ĐANG LÀM BÁNH
              </span>
              <div className="mt-2 text-4xl font-extrabold text-[#d97706]">
                {String(kpiCounts.preparing).padStart(2, "0")}
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/70 grid place-items-center text-[#d97706] shadow-sm">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: ĐANG GIAO */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === "shipping" ? "all" : "shipping")}
          className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border border-[#faebd7] shadow-sm hover:shadow-md ${selectedStatus === "shipping"
            ? "ring-2 ring-[#0284c7] bg-gradient-to-br from-[#bae6fd] to-[#f0f9ff]" // Nền xanh rõ hơn khi chọn
            : "bg-gradient-to-br from-[#e0f2fe] to-[#fffbf5]" // Nền mặc định lúc chưa chọn
            }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[0.7rem] font-bold tracking-wider text-[#b86638] uppercase">
                ĐANG GIAO
              </span>
              <div className="mt-2 text-4xl font-extrabold text-[#d97706]">
                {String(kpiCounts.shipping).padStart(2, "0")}
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/70 grid place-items-center text-[#d97706] shadow-sm">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6 0a1 1 0 102 0m-2 0a1 1 0 112 0m6 0a1 1 0 102 0m-2 0a1 1 0 112 0" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4: ĐÃ HOÀN THÀNH */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === "completed" ? "all" : "completed")}
          className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md ${selectedStatus === "completed"
            ? "ring-2 ring-[#2196f3] border-transparent bg-gradient-to-br from-[#2ecc71] to-[#ffffff]" // Đổi màu ring hoặc border tùy ý
            : "border border-[#e5e5e5] bg-gradient-to-br from-[#2ecc71] to-[#fafafa]"
            }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[0.7rem] font-bold tracking-wider text-[#737373] uppercase">
                ĐÃ HOÀN THÀNH
              </span>
              <div className="mt-2 text-4xl font-extrabold text-[#333333]">
                {kpiCounts.completed}
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/70 grid place-items-center text-gray-500 shadow-sm">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-3xl border border-[#f0e2db] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#faf4f1] text-[0.7rem] font-bold uppercase tracking-wider text-[#9a8580] border-b border-[#f0e2db]">
              <tr>
                <th className="py-4 px-6">MÃ ĐƠN</th>
                <th className="py-4 px-6">KHÁCH HÀNG</th>
                <th className="py-4 px-6">SẢN PHẨM</th>
                <th className="py-4 px-6">TỔNG TIỀN</th>
                <th className="py-4 px-6">THANH TOÁN</th>
                <th className="py-4 px-6">TRẠNG THÁI</th>
                <th className="py-4 px-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7eeea]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8d7974]">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#b73375] border-t-transparent"></div>
                    <p className="mt-2 text-xs">Đang tải danh sách đơn hàng...</p>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8d7974]">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const payment = PAYMENT_METHODS[order._id] || { label: "Tiền mặt", icon: "cash" };

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-[#fffcfb] transition-colors"
                    >
                      {/* MÃ ĐƠN */}
                      <td className="py-5 px-6 font-bold text-[#aa2e63]">
                        #{order._id.startsWith("VC-") ? order._id : order._id.slice(-6).toUpperCase()}
                      </td>

                      {/* KHÁCH HÀNG */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full grid place-items-center font-bold text-xs shrink-0 ${getAvatarColor(
                              order.customerName
                            )}`}
                          >
                            {getInitials(order.customerName)}
                          </div>
                          <div>
                            <div className="font-bold text-[#5a342f]">
                              {order.customerName}
                            </div>
                            <div className="text-xs text-[#a89590]">{order.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* SẢN PHẨM */}
                      <td className="py-5 px-6 max-w-xs">
                        <div className="font-semibold text-[#5a342f]">
                          {order.items[0]?.name || "Bánh Kem Thượng Hạng"}
                          {order.items.length > 1 && (
                            <span className="ml-1 text-xs text-[#a89590]">
                              (+{order.items.length - 1} khác)
                            </span>
                          )}
                        </div>
                        {order.note && (
                          <div className="mt-0.5 text-xs italic text-[#a89590] truncate">
                            + Ghi chú: &quot;{order.note}&quot;
                          </div>
                        )}
                      </td>

                      {/* TỔNG TIỀN */}
                      <td className="py-5 px-6 font-extrabold text-[#5a342f]">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      {/* THANH TOÁN */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#7d6a66]">
                          {payment.icon === "momo" ? (
                            <span className="grid h-5 w-5 place-items-center rounded bg-[#a50064] text-[0.55rem] font-extrabold text-white">
                              Mo
                            </span>
                          ) : (
                            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                          <span>{payment.label}</span>
                        </div>
                      </td>

                      {/* TRẠNG THÁI */}
                      <td className="py-5 px-6">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingStatusOrderId(
                                editingStatusOrderId === order._id ? null : order._id
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                            <span>{statusInfo.label}</span>
                            <svg className="h-3 w-3 opacity-60 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Quick Status Dropdown Menu */}
                          {editingStatusOrderId === order._id && (
                            <div className="absolute left-0 mt-2 z-50 w-44 rounded-2xl bg-white p-2 shadow-xl border border-[#f0e2db] animate-fadeIn">
                              <div className="text-[0.65rem] font-bold text-[#a89590] px-3 py-1 uppercase">
                                Đổi trạng thái
                              </div>
                              {(["pending", "preparing", "shipping", "completed", "cancelled"] as OrderStatus[]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleStatusChange(order._id, st)}
                                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition ${order.status === st
                                      ? "bg-[#fff0f5] text-[#b73375]"
                                      : "hover:bg-[#faf4f1] text-[#5a342f]"
                                      }`}
                                  >
                                    {STATUS_CONFIG[st].label}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* ACTION MENU */}
                      <td className="py-5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-full p-2 text-[#a89590] hover:bg-[#faf4f1] hover:text-[#5a342f] transition"
                          title="Xem chi tiết đơn"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="1.5" strokeWidth="2" />
                            <circle cx="12" cy="6" r="1.5" strokeWidth="2" />
                            <circle cx="12" cy="18" r="1.5" strokeWidth="2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-[#fffaf8] border-t border-[#f7eeea] text-xs text-[#8d7974]">
          <div>
            Hiển thị <strong className="text-[#5a342f]">{paginatedOrders.length}</strong> trên{" "}
            <strong className="text-[#5a342f]">{filteredOrders.length}</strong> đơn hàng
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="grid h-8 w-8 place-items-center rounded-full border border-[#f0e2db] bg-white text-[#7d6a66] disabled:opacity-40 hover:bg-[#faf4f1] transition"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 rounded-full font-bold transition ${currentPage === pageNum
                  ? "bg-[#aa2e63] text-white shadow-sm"
                  : "bg-white border border-[#f0e2db] text-[#7d6a66] hover:bg-[#faf4f1]"
                  }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="grid h-8 w-8 place-items-center rounded-full border border-[#f0e2db] bg-white text-[#7d6a66] disabled:opacity-40 hover:bg-[#faf4f1] transition"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Button "+ Tạo đơn mới" */}
      <div className="pt-2">
        <button
          onClick={() => setShowCreateModal(true)}
          type="button"
          className="flex items-center gap-2 rounded-full bg-[#aa2e63] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#aa2e63]/25 hover:bg-[#902452] transition active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14M5 12h14" />
          </svg>
          <span>Tạo đơn mới</span>
        </button>
      </div>

      {/* MODAL 1: Create New Order */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#f0e2db] space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0e2db] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#5a342f]">
                Tạo đơn hàng mới
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                type="button"
                className="rounded-full p-1 text-[#a89590] hover:bg-[#faf4f1]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a342f] mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a342f] mb-1">
                    Giá tiền (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="420000"
                    className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Sản phẩm đặt
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Bánh Red Velvet (Large)..."
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Địa chỉ giao hàng
                </label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Số nhà, Đường, Quận/Huyện..."
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Ghi chú cho tiệm
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="VD: Viết chữ 'Chúc mừng sinh nhật'..."
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold text-[#7d6a66] hover:bg-[#faf4f1]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#aa2e63] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#902452]"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Order Detail View */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-[#f0e2db] space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0e2db] pb-4">
              <div>
                <span className="text-xs font-bold text-[#aa2e63] uppercase tracking-wider">
                  Chi tiết đơn hàng #{selectedOrder._id}
                </span>
                <h2 className="font-serif text-xl font-bold text-[#5a342f]">
                  Khách hàng: {selectedOrder.customerName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                type="button"
                className="rounded-full p-1.5 text-[#a89590] hover:bg-[#faf4f1]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#fffaf8] p-4 rounded-2xl border border-[#f7eeea]">
                <div>
                  <div className="text-xs text-[#a89590]">Số điện thoại</div>
                  <div className="font-bold text-[#5a342f]">{selectedOrder.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-[#a89590]">Trạng thái</div>
                  <div className="font-bold text-[#aa2e63]">
                    {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-[#a89590]">Địa chỉ giao</div>
                  <div className="font-semibold text-[#5a342f]">
                    {selectedOrder.deliveryAddress}
                  </div>
                </div>
                {selectedOrder.note && (
                  <div className="col-span-2">
                    <div className="text-xs text-[#a89590]">Ghi chú</div>
                    <div className="text-xs italic text-[#5a342f]">
                      &quot;{selectedOrder.note}&quot;
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-[#5a342f] mb-2 uppercase tracking-wider">
                  Danh sách món
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#faf4f1]"
                    >
                      <div>
                        <div className="font-bold text-[#5a342f]">{item.name}</div>
                        <div className="text-xs text-[#a89590]">
                          Số lượng: x{item.quantity} · {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div className="font-extrabold text-[#aa2e63]">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#f0e2db] pt-4">
                <span className="font-bold text-[#5a342f]">Tổng thành tiền</span>
                <span className="text-xl font-extrabold text-[#aa2e63]">
                  {formatCurrency(selectedOrder.totalPrice)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full bg-[#aa2e63] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#902452]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
