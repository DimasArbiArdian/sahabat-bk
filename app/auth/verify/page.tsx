"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, HeartHandshake } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setMessage("Kode verifikasi tidak ditemukan pada tautan ini.");
      return;
    }

    fetch(`/api/auth/verify-email?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.message?.includes("berhasil") || data.message?.includes("verified")) {
          setStatus("success");
          setMessage("Email Anda berhasil diverifikasi! Mengalihkan ke halaman masuk...");
          setTimeout(() => router.push("/auth/login"), 2500);
        } else {
          setStatus("error");
          setMessage(data.message || "Kode verifikasi tidak valid atau telah kedaluwarsa.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Gagal menghubungi server verifikasi.");
      });
  }, [code, router]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 w-full max-w-md text-center space-y-6">
      <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto shadow-md">
        <HeartHandshake className="w-6 h-6" />
      </div>

      {status === "loading" && (
        <div className="space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Memverifikasi Akun Anda...</h2>
          <p className="text-xs text-slate-500">Mohon tunggu sebentar selagi kami mengaktifkan akun Anda.</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 animate-in fade-in">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Verifikasi Berhasil!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 transition-all text-sm"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4 animate-in fade-in">
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Verifikasi Gagal</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 text-xs shadow-sm transition-all"
            >
              Coba Masuk ke Akun
            </Link>
            <Link
              href="/auth/register"
              className="w-full py-2.5 px-4 rounded-xl font-medium text-slate-600 hover:bg-slate-100 text-xs transition-all"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
