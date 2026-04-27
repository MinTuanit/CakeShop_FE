import Link from "next/link";

type FooterLink = {
  label: string;
  href?: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Tiệm Bánh MT",
    links: [
      {
        label: "© 2026 CakeShopMT. Chế tác bánh với sự tinh tế.",
      },
    ],
  },
  {
    title: "CakeShopMT",
    links: [
      { label: "Minh bạch Thành phần", href: "/minh-bach-thanh-phan" },
      { label: "Câu chuyện của Chúng tôi", href: "/cau-chuyen" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Chính sách Bảo mật", href: "/chinh-sach-bao-mat" },
      { label: "Giao hàng & Trả hàng", href: "/giao-hang-tra-hang" },
    ],
  },
  {
    title: "Kết nối",
    links: [{ label: "Liên hệ với Chúng tôi", href: "/lien-he" }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#eaded8] bg-[#f3efec] px-5 py-9 text-[#8b7470]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[#b33e75]">
              {column.title}
            </h2>
            <ul className="space-y-2 text-sm leading-6">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link
                      className="transition hover:text-[#b33e75]"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    link.label
                  )}
                </li>
              ))}
            </ul>
            {column.title === "Kết nối" && (
              <div className="mt-4 flex items-center gap-3 text-[#b33e75]">
                <a
                  aria-label="Chia sẻ"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/75 shadow-sm transition hover:bg-white"
                  href="#"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                    <path d="M16 6l-4-4-4 4" />
                    <path d="M12 2v13" />
                  </svg>
                </a>
                <a
                  aria-label="Email"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/75 shadow-sm transition hover:bg-white"
                  href="mailto:hello@cakeshopmt.com"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
