"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredSchedules, saveStoredSchedules } from "@/lib/storage";
import { CounselingSchedule } from "@/lib/mock-data";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  FileText,
  X,
  Filter,
  ArrowRight,
  User,
} from "lucide-react";

export default function TeacherSchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("APPROVED");
  const [selectedSchedule, setSelectedSchedule] = useState<CounselingSchedule | null>(null);
  const [counselorNotes, setCounselorNotes] = useState("");
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    setSchedules(getStoredSchedules());
  }, []);

  const filtered = schedules.filter((s) => {
    if (filterStatus === "ALL") return true;
    return s.status === filterStatus;
  });

  const handleOpenCompleteModal = (s: CounselingSchedule) => {
    setSelectedSchedule(s);
    setCounselorNotes(s.counselorNotes || "");
  };

  const handleSaveComplete = () => {
    if (!selectedSchedule) return;

    const all = getStoredSchedules();
    const updated = all.map((s) => {
      if (s.id === selectedSchedule.id) {
        return {
          ...s,
          status: "COMPLETED" as const,
          counselorNotes: counselorNotes.trim() || "Sesi konseling telah dilaksanakan dengan baik.",
        };
      }
      return s;
    });

    saveStoredSchedules(updated);
    setSchedules(updated);
    setSelectedSchedule(null);
    setSuccessToast(`Sesi konseling bersama ${selectedSchedule.studentName} berhasil diselesaikan!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Manajemen Jadwal Konseling Guru BK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jadwal Konseling Terkonfirmasi
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Daftar sesi bimbingan yang telah disetujui untuk dilaksanakan serta riwayat konseling selesai.
          </p>
        </div>

        <Link
          href="/teacher/schedule/pending"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" />
          <span>Lihat Permintaan Masuk</span>
        </Link>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {[
            { id: "APPROVED", label: "Terjadwal (Disetujui)" },
            { id: "COMPLETED", label: "Selesai Dilaksanakan" },
            { id: "ALL", label: "Semua Sesi" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Ditemukan {filtered.length} sesi
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === "COMPLETED"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {item.status === "COMPLETED" ? "Selesai Terlaksana" : "Terjadwal"}
                </span>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {item.category || "Konseling"}
                </span>

                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
                  {item.method}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">
                  {new Date(item.date).toLocaleDateString("id-ID", {
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
              <div className="text-xs text-slate-400">
                Siswa: <span className="text-slate-800 font-bold">{item.studentName}</span> ({item.studentGrade})
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Completed Notes */}
            {item.counselorNotes && (
              <div className="p-3.5 bg-teal-50/70 border border-teal-200/70 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-teal-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Catatan Hasil Konseling & Rekomendasi:</span>
                </div>
                <p className="text-teal-800 leading-relaxed">{item.counselorNotes}</p>
              </div>
            )}

            {/* Footer with Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                Kontak Siswa: <span className="font-semibold">{item.studentPhone}</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${item.studentPhone}?text=Halo%20${encodeURIComponent(
                    item.studentName
                  )},%20ini%20Ibu%20Siti%20dari%20Ruang%20BK%20terkait%20jadwal%20konseling%20kita`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat Siswa (WA)</span>
                </a>

                {item.status === "APPROVED" && (
                  <button
                    onClick={() => handleOpenCompleteModal(item)}
                    className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selesaikan & Catat Hasil</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">
              Tidak Ada Jadwal dengan Status Ini
            </h3>
          </div>
        )}
      </div>

      {/* Complete Session Notes Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Catat Hasil & Selesaikan Konseling
              </h3>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Sesi konseling bersama <strong>{selectedSchedule.studentName}</strong> mengenai <em>"{selectedSchedule.title}"</em>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Catatan Kasus & Rekomendasi untuk Siswa:
              </label>
              <textarea
                rows={4}
                value={counselorNotes}
                onChange={(e) => setCounselorNotes(e.target.value)}
                placeholder="Contoh: Siswa telah diberikan teknik relaksasi 4-7-8 dan diarahkan untuk membuat jadwal belajar harian. Rencana follow-up 2 minggu mendatang..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSchedule(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveComplete}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
              >
                Simpan & Tandai Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
