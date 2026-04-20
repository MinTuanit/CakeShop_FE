"use client";

import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { useRouter } from "next/navigation";
import type { User } from "../../types/user";

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Gọi API lấy thông tin user, backend sẽ kiểm tra token từ cookie
    apiClient.get("/users/me", { withCredentials: true })
      .then(res => {
        setUser(res.data.user ?? res.data); // Ưu tiên res.data.user nếu có
        setLoading(false);
      })
      .catch(() => {
        setError("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        setLoading(false);
        router.push("/login");
      });
  }, [router]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <h2>Xin chào, {user?.name || user?.phone}!</h2>
      <p>Chào mừng bạn đến với trang tổng quan.</p>
      <div>
        <strong>Số điện thoại:</strong> {user?.phone}
      </div>
      <div>
        <strong>Vai trò:</strong> {user?.role}
      </div>
      {/* Thêm các thông tin/tính năng tổng quan khác tại đây */}
    </div>
  );
}
