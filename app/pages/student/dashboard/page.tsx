"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStoredSchedules,
  getStoredModules,
  getStoredMoods,
  saveMoodLog,
} from "@/lib/storage";
import { CounselingSchedule, ModuleItem, MoodLog } from "@/lib/mock-data";
import {
  Calendar,
  BookOpen,
  MessageSquareWarning,
  Sparkles,
  ArrowRight,
  Smile,
  Clock,
  CheckCircle2,
  Phone,
  Flame,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("Siswa");
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null);
  const [moodSavedToast, setMoodSavedToast] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const name = localStorage.getItem("name") || "Budi Pratama";
    setStudentName(name);

    // Fetch schedules
    const storedSch = getStoredSchedules();
    setSchedules(storedSch);

    // Fetch modules
    const storedMods = getStoredModules();
    setModules(storedMods);

    // Check today mood
    const moods = getStoredMoods();
    const current = moods.find((m) => m.date === todayStr);
    if (current) setTodayMood(current);
  }, [todayStr]);

  const handleSelectMood = (
    mood: "happy" | "calm" | "neutral" | "anxious" | "sad",
    label: string
  ) => {
    const entry: MoodLog = {
      date: todayStr,
      mood,
      moodLabel: label,
      note: "Dicatat melalui Daily Mood Tracker",
    };
    saveMoodLog(entry);
    setTodayMood(entry);
    setMoodSavedToast(true);
    setTimeout(() => setMoodSavedToast(false), 4000);
  };

  const upcomingSchedule = schedules.find(
    (s) => s.status === "APPROVED" || s.status === "PENDING"
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-xl shadow-teal-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ruang Konseling & Bimbingan Pribadi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {getGreeting()}, {studentName}! 👋
          </h1>
          <p className="mt-2 text-teal-50 text-sm sm:text-base leading-relaxed">
            "Setiap langkah kecil yang kamu ambil hari ini membawamu lebih dekat ke masa depan impianmu. Ingat, kamu tidak sendirian di sekolah ini."
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pages/student/schedule/create"
              className="inline-flex items-center gap-2 bg-white text-teal-800 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-teal-50 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>Jadwalkan Konseling</span>
            </Link>
            <Link
              href="/pages/student/complaints"
              className="inline-flex items-center gap-2 bg-teal-800/40 hover:bg-teal-800/60 border border-white/20 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl backdrop-blur-md transition-all"
            >
              <MessageSquareWarning className="w-4 h-4 text-rose-300" />
              <span>Kotak Suara Rahasia</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mb-20" />
      </div>

      {/* Daily Mood Tracker Widget */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">
                Bagaimana Perasaanmu Hari Ini?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check-in perasaan membantumu lebih sadar akan emosi dan menjaga kesehatan mental.
            </p>
          </div>

          {todayMood && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mood tercatat: {todayMood.moodLabel}</span>
            </div>
          )}
        </div>

        {/* Mood Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {[
            { id: "happy", icon: "😄", label: "Sangat Bahagia", desc: "Berenergi & ceria" },
            { id: "calm", icon: "😊", label: "Tenang & Baik", desc: "Fokus & rileks" },
            { id: "neutral", icon: "😐", label: "Biasa Saja", desc: "Stabil & datar" },
            { id: "anxious", icon: "😔", label: "Cemas / Stres", desc: "Beban pikiran" },
            { id: "sad", icon: "😢", label: "Butuh Teman", desc: "Sedih / lelah" },
          ].map((m) => {
            const isSelected = todayMood?.mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() =>
                  handleSelectMood(
                    m.id as "happy" | "calm" | "neutral" | "anxious" | "sad",
                    m.label
                  )
                }
                className={`p-4 rounded-2xl border text-center transition-all group ${
                  isSelected
                    ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm"
                    : "bg-slate-50 border-slate-200/80 hover:bg-white hover:border-teal-200 hover:shadow-md"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {m.icon}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-slate-800">
                  {m.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>

        {moodSavedToast && (
          <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs flex items-center justify-between animate-in fade-in">
            <span>✨ Terima kasih telah check-in hari ini! Emosimu valid dan berharga.</span>
            <Link
              href="/pages/student/assessment"
              className="font-semibold text-teal-700 hover:underline"
            >
              Coba Tes Relaksasi →
            </Link>
          </div>
        )}
      </div>

      {/* Grid: Upcoming Counseling & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Next Counseling Appointment */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-800">
                  Jadwal Konseling Terdekat
                </h3>
              </div>
              <Link
                href="/pages/student/schedule"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingSchedule ? (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      upcomingSchedule.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {upcomingSchedule.status === "APPROVED"
                      ? "Disetujui Guru BK"
                      : "Menunggu Persetujuan"}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(upcomingSchedule.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    {upcomingSchedule.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                    {upcomingSchedule.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Konselor: </span>
                    <span className="font-semibold text-slate-700">
                      {upcomingSchedule.counselorName || "Dra. Siti Rahmawati"}
                    </span>
                    <span className="text-slate-400"> ({upcomingSchedule.method})</span>
                  </div>

                  {upcomingSchedule.status === "APPROVED" && (
                    <a
                      href={`https://wa.me/${upcomingSchedule.counselorPhone || "6281298765432"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Chat Konselor (WA)</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-slate-700">
                  Belum Ada Jadwal Konseling Aktif
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Kamu dapat mengajukan sesi konsultasi tatap muka atau daring kapan saja dengan Guru BK.
                </p>
                <Link
                  href="/pages/student/schedule/create"
                  className="mt-4 inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-teal-700 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Ajukan Jadwal Sekarang</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Services */}
        <div className="space-y-4">
          <Link
            href="/pages/student/assessment"
            className="block p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Tes Minat & Bakat Karir</h4>
            <p className="text-xs text-slate-600 mt-1">
              Ikuti tes 10 pertanyaan Holland RIASEC untuk rekomendasi jurusan kuliah.
            </p>
            <div className="mt-3 text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>Mulai Tes Cepat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/pages/student/complaints"
            className="block p-5 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/80 rounded-3xl hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Kotak Suara Rahasia</h4>
            <p className="text-xs text-slate-600 mt-1">
              Laporkan perundungan atau masalah sekolah secara aman & anonim 100%.
            </p>
            <div className="mt-3 text-xs font-semibold text-rose-700 flex items-center gap-1">
              <span>Kirim Laporan Rahasia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-2xl text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Butuh Bantuan Mendesak?</span>
            </div>
            Ruang BK buka setiap Senin–Jumat 07:30 – 15:30 WIB di Lantai 2 Gedung Utama.
          </div>
        </div>
      </div>

      {/* Featured Modules Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base text-slate-800">
                Modul Bimbingan Populer
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Materi pengembangan diri yang dikurasi oleh Guru BK
            </p>
          </div>
          <Link
            href="/pages/student/module/list-module"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            Semua Modul <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:border-teal-200 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-100/70 text-teal-800">
                  {item.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">{item.readTime}</span>
                <Link
                  href={`/pages/student/module/detail-module/${item.id}`}
                  className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  Baca Modul →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
