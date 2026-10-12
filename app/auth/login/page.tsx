"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_USERS } from "@/lib/mock-data";
import {
  HeartHandshake,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickDemoLogin = (roleKey: "student" | "teacher" | "admin") => {
    const demo = DEMO_USERS[roleKey];
    localStorage.setItem("token", demo.token);
    localStorage.setItem("role", demo.role);
    localStorage.setItem("name", demo.fullname);
    localStorage.setItem("id", demo.id);
    window.dispatchEvent(new Event("storage"));

    if (demo.role === "TEACHER") {
      router.push("/teacher/dashboard");
    } else if (demo.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/pages/student/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.fullname);
        localStorage.setItem("id", data.user.id);
        window.dispatchEvent(new Event("storage"));

        const userRole = (data.user.role || "").toUpperCase();
        if (userRole === "TEACHER") {
          router.push("/teacher/dashboard");
        } else if (userRole === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/pages/student/dashboard");
        }
      } else {
        // Fallback for demo testing if credentials match demo accounts
        if (email === DEMO_USERS.student.email) {
          handleQuickDemoLogin("student");
          return;
        } else if (email === DEMO_USERS.teacher.email) {
          handleQuickDemoLogin("teacher");
          return;
        } else if (email === DEMO_USERS.admin.email) {
          handleQuickDemoLogin("admin");
          return;
        }
        setError(data.message || "Gagal masuk. Periksa kembali email dan password Anda.");
      }
    } catch {
      // Fallback offline / local demo check
      if (email.includes("guru") || email.includes("teacher")) {
        handleQuickDemoLogin("teacher");
      } else if (email.includes("admin")) {
        handleQuickDemoLogin("admin");
      } else {
        handleQuickDemoLogin("student");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Left Section: Branding & Inspiring Message */}
      <div className="lg:w-1/2 gradient-brand p-8 sm:p-12 lg:p-20 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-12">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">Sahabat BK</span>
              <span className="block text-xs text-teal-100 font-medium">
                SMA Negeri 1 Prestasi Bangsa
              </span>
            </div>
          </Link>

          <div className="max-w-md space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ruang Aman & Peduli Siswa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Terhubung, Bimbing, dan Bertumbuh Bersama.
            </h1>
            <p className="text-teal-50 text-sm sm:text-base leading-relaxed">
              Platform bimbingan dan konseling sekolah modern untuk mendukung
              kesejahteraan mental, prestasi belajar, dan persiapan karir impianmu.
            </p>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 pt-10 border-t border-white/20 flex items-center gap-3 text-xs text-teal-100">
          <ShieldCheck className="w-5 h-5 text-teal-200" />
          <span>Kerahasiaan data bimbingan dilindungi kode etik konseling ABKIN.</span>
        </div>
      </div>

      {/* Right Section: Modern Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 sm:p-10 w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Masukkan email dan kata sandi akun Sahabat BK Anda.
            </p>
          </div>

          {/* Quick 1-Click Demo Login Bar */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/70 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Login Instan 1-Klik (Demo):
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student")}
                className="p-2 bg-white hover:bg-teal-100/60 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold text-center transition-all hover:scale-[1.02] shadow-sm"
              >
                🧑‍🎓 Siswa
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("teacher")}
                className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold text-center transition-all hover:scale-[1.02] shadow-sm"
              >
                👩‍🏫 Guru BK
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className="p-2 bg-white hover:bg-purple-100/60 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold text-center transition-all hover:scale-[1.02] shadow-sm"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="contoh: siswa@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Memproses..." : "Masuk ke Akun"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
            <p>
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-teal-600 hover:underline"
              >
                Daftar Akun Siswa Baru
              </Link>
            </p>
            <p>
              <Link href="/" className="hover:text-teal-600">
                ← Kembali ke Beranda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
