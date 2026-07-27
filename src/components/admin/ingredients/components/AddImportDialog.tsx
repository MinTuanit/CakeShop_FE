"use client";

import type { FormEvent } from "react";
import type { Product } from "@/src/types/product";

type AddImportDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  newName: string;
  setNewName: (value: string) => void;
  newDescription: string;
  setNewDescription: (value: string) => void;
  newQuantity: string;
  setNewQuantity: (value: string) => void;
  newUnit: string;
  setNewUnit: (value: string) => void;
  newCategory: string;
  setNewCategory: (value: string) => void;
  newSupplier: string;
  setNewSupplier: (value: string) => void;
  newPrice: string;
  setNewPrice: (value: string) => void;
  newImportDate: string;
  setNewImportDate: (value: string) => void;
  newProduct: string;
  setNewProduct: (value: string) => void;
  productList: Product[];
};

const UNIT_OPTIONS = ["kg", "g", "vỉ", "lốc", "lít", "ml", "hộp", "gói", "cái", "bịch"];

export function AddImportDialog({
  open,
  onClose,
  onSubmit,
  newName,
  setNewName,
  newDescription,
  setNewDescription,
  newQuantity,
  setNewQuantity,
  newUnit,
  setNewUnit,
  newCategory,
  setNewCategory,
  newSupplier,
  setNewSupplier,
  newPrice,
  setNewPrice,
  newImportDate,
  setNewImportDate,
  newProduct,
  setNewProduct,
  productList,
}: AddImportDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#f0e2db] space-y-5">
        <div className="flex items-center justify-between border-b border-[#f0e2db] pb-4">
          <h2 className="font-serif text-xl font-bold text-[#5a342f]">
            Nhập hàng mới vào kho
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-1 text-[#a89590] hover:bg-[#faf4f1]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#5a342f]">
              Tên nguyên liệu
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ví dụ: Topper Happy Birthday ánh kim"
              className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#5a342f]">
              Mô tả
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Ví dụ: Phụ kiện cắm bánh sinh nhật"
              className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Đơn giá (VNĐ)
              </label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="18000"
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Số lượng
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="120"
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Đơn vị
              </label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Danh mục
              </label>
              <input
                type="text"
                required
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Đồ trang trí"
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Nhà cung cấp
              </label>
              <input
                type="text"
                required
                value={newSupplier}
                onChange={(e) => setNewSupplier(e.target.value)}
                placeholder="Decor Cake Store"
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Ngày nhập
              </label>
              <input
                type="date"
                required
                value={newImportDate}
                onChange={(e) => setNewImportDate(e.target.value)}
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5a342f]">
                Sản phẩm
                <span className="ml-1 font-normal text-[#a89590]">— không bắt buộc</span>
              </label>
              <select
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="w-full rounded-xl border border-[#f0e2db] bg-[#faf4f1] p-3 text-[#5a342f] outline-none focus:border-[#b73375]"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {productList.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} — {product.price?.toLocaleString()}đ
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
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
  );
}