"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getStoredModules } from "@/lib/storage";
import { ModuleItem } from "@/lib/mock-data";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Share2,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ModuleDetail() {
  const params = useParams();
  const moduleId = params?.moduleId as string | undefined;

  const [module, setModule] = useState<ModuleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!moduleId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Check stored modules first
    const localMods = getStoredModules();
    const foundLocal = localMods.find((m) => m.id === moduleId);

    if (foundLocal) {
      setModule(foundLocal);
      setLoading(false);
    } else if (token) {
      // Try backend fetch
      fetch(`/api/module/${moduleId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setModule({
              id: data.id,
              title: data.title,
              category: data.category || "Belajar",
              description: data.description,
              content: data.content,
              author: data.teacher?.user?.fullname || "Dra. Siti Rahmawati, M.Pd., Kons.",
              readTime: "5 menit baca",
              tags: ["Bimbingan Konseling"],
              createdAt: data.createdAt,
              references: data.references || [],
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Memuat materi modul...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Modul Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">
          Materi bimbingan yang Anda cari mungkin telah diperbarui atau dipindahkan.
        </p>
        <Link
          href="/pages/student/module/list-module"
          className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          ← Kembali ke Daftar Modul
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Modul</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? "bg-amber-50 border-amber-300 text-amber-600"
                : "bg-white border-slate-200/80 text-slate-500 hover:text-slate-800"
            }`}
            title="Simpan Modul"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
            title="Bagikan Tautan"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copiedToast && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Tautan modul berhasil disalin ke papan klip!</span>
        </div>
      )}

      {/* Article Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100/70 text-teal-800">
            {module.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {module.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {module.title}
        </h1>

        {module.description && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed border-l-4 border-teal-500 pl-4 py-1 italic bg-teal-50/40 rounded-r-xl">
            {module.description}
          </p>
        )}

        {/* Author info pill */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-xs">
              {module.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{module.author}</div>
              <div className="text-[11px] text-slate-400">Guru BK Konselor Sekolah</div>
            </div>
          </div>
          <div>
            {new Date(module.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Article Markdown Body */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="prose max-w-none text-slate-700 leading-relaxed">
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>

        {/* References Section */}
        {module.references && module.references.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Referensi & Bacaan Lanjutan:
            </h4>
            <div className="space-y-2">
              {module.references.map((ref) => (
                <a
                  key={ref.id}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-teal-600 hover:text-teal-800 hover:underline bg-slate-50 p-2.5 rounded-xl border border-slate-200/60"
                >
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{ref.title || ref.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Consult with Counselor CTA Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-teal-900/10">
        <div>
          <h3 className="font-bold text-lg">Ada Pertanyaan Mengenai Modul Ini?</h3>
          <p className="text-teal-100 text-xs sm:text-sm mt-1">
            Jadwalkan sesi bimbingan tatap muka atau daring bersama Guru BK untuk berdiskusi lebih mendalam.
          </p>
        </div>
        <Link
          href="/pages/student/schedule/create"
          className="bg-white hover:bg-teal-50 text-teal-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex-shrink-0 active:scale-95"
        >
          Jadwalkan Diskusi
        </Link>
      </div>
    </div>
  );
}
