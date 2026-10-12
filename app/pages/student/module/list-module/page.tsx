"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredModules, saveStoredModules } from "@/lib/storage";
import { ModuleItem } from "@/lib/mock-data";
import {
  BookOpen,
  Search,
  Filter,
  PlusCircle,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  User,
  Tag,
} from "lucide-react";

export default function ModuleList() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "TEACHER") {
      setIsTeacher(true);
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Fetch from backend API, fallback to local storage
    if (token) {
      fetch("/api/module", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Map Prisma module to ModuleItem
            const mapped: ModuleItem[] = data.map((d: any) => ({
              id: d.id,
              title: d.title,
              category: d.category || "Belajar",
              description: d.description || "",
              content: d.content || "",
              author: d.teacher?.user?.fullname || "Guru BK",
              readTime: "4 menit baca",
              tags: ["Bimbingan", "Siswa"],
              createdAt: d.createdAt,
              references: d.references || [],
            }));
            setModules(mapped);
          } else {
            setModules(getStoredModules());
          }
        })
        .catch(() => {
          setModules(getStoredModules());
        });
    } else {
      setModules(getStoredModules());
    }
  }, []);

  const handleDeleteClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedModuleId) return;

    // Update local storage
    const updated = modules.filter((m) => m.id !== selectedModuleId);
    saveStoredModules(updated);
    setModules(updated);
    setIsDeleteModalOpen(false);
    setSelectedModuleId(null);

    // Try deleting on API as well
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`/api/module/${selectedModuleId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignored in demo mode
      }
    }
  };

  // Filter modules
  const filteredModules = modules.filter((mod) => {
    const matchesCategory =
      selectedCategory === "Semua" || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["Semua", "Pribadi", "Sosial", "Belajar", "Karir"];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Perpustakaan Bimbingan & Konseling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Modul & Panduan Siswa
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kumpulan artikel dan panduan praktis dari Guru BK untuk membantu pengembangan diri, manajemen belajar, dan karir.
          </p>
        </div>

        {isTeacher && (
          <Link
            href="/teacher/module"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-teal-700/20 transition-all active:scale-95 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Modul Baru</span>
          </Link>
        )}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari judul atau topik modul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Category & Read Time */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.category === "Pribadi"
                      ? "bg-teal-50 text-teal-700 border border-teal-200/60"
                      : item.category === "Sosial"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : item.category === "Karir"
                      ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                      : "bg-sky-50 text-sky-700 border border-sky-200/60"
                  }`}
                >
                  {item.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{item.readTime || "4 mnt"}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[140px]">
                <User className="w-3 h-3 text-slate-400" />
                <span className="truncate">{item.author || "Guru BK"}</span>
              </div>

              <div className="flex items-center gap-2">
                {isTeacher && (
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Modul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <Link
                  href={`/pages/student/module/detail-module/${item.id}`}
                  className="inline-flex items-center gap-1 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold px-3 py-1.5 rounded-xl transition-all"
                >
                  <span>Buka Modul</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">
            Tidak Ada Modul yang Ditemukan
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base">
              Konfirmasi Hapus Modul
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus materi modul bimbingan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
