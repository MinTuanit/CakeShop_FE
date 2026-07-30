"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus, UserItem, UserStats } from "@/src/services/userService";
import UserModal from "./components/UserModal";
import UserStatsCards from "./components/UserStatsCards";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Actions
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      fetchData();
    } catch (error) {
      console.error("Failed to update customer status:", error);
    }
  };

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

        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-[#b73375] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#b73375]/30 hover:bg-[#9c265f] transition-all self-start md:self-auto"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm khách hàng
        </button>
      </div>

      {/* Statistics Cards Row */}
      <UserStatsCards stats={stats} />

      {/* Filters and Sorting controls */}
      <UserFilters
        tab={tab}
        setTab={setTab}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setPage={setPage}
      />

      <UserTable
        users={users}
        loading={loading}
        page={page}
        setPage={setPage}
        total={total}
        limit={limit}
        onEdit={(user) => {
          setEditingUser(user);
          setIsModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Customer Data Table */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSuccess={() => {
          fetchData(); // Reload data after edit/add
        }}
      />
    </div>

  );
}
