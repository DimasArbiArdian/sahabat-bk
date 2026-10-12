"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSchedules, saveStoredSchedules } from "@/lib/storage";
import { CounselingSchedule } from "@/lib/mock-data";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Video,
  MessageSquare,
  Building,
} from "lucide-react";

export default function CreateSchedulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Pribadi" | "Sosial" | "Belajar" | "Karir">("Belajar");
  const [method, setMethod] = useState<"Tatap Muka di Ruang BK" | "Online WhatsApp" | "Online Google Meet">("Tatap Muka di Ruang BK");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const studentName = localStorage.getItem("name") || "Budi Pratama";
    const studentId = localStorage.getItem("id") || "usr-std-001";

    const newSchedule: CounselingSchedule = {
      id: "sch-" + Date.now().toString(36),
      studentId,
      studentName,
      studentGrade: "11 MIPA 2",
      studentPhone: "6281234567890",
      counselorName: "Dra. Siti Rahmawati, M.Pd., Kons.",
      counselorPhone: "6281298765432",
      title: title.trim(),
      category,
      method,
      description: description.trim(),
      date: new Date(date).toISOString(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    const current = getStoredSchedules();
    saveStoredSchedules([newSchedule, ...current]);

    // Try posting to API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, date }),
        });
      } catch {
        // Ignored in local demo mode
      }
    }

    setLoading(false);
    router.push("/pages/student/schedule");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Permohonan Konseling Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ajukan Jadwal Konseling Baru
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Pilih topik bimbingan, metode konsultasi, dan waktu yang nyaman untuk bertemu Guru BK.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Metode Konsultasi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "Tatap Muka di Ruang BK",
                  icon: Building,
                  label: "Tatap Muka",
                  desc: "Di Ruang BK Lantai 2",
                },
                {
                  id: "Online WhatsApp",
                  icon: MessageSquare,
                  label: "Online WhatsApp",
                  desc: "Chat / Call WA",
                },
                {
                  id: "Online Google Meet",
                  icon: Video,
                  label: "Video Call",
                  desc: "Google Meet",
                },
              ].map((m) => {
                const isSelected = method === m.id;
                const IconComponent = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 text-teal-900"
                        : "bg-slate-50 border-slate-200/80 hover:bg-white text-slate-700"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 mb-2 ${
                        isSelected ? "text-teal-600" : "text-slate-400"
                      }`}
                    />
                    <div className="text-xs sm:text-sm font-bold">{m.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Layanan
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
              >
                <option value="Belajar">Bimbingan Belajar</option>
                <option value="Karir">Bimbingan Karir / Kuliah</option>
                <option value="Pribadi">Bimbingan Pribadi</option>
                <option value="Sosial">Bimbingan Sosial & Relasi</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Topik / Judul Konseling
              </label>
              <input
                type="text"
                placeholder="Contoh: Konsultasi Penjurusan Kuliah & Persiapan SNBT"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi / Hal yang Ingin Diceritakan
            </label>
            <textarea
              rows={4}
              placeholder="Ceritakan gambaran singkat hal yang ingin kamu diskusikan agar Guru BK dapat mempersiapkan materi bimbingan yang tepat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          {/* Date & Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Tanggal & Waktu Pertemuan
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              *Jadwal jam kerja Guru BK: Senin–Jumat pukul 07:30 – 15:30 WIB.
            </p>
          </div>

          {/* Counselor Assignment Note */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">
                Konselor Ditugaskan: Dra. Siti Rahmawati, M.Pd., Kons.
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Permintaanmu akan segera dikonfirmasi dan statusnya dapat dipantau di menu Jadwal Konseling.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Mengajukan Permintaan..." : "Kirim Pengajuan Konseling"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
