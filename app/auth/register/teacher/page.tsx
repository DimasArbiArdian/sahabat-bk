"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HeartHandshake,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function RegisterTeacher() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [employeeId, setEmployeeId] = useState(""); // NIP
  const [schoolId, setSchoolId] = useState("");

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/auth/register/school");
        if (res.ok) {
          const data = await res.json();
          if (data.schools && data.schools.length > 0) {
            setSchools(data.schools);
            setSchoolId(data.schools[0].id);
          }
        }
      } catch (err) {
        console.warn("Fetch schools failed:", err);
      }
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          email,
          password,
          phoneNumber,
          employeeId,
          schoolId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Pendaftaran gagal. Silakan periksa kembali data Anda.");
      }

      setSuccess(
        data.message ||
          "Pendaftaran berhasil! Akun Anda siap digunakan. Mengalihkan ke halaman masuk..."
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      <div className="lg:w-5/12 gradient-brand p-8 sm:p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">Sahabat BK</span>
              <span className="block text-[11px] text-teal-100 font-medium">
                SMA Negeri 1 Prestasi Bangsa
              </span>
            </div>
          </Link>

          <div className="max-w-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Daftar Akun Guru BK</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Portal Pendaftaran Konselor
            </h1>
            <p className="text-teal-50 text-xs sm:text-sm leading-relaxed">
              Daftarkan akun pendidik dan konselor Anda untuk mengelola jadwal bimbingan siswa, mempublikasikan modul, dan menangani pengaduan.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/20 flex items-center gap-3 text-xs text-teal-100">
          <ShieldCheck className="w-5 h-5 text-teal-200 flex-shrink-0" />
          <span>Kerahasiaan data bimbingan dilindungi kode etik konseling ABKIN.</span>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-10 w-full max-w-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pendaftaran Akun Guru BK
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Lengkapi informasi kepegawaian dan kontak konseling Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl gap-1">
            <Link
              href="/auth/register/student"
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Daftar sebagai Siswa</span>
            </Link>
            <div className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-teal-800 shadow-sm flex items-center justify-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Guru BK</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap & Gelar
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Contoh: Dra. Siti Rahmawati, M.Pd., Kons."
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                placeholder="Contoh: 198506122010012003"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Konseling
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institusi Sekolah
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
                  >
                    {schools.length > 0 ? (
                      schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))
                    ) : (
                      <option value="default-school">
                        SMA Negeri 1 Prestasi Bangsa
                      </option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="gurubk@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Mendaftar..." : "Daftar Akun Guru BK"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
            <p>
              Sudah memiliki akun?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-teal-600 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
            <p>
              <Link href="/" className="hover:text-teal-600">
                ← Kembali ke Beranda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}