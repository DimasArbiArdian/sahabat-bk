"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStoredSchedules,
  getStoredModules,
  getStoredComplaints,
} from "@/lib/storage";
import { CounselingSchedule, ModuleItem, AnonymousComplaint } from "@/lib/mock-data";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  BookOpen,
  MessageSquareWarning,
  CheckCircle2,
  Users,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Phone,
} from "lucide-react";

export default function TeacherDashboardPage() {
  const [teacherName, setTeacherName] = useState("Guru BK");
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [complaints, setComplaints] = useState<AnonymousComplaint[]>([]);

  useEffect(() => {
    const name = localStorage.getItem("name") || "Dra. Siti Rahmawati, M.Pd., Kons.";
    setTeacherName(name);

    setSchedules(getStoredSchedules());
    setModules(getStoredModules());
    setComplaints(getStoredComplaints());
  }, []);

  const pendingSchedules = schedules.filter((s) => s.status === "PENDING");
  const approvedSchedules = schedules.filter((s) => s.status === "APPROVED");
  const completedSchedules = schedules.filter((s) => s.status === "COMPLETED");
  const activeComplaints = complaints.filter((c) => c.status !== "SELESAI");

  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Siswa,Kelas,Topik,Kategori,Metode,Status,Tanggal\n" +
      schedules
        .map(
          (s) =>
            `"${s.id}","${s.studentName}","${s.studentGrade}","${s.title}","${s.category}","${s.method}","${s.status}","${s.date}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Konseling_SahabatBK_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/80 mb-3">
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
            <span>Pusat Kendali Bimbingan & Konseling Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang, {teacherName}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Pantau permohonan konseling siswa, tindak lanjut kotak pengaduan, dan publikasi modul belajar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Rekap CSV</span>
          </button>
          <Link
            href="/teacher/module"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-700/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Modul Baru</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <Link
          href="/teacher/schedule/pending"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Permintaan Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {pendingSchedules.length}
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <span>Perlu konfirmasi Guru BK</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        {/* Metric 2 */}
        <Link
          href="/teacher/schedule"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Konseling Terjadwal</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {approvedSchedules.length}
          </div>
          <div className="mt-1 text-[11px] text-teal-600 font-semibold">
            Siap untuk sesi tatap muka / daring
          </div>
        </Link>

        {/* Metric 3 */}
        <Link
          href="/teacher/complaints"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kotak Suara Siswa</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareWarning className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {activeComplaints.length}
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-semibold">
            {activeComplaints.length > 0 ? "Laporan butuh tindak lanjut" : "Semua laporan selesai"}
          </div>
        </Link>

        {/* Metric 4 */}
        <Link
          href="/pages/student/module/list-module"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Modul Terpublikasi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {modules.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            Materi panduan siswa
          </div>
        </Link>
      </div>

      {/* Main Grid: Pending Schedules & Active Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Requests Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-800">
                Permintaan Konseling Masuk
              </h3>
            </div>
            <Link
              href="/teacher/schedule/pending"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Kelola ({pendingSchedules.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingSchedules.length > 0 ? (
            <div className="space-y-4">
              {pendingSchedules.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {item.studentName} ({item.studentGrade})
                    </span>
                    <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                  <div className="pt-2 border-t border-amber-200/40 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Link
                      href="/teacher/schedule/pending"
                      className="font-semibold text-teal-700 hover:underline"
                    >
                      Beri Tanggapan →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Semua Permintaan Konseling Telah Direspons
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Tidak ada siswa yang menunggu konfirmasi saat ini.
              </p>
            </div>
          )}
        </div>

        {/* Complaints Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-base text-slate-800">
                Kotak Pengaduan Siswa Terkini
              </h3>
            </div>
            <Link
              href="/teacher/complaints"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {item.isAnonymous ? "🎭 Pelapor Anonim" : `👤 ${item.reporterName} (${item.reporterGrade})`}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.urgency === "Darurat"
                          ? "bg-rose-100 text-rose-800"
                          : item.urgency === "Mendesak"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.content}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                    <span>Status: <strong className="text-slate-700">{item.status}</strong></span>
                    <Link
                      href="/teacher/complaints"
                      className="font-semibold text-teal-700 hover:underline"
                    >
                      Tindak Lanjuti →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Tidak Ada Laporan Aktif
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
