export interface DemoUser {
  id: string;
  email: string;
  fullname: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  token: string;
  details?: {
    grade?: string;
    studentId?: string;
    phoneNumber?: string;
    employeeId?: string;
    schoolName?: string;
  };
}

export const DEMO_USERS: Record<string, DemoUser> = {
  student: {
    id: "usr-std-001",
    email: "siswa@sahabatbk.sch.id",
    fullname: "Budi Pratama",
    role: "STUDENT",
    token: "demo-jwt-student-token",
    details: {
      grade: "11 MIPA 2",
      studentId: "NIS-20241102",
      phoneNumber: "6281234567890",
      schoolName: "SMA Negeri 1 Prestasi Bangsa",
    },
  },
  teacher: {
    id: "usr-tch-001",
    email: "gurubk@sahabatbk.sch.id",
    fullname: "Dra. Siti Rahmawati, M.Pd., Kons.",
    role: "TEACHER",
    token: "demo-jwt-teacher-token",
    details: {
      employeeId: "NIP-198506122010012003",
      phoneNumber: "6281298765432",
      schoolName: "SMA Negeri 1 Prestasi Bangsa",
    },
  },
  admin: {
    id: "usr-adm-001",
    email: "admin@sahabatbk.sch.id",
    fullname: "Administrator Sekolah",
    role: "ADMIN",
    token: "demo-jwt-admin-token",
    details: {
      phoneNumber: "628111222333",
      schoolName: "SMA Negeri 1 Prestasi Bangsa",
    },
  },
};

export interface CounselingSchedule {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentPhone: string;
  counselorId?: string;
  counselorName?: string;
  counselorPhone?: string;
  title: string;
  description: string;
  date: string;
  category: "Pribadi" | "Sosial" | "Belajar" | "Karir";
  method: "Tatap Muka di Ruang BK" | "Online WhatsApp" | "Online Google Meet";
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  rejectedReason?: string;
  counselorNotes?: string;
  createdAt: string;
}

export const INITIAL_SCHEDULES: CounselingSchedule[] = [
  {
    id: "sch-001",
    studentId: "usr-std-001",
    studentName: "Budi Pratama",
    studentGrade: "11 MIPA 2",
    studentPhone: "6281234567890",
    counselorId: "usr-tch-001",
    counselorName: "Dra. Siti Rahmawati, M.Pd., Kons.",
    counselorPhone: "6281298765432",
    title: "Konsultasi Penjurusan & Minat Kuliah",
    description: "Bingung memilih antara Teknik Informatika atau Statistika Data Sains untuk SBMPTN/SNBT mendatang.",
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    category: "Karir",
    method: "Tatap Muka di Ruang BK",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "sch-002",
    studentId: "usr-std-002",
    studentName: "Anisa Rahma",
    studentGrade: "12 IPS 1",
    studentPhone: "6281299887766",
    counselorId: "usr-tch-001",
    counselorName: "Dra. Siti Rahmawati, M.Pd., Kons.",
    counselorPhone: "6281298765432",
    title: "Manajemen Waktu & Tekanan Menghadapi Ujian Akhir",
    description: "Sering merasa cemas dan sulit tidur saat mendekati ujian kelulusan sekolah.",
    date: new Date(Date.now() + 86400000 * 4).toISOString(),
    category: "Belajar",
    method: "Online WhatsApp",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sch-003",
    studentId: "usr-std-003",
    studentName: "Rizky Firmansyah",
    studentGrade: "10 Merdeka 3",
    studentPhone: "6281312345678",
    counselorId: "usr-tch-001",
    counselorName: "Dra. Siti Rahmawati, M.Pd., Kons.",
    counselorPhone: "6281298765432",
    title: "Adaptasi Lingkungan Baru di Sekolah",
    description: "Merasa canggung bersosialisasi dengan teman sekelas baru setelah masa MPLS.",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: "Sosial",
    method: "Tatap Muka di Ruang BK",
    status: "COMPLETED",
    counselorNotes: "Siswa telah diberikan teknik ice-breaking dan diajak bergabung ke ekskul Pramuka/Palang Merah Remaja.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export interface ModuleItem {
  id: string;
  title: string;
  category: "Pribadi" | "Sosial" | "Belajar" | "Karir";
  description: string;
  content: string;
  author: string;
  readTime: string;
  tags: string[];
  createdAt: string;
  references: { id: string; url: string; title?: string }[];
}

export const INITIAL_MODULES: ModuleItem[] = [
  {
    id: "mod-001",
    title: "Mengelola Burnout & Stres Belajar Menjelang Ujian",
    category: "Belajar",
    description: "Panduan praktis mengenali gejala kelelahan mental saat belajar dan strategi pemulihan energi berpikir secara efektif.",
    content: `## Mengapa Siswa Bisa Mengalami Burnout?
Burnout belajar bukan sekadar rasa malas biasa. Ini adalah kondisi kelelahan emosional, fisik, dan mental yang berkepanjangan akibat beban tugas atau ekspektasi yang terlalu tinggi.

### Tanda-Tanda Utama:
1. **Kehilangan Motivasi:** Merasa tidak bersemangat meski materi pelajaran sebelumnya kamu sukai.
2. **Penurunan Konsentrasi:** Membaca satu halaman buku berulang kali tanpa bisa memahaminya.
3. **Kelelahan Fisik:** Sering pusing, leher kaku, atau merasa selalu mengantuk di kelas.

### 4 Langkah Mengatasi Stres Belajar:
- **Terapkan Teknik Pomodoro:** Belajar fokus selama 25 menit, lalu istirahat 5 menit tanpa menatap layar handphone.
- **Batasi Multitasking:** Kerjakan tugas satu per satu berdasarkan skala prioritas (Eisenhower Matrix).
- **Olahraga Ringan:** Jalan santai 15 menit setiap pagi untuk memicu hormon endorfin dan dopamin alami.
- **Konsultasi ke Guru BK:** Jangan ragu mendiskusikan beban pikiranmu di ruang BK yang selalu terbuka dan menjaga kerahasiaan.`,
    author: "Dra. Siti Rahmawati, M.Pd., Kons.",
    readTime: "4 menit baca",
    tags: ["Manajemen Stres", "Tips Belajar", "Kesehatan Mental"],
    createdAt: "2025-02-15T08:00:00.000Z",
    references: [
      { id: "ref-1", url: "https://www.apa.org/topics/stress", title: "American Psychological Association - Managing Stress" },
      { id: "ref-2", url: "https://kemdikbud.go.id", title: "Panduan Belajar Efektif Kemendikbud" },
    ],
  },
  {
    id: "mod-002",
    title: "Mengenal Minat dan Bakat: Menentukan Jurusan Kuliah Impian",
    category: "Karir",
    description: "Temukan passion sejati dan pelajari matriks kecocokan kepribadian dengan prospek karir masa depan di era AI.",
    content: `## Jangan Sampai Salah Memilih Jurusan!
Banyak mahasiswa merasa tidak cocok dengan program studinya di tahun pertama karena memilih hanya berdasarkan tren atau ikut-ikutan teman sebaya.

### Tiga Pilar Keputusan Karir:
1. **Kemampuan Nyata (Ability):** Apa mata pelajaran atau keterampilan yang kamu kuasai dengan mudah?
2. **Ketertarikan Tinggi (Interest):** Topik apa yang membuatmu penasaran dan betah membacanya berjam-jam?
3. **Peluang Masa Depan (Opportunity):** Bagaimana kebutuhan industri 5–10 tahun mendatang untuk bidang tersebut?

### Teori Minat RIASEC Holland:
- **Realistic:** Praktis, suka alat, teknis (Teknik Mesin, Pertanian, Arsitektur).
- **Investigative:** Analitis, pemecah masalah (Sains, Kedokteran, Matematika).
- **Artistic:** Kreatif, ekspresif (Desain Komunikasi Visual, Sastra, Musik).
- **Social:** Membantu orang lain (Keguruan, Psikologi, Keperawatan).
- **Enterprising:** Negosiasi, kepemimpinan (Manajemen Bisnis, Hukum).
- **Conventional:** Terstruktur, data, akurasi (Akuntansi, Administrasi).`,
    author: "Dra. Siti Rahmawati, M.Pd., Kons.",
    readTime: "6 menit baca",
    tags: ["Penjurusan", "Kuliah", "Holland RIASEC"],
    createdAt: "2025-02-18T10:30:00.000Z",
    references: [
      { id: "ref-3", url: "https://www.onetonline.org/explore/interests", title: "O*NET Interest Profiler" },
    ],
  },
  {
    id: "mod-003",
    title: "Membangun Resiliensi dan Pertemanan Sehat (Anti-Bullying)",
    category: "Sosial",
    description: "Cara mengenali relasi pertemanan beracun (toxic friendships), membela diri secara asertif, dan menciptakan atmosfer sekolah ramah anak.",
    content: `## Menjaga Lingkungan Sekolah yang Hangat & Inklusif
Sekolah adalah rumah kedua bagi kita semua. Setiap siswa berhak merasa aman, dihargai, dan diterima tanpa rasa takut akan intimidasi atau perundungan.

### Bentuk Perundungan yang Sering Tidak Disadari:
- **Verbal:** Mengolok-olok fisik (body shaming), nama orang tua, atau latar belakang sosial.
- **Sosial:** Mengucilkan teman dari kelompok belajar atau menyebarkan rumor tidak berdasar.
- **Cyberbullying:** Menyerang di kolom komentar media sosial atau grup WhatsApp kelas.

### Jadilah Upstander, Bukan Sekadar Bystander:
Jika kamu melihat temanmu diperlakukan tidak adil, beranilah menunjukkan empati:
1. Dekati teman tersebut dan berikan dukungan moral.
2. Gunakan **Kotak Suara Rahasia Sahabat BK** untuk melaporkan kejadian secara anonim jika kamu merasa tidak nyaman melapor langsung.
3. Guru BK akan menindaklanjuti dengan pendekatan restorative justice yang mendidik tanpa membuka identitas pelapor.`,
    author: "Dra. Siti Rahmawati, M.Pd., Kons.",
    readTime: "5 menit baca",
    tags: ["Anti Bullying", "Pertemanan Sehat", "Komunikasi Asertif"],
    createdAt: "2025-02-20T14:15:00.000Z",
    references: [
      { id: "ref-4", url: "https://www.unicef.org/indonesia/id/perlindungan-anak/anti-perundungan", title: "UNICEF Indonesia - Panduan Anti-Perundungan" },
    ],
  },
  {
    id: "mod-004",
    title: "Mengenal Emosi Diri: Teknik Regulasi Emosi saat Cemas & Marah",
    category: "Pribadi",
    description: "Latihan praktis STOP (Stop, Take a breath, Observe, Proceed) dan journaling untuk menjaga kestabilan emosi remaja.",
    content: `## Emosi Bukan Musuh, Tapi Sinyal dari Tubuhmu
Merasa sedih, kecewa, takut, atau marah adalah hal yang sangat manusiawi. Masalah muncul ketika kita menekan emosi tersebut hingga meledak di saat yang tidak tepat.

### Teknik Pernapasan 4-7-8 untuk Meredakan Detak Jantung:
1. Tarik napas perlahan melalui hidung selama 4 hitungan.
2. Tahan napas dengan tenang selama 7 hitungan.
3. Hembuskan napas perlahan melalui mulut dengan bunyi mendesir selama 8 hitungan.
4. Ulangi siklus ini 4 kali hingga pikiranmu terasa lebih hening.

### Jadwalkan Waktu Menulis (Expressive Writing):
Tuliskan apa saja yang mengganjal di hatimu di buku catatan pribadi selama 10 menit tanpa memikirkan tata bahasa. Ini membantu otak bagian prefrontal cortex memproses beban emosional dengan lebih logis.`,
    author: "Dra. Siti Rahmawati, M.Pd., Kons.",
    readTime: "3 menit baca",
    tags: ["Self-Care", "Regulasi Emosi", "Mindfulness"],
    createdAt: "2025-02-22T09:00:00.000Z",
    references: [
      { id: "ref-5", url: "https://www.mindful.org", title: "Mindful Living Practices" },
    ],
  },
];

export interface AnonymousComplaint {
  id: string;
  category: "Bullying / Perundungan" | "Tekanan Belajar" | "Masalah Hubungan Teman" | "Fasilitas & Keamanan" | "Lainnya";
  urgency: "Normal" | "Mendesak" | "Darurat";
  isAnonymous: boolean;
  reporterName?: string;
  reporterGrade?: string;
  title: string;
  content: string;
  status: "BARU" | "DIPROSES" | "SELESAI";
  counselorReply?: string;
  createdAt: string;
}

export const INITIAL_COMPLAINTS: AnonymousComplaint[] = [
  {
    id: "cmp-001",
    category: "Bullying / Perundungan",
    urgency: "Mendesak",
    isAnonymous: true,
    title: "Tindakan pengucilan di kelas 10 terhadap siswa baru",
    content: "Ada sekelompok siswa yang kerap menolak kerja kelompok dengan salah satu siswa dan menyebarkan foto ejekan di grup chat tanpa seizinnya.",
    status: "DIPROSES",
    counselorReply: "Laporan telah diterima. Guru BK telah menjadwalkan mediasi wali kelas dan pembinaan karakter tanpa menyebutkan nama pelapor.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "cmp-002",
    category: "Tekanan Belajar",
    urgency: "Normal",
    isAnonymous: false,
    reporterName: "Budi Pratama",
    reporterGrade: "11 MIPA 2",
    title: "Jadwal ulangan harian yang bertumpuk dalam 1 hari",
    content: "Minggu ini ada 4 ulangan harian sekaligus di hari Kamis sehingga siswa kesulitan mempersiapkan diri secara optimal.",
    status: "SELESAI",
    counselorReply: "Sudah dikoordinasikan dengan kurikulum untuk meratakan jadwal asesmen.",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export interface MoodLog {
  date: string; // YYYY-MM-DD
  mood: "happy" | "calm" | "neutral" | "anxious" | "sad";
  moodLabel: string;
  note?: string;
}
