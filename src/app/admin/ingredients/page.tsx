"use client";

import { useEffect, useMemo, useState } from "react";
import { getImports, createImport, deleteImport } from "@/src/services/importService";
import type { ImportItem, IngredientStatus } from "@/src/types/import";

// Default initial mock data matching Image 2 perfectly
const MOCK_INGREDIENTS: (ImportItem & { subName: string; avatarUrl: string })[] = [
  {
    _id: "ing_01",
    id: "ing_01",
    name: "Bột mì số 11",
    subName: "High Protein Flour",
    quantity: 150.0,
    unit: "kg",
    supplier: "InterFlour VN",
    price: 32000,
    category: "Bột & Ngũ cốc",
    status: "stable",
    avatarUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80",
  },
  {
    _id: "ing_02",
    id: "ing_02",
    name: "Chocolate 70%",
    subName: "Callebaut Belgium",
    quantity: 25.5,
    unit: "kg",
    supplier: "Nhất Hương Ltd.",
    price: 240000,
    category: "Socola & Ca cao",
    status: "low",
    avatarUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=150&auto=format&fit=crop&q=80",
  },
  {
    _id: "ing_03",
    id: "ing_03",
    name: "Dâu tây tươi",
    subName: "VietGAP Grade A",
    quantity: 1.5,
    unit: "kg",
    supplier: "Mộc Nhiên Farm",
    price: 180000,
    category: "Trái cây tươi",
    status: "critical",
    avatarUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=150&auto=format&fit=crop&q=80",
  },
  {
    _id: "ing_04",
    id: "ing_04",
    name: "Đường tinh luyện",
    subName: "Bien Hoa Sugar",
    quantity: 500.0,
    unit: "kg",
    supplier: "Đường Biên Hòa",
    price: 22000,
    category: "Gia vị & Đường",
    status: "stable",
    avatarUrl: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=150&auto=format&fit=crop&q=80",
  },
];

const STATUS_TAGS: Record<
  IngredientStatus,
  { label: string; bg: string; text: string }
> = {
  stable: {
    label: "Ổn định",
    bg: "bg-[#eef7f1]",
    text: "text-[#2f7560]",
  },
  low: {
    label: "Sắp hết",
    bg: "bg-[#fef9c3]",
    text: "text-[#854d0e]",
  },
  critical: {
    label: "Cần báo",
    bg: "bg-[#fee2e2]",
    text: "text-[#dc2626]",
  },
};

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<
    (ImportItem & { subName?: string; avatarUrl?: string })[]
  >(MOCK_INGREDIENTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // New Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnit, setNewUnit] = useState("kg");
  const [newSupplier, setNewSupplier] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Nguyên liệu chung");

  // Fetch ingredients from API with fallback
  useEffect(() => {
    async function fetchIngredients() {
      setLoading(true);
      try {
        const res = await getImports();
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            ...item,
            subName: item.description || "Thượng hạng",
            avatarUrl:
              item.imageUrl ||
              "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80",
            status: (
              (item.quantity ?? 10) <= 2
                ? "critical"
                : (item.quantity ?? 10) <= 30
                  ? "low"
                  : "stable"
            ) as IngredientStatus,
          }));
          setIngredients(mapped);
        }
      } catch (err) {
        console.warn("Using local mock ingredients data due to backend fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIngredients();
  }, []);

  // Filter logic
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const q = searchQuery.toLowerCase();
      return (
        ing.name.toLowerCase().includes(q) ||
        (ing.subName && ing.subName.toLowerCase().includes(q)) ||
        (ing.supplier && ing.supplier.toLowerCase().includes(q))
      );
    });
  }, [ingredients, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage) || 1;
  const paginatedIngredients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIngredients.slice(start, start + itemsPerPage);
  }, [filteredIngredients, currentPage]);

  // Handle Add New Import Submit
  const handleCreateImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = Number(newQuantity) || 10;
    const priceNum = Number(newPrice) || 50000;
    const status: IngredientStatus =
      qtyNum <= 2 ? "critical" : qtyNum <= 30 ? "low" : "stable";

    const newIng = {
      _id: `ing_${Date.now()}`,
      id: `ing_${Date.now()}`,
      name: newName || "Nguyên liệu mới",
      subName: newSubName || "Nhập mới",
      description: newSubName,
      quantity: qtyNum,
      unit: newUnit,
      supplier: newSupplier || "Nhà cung cấp Việt Nam",
      price: priceNum,
      category: newCategory,
      status,
    };

    try {
      await createImport({
        name: newIng.name,
        price: newIng.price,
        description: newIng.description,
        category: newIng.category,
        quantity: newIng.quantity,
        unit: newIng.unit,
        supplier: newIng.supplier,
      });
    } catch {
      // Local fallback update
    }

    setIngredients([newIng, ...ingredients]);
    setShowImportModal(false);

    // Reset Form
    setNewName("");
    setNewSubName("");
    setNewQuantity("");
    setNewSupplier("");
    setNewPrice("");
  };

  // Handle Item Delete
  const handleDeleteItem = async (id?: string) => {
    if (!id) return;
    try {
      await deleteImport(id);
    } catch {
      // Local fallback
    }
    setIngredients((prev) => prev.filter((item) => item.id !== id && item._id !== id));
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
            placeholder="Tìm kiếm nguyên liệu..."
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

        {/* Right Header Actions & Admin Profile */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <button
            onClick={() => setShowImportModal(true)}
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#aa2e63] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#aa2e63]/20 hover:bg-[#902452] transition active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v8m-4-4h8" />
            </svg>
            <span>Nhập hàng mới</span>
          </button>

          {/* Icons & User */}
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
                <div className="text-[0.65rem] text-[#a89590]">Quản lý kho</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#5a342f] tracking-tight">
          Kho Nguyên Liệu
        </h1>
        <p className="mt-1 text-sm text-[#8d7974]">
          Quản lý và theo dõi nguồn nguyên liệu thượng hạng cho những chiếc bánh nghệ thuật tại Velvet & Crumb.
        </p>
      </div>

      {/* Upper Banner & Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Wide Stock Alert Banner Card (2 Cols) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-[#faebd7] bg-gradient-to-br from-[#fff6f2] via-[#fffbf9] to-[#fff3ee] p-6 shadow-sm flex flex-col justify-between">
          <div className="relative z-10 max-w-md">
            {/* Tag */}
            <span className="inline-block rounded-full bg-[#fde8e8] px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#dc2626] border border-[#fca5a5]/30">
              SẮP HẾT HÀNG
            </span>

            {/* Main title */}
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#5a342f] tracking-tight">
              Dâu Tây Đà Lạt
            </h2>

            {/* Stock quantity highlight */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#5a342f]">1.5</span>
              <span className="text-sm font-bold text-[#8d7974]">kg còn lại</span>
            </div>

            {/* Requirement note */}
            <p className="mt-4 text-xs font-semibold text-[#8d7974]">
              Nhu cầu nhập hàng từ nhà cung cấp &apos;<span className="text-[#5a342f]">Mộc Nhiên Farm</span>&apos;
            </p>
          </div>

          {/* Strawberry Arch Cutout Image (Right Side) */}
          <div className="absolute right-4 bottom-0 top-0 hidden sm:flex items-center justify-end w-56 pointer-events-none">
            <div className="h-44 w-44 rounded-full overflow-hidden border-4 border-white shadow-xl transform translate-x-4">
              <img
                src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&auto=format&fit=crop&q=80"
                alt="Dâu tây tươi"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Summary KPI Card (1 Col) */}
        <div className="rounded-3xl border border-[#fce7ef] bg-[#ffedf3]/60 p-6 shadow-sm flex flex-col justify-center space-y-6">
          {/* TỔNG SỐ MỤC */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white grid place-items-center text-[#aa2e63] shadow-sm shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[#a85979]">
                TỔNG SỐ MỤC
              </div>
              <div className="mt-0.5 text-2xl font-extrabold text-[#5a342f]">
                {ingredients.length || 42} <span className="text-sm font-semibold text-[#8d7974]">nguyên liệu</span>
              </div>
            </div>
          </div>

          {/* ĐANG VẬN CHUYỂN */}
          <div className="flex items-center gap-4 border-t border-[#f8d4e2] pt-5">
            <div className="h-12 w-12 rounded-2xl bg-white grid place-items-center text-[#aa2e63] shadow-sm shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6 0a1 1 0 102 0m-2 0a1 1 0 112 0m6 0a1 1 0 102 0m-2 0a1 1 0 112 0" />
              </svg>
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[#a85979]">
                ĐANG VẬN CHUYỂN
              </div>
              <div className="mt-0.5 text-2xl font-extrabold text-[#5a342f]">
                3 <span className="text-sm font-semibold text-[#8d7974]">đơn mới</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients Table Container */}
      <div className="rounded-3xl border border-[#f0e2db] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#faf4f1] text-[0.7rem] font-bold uppercase tracking-wider text-[#9a8580] border-b border-[#f0e2db]">
              <tr>
                <th className="py-4 px-6">NGUYÊN LIỆU</th>
                <th className="py-4 px-6">SỐ LƯỢNG TỒN</th>
                <th className="py-4 px-6">ĐƠN VỊ</th>
                <th className="py-4 px-6">NHÀ CUNG CẤP</th>
                <th className="py-4 px-6">TRẠNG THÁI</th>
                <th className="py-4 px-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7eeea]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8d7974]">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#b73375] border-t-transparent"></div>
                    <p className="mt-2 text-xs">Đang tải danh sách kho...</p>
                  </td>
                </tr>
              ) : paginatedIngredients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8d7974]">
                    Không tìm thấy nguyên liệu nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedIngredients.map((item) => {
                  const tag = STATUS_TAGS[item.status || "stable"];
                  const isLow = item.status === "critical" || (item.quantity ?? 0) <= 2;

                  return (
                    <tr key={item.id || item._id} className="hover:bg-[#fffcfb] transition-colors">
                      {/* NGUYÊN LIỆU */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-bold text-[#5a342f]">{item.name}</div>
                            <div className="text-xs text-[#a89590]">
                              {item.subName || item.description || "Thượng hạng"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SỐ LƯỢNG TỒN */}
                      <td className="py-5 px-6">
                        <span
                          className={`font-extrabold text-base ${isLow ? "text-[#dc2626]" : "text-[#5a342f]"
                            }`}
                        >
                          {Number(item.quantity).toFixed(1)}
                        </span>
                      </td>

                      {/* ĐƠN VỊ */}
                      <td className="py-5 px-6 font-semibold text-[#8d7974]">
                        {item.unit || "kg"}
                      </td>

                      {/* NHÀ CUNG CẤP */}
                      <td className="py-5 px-6 font-semibold text-[#5a342f]">
                        {item.supplier || "Đang cập nhật"}
                      </td>

                      {/* TRẠNG THÁI */}
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tag.bg} ${tag.text}`}
                        >
                          {tag.label}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id || item._id)}
                          className="rounded-full p-2 text-[#a89590] hover:bg-[#fee2e2] hover:text-[#dc2626] transition"
                          title="Xóa nguyên liệu"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            Hiển thị <strong className="text-[#5a342f]">{paginatedIngredients.length}</strong> trên{" "}
            <strong className="text-[#5a342f]">{filteredIngredients.length}</strong> nguyên liệu
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

      {/* MODAL: Add New Import Record */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#f0e2db] space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0e2db] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#5a342f]">
                Nhập hàng mới vào kho
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                type="button"
                className="rounded-full p-1 text-[#a89590] hover:bg-[#faf4f1]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateImportSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Tên nguyên liệu
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Bột mì số 11, Chocolate 70%..."
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Tên phụ / Thương hiệu / Loại
                </label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Ví dụ: High Protein Flour, Callebaut Belgium..."
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a342f] mb-1">
                    Số lượng tồn
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="100.0"
                    className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a342f] mb-1">
                    Đơn vị
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                  >
                    <option value="kg">kg</option>
                    <option value="vỉ">vỉ</option>
                    <option value="lít">lít</option>
                    <option value="hộp">hộp</option>
                    <option value="gói">gói</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a342f] mb-1">
                    Nhà cung cấp
                  </label>
                  <input
                    type="text"
                    required
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    placeholder="InterFlour VN, Mộc Nhiên Farm..."
                    className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a342f] mb-1">
                    Đơn giá nhập (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="35000"
                    className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a342f] mb-1">
                  Danh mục nguyên liệu
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Bột & Ngũ cốc, Socola, Trái cây..."
                  className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold text-[#7d6a66] hover:bg-[#faf4f1]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#aa2e63] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#902452]"
                >
                  Nhập kho ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
