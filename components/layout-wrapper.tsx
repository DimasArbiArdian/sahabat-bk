"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthWrapper from "@/components/auth-wrapper";
import { DEMO_USERS } from "@/lib/mock-data";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  MessageSquareWarning,
  Sparkles,
  User,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Bell,
  HeartHandshake,
  School,
  ArrowRightLeft,
  LifeBuoy,
} from "lucide-react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStandalone, setIsStandalone] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pathname = usePathname() || "";
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/pages/student/module/list-module") {
      return pathname.startsWith("/pages/student/module");
    }
    return pathname === href;
  };

  const updateUserInfo = () => {
    const currentRole = localStorage.getItem("role");
    const currentName = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    // Auto seed demo user if none exists and visiting authenticated route
    if (!token && !pathname.startsWith("/auth") && pathname !== "/") {
      const defaultUser = DEMO_USERS.student;
      localStorage.setItem("token", defaultUser.token);
      localStorage.setItem("role", defaultUser.role);
      localStorage.setItem("name", defaultUser.fullname);
      localStorage.setItem("id", defaultUser.id);
      setRole(defaultUser.role);
      setName(defaultUser.fullname);
    } else {
      setRole(currentRole);
      setName(currentName);
    }
  };

  useEffect(() => {
    updateUserInfo();
    window.addEventListener("storage", updateUserInfo);
    return () => window.removeEventListener("storage", updateUserInfo);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    setName(null);
    setRole(null);
    setShowProfileMenu(false);
    router.push("/auth/login");
  };

  const switchDemoRole = (targetRole: "student" | "teacher" | "admin") => {
    const demo = DEMO_USERS[targetRole];
    localStorage.setItem("token", demo.token);
    localStorage.setItem("role", demo.role);
    localStorage.setItem("name", demo.fullname);
    localStorage.setItem("id", demo.id);
    setName(demo.fullname);
    setRole(demo.role);
    setShowRoleSwitcher(false);
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
    <AuthWrapper setIsAuthPage={setIsStandalone}>
      {isStandalone ? (
        <main className="min-h-screen bg-slate-50">{children}</main>
      ) : (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transform transition-transform duration-300 md:relative md:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div>
              {/* Sidebar Header / Brand */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-3 group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
                      Sahabat <span className="text-teal-600">BK</span>
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Bimbingan & Konseling
                    </span>
                  </div>
                </Link>

                <button
                  className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Badge & Quick Switcher */}
              <div className="px-5 py-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        role === "TEACHER"
                          ? "bg-amber-500"
                          : role === "ADMIN"
                          ? "bg-purple-500"
                          : "bg-teal-500"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {role === "TEACHER"
                          ? "Guru BK (Konselor)"
                          : role === "ADMIN"
                          ? "Administrator"
                          : "Siswa Aktif"}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                        {name || "Pengguna"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                    title="Ganti Peran Demo"
                    className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Role Switcher Dropdown */}
                {showRoleSwitcher && (
                  <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2 text-xs space-y-1">
                    <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Coba Peran Demo:
                    </div>
                    <button
                      onClick={() => switchDemoRole("student")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === "STUDENT"
                          ? "bg-teal-50 text-teal-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>🧑‍🎓 Siswa (Budi)</span>
                      {role === "STUDENT" && <span className="text-[10px]">Aktif</span>}
                    </button>
                    <button
                      onClick={() => switchDemoRole("teacher")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === "TEACHER"
                          ? "bg-amber-50 text-amber-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>👩‍🏫 Guru BK (Ibu Siti)</span>
                      {role === "TEACHER" && <span className="text-[10px]">Aktif</span>}
                    </button>
                    <button
                      onClick={() => switchDemoRole("admin")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === "ADMIN"
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>🛡️ Admin Sekolah</span>
                      {role === "ADMIN" && <span className="text-[10px]">Aktif</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <nav className="px-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
                {role === "STUDENT" ? (
                  <>
                    <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Menu Utama Siswa
                    </div>
                    <Link
                      href="/pages/student/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/dashboard")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      <span>Dashboard & Mood</span>
                    </Link>

                    <Link
                      href="/pages/student/module/list-module"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/module/list-module")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Modul Bimbingan</span>
                    </Link>

                    <Link
                      href="/pages/student/schedule"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/schedule")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span>Jadwal Konseling</span>
                    </Link>

                    <div className="px-3 pt-4 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Layanan Khusus
                    </div>

                    <Link
                      href="/pages/student/complaints"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/complaints")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <MessageSquareWarning className="w-4 h-4 text-rose-500" />
                      <span>Kotak Suara Rahasia</span>
                      <span className="ml-auto text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-semibold">
                        Aman
                      </span>
                    </Link>

                    <Link
                      href="/pages/student/assessment"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/assessment")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Tes Minat & Bakat</span>
                    </Link>

                    <Link
                      href="/pages/student/user"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/user")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Profil Saya</span>
                    </Link>
                  </>
                ) : role === "TEACHER" ? (
                  <>
                    <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Portal Guru BK
                    </div>
                    <Link
                      href="/teacher/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/teacher/dashboard")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      <span>Dashboard Guru BK</span>
                    </Link>

                    <Link
                      href="/pages/student/module/list-module"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/pages/student/module/list-module")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Kelola Modul</span>
                    </Link>

                    <Link
                      href="/teacher/schedule"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/teacher/schedule")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span>Jadwal Terkonfirmasi</span>
                    </Link>

                    <Link
                      href="/teacher/schedule/pending"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/teacher/schedule/pending")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Permintaan Masuk</span>
                      <span className="ml-auto text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-semibold">
                        Prioritas
                      </span>
                    </Link>

                    <Link
                      href="/teacher/complaints"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/teacher/complaints")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <MessageSquareWarning className="w-4 h-4 text-rose-500" />
                      <span>Kotak Pengaduan Siswa</span>
                    </Link>

                    <Link
                      href="/teacher/user"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/teacher/user")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Profil Guru BK</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Portal Admin
                    </div>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isActive("/admin/dashboard")
                          ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-200/50"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <School className="w-4 h-4 text-purple-600" />
                      <span>Manajemen Sekolah</span>
                    </Link>
                    <Link
                      href="/pages/student/module/list-module"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100/70"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Lihat Modul</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-100 space-y-2">
              <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-teal-900">
                  <LifeBuoy className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hotline Darurat BK</span>
                </div>
                <p className="text-slate-500 mt-1 text-[11px] leading-tight">
                  Konsultasi krisis 24 jam / Perlindungan anak
                </p>
                <a
                  href="https://wa.me/6281298765432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800"
                >
                  Hubungi Sekarang <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 px-1">
                <Link href="/" className="hover:text-teal-600 transition-colors">
                  Beranda
                </Link>
                <span>•</span>
                <button
                  onClick={handleLogout}
                  className="text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                >
                  <LogOut className="w-3 h-3" />
                  Keluar
                </button>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between z-30 sticky top-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  title="Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block">
                    SMA Negeri 1 Prestasi Bangsa
                  </div>
                </div>
              </div>

              {/* Right Side Header Items */}
              <div className="flex items-center gap-3">
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors"
                    title="Notifikasi"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="font-semibold text-sm text-slate-800">Notifikasi Terkini</span>
                        <span className="text-[10px] bg-teal-50 text-teal-700 font-medium px-2 py-0.5 rounded-full">
                          2 Baru
                        </span>
                      </div>
                      <div className="space-y-3 pt-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100">
                          <div className="font-semibold text-teal-900">Jadwal Konseling Dikonfirmasi</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">
                            Sesi bersama Dra. Siti Rahmawati dijadwalkan besok pukul 10:00 WIB.
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-semibold text-slate-800">Modul Baru Diterbitkan</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">
                            "Mengenal Emosi Diri" telah siap dibaca di perpustakaan modul.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-100/80 rounded-xl transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-teal-700/20">
                      {name ? name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-semibold text-slate-800 leading-tight">
                        {name || "Pengguna"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {role === "TEACHER" ? "Guru BK" : role === "ADMIN" ? "Admin" : "Siswa"}
                      </div>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-semibold text-slate-800">{name}</div>
                        <div className="text-[11px] text-slate-500">{role}</div>
                      </div>
                      <Link
                        href={role === "TEACHER" ? "/teacher/user" : "/pages/student/user"}
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Edit Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Page Body */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      )}
    </AuthWrapper>
  );
}
