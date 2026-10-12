"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getStoredModules, saveStoredModules } from "@/lib/storage";
import { ModuleItem } from "@/lib/mock-data";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  Send,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Dynamically import MDEditor to prevent SSR hydration issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Reference {
  id: string;
  url: string;
  title?: string;
}

export default function CreateModule() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Pribadi" | "Sosial" | "Belajar" | "Karir">("Belajar");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(
    "## Panduan Singkat\nTuliskan isi modul bimbingan di sini dengan format Markdown yang rapi.\n\n### Poin Penting:\n1. Poin pertama\n2. Poin kedua"
  );
  const [references, setReferences] = useState<Reference[]>([]);
  const [newRefUrl, setNewRefUrl] = useState("");
  const [newRefTitle, setNewRefTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddReference = () => {
    if (!newRefUrl.trim()) return;
    try {
      new URL(newRefUrl);
    } catch {
      setError("Tautan tidak valid. Pastikan diawali http:// atau https://");
      return;
    }

    setReferences([
      ...references,
      {
        id: "ref-" + Date.now().toString(36),
        url: newRefUrl.trim(),
        title: newRefTitle.trim() || newRefUrl.trim(),
      },
    ]);
    setNewRefUrl("");
    setNewRefTitle("");
    setError("");
  };

  const handleRemoveReference = (id: string) => {
    setReferences(references.filter((r) => r.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Judul dan isi modul bimbingan wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const teacherName = localStorage.getItem("name") || "Dra. Siti Rahmawati, M.Pd., Kons.";

    const newModule: ModuleItem = {
      id: "mod-" + Date.now().toString(36),
      title: title.trim(),
      category,
      description: description.trim(),
      content: content.trim(),
      author: teacherName,
      readTime: "5 menit baca",
      tags: [category, "Bimbingan"],
      createdAt: new Date().toISOString(),
      references,
    };

    // Save to local storage
    const current = getStoredModules();
    saveStoredModules([newModule, ...current]);

    // Try posting to API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/module", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            content,
            references: references.map((r) => r.url),
          }),
        });
      } catch {
        // Ignored in local demo mode
      }
    }

    setLoading(false);
    router.push("/pages/student/module/list-module");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Penyusunan Materi Guru BK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Publikasikan Modul Bimbingan Baru
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Buat artikel panduan bimbingan pribadi, sosial, belajar, atau karir untuk seluruh siswa.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Pilar BK
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
              >
                <option value="Belajar">Bimbingan Belajar</option>
                <option value="Karir">Bimbingan Karir & Kuliah</option>
                <option value="Pribadi">Bimbingan Pribadi</option>
                <option value="Sosial">Bimbingan Sosial & Relasi</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Judul Modul Bimbingan
              </label>
              <input
                type="text"
                placeholder="Contoh: Mengatasi Stres dan Kejenuhan Belajar Menjelang Ujian"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ringkasan Singkat / Abstrak
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan secara singkat manfaat dan inti materi yang akan dipelajari siswa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          {/* Markdown Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Konten / Isi Lengkap Modul (Mendukung Format Markdown)
            </label>
            <div className="rounded-2xl overflow-hidden border border-slate-200" data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={350}
                preview="edit"
              />
            </div>
          </div>

          {/* References Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Referensi & Tautan Pendukung (Opsional)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Judul / Nama Sumber (misal: UNICEF)"
                value={newRefTitle}
                onChange={(e) => setNewRefTitle(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={newRefUrl}
                  onChange={(e) => setNewRefUrl(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddReference}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            {/* References list */}
            {references.length > 0 && (
              <div className="space-y-2 pt-2">
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <LinkIcon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">{ref.title}</span>
                      <span className="text-slate-400 truncate">({ref.url})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveReference(ref.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Menyimpan Modul..." : "Publikasikan Modul Sekarang"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}