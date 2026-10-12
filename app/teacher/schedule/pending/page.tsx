"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSchedules, saveStoredSchedules } from "@/lib/storage";
import { CounselingSchedule } from "@/lib/mock-data";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar,
  Building,
  Video,
  MessageSquare,
  AlertCircle,
  X,
  Phone,
} from "lucide-react";

export default function PendingSchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<CounselingSchedule | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    const all = getStoredSchedules();
    setSchedules(all.filter((s) => s.status === "PENDING"));
  }, []);

  const handleApprove = async (schedule: CounselingSchedule) => {
    const all = getStoredSchedules();
    const updated = all.map((s) => {
      if (s.id === schedule.id) {
        return {
          ...s,
          status: "APPROVED" as const,
          counselorName: localStorage.getItem("name") || "Dra. Siti Rahmawati, M.Pd., Kons.",
        };
      }
      return s;
    });

    saveStoredSchedules(updated);
    setSchedules(updated.filter((s) => s.status === "PENDING"));
    setSuccessToast(`Jadwal konseling bersama ${schedule.studentName} telah berhasil disetujui!`);
    setTimeout(() => setSuccessToast(""), 4000);

    // Try API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`/api/schedule/${schedule.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "APPROVED" }),
        });
      } catch {
        // Ignored in local demo mode
      }
    }
  };

  const handleOpenReject = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setRejectionReason("Jadwal bertabrakan dengan agenda rapat dinas sekolah. Silakan ajukan jadwal di hari berikutnya.");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedSchedule || !rejectionReason.trim()) return;

    const all = getStoredSchedules();
    const updated = all.map((s) => {
      if (s.id === selectedSchedule.id) {
        return {
          ...s,
          status: "REJECTED" as const,
          rejectedReason: rejectionReason.trim(),
        };
      }
      return s;
    });

    saveStoredSchedules(updated);
    setSchedules(updated.filter((s) => s.status === "PENDING"));
    setIsRejectModalOpen(false);
    setSelectedSchedule(null);
    setSuccessToast("Permintaan jadwal telah ditolak dengan catatan alasan.");
    setTimeout(() => setSuccessToast(""), 4000);

    // Try API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`/api/schedule/${selectedSchedule.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "REJECTED", rejectedReason: rejectionReason }),
        });
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Verifikasi & Konfirmasi Konseling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Permintaan Konseling Masuk
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Tinjau permohonan konseling dari siswa untuk disetujui atau dijadwalkan ulang.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 hover:border-amber-300 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                  Menunggu Persetujuan Guru BK
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
              <div className="text-xs font-semibold text-slate-400">
                Pemohon: <span className="text-slate-800 font-bold">{item.studentName}</span> ({item.studentGrade})
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                No. Kontak Siswa: <span className="font-semibold text-slate-600">{item.studentPhone}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenReject(item)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  Tolak / Minta Reschedule
                </button>
                <button
                  onClick={() => handleApprove(item)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Jadwal Ini</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">
              Tidak Ada Permintaan yang Menunggu
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Semua permohonan konseling dari siswa telah diproses.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Alasan Penolakan / Reschedule
              </h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Berikan catatan yang jelas kepada <strong>{selectedSchedule.studentName}</strong> agar siswa memahami alasan penyesuaian jadwal.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Catatan Alasan:
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan atau saran waktu alternatif..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
