"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Compass,
  GraduationCap,
  Briefcase,
  Calendar,
  RotateCcw,
} from "lucide-react";

interface Question {
  id: number;
  text: string;
  categoryDesc: string;
  options: {
    text: string;
    archetype: "R" | "I" | "A" | "S" | "E" | "C"; // Holland Code
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Kegiatan apa yang paling membuatmu lupa waktu dan bersemangat?",
    categoryDesc: "Minat Aktivitas",
    options: [
      { text: "Membongkar dan merakit alat elektronik / mekanik / crafting fisik", archetype: "R" },
      { text: "Menganalisis data, memecahkan teka-teki logika, atau eksperimen sains", archetype: "I" },
      { text: "Menggambar, menulis cerita, mendesain, atau bermusik secara bebas", archetype: "A" },
      { text: "Mendengarkan curhat teman, mengajar, atau menjadi relawan sosial", archetype: "S" },
      { text: "Memimpin organisasi, bernegosiasi, atau merancang strategi jualan", archetype: "E" },
      { text: "Merapikan berkas, membuat jadwal presisi, dan pembukuan teratur", archetype: "C" },
    ],
  },
  {
    id: 2,
    text: "Saat diberikan tugas proyek bebas di sekolah, topik apa yang kamu pilih?",
    categoryDesc: "Eksplorasi Proyek",
    options: [
      { text: "Membuat robotik atau alat fungsional yang bisa langsung digunakan", archetype: "R" },
      { text: "Melakukan penelitian ilmiah tentang fenomena alam / biologi / teknologi", archetype: "I" },
      { text: "Membuat video pendek, komik, atau pameran karya visual kreatif", archetype: "A" },
      { text: "Membuat kampanye kesehatan mental atau bantuan teman sebaya", archetype: "S" },
      { text: "Membuat pitch deck bisnis rintisan atau festival kewirausahaan", archetype: "E" },
      { text: "Menyusun sistem arsip data sekolah atau rekapitulasi anggaran", archetype: "C" },
    ],
  },
  {
    id: 3,
    text: "Lingkungan kerja seperti apa yang paling kamu impikan di masa depan?",
    categoryDesc: "Preferensi Lingkungan",
    options: [
      { text: "Di lapangan terbuka, bengkel kerja teknik, atau laboratorium manufaktur", archetype: "R" },
      { text: "Di laboratorium riset yang tenang dengan peralatan canggih", archetype: "I" },
      { text: "Di studio kreatif yang estetik, fleksibel, dan penuh inspirasi", archetype: "A" },
      { text: "Di sekolah, rumah sakit, yayasan sosial, atau ruang konseling hangat", archetype: "S" },
      { text: "Di gedung perkantoran modern, panggung presentasi, atau ruang negosiasi", archetype: "E" },
      { text: "Di kantor korporat yang rapi dengan sistem kerja terstruktur jelas", archetype: "C" },
    ],
  },
  {
    id: 4,
    text: "Bagaimana caramu mengambil keputusan penting dalam hidup?",
    categoryDesc: "Gaya Pengambilan Keputusan",
    options: [
      { text: "Melihat hasil nyata praktis yang paling cepat terbukti berhasil", archetype: "R" },
      { text: "Mengumpulkan bukti, membaca riset, dan menganalisis fakta mendalam", archetype: "I" },
      { text: "Mengikuti intuisi hati, nilai estetika, dan keaslian perasaan", archetype: "A" },
      { text: "Mempertimbangkan dampaknya bagi kebahagiaan orang-orang di sekitar", archetype: "S" },
      { text: "Melihat potensi keuntungan strategis dan peluang kepemimpinan ke depan", archetype: "E" },
      { text: "Mematuhi standar regulasi resmi dan prosedur baku yang teruji aman", archetype: "C" },
    ],
  },
  {
    id: 5,
    text: "Jika kamu berkesempatan magang 1 bulan penuh, perusahaan mana yang kamu pilih?",
    categoryDesc: "Eksplorasi Industri",
    options: [
      { text: "Perusahaan Otomotif / Pabrik Energi Terbarukan", archetype: "R" },
      { text: "Lembaga Riset Sains / Pusat Kecerdasan Buatan (AI Research)", archetype: "I" },
      { text: "Agensi Desain & Animasi / Rumah Produksi Media Kreatif", archetype: "A" },
      { text: "Lembaga Pendidikan & Konseling / Organisasi Kemanusiaan UNICEF", archetype: "S" },
      { text: "Startup Venture Capital / Agensi Pemasaran & Manajemen", archetype: "E" },
      { text: "Kantor Akuntan Publik / Bank Sentral & Manajemen Keuangan", archetype: "C" },
    ],
  },
];

const ARCHETYPE_INFO: Record<
  string,
  {
    name: string;
    title: string;
    traits: string[];
    majors: string[];
    careers: string[];
  }
> = {
  R: {
    name: "Realistic (Praktikal & Teknis)",
    title: "Sang Praktisi Handal",
    traits: ["Suka praktik nyata", "Keterampilan fisik / teknis tinggi", "Logis dan tangguh"],
    majors: ["Teknik Mesin", "Teknik Elektro", "Arsitektur", "Teknik Sipil", "Ilmu Pertanian"],
    careers: ["Insinyur Robotik", "Teknisi Sistem", "Arsitek Lanskap", "Pilot"],
  },
  I: {
    name: "Investigative (Analitis & Peneliti)",
    title: "Sang Pemikir & Peneliti",
    traits: ["Kritis dan ingin tahu", "Kuat dalam logika data", "Pemecah teka-teki ulung"],
    majors: ["Teknik Informatika & AI", "Kedokteran", "Statistika & Sains Data", "Biologi / Kimia Murni"],
    careers: ["Data Scientist", "Dokter Spesialis", "Peneliti AI", "Bioinformatisi"],
  },
  A: {
    name: "Artistic (Kreatif & Ekspresif)",
    title: "Sang Kreator & Visioner",
    traits: ["Imajinatif tinggi", "Bebas dari kekakuan", "Peka estetika dan ekspresi"],
    majors: ["Desain Komunikasi Visual (DKV)", "Sastra & Penulisan Kreatif", "Seni Rupa / Musik", "Ilmu Komunikasi"],
    careers: ["UI/UX Designer", "Creative Director", "Content Creator", "Animator"],
  },
  S: {
    name: "Social (Penolong & Edukatif)",
    title: "Sang Pengabdi & Pembimbing",
    traits: ["Empati tinggi", "Komunikator hangat", "Suka membantu sesama tumbuh"],
    majors: ["Bimbingan Konseling (BK)", "Psikologi", "Pendidikan Guru", "Hubungan Internasional", "Keperawatan"],
    careers: ["Konselor Sekolah", "Psikolog Klinis", "Guru Inspiratif", "Pekerja Sosial"],
  },
  E: {
    name: "Enterprising (Pemimpin & Persuasif)",
    title: "Sang Pemimpin & Penggerak",
    traits: ["Percaya diri tinggi", "Piawai bernegosiasi", "Berani mengambil risiko terukur"],
    majors: ["Manajemen Bisnis", "Ilmu Hukum", "Hubungan Masyarakat", "Ekonomi Pembangunan"],
    careers: ["Entrepreneur", "Business Development", "Pengacara", "Manajer Pemasaran"],
  },
  C: {
    name: "Conventional (Terstruktur & Detail)",
    title: "Sang Pengelola Presisi",
    traits: ["Sangat teliti", "Menyukai sistem rapi", "Ahli pengelolaan data angka"],
    majors: ["Akuntansi", "Aktuaria", "Administrasi Bisnis", "Sistem Informasi"],
    careers: ["Akuntan Publik", "Aktuaris Finansial", "Analis Keuangan", "Database Administrator"],
  },
};

export default function AssessmentPage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "R" | "I" | "A" | "S" | "E" | "C">>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (archetype: "R" | "I" | "A" | "S" | "E" | "C") => {
    const nextAnswers = { ...answers, [currentQ.id]: archetype };
    setAnswers(nextAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateResult = () => {
    const counts: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.values(answers).forEach((val) => {
      counts[val] = (counts[val] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topKey = sorted[0][0];
    const secondKey = sorted[1][0];

    return {
      primary: ARCHETYPE_INFO[topKey],
      secondary: ARCHETYPE_INFO[secondKey],
      code: `${topKey}-${secondKey}`,
    };
  };

  const result = isFinished ? calculateResult() : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-colors border border-slate-200/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Asesmen Holland RIASEC Minat Bakat Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tes Minat Bakat & Eksplorasi Karir
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kenali tipe kepribadian kerja dominanmu untuk memilih jurusan kuliah dan karir impian.
          </p>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Pertanyaan {currentIdx + 1} dari {QUESTIONS.length}</span>
              <span>{Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}% Selesai</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              {currentQ.categoryDesc}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
              {currentQ.text}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, index) => {
              const isChosen = answers[currentQ.id] === opt.archetype;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(opt.archetype)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                    isChosen
                      ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 text-teal-900"
                      : "bg-slate-50 border-slate-200/80 hover:bg-white hover:border-teal-300 hover:shadow-md text-slate-700"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium leading-relaxed pr-4">
                    {opt.text}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChosen
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-300 group-hover:border-teal-400"
                    }`}
                  >
                    {isChosen && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40"
            >
              ← Kembali
            </button>
            <span className="text-xs text-slate-400">
              Pilih salah satu jawaban yang paling mencerminkan dirimu
            </span>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in">
          {/* Result Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl gradient-brand text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-700/20">
              <Compass className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
              <span>Profil Kepribadian Karir: {result?.code}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {result?.primary.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kamu memiliki kombinasi potensi dominan pada tipe{" "}
              <strong>{result?.primary.name}</strong> dan didukung oleh karakter{" "}
              <strong>{result?.secondary.name}</strong>.
            </p>
          </div>

          {/* Two Column Archetypes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Primary Archetype */}
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                Karakter Utama (Dominan)
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {result?.primary.name}
              </h3>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Kekuatan Alami:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result?.primary.traits.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  <span>Rekomendasi Jurusan Kuliah:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result?.primary.majors.map((m, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold bg-white border border-teal-200 text-teal-900 px-2.5 py-1 rounded-lg"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Secondary Archetype */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">
                Karakter Pendukung
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {result?.secondary.name}
              </h3>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Kekuatan Pendukung:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result?.secondary.traits.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                  <span>Peluang Profesi Masa Depan:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result?.primary.careers.concat(result?.secondary.careers.slice(0, 2)).map((c, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                setAnswers({});
                setCurrentIdx(0);
                setIsFinished(false);
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Tes</span>
            </button>

            <Link
              href="/pages/student/schedule/create"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-xl shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Konsultasikan Hasil Ini dengan Guru BK</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
