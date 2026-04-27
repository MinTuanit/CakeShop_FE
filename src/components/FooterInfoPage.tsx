import Link from "next/link";
import Footer from "./Footer";

type InfoSection = {
  title: string;
  body: string;
};

type FooterInfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
};

export default function FooterInfoPage({
  eyebrow,
  title,
  description,
  sections,
}: FooterInfoPageProps) {
  return (
    <main className="min-h-screen bg-[#f8f1ec] text-[#4f342f]">
      <header className="border-b border-[#eaded8] bg-[#f8f1ec]/90 px-5 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link className="font-serif text-xl font-bold text-[#8d143d]" href="/overview">
            Tiệm Bánh MT
          </Link>
          <Link
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#b73375] shadow-sm transition hover:bg-[#fff7fa]"
            href="/overview"
          >
            Trang chủ
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <span className="inline-flex rounded-full bg-[#f7d6c9] px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#b73375]">
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-3xl font-['Segoe_UI',Arial,sans-serif] text-4xl font-extrabold leading-tight text-[#8d143d] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#7f6d69]">
          {description}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article
              className="rounded-2xl bg-white p-6 shadow-[0_18px_42px_rgba(108,63,57,0.1)]"
              key={section.title}
            >
              <h2 className="text-lg font-bold text-[#6d2b31]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#7f6d69]">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
