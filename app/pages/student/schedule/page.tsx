"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredSchedules } from "@/lib/storage";
import { CounselingSchedule } from "@/lib/mock-data";
import {
  Calendar,
  Clock,
  PlusCircle,
  Phone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building,
  Video,
  MessageSquare,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function StudentSchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      fetch("/api/schedule", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped: CounselingSchedule[] = data.map((d: any) => ({
              id: d.id,
              studentId: d.studentId,
              studentName: localStorage.getItem("name") || "Budi Pratama",
              studentGrade: "11 MIPA 2",
              studentPhone: "6281234567890",
              counselorName: d.counselor?.user?.fullname || "Dra. Siti Rahmawati, M.Pd., Kons.",
              counselorPhone: d.counselor?.phoneNumber || "6281298765432",
              title: d.title,
              description: d.description,
              date: d.date,
              category: "Belajar",
              method: "Tatap Muka di Ruang BK",
              status: d.status,
              rejectedReason: d.rejectedReason,
              createdAt: d.createdAt,
            }));
            setSchedules(mapped);
          } else {
            setSchedules(getStoredSchedules());
          }
        })
        .catch(() => {
          setSchedules(getStoredSchedules());
        });
    } else {
      setSchedules(getStoredSchedules());
    }
  }, []);

  const filtered = schedules.filter((s) => {
    if (filterStatus === "ALL") return true;
    return s.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui Guru BK</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Konfirmasi</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak / Diatur Ulang</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Selesai Terlaksana</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Riwayat & Jadwal Konseling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jadwal Konseling Siswa
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Pantau status permohonan konseling tatap muka dan sesi konsultasi daring Anda.
          </p>
        </div>

        <Link
          href="/pages/student/schedule/create"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-teal-700/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajukan Jadwal Baru</span>
        </Link>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "Semua Sesi" },
            { id: "APPROVED", label: "Disetujui" },
            { id: "PENDING", label: "Menunggu" },
            { id: "COMPLETED", label: "Selesai" },
            { id: "REJECTED", label: "Ditolak" },
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
          Ditemukan {filtered.length} jadwal konseling
        </div>
      </div>

      {/* Schedules Cards List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(item.status)}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {item.category || "Konseling"}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
                  {item.method || "Tatap Muka di Ruang BK"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
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
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Rejection / Reschedule Reason */}
            {item.status === "REJECTED" && item.rejectedReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Catatan dari Guru BK:</span>
                </div>
                <p className="leading-relaxed">"{item.rejectedReason}"</p>
              </div>
            )}

            {/* Completed Notes */}
            {item.status === "COMPLETED" && item.counselorNotes && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Catatan Hasil Konseling:</span>
                </div>
                <p className="leading-relaxed">"{item.counselorNotes}"</p>
              </div>
            )}

            {/* Footer with Counselor info & Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400">Guru BK Pendamping: </span>
                <span className="font-bold text-slate-700">
                  {item.counselorName || "Dra. Siti Rahmawati, M.Pd., Kons."}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.status === "APPROVED" && (
                  <a
                    href={`https://wa.me/${item.counselorPhone || "6281298765432"}?text=Halo%20Ibu%20Siti,%20saya%20${encodeURIComponent(
                      item.studentName
                    )}%20ingin%20mengonfirmasi%20jadwal%20konseling%20untuk%20topik%20"${encodeURIComponent(
                      item.title
                    )}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi Guru BK via WhatsApp</span>
                  </a>
                )}

                {item.status === "REJECTED" && (
                  <Link
                    href="/pages/student/schedule/create"
                    className="inline-flex items-center gap-1.5 bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl"
                  >
                    <span>Ajukan Jadwal Baru</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">
              Belum Ada Jadwal Konseling
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tidak ada sesi yang cocok dengan filter yang dipilih. Ajukan sesi konsultasi baru bersama Guru BK kapan saja.
            </p>
            <Link
              href="/pages/student/schedule/create"
              className="mt-4 inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-teal-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ajukan Jadwal Baru</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
