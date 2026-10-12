"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredComplaints, saveStoredComplaints } from "@/lib/storage";
import { AnonymousComplaint } from "@/lib/mock-data";
import {
  MessageSquareWarning,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Search,
  Filter,
  Send,
  X,
} from "lucide-react";

export default function TeacherComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<AnonymousComplaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<AnonymousComplaint | null>(null);
  const [replyText, setReplyText] = useState("");
  const [newStatus, setNewStatus] = useState<"BARU" | "DIPROSES" | "SELESAI">("DIPROSES");

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  const filtered = complaints.filter((c) => {
    if (filterStatus === "ALL") return true;
    return c.status === filterStatus;
  });

  const handleOpenAction = (item: AnonymousComplaint) => {
    setSelectedComplaint(item);
    setReplyText(item.counselorReply || "");
    setNewStatus(item.status);
  };

  const handleSaveReply = () => {
    if (!selectedComplaint) return;

    const updated = complaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: newStatus,
          counselorReply: replyText.trim() || undefined,
        };
      }
      return c;
    });

    saveStoredComplaints(updated);
    setComplaints(updated);
    setSelectedComplaint(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full mb-1">
            <MessageSquareWarning className="w-3 h-3" />
            <span>Pusat Tindak Lanjut Pengaduan Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kotak Pengaduan Siswa
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Daftar laporan perundungan, keluhan, dan curahan hati siswa untuk ditindaklanjuti secara bijaksana.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {["ALL", "BARU", "DIPROSES", "SELESAI"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "Semua Status" : st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan {filtered.length} dari {complaints.length} laporan
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {item.isAnonymous ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pelapor Anonim</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.reporterName} ({item.reporterGrade})</span>
                  </span>
                )}

                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {item.category}
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.urgency === "Darurat"
                      ? "bg-rose-100 text-rose-800"
                      : item.urgency === "Mendesak"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Urgensi: {item.urgency}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === "SELESAI"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "DIPROSES"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>
            </div>

            {item.counselorReply && (
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-xs space-y-1">
                <div className="font-bold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Catatan Tindak Lanjut Konselor:</span>
                </div>
                <p className="text-teal-800 leading-relaxed">
                  {item.counselorReply}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleOpenAction(item)}
                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                <span>Tindak Lanjuti / Beri Tanggapan</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-700 text-sm">
              Tidak Ada Laporan dengan Status Ini
            </h4>
          </div>
        )}
      </div>

      {/* Follow-up Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Tindak Lanjut Laporan Siswa
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Judul Laporan:</div>
              <div className="font-bold text-sm text-slate-800">
                {selectedComplaint.title}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ubah Status Penanganan
              </label>
              <select
                value={newStatus}
                onChange={(e: any) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
              >
                <option value="BARU">BARU (Belum Ditindaklanjuti)</option>
                <option value="DIPROSES">DIPROSES (Sedang Mediasi / Penyelidikan)</option>
                <option value="SELESAI">SELESAI (Masalah Telah Terselesaikan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggapan / Catatan Konseling untuk Siswa
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tuliskan langkah yang telah diambil atau pesan penguatan untuk siswa pelapor..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleSaveReply}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
              >
                Simpan & Kirim Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
