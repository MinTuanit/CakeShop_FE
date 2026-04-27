"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "@/src/components/Footer";
import apiClient from "../../services/apiClient";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!acceptedTerms) {
      setError("Vui lòng đồng ý với điều khoản dịch vụ và chính sách bảo mật.");
      return;
    }

    try {
      await apiClient.post("/auth/register", { name, phone, password });
      setSuccess("Đăng ký thành công. Đang chuyển đến trang đăng nhập...");
      window.setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;

      setError(message || "Đăng ký thất bại");
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f7f1ed] text-[#604a45]">
      <section className="grid min-h-screen lg:grid-cols-[1.02fr_1fr]">
        <aside className="relative hidden overflow-hidden bg-[#2d201d] px-10 py-12 text-white lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_51%_39%,rgba(132,78,55,0.88)_0,rgba(75,43,35,0.76)_34%,rgba(41,29,27,0.94)_70%),linear-gradient(180deg,rgba(25,18,17,0.16),rgba(15,12,11,0.78))]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[-5rem] top-[13.5rem] h-[28rem] w-[48rem] rounded-[50%] bg-[radial-gradient(circle_at_50%_20%,#765340_0,#5f3c32_28%,#422922_58%,#211615_100%)] shadow-[0_24px_55px_rgba(18,9,7,0.52)]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[-4rem] top-[20.5rem] h-36 w-[50rem] rounded-[50%] border-t-[10px] border-[#9c7a63]/45"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[4.4rem] left-[-4rem] h-24 w-[42rem] rounded-[50%] border-t-[11px] border-[#d7c3b9]/70"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[3.1rem] left-[-2rem] h-20 w-[36rem] bg-[radial-gradient(circle,#f3efe8_0_2px,transparent_2px)] [background-size:18px_12px] opacity-70"
          />

          <div className="relative z-10 flex min-h-full flex-col">
            <div className="font-['Brush_Script_MT','Segoe_Script',cursive] text-[7.6rem] leading-none tracking-wide text-[#f2de9a] drop-shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
              Signature
            </div>

            <div className="mt-auto max-w-[31rem] pb-28">
              <h1 className="font-serif text-5xl font-bold italic leading-[0.98] text-[#bd2f75]">
                Thế giới của những
                <br />
                hương vị thủ công
              </h1>
              <p className="mt-8 max-w-[24rem] text-sm leading-6 text-white/46">
                Gia nhập cộng đồng của chúng tôi để trải nghiệm những món bánh
                thủ công tinh tế nhất, các bộ sưu tập theo mùa và ưu đãi riêng.
              </p>
              <div className="mt-7 flex gap-4">
                <span className="rounded-full bg-[#f6b4a8]/70 px-6 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#8f355f]">
                  Từ năm 2026
                </span>
                <span className="rounded-full bg-[#c43d7c]/80 px-6 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white">
                  Chế tác tại MT
                </span>
              </div>
            </div>

            <div className="absolute bottom-10 right-12 h-[15.5rem] w-[12rem] rotate-[-4deg] rounded-[1.25rem] bg-white p-4 shadow-[0_18px_35px_rgba(0,0,0,0.32)]">
              <div className="h-full rounded-[0.95rem] bg-[#fbf8f3] p-4">
                <div className="mx-auto mb-3 w-fit rounded-sm bg-[#5d332a] px-3 py-1 text-[0.52rem] font-bold uppercase tracking-[0.2em] text-[#f6d8b4]">
                  Apple Crumble
                </div>
                <div className="relative mx-auto mt-3 h-32 w-32">
                  <div className="absolute bottom-0 left-1/2 h-14 w-28 -translate-x-1/2 rounded-b-[2rem] bg-[linear-gradient(90deg,#d77b21,#f3b34b,#7b3a1c)] shadow-inner" />
                  <div className="absolute bottom-12 left-1/2 h-[5.5rem] w-24 -translate-x-1/2 rounded-[48%_48%_42%_42%] bg-[repeating-radial-gradient(circle_at_56%_35%,#fff8ed_0_8px,#ead7c7_9px_15px)] shadow-[0_7px_14px_rgba(90,48,29,0.18)]" />
                  <div className="absolute left-4 top-14 h-9 w-10 rounded-full bg-[radial-gradient(circle_at_35%_25%,#ff9c9c,#b50021_70%)] shadow-[0_5px_8px_rgba(110,0,16,0.24)]" />
                  <div className="absolute left-9 top-12 h-8 w-2 rotate-45 rounded-full bg-[#553018]" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-[28.75rem]">
            <div className="mb-9 lg:hidden">
              <p className="font-['Brush_Script_MT','Segoe_Script',cursive] text-6xl leading-none text-[#bd2f75]">
                signature
              </p>
              <p className="mt-2 text-sm text-[#8a7774]">
                Thế giới của những hương vị thủ công
              </p>
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#bd2f75]">
              Tạo tài khoản của bạn
            </h2>
            <p className="mt-2 text-sm text-[#7f6d69]">
              Bắt đầu hành trình khám phá nghệ thuật làm bánh
            </p>

            <form
              autoComplete="on"
              className="mt-10 space-y-6"
              onSubmit={handleSubmit}
            >
              <label className="block">
                <span className="text-xs font-semibold text-[#65514d]">
                  Họ và Tên
                </span>
                <input
                  autoComplete="name"
                  className="mt-2 h-12 w-full rounded-full border border-transparent bg-[#e7e1dd] px-6 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#bbaea9] focus:border-[#d85691] focus:bg-white focus:ring-4 focus:ring-[#d85691]/15"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Elias Thorne"
                  required
                  type="text"
                  value={name}
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#65514d]">
                  Số điện thoại
                </span>
                <input
                  autoComplete="tel"
                  className="mt-2 h-12 w-full rounded-full border border-transparent bg-[#e7e1dd] px-6 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#bbaea9] focus:border-[#d85691] focus:bg-white focus:ring-4 focus:ring-[#d85691]/15"
                  inputMode="tel"
                  maxLength={11}
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  required
                  type="tel"
                  value={phone}
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#65514d]">
                  Mật khẩu
                </span>
                <div className="relative mt-2">
                  <input
                    autoComplete="new-password"
                    className="h-12 w-full rounded-full border border-transparent bg-[#e7e1dd] px-6 pr-12 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#bbaea9] focus:border-[#d85691] focus:bg-white focus:ring-4 focus:ring-[#d85691]/15"
                    minLength={6}
                    name="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-4 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[#8b7470] transition hover:bg-white/70"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
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
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </label>

              <div className="space-y-4">
                <label className="flex items-start gap-3 text-xs leading-5 text-[#7f6d69]">
                  <input
                    checked={acceptedTerms}
                    className="mt-0.5 h-4 w-4 rounded border-[#cfbfba] accent-[#bd2f75]"
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                    type="checkbox"
                  />
                  <span>
                    Tôi đã đọc và đồng ý với{" "}
                    <button
                      className="font-bold text-[#bd2f75] underline-offset-2 transition hover:underline"
                      onClick={() => setTermsOpen((open) => !open)}
                      type="button"
                    >
                      Điều khoản dịch vụ
                    </button>{" "}
                    và{" "}
                    <button
                      className="font-bold text-[#bd2f75] underline-offset-2 transition hover:underline"
                      onClick={() => setPrivacyOpen((open) => !open)}
                      type="button"
                    >
                      Chính sách bảo mật
                    </button>
                    .
                  </span>
                </label>

                {(termsOpen || privacyOpen) && (
                  <div className="space-y-3 rounded-2xl border border-[#eaded8] bg-white/72 p-4 text-xs leading-6 text-[#75625d]">
                    {termsOpen && (
                      <section>
                        <h3 className="font-bold text-[#8d143d]">
                          Điều khoản dịch vụ
                        </h3>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          <li>
                            Thông tin đăng ký cần chính xác để hỗ trợ đơn hàng.
                          </li>
                          <li>
                            Đơn bánh đặt riêng nên được xác nhận trước khi bếp
                            xử lý.
                          </li>
                          <li>
                            Không sử dụng tài khoản cho hành vi gian lận hoặc
                            phá hoại dịch vụ.
                          </li>
                        </ul>
                      </section>
                    )}

                    {privacyOpen && (
                      <section>
                        <h3 className="font-bold text-[#8d143d]">
                          Chính sách bảo mật
                        </h3>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          <li>
                            Thông tin cá nhân chỉ dùng để xác nhận và hỗ trợ
                            đơn hàng.
                          </li>
                          <li>
                            Mật khẩu được xử lý bảo mật phía máy chủ.
                          </li>
                          <li>
                            Cookie đăng nhập được dùng để duy trì phiên tài
                            khoản.
                          </li>
                        </ul>
                      </section>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <p className="rounded-lg bg-[#fff0f5] px-4 py-3 text-sm font-medium text-[#b4235d]">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-lg bg-[#eef9f2] px-4 py-3 text-sm font-medium text-[#327348]">
                  {success}
                </p>
              )}

              <button
                className={`h-[3.25rem] w-full rounded-full bg-gradient-to-r from-[#b73375] to-[#fa9abd] text-sm font-bold text-white transition focus:outline-none focus:ring-4 focus:ring-[#d85691]/25 ${
                  acceptedTerms
                    ? "shadow-[0_14px_28px_rgba(205,63,131,0.25)] hover:translate-y-[-1px] hover:shadow-[0_16px_30px_rgba(205,63,131,0.32)]"
                    : "cursor-not-allowed opacity-55 shadow-none"
                }`}
                disabled={!acceptedTerms}
                type="submit"
              >
                Đăng ký tài khoản
              </button>
            </form>

            <p className="mt-9 text-center text-sm text-[#7f6d69]">
              Đã có tài khoản?{" "}
              <Link className="font-bold text-[#bd2f75]" href="/login">
                Đăng nhập
              </Link>
            </p>

            <div className="mt-24 flex items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d9cbc6]">
              <span className="h-px w-12 bg-[#d9cbc6]" />
              Tiệm Bánh MT
              <span className="h-px w-12 bg-[#d9cbc6]" />
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}
