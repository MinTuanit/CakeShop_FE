import { UserItem, createUser, updateUser } from "@/src/services/userService";
import { useState, useEffect } from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
  onSuccess: () => void;
}

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    email: "",
    address: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        password: "", // Leave blank for edit
        email: user.email || "",
        address: user.address || "",
        role: user.role || "user",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        password: "",
        email: "",
        address: "",
        role: "user",
      });
    }
    setError("");
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (user) {
        // Edit mode
        const dataToUpdate: any = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        await updateUser(user._id, dataToUpdate);
      } else {
        // Create mode
        if (!formData.password) {
          setError("Vui lòng nhập mật khẩu");
          setLoading(false);
          return;
        }
        await createUser(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-[#f4e8e1] bg-[#fffaf8] px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-[#5a342f]">
            {user ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#a88a83] transition hover:bg-[#fceae3] hover:text-[#5a342f]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-[#fdf0f5] p-3 text-sm text-[#b73375] border border-[#fce7ef]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#8d7974]">
                  Họ và tên <span className="text-[#b73375]">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-[#f4e8e1] bg-white px-4 py-2.5 text-sm text-[#5a342f] outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#8d7974]">
                  Số điện thoại <span className="text-[#b73375]">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#f4e8e1] bg-white px-4 py-2.5 text-sm text-[#5a342f] outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#8d7974]">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#f4e8e1] bg-white px-4 py-2.5 text-sm text-[#5a342f] outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
                  placeholder="Nhập email (tùy chọn)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[#8d7974]">
                  Mật khẩu {user ? "" : <span className="text-[#b73375]">*</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-[#f4e8e1] bg-white px-4 py-2.5 text-sm text-[#5a342f] outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
                  placeholder={user ? "Bỏ trống nếu không đổi" : "Nhập mật khẩu"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#8d7974]">
                Địa chỉ
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-[#f4e8e1] bg-white px-4 py-2.5 text-sm text-[#5a342f] outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
                placeholder="Nhập địa chỉ giao hàng"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#8d7974]">
                Vai trò
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-[#f4e8e1] bg-white px-4 py-2.5 text-sm text-[#5a342f] outline-none transition focus:border-[#b73375] focus:ring-1 focus:ring-[#b73375]"
              >
                <option value="user">Khách hàng (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full px-6 py-2.5 text-sm font-bold text-[#8d7974] hover:bg-[#fceae3] hover:text-[#5a342f] transition disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-[#b73375] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#b73375]/20 hover:bg-[#9c265f] transition disabled:opacity-70"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {user ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
