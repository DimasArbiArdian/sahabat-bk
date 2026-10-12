"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, User, CheckCircle2, Phone, GraduationCap } from "lucide-react";

export default function UpdateStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    studentId: "NIS-20241102",
    grade: "11 MIPA 2",
    phoneNumber: "6281234567890",
    schoolName: "SMA Negeri 1 Prestasi Bangsa",
  });
  const [successToast, setSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentName = localStorage.getItem("name") || "Budi Pratama";
    setForm((prev) => ({ ...prev, fullname: currentName }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem("name", form.fullname);
    window.dispatchEvent(new Event("storage"));

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        await fetch("/api/user/student", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
      } catch {
        // Ignored in local demo mode
      }
    }

    setLoading(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>Pengaturan Akun Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profil Siswa
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Perbarui data diri, kelas, nomor WhatsApp untuk notifikasi jadwal bimbingan.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profil berhasil diperbarui!</span>
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {/* Avatar header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-700/20">
            {form.fullname ? form.fullname.charAt(0) : "S"}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{form.fullname}</h3>
            <p className="text-xs text-slate-500">Siswa Kelas {form.grade}</p>
            <p className="text-[11px] text-teal-600 font-medium">{form.schoolName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIS (Nomor Induk Siswa)
              </label>
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelas
              </label>
              <input
                type="text"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nomor WhatsApp Siswa (format 628...)
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all"
          >
            {loading ? "Menyimpan Perubahan..." : "Simpan Pembaruan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
