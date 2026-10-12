"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredComplaints, saveStoredComplaints } from "@/lib/storage";
import { AnonymousComplaint } from "@/lib/mock-data";
import {
  ShieldAlert,
  Send,
  Lock,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  LifeBuoy,
} from "lucide-react";

export default function StudentComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<AnonymousComplaint[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState<
    "Bullying / Perundungan" | "Tekanan Belajar" | "Masalah Hubungan Teman" | "Fasilitas & Keamanan" | "Lainnya"
  >("Bullying / Perundungan");
  const [urgency, setUrgency] = useState<"Normal" | "Mendesak" | "Darurat">("Mendesak");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const studentName = localStorage.getItem("name") || "Budi Pratama";

    const newReport: AnonymousComplaint = {
      id: "cmp-" + Date.now().toString(36),
      category,
      urgency,
      isAnonymous,
      reporterName: isAnonymous ? undefined : studentName,
      reporterGrade: isAnonymous ? undefined : "11 MIPA 2",
      title: title.trim(),
      content: content.trim(),
      status: "BARU",
      createdAt: new Date().toISOString(),
    };

    const updated = [newReport, ...complaints];
    saveStoredComplaints(updated);
    setComplaints(updated);

    setTitle("");
    setContent("");
    setIsSubmitting(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
            <Lock className="w-3 h-3" />
            <span>Kerahasiaan & Privasi 100% Terlindungi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kotak Suara & Pengaduan Rahasia
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Ruang aman untuk melaporkan perundungan (bullying), beban akademik berat, atau masalah pribadi secara anonim.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymity Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Pilihan Identitas Pelapor
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(true)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    isAnonymous
                      ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400/20 text-rose-900"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                  }`}
                >
                  <EyeOff className={`w-5 h-5 mt-0.5 ${isAnonymous ? "text-rose-600" : "text-slate-400"}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Anonim (Rahasia)</div>
                    <div className="text-[11px] opacity-75">Nama & kelasmu disembunyikan sepenuhnya</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(false)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    !isAnonymous
                      ? "bg-teal-50 border-teal-300 ring-2 ring-teal-400/20 text-teal-900"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                  }`}
                >
                  <UserCheck className={`w-5 h-5 mt-0.5 ${!isAnonymous ? "text-teal-600" : "text-slate-400"}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Sertakan Identitas</div>
                    <div className="text-[11px] opacity-75">Guru BK dapat menghubungi balik langsung</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kategori Masalah
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
                >
                  <option value="Bullying / Perundungan">Bullying / Perundungan</option>
                  <option value="Tekanan Belajar">Tekanan Belajar / Akademik</option>
                  <option value="Masalah Hubungan Teman">Masalah Relasi Teman / Sosial</option>
                  <option value="Fasilitas & Keamanan">Keamanan Sekolah & Fasilitas</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tingkat Urgensi
                </label>
                <select
                  value={urgency}
                  onChange={(e: any) => setUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
                >
                  <option value="Normal">Normal (Saran / Masukan)</option>
                  <option value="Mendesak">Mendesak (Butuh Tindakan 1-2 Hari)</option>
                  <option value="Darurat">Darurat (Ancaman Fisik / Krisis)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Judul Laporan / Keluhan
              </label>
              <input
                type="text"
                placeholder="Ringkasan singkat masalah yang dihadapi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detail Kejadian / Penjelasan
              </label>
              <textarea
                placeholder="Ceritakan secara kronologis apa yang terjadi, tempat kejadian, atau siapa yang terlibat (jika relevan). Segala cerita aman bersama Guru BK."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isAnonymous ? "Kirim Laporan Rahasia (Anonim)" : "Kirim Laporan Resmi"}</span>
            </button>
          </form>

          {successToast && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <div className="font-bold">Laporan Berhasil Terkirim ke Guru BK!</div>
                <div className="text-emerald-700 mt-0.5">
                  Terima kasih atas keberanianmu. Guru BK akan segera meninjau dan menindaklanjuti dengan penuh kehati-hatian.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Safety Principles */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 text-xs text-slate-600 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <span>Komitmen Ruang BK</span>
            </div>
            <p className="leading-relaxed">
              Kotak Suara ini dibaca langsung oleh Koordinator Bimbingan Konseling. Setiap informasi ditangani dengan azas kerahasiaan konselor (Kode Etik ABKIN).
            </p>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li className="flex items-start gap-1.5">
                <span className="text-teal-600 font-bold">•</span>
                <span>Tidak ada sanksi atas laporan yang diajukan dengan itikad baik.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-600 font-bold">•</span>
                <span>Pendekatan mediasi bersifat pembinaan (bukan penghakiman).</span>
              </li>
            </ul>
          </div>

          <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-6 text-xs text-rose-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Situasi Mengancam Keselamatan?</span>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Jika kamu atau temanmu dalam bahaya fisik segera temui Guru BK di Ruang BK atau hubungi Hotline Darurat.
            </p>
            <a
              href="https://wa.me/6281298765432"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Hubungi Hotline Darurat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Riwayat Laporan Terkirim */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-bold text-base text-slate-900">
            Daftar Pengaduan Anda
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status penanganan dan tindak lanjut dari Guru BK
          </p>
        </div>

        {complaints.length > 0 ? (
          <div className="space-y-4">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === "SELESAI"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "DIPROSES"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>

                {item.counselorReply && (
                  <div className="mt-3 p-3.5 bg-teal-50 border border-teal-200/70 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-teal-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Tanggapan & Tindak Lanjut Guru BK:</span>
                    </div>
                    <p className="text-teal-800 text-[11px] leading-relaxed">
                      "{item.counselorReply}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            Belum ada riwayat laporan yang dikirimkan.
          </div>
        )}
      </div>
    </div>
  );
}
