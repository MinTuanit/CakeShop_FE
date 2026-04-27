"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "@/src/components/Footer";
import apiClient from "../../services/apiClient";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post(
        "/auth/login",
        { phone, password },
        { withCredentials: true },
      );
      router.push("/overview");
    } catch (err) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;

      setError(message || "Đăng nhập thất bại");
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1ee] text-[#6e5855]">
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-1/2 top-[-5.5rem] h-48 w-48 -translate-x-[115%] rounded-full bg-[radial-gradient(circle_at_42%_38%,#f2f2f2_0,#bbb7b4_33%,#615d5c_68%,#242120_100%)] opacity-45 blur-[1px]" />
          <div className="absolute left-1/2 top-[-4.75rem] h-52 w-52 -translate-x-[20%] rounded-full bg-[radial-gradient(circle_at_45%_35%,#f8f8f8_0,#bdb8b6_31%,#625e5d_69%,#242120_100%)] opacity-40 blur-[1px]" />
          <div className="absolute bottom-[-14rem] left-1/2 h-[30rem] w-[58rem] max-w-[118vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_50%_39%,#f6d69c_0,#d89b54_42%,#b96f2f_60%,#7d451c_79%,#3e2412_100%)] shadow-[0_25px_55px_rgba(89,53,25,0.26)]" />
          <div className="absolute bottom-[-13rem] left-1/2 h-[27rem] w-[54rem] max-w-[110vw] -translate-x-1/2 rounded-[50%] border border-white/60 bg-[radial-gradient(circle_at_50%_43%,rgba(255,245,218,0.55)_0,rgba(214,132,55,0.16)_44%,rgba(72,39,18,0.2)_100%)]" />
        </div>

        <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] bg-white/70 shadow-[0_28px_80px_rgba(138,78,74,0.2)] backdrop-blur-md md:grid-cols-[1.05fr_1fr]">
          <section className="bg-white/60 px-7 py-4 sm:px-12 sm:py-12 lg:px-14">
            <div className="max-w-[21rem]">
              <h1 className="font-serif text-[2.65rem] font-bold italic leading-[0.92] text-[#bd3c79] sm:text-5xl">
                Chào mừng quay trở lại
              </h1>
              <p className="mt-5 text-sm leading-6 text-[#8a7774]">
                Vui lòng nhập thông tin để truy cập tài khoản của bạn.
              </p>
              <form
                autoComplete="on"
                className="mt-9 space-y-5"
                onSubmit={handleSubmit}
              >
                <label className="block">
                  <span className="text-xs font-semibold text-[#7c6662]">
                    Điện thoại
                  </span>
                  <input
                    autoComplete="username"
                    className="mt-2 h-12 w-full rounded-md border border-transparent bg-[#eee9e6] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#c6bab5] focus:border-[#d85691] focus:bg-white focus:ring-4 focus:ring-[#d85691]/15"
                    inputMode="tel"
                    maxLength={11}
                    name="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại"
                    required
                    type="tel"
                    value={phone}
                  />
                </label>

                <div>
                  <label className="block">
                    <span className="text-xs font-semibold text-[#7c6662]">
                      Mật khẩu
                    </span>
                    <input
                      autoComplete="current-password"
                      className="mt-2 h-12 w-full rounded-md border border-transparent bg-[#eee9e6] px-4 text-sm text-[#5f4b48] outline-none transition placeholder:text-[#c6bab5] focus:border-[#d85691] focus:bg-white focus:ring-4 focus:ring-[#d85691]/15"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      type="password"
                      value={password}
                    />
                  </label>
                  <div className="mt-2 flex justify-end">
                    <a
                      className="text-xs font-bold text-[#d85691] transition hover:text-[#b43773]"
                      href="#"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                <label className="flex w-fit items-center gap-2 text-xs text-[#8a7774]">
                  <input
                    checked={remember}
                    className="h-4 w-4 rounded border-[#cfbfba] text-[#bd3c79] accent-[#bd3c79]"
                    onChange={(e) => setRemember(e.target.checked)}
                    type="checkbox"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                {error && (
                  <p className="rounded-md bg-[#fff0f5] px-3 py-2 text-sm font-medium text-[#b4235d]">
                    {error}
                  </p>
                )}

                <button
                  className="h-12 w-full rounded-full bg-gradient-to-r from-[#af2f70] to-[#ff9ac7] text-sm font-bold text-white shadow-[0_12px_22px_rgba(205,63,131,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_14px_26px_rgba(205,63,131,0.34)] focus:outline-none focus:ring-4 focus:ring-[#d85691]/25"
                  type="submit"
                >
                  Đăng nhập vào CakeShopMT
                </button>
              </form>

              <div className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#b8aaa7]">
                Hoặc tiếp tục với
              </div>

              <div className="mt-4 w-full flex items-center justify-center gap-4">
                <button
                  className="flex h-11 w-full max-w-[12rem] items-center justify-center gap-2 rounded-md bg-white text-sm font-semibold text-[#887470] shadow-sm ring-1 ring-[#eadfdb] transition hover:bg-[#fff7fa]"
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-[#8a7774]">
                Bạn mới đến cửa hàng?{" "}
                <Link className="font-bold text-[#bd3c79]" href="/register">
                  Đăng ký tài khoản
                </Link>
              </p>
            </div>
          </section>

          <section className="relative hidden min-h-[38rem] items-end justify-center overflow-hidden bg-[#f6dcd4]/70 px-10 py-14 md:flex">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(255,122,147,0.34)_0,rgba(255,122,147,0)_28%),radial-gradient(circle_at_48%_45%,rgba(255,255,255,0.58)_0,rgba(255,255,255,0)_32%),linear-gradient(135deg,rgba(255,255,255,0.36),rgba(244,185,170,0.36))]"
            />
            <article className="relative mb-2 w-full max-w-[22rem] rounded-[1.35rem] bg-white/90 p-8 shadow-[0_22px_48px_rgba(119,75,68,0.18)]">
              <blockquote className="font-['Segoe_UI',Arial,sans-serif] text-xl font-semibold italic leading-8 text-[#9b7168]">
                “Sự chú trọng đến từng chi tiết trong từng miếng bánh thực sự
                rất đáng kinh ngạc. Đặt hàng từ MT giống như đang ủy thác
                một tác phẩm nghệ thuật.”
              </blockquote>
              <div className="mt-7 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_25%,#ffd2a5,#d94b69_42%,#14546a_100%)] text-sm font-bold text-white">
                  MT
                </div>
                <div>
                  <p className="text-sm font-bold text-[#5f4b48]">
                    Minh Tun
                  </p>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#b7a7a2]">
                    Thành viên thân thiết
                  </p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
