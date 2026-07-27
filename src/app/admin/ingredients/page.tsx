"use client";

import { useEffect, useMemo, useState } from "react";
import { getImports, createImport, deleteImport } from "@/src/services/importService";
import { getProducts } from "@/src/services/productService";
import type { ImportItem, IngredientStatus, CreateImportPayload } from "@/src/types/import";
import type { Product } from "@/src/types/product";
import { AddImportDialog, DeleteImportDialog } from "@/src/components/admin/ingredients/components";
import { formatDate } from "@/src/utils/date";

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<
    (ImportItem & { subName?: string; avatarUrl?: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("Nguyên liệu chung");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnit, setNewUnit] = useState("kg");
  const [newSupplier, setNewSupplier] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImportDate, setNewImportDate] = useState("");
  const [newProduct, setNewProduct] = useState("");
  // Delete Confirmation Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ImportItem & { subName?: string; avatarUrl?: string } | null>(null);

  // Product list for select dropdown
  const [productList, setProductList] = useState<Product[]>([]);

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

  // Fetch products for the select dropdown
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getProducts();
        if (res.data) {
          const filtered = res.data.filter(
            (p) => p.category?.toLowerCase() !== "cake"
          );
          setProductList(filtered);
        }
      } catch (err) {
        console.warn("Could not load products for dropdown:", err);
      }
    }
    fetchProducts();
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

    const payload: CreateImportPayload = {
      name: newName || "Nguyên liệu mới",
      price: priceNum,
      description: newDescription || undefined,
      category: newCategory,
      quantity: qtyNum,
      unit: newUnit,
      supplier: newSupplier || "Nhà cung cấp Việt Nam",
      importDate: newImportDate || new Date().toISOString().split("T")[0],
      product: newProduct || undefined,
    };

    const newIng = {
      _id: `ing_${Date.now()}`,
      id: `ing_${Date.now()}`,
      ...payload,
      subName: newDescription || "Nhập mới",
      status,
    };

    try {
      await createImport(payload);
    } catch {
      // Local fallback update
    }

    setIngredients([newIng, ...ingredients]);
    setShowImportModal(false);

    // Reset Form
    setNewName("");
    setNewDescription("");
    setNewQuantity("");
    setNewUnit("kg");
    setNewSupplier("");
    setNewPrice("");
    setNewImportDate("");
    setNewProduct("");
  };

  // Internal delete function (no confirmation)
  const performDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteImport(id);
    } catch {
      // Local fallback
    }
    setIngredients((prev) => prev.filter((item) => item.id !== id && item._id !== id));
  };

  // Confirmation handlers
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id || deleteTarget._id;
    await performDelete(id);
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
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
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#5a342f] tracking-tight">
          Kho Nguyên Liệu
        </h1>
        <p className="mt-1 text-sm text-[#8d7974]">
          Quản lý và theo dõi nguồn nguyên liệu
        </p>
      </div>
      {/* Ingredients Table Container */}
      <div className="rounded-3xl border border-[#f0e2db] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#faf4f1] text-[0.7rem] font-bold uppercase tracking-wider text-[#9a8580] border-b border-[#f0e2db]">
              <tr>
                <th className="py-4 px-6">NGUYÊN LIỆU</th>
                <th className="py-4 px-6">SỐ LƯỢNG NHẬP</th>
                <th className="py-4 px-6">ĐƠN VỊ</th>
                <th className="py-4 px-6">NHÀ CUNG CẤP</th>
                <th className="py-4 px-6">THỜI GIAN NHẬP</th>
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

                      {/* THỜI GIAN NHẬP */}
                      <td className="py-5 px-6 font-semibold text-[#5a342f]">
                        {item.importDate ? formatDate(item.importDate) : ""}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(item);
                            setShowDeleteModal(true);
                          }}
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

      <DeleteImportDialog
        open={showDeleteModal}
        target={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <AddImportDialog
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSubmit={handleCreateImportSubmit}
        newName={newName}
        setNewName={setNewName}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newQuantity={newQuantity}
        setNewQuantity={setNewQuantity}
        newUnit={newUnit}
        setNewUnit={setNewUnit}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        newPrice={newPrice}
        setNewPrice={setNewPrice}
        newImportDate={newImportDate}
        setNewImportDate={setNewImportDate}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        productList={productList}
      />
    </div>
  );
}
