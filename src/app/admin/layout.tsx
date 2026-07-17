"use client";

import { useState } from "react";

import Footer from "../../components/Footer";
import ShopHeader from "../../components/ShopHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf7f6]">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />

      <div
        className="min-h-screen transition-[padding-left] duration-200"
        style={{ paddingLeft: collapsed ? "4rem" : "16rem" }}
      >
        <ShopHeader user={user} onLogout={() => { }} />

        <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>

        <Footer />
      </div>
    </div>
  );
}