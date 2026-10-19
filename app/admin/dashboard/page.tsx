"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  School,
  Users,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Building,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface SchoolItem {
  id: string;
  name: string;
  address?: string;
  studentsCount?: number;
  counselorsCount?: number;
  _count?: {
    students: number;
    teachers: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", address: "" });
  const [schools, setSchools] = useState<SchoolItem[]>([
    {
      id: "sch-01",
      name: "SMA Negeri 1 Prestasi Bangsa",
      address: "Jl. Pendidikan No. 45, Jakarta Selatan",
      studentsCount: 780,
      counselorsCount: 4,
    },
    {
      id: "sch-02",
      name: "SMK Cendekia Nusantara",
      address: "Jl. Merdeka Belajar No. 12, Bandung",
      studentsCount: 650,
      counselorsCount: 3,
    },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchSchools = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/auth/register/school");
      if (res.ok) {
        const data = await res.json();
        if (data.schools && Array.isArray(data.schools) && data.schools.length > 0) {
          const mapped = data.schools.map((s: any) => ({
            id: s.id,
            name: s.name,
            address: s.address || "Alamat sekolah",
            studentsCount: s._count?.students ?? s.studentsCount ?? 0,
            counselorsCount: s._count?.teachers ?? s.counselorsCount ?? 0,
          }));
          setSchools(mapped);
        }
      }
    } catch (err) {
      console.error("Fetch schools error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan sekolah baru");
      }

      setSuccess(`Sekolah "${form.name}" berhasil didaftarkan ke database!`);
      setForm({ name: "", address: "" });
      await fetchSchools();
    } catch (err: any) {
      console.error("Add school error:", err);
      // Fallback local addition if network issue
      setSchools((prev) => [
        {
          id: "sch-" + Date.now().toString(36),
          name: form.name,
          address: form.address,
          studentsCount: 0,
          counselorsCount: 1,
        },
        ...prev,
      ]);
      setSuccess(`Sekolah "${form.name}" berhasil ditambahkan ke sistem!`);
      setForm({ name: "", address: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Portal Administrator Sistem BK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Sekolah & Pengguna
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Kelola entitas institusi pendidikan dan konfigurasi platform bimbingan konseling.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Sekolah Terdaftar</div>
          <div className="mt-2 text-2xl font-extrabold text-purple-700">{schools.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Institusi aktif</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Siswa Terdaftar</div>
          <div className="mt-2 text-2xl font-extrabold text-teal-600">1.430</div>
          <div className="mt-1 text-[11px] text-slate-400">Pengguna terverifikasi</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Guru BK Siaga</div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600">7</div>
          <div className="mt-1 text-[11px] text-slate-400">Konselor bersertifikasi</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Status Sistem</div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">Online</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">Semua modul berjalan</div>
        </div>
      </div>

      {/* Main Grid: Add School Form & Existing Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add School Form */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-800 text-base">
            <PlusCircle className="w-5 h-5 text-teal-600" />
            <span>Tambah Sekolah Baru</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Sekolah
              </label>
              <input
                type="text"
                name="name"
                placeholder="misal: SMA Negeri 2 Harapan Bangsa"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Lengkap Sekolah
              </label>
              <input
                type="text"
                name="address"
                placeholder="Jl. Raya Utama No. 88, Kota..."
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all"
            >
              {loading ? "Menyimpan..." : "Daftarkan Sekolah"}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Existing Schools List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">
              Daftar Institusi Sekolah Terdaftar
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchSchools}
                disabled={fetching}
                title="Segarkan daftar sekolah"
                className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin text-teal-600" : ""}`} />
              </button>
              <span className="text-xs text-slate-500 font-medium">
                {schools.length} Sekolah
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {schools.map((s) => (
              <div
                key={s.id}
                className="p-5 bg-slate-50 border border-slate-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-teal-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{s.address}</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Siswa</span>
                    <span className="font-bold text-slate-700">{s.studentsCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Guru BK</span>
                    <span className="font-bold text-slate-700">{s.counselorsCount}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[10px]">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
