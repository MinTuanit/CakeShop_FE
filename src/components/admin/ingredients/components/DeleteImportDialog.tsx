"use client";

import type { ImportItem } from "@/src/types/import";

type IngredientTarget = ImportItem & {
  subName?: string;
  avatarUrl?: string;
};

type DeleteImportDialogProps = {
  open: boolean;
  target: IngredientTarget | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteImportDialog({
  open,
  target,
  onCancel,
  onConfirm,
}: DeleteImportDialogProps) {
  if (!open || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#f0e2db] space-y-5">
        <div className="flex items-center justify-between border-b border-[#f0e2db] pb-4">
          <h2 className="font-serif text-xl font-bold text-[#5a342f]">Xác nhận xóa</h2>
          <button
            onClick={onCancel}
            type="button"
            className="rounded-full p-1 text-[#a89590] hover:bg-[#faf4f1]"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-[#5a342f]">
          Bạn có chắc muốn xóa nguyên liệu <strong>{target.name}</strong> không?
        </p>
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-xs font-semibold text-[#7d6a66] hover:bg-[#faf4f1]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#aa2e63] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#902452]"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}