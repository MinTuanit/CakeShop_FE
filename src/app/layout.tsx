import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CakeShopMT",
  description: "Tiệm bánh kem và phụ kiện CakeShopMT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
