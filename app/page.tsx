"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/lib/mock-data";
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Calendar,
  BookOpen,
  MessageSquareHeart,
  Smile,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  PhoneCall,
  UserCheck,
  ChevronRight,
  Clock,
  EyeOff,
  KeyRound,
  Award,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickLogin = (roleKey: "student" | "teacher" | "admin") => {
    const demo = DEMO_USERS[roleKey];
    localStorage.setItem("token", demo.token);
    localStorage.setItem("role", demo.role);
    localStorage.setItem("name", demo.fullname);
    localStorage.setItem("id", demo.id);
    window.dispatchEvent(new Event("storage"));

    if (demo.role === "STUDENT") {
      router.push("/pages/student/dashboard");
    } else if (demo.role === "TEACHER") {
      router.push("/teacher/dashboard");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1">
                Sahabat <span className="text-teal-600">BK</span>
              </span>
              <span className="block text-xs font-medium text-slate-500">
                Layanan Bimbingan Konseling Digital
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#layanan" className="hover:text-teal-600 transition-colors">
              4 Pilar BK
            </a>
            <a href="#fitur" className="hover:text-teal-600 transition-colors">
              Fitur Unggulan
            </a>
            <a href="#modul" className="hover:text-teal-600 transition-colors">
              Materi Modul
            </a>
            <a href="#keamanan" className="hover:text-teal-600 transition-colors">
              Jaminan Privasi
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-4 py-2 transition-colors hidden sm:inline-block"
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-md shadow-teal-700/20 transition-all hover:shadow-lg active:scale-95"
            >
              Daftar Siswa
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <a
              href="#layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1"
            >
              4 Pilar BK
            </a>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1"
            >
              Fitur Unggulan
            </a>
            <a
              href="#modul"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1"
            >
              Materi Modul
            </a>
            <a
              href="#keamanan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1"
            >
              Jaminan Privasi
            </a>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-teal-600"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow dots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-800 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform BK Modern Sekolah Menengah & Kejuruan</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Tumbuh Bahagia, Raih Cita, Didampingi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              Sahabat BK
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ruang aman dan terpercaya untuk curhat, konsultasi karir, manajemen
            stres, dan asesmen minat bakat bersama Guru BK profesional secara
            tatap muka maupun daring.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleQuickLogin("student")}
              className="inline-flex items-center gap-2 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 px-7 py-3.5 rounded-xl shadow-lg shadow-teal-700/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Mulai Sebagai Siswa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickLogin("teacher")}
              className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-7 py-3.5 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <span>Portal Guru BK</span>
              <UserCheck className="w-4 h-4 text-teal-600" />
            </button>
          </div>

          {/* Quick Demo Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">⚡ Coba Akun Demo Cepat:</span>
            <button
              onClick={() => handleQuickLogin("student")}
              className="bg-slate-100 hover:bg-teal-50 hover:text-teal-700 px-3 py-1 rounded-lg transition-colors font-medium"
            >
              🧑‍🎓 Siswa (Budi)
            </button>
            <button
              onClick={() => handleQuickLogin("teacher")}
              className="bg-slate-100 hover:bg-amber-50 hover:text-amber-700 px-3 py-1 rounded-lg transition-colors font-medium"
            >
              👩‍🏫 Guru BK (Ibu Siti)
            </button>
            <button
              onClick={() => handleQuickLogin("admin")}
              className="bg-slate-100 hover:bg-purple-50 hover:text-purple-700 px-3 py-1 rounded-lg transition-colors font-medium"
            >
              🛡️ Admin
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="text-3xl font-extrabold text-teal-600">100%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Kerahasiaan Terjamin</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Kode etik konseling ketat</p>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="text-3xl font-extrabold text-teal-600">1.250+</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Sesi Konseling</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Siswa terbantu secara efektif</p>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="text-3xl font-extrabold text-teal-600">98%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Tingkat Kepuasan</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Berdasarkan ulasan siswa</p>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="text-3xl font-extrabold text-teal-600">24 Jam</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Hotline Darurat</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Siaga untuk situasi krisis</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pilar Layanan BK */}
      <section id="layanan" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
              Layanan Komprehensif
            </h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              4 Pilar Bimbingan & Konseling Sekolah
            </p>
            <p className="text-slate-600 mt-4 text-base">
              Setiap siswa memiliki potensi unik. Sahabat BK mendukung perkembangan
              siswa dalam seluruh aspek kehidupan akademik dan emosional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pilar 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bimbingan Pribadi</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Pengenalan emosi, manajemen stres, resiliensi diri, dan membangun
                kepercayaan diri menghadapi perubahan hidup.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Regulasi emosi
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Penerimaan diri
                </li>
              </ul>
            </div>

            {/* Pilar 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bimbingan Sosial</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Relasi pertemanan sehat, komunikasi asertif, resolusi konflik, dan
                pencegahan perilaku perundungan (anti-bullying).
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Anti perundungan
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Empati & sosialisasi
                </li>
              </ul>
            </div>

            {/* Pilar 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-sky-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bimbingan Belajar</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Menemukan gaya belajar efektif, mengatasi rasa malas dan prokrastinasi,
                serta strategi persiapan ujian tanpa panik.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Manajemen waktu
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Strategi belajar
                </li>
              </ul>
            </div>

            {/* Pilar 4 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-amber-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bimbingan Karir</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Eksplorasi minat bakat, pemilihan jurusan kuliah, pengenalan profesi
                masa depan, serta persiapan portofolio.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Tes Holland RIASEC
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Info kampus & prodi
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan Interaktif */}
      <section id="fitur" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
              Inovasi Terkini
            </h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Fitur Cerdas untuk Kenyamanan Siswa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Booking Konseling Fleksibel</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Pilih sendiri waktu konseling yang cocok tanpa takut bentrok dengan
                jam pelajaran. Tersedia opsi tatap muka di ruang BK atau online via WhatsApp.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-700">
                <span>Konfirmasi cepat oleh Guru BK</span>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Kotak Suara Rahasia (Anti-Bullying)</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Merasa takut atau malu melapor langsung? Siswa dapat mengirimkan
                laporan perundungan atau keluhan secara anonim 100% aman.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-rose-700">
                <span>Privasi identitas dijamin penuh</span>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Daily Mood Tracker & Asesmen</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Catat perasaanmu setiap hari untuk memantau kesehatan mentalmu. Dapatkan
                saran personalisasi dan tes minat bakat interaktif.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
                <span>Evaluasi diri & tips mindfulness</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materi Modul Bimbingan */}
      <section id="modul" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold text-teal-800 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Pustaka Materi Edukasi Siswa</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Modul Bimbingan Praktis & Relevan
              </h2>
              <p className="text-slate-600 text-base mt-3">
                Disusun oleh Guru BK profesional dan psikolog pendidikan untuk membantu
                siswa mengatasi tantangan belajar, pergaulan, emosi, dan persiapan karir.
              </p>
            </div>
            <div>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-5 py-2.5 rounded-xl transition-all"
              >
                <span>Akses Semua Modul</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Modul 1: Pribadi */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-teal-300 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="px-2.5 py-1 rounded-full font-semibold bg-teal-100 text-teal-800">
                    Bimbingan Pribadi
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> 5 mnt
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Regulasi Emosi & Manajemen Stres Remaja
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  Latihan pernapasan 4-7-8, mengurai kecemasan pra-ujian, dan membangun kebiasaan positive self-talk saat merasa overthinking.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Lembar Kerja + Audio</span>
                <Link
                  href="/auth/login"
                  className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Baca Modul <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Modul 2: Karir */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-amber-300 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="px-2.5 py-1 rounded-full font-semibold bg-amber-100 text-amber-800">
                    Bimbingan Karir
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> 8 mnt
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Panduan Memilih Jurusan Kuliah & Karir Digital
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  Strategi membedakan passion murni vs ekspektasi orang sekitar, pengenalan rumpun prodi SNBP/SNBT, dan peta karir masa depan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Tes RIASEC Included</span>
                <Link
                  href="/auth/login"
                  className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Baca Modul <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Modul 3: Belajar */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-sky-300 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="px-2.5 py-1 rounded-full font-semibold bg-sky-100 text-sky-800">
                    Bimbingan Belajar
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> 6 mnt
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Gaya Belajar VAK & Taklukkan Rasa Malas
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  Kenali tipe belajarmu (Visual, Auditori, atau Kinestetik) dan terapkan teknik Pomodoro 25/5 untuk menyelesaikan tugas tepat waktu.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Checklist Belajar</span>
                <Link
                  href="/auth/login"
                  className="font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Baca Modul <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Modul 4: Sosial */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                    Bimbingan Sosial
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> 7 mnt
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Pertemanan Sehat & Speak-Up Lawan Bullying
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  Menjaga batas pertemanan yang sehat, bersikap asertif menolak tekanan teman sebaya (peer pressure), dan langkah aman melapor perundungan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Panduan Suara Anonim</span>
                <Link
                  href="/auth/login"
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Baca Modul <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jaminan Privasi & Keamanan */}
      <section id="keamanan" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privasi & Keamanan Prioritas Utama</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Ruang Aman Tanpa Rasa Khawatir
            </h2>
            <p className="text-slate-600 mt-4 text-base">
              Kami memegang teguh standar profesional bimbingan konseling dan perlindungan anak.
              Setiap keluhan, curhat, dan identitasmu dijaga dengan komitmen keamanan berlapis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Keamanan 1: Asas Kerahasiaan ABKIN */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kode Etik Kerahasiaan</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Mengikuti Kode Etik Asosiasi Bimbingan dan Konseling Indonesia (ABKIN). Data sesi konseling tidak dibocorkan ke teman sebaya maupun pihak luar tanpa persetujuanmu.
              </p>
            </div>

            {/* Keamanan 2: Kotak Suara Anonim 100% */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kotak Suara Anonim 100%</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Laporan insiden perundungan atau keluhan sensitif dapat dikirim tanpa menyertakan nama siswa, sehingga pelapor terlindungi secara mutlak dari intimidasi.
              </p>
            </div>

            {/* Keamanan 3: Enkripsi & Proteksi Akun */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Enkripsi & Proteksi Data</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Kata sandi dienkripsi dengan standar hash industri dan sesi konseling dilindungi otentikasi aman JWT untuk memastikan akun hanya dapat diakses oleh pemiliknya.
              </p>
            </div>

            {/* Keamanan 4: Regulasi Satuan Pendidikan (PPKSP) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Sesuai Regulasi PPKSP</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Selaras dengan Permendikbudristek No. 46/2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan untuk mewujudkan sekolah yang inklusif dan aman.
              </p>
            </div>
          </div>

          {/* Trust Banner inside Keamanan */}
          <div className="mt-10 bg-teal-50/80 border border-teal-200/70 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-teal-950 font-medium">
                <strong>Prinsip Kami:</strong> Konseling bukan tentang mencari siapa yang salah, melainkan mendampingi setiap siswa bertumbuh dengan penuh empati dan rasa aman.
              </div>
            </div>
            <Link
              href="/auth/register"
              className="whitespace-nowrap px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              Mulai Konsultasi Aman
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Crisis Hotline Banner */}
      <section className="bg-teal-900 text-white py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 flex items-center justify-center text-teal-300">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Sedang Menghadapi Masalah Berat?</h3>
              <p className="text-teal-200 text-sm">
                Kamu tidak sendirian. Guru BK siap mendengarkan tanpa menghakimi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6281298765432"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Hubungi Guru BK Siaga (WA)</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-white font-bold text-base">Sahabat BK</span>
          </div>
          <div>
            © 2025 Sahabat BK - Platform Bimbingan & Konseling Sekolah Indonesia. Semua hak dilindungi.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Masuk
            </Link>
            <span>•</span>
            <Link href="/auth/register" className="hover:text-white transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
