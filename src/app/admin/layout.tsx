"use client";

import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf7f6] text-[#5a342f]">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
      />

      <div
        className="min-h-screen transition-all duration-200"
        style={{ paddingLeft: collapsed ? "5rem" : "16rem" }}
      >
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}