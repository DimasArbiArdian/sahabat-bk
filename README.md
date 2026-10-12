<div align="center">

# 🌿 Sahabat BK
### Platform Bimbingan & Konseling Sekolah Terintegrasi Modern

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

<p align="center">
  <b>Ruang aman dan terpercaya untuk curhat, konsultasi karir, regulasi emosi, dan asesmen minat bakat siswa bersama Guru BK secara tatap muka maupun daring.</b>
</p>

[Fitur Unggulan](#-fitur-unggulan) • [Teknologi](#-tech-stack) • [Cara Instalasi](#-cara-memulai-lokal) • [Akun Demo](#-akun-demo-bawaan) • [Panduan Deploy](#-panduan-deploy-online)

---

</div>

## 📖 Tentang Sahabat BK

**Sahabat BK** adalah aplikasi web bimbingan konseling digital sekolah yang dirancang khusus untuk memfasilitasi komunikasi antara siswa, Guru Bimbingan dan Konseling (Konselor), serta Admin Sekolah. Dengan antarmuka modern, responsif, dan estetik, platform ini memastikan azas kerahasiaan konseling terlindungi sepenuhnya seraya memberikan pengalaman bimbingan yang ramah remaja.

---

## ✨ Fitur Unggulan

### 🧑‍🎓 Portal Siswa
- **🏠 Dashboard Siswa Interaktif**: Ringkasan jadwal bimbingan aktif, quote motivasi harian, dan akses cepat layanan.
- **😊 Daily Mood Tracker**: Check-in perasaan harian (5 pilihan emosi) untuk membantu memantau kesehatan mental dan kesejahteraan emosional siswa.
- **🛡️ Kotak Suara Rahasia (Anti-Bullying Whistleblower Box)**: Form pengaduan perundungan, kekerasan, atau beban belajar secara **100% Anonim** atau beridentitas dengan tingkat urgensi (Normal, Mendesak, Darurat).
- **🧭 Tes Minat Bakat (Holland RIASEC)**: Kuis asesmen mandiri untuk menganalisis tipe kepribadian karir, rekomendasi jurusan kuliah, dan opsi diskusi langsung dengan Guru BK.
- **📅 Pengajuan Jadwal Konseling Fleksibel**: Pilih metode bimbingan (**Tatap Muka di Ruang BK**, **Online WhatsApp**, atau **Google Meet**) beserta waktu yang diinginkan.
- **📚 Perpustakaan Modul Bimbingan**: Baca materi pengembangan diri (Pribadi, Sosial, Belajar, Karir) dengan Markdown reader, perkiraan waktu baca, dan fitur simpan/bookmark.
- **💬 Direct WhatsApp Consultation**: Tombol satu-klik untuk langsung terhubung ke chat WhatsApp Guru BK setelah jadwal disetujui.

### 👩‍🏫 Portal Guru BK (Konselor)
- **📊 Dashboard Metrik & Analitik**: Pantau jumlah permintaan konseling pending, sesi terjadwal, dan laporan kotak suara masuk.
- **⏳ Manajemen Persetujuan Konseling**: Setujui jadwal atau tolak/reschedule dengan catatan alasan yang ramah dan edukatif.
- **📝 Catatan Kasus & Hasil Konseling**: Form evaluasi pasca-konseling untuk mencatat tindak lanjut dan rekomendasi perkembangan siswa.
- **📥 Pusat Kotak Suara Siswa**: Tinjau laporan perundungan dari siswa, ubah status penanganan (*BARU*, *DIPROSES*, *SELESAI*), dan tuliskan tanggapan konselor.
- **✍️ Publikasi Modul Bimbingan**: Editor artikel bimbingan berbasis Markdown lengkap dengan penambahan tautan referensi eksternal.
- **📑 Export Rekapitulasi CSV**: Unduh laporan seluruh riwayat sesi konseling siswa dalam 1 klik untuk administrasi sekolah.

### 🛡️ Portal Administrator & Mode Demo
- **🏢 Manajemen Sekolah**: Tambah dan kelola institusi sekolah terdaftar.
- **⚡ Quick Role Switcher (1-Klik Demo)**: Penguji dapat langsung berganti peran (*Siswa*, *Guru BK*, *Admin*) tanpa hambatan konfigurasi database awal.

---

## 🛠️ Tech Stack

- **Frontend & App Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
- **Styling & UI Components**: [Tailwind CSS 3.4](https://tailwindcss.com/) dengan custom Emerald/Teal brand design system, Glassmorphism, dan [Lucide React](https://lucide.dev/) Icons
- **Tipografi**: Google Font [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Database & ORM**: [Prisma ORM 6](https://www.prisma.io/) & [PostgreSQL](https://www.postgresql.org/)
- **Autentikasi & Keamanan**: JWT via `jose`, `bcryptjs`, dan middleware header propagation
- **Konten & Markdown**: `@uiw/react-md-editor` & `react-markdown`

---

## 🚀 Cara Memulai (Lokal)

### 1. Clone Repository
```bash
git clone https://github.com/DimasArbiArdian/sahabat-bk.git
cd sahabat-bk
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di root folder proyek:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sahabat_bk?schema=public"
NEXTAUTH_SECRET="sahabat-bk-super-secret-jwt-key-2025"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Sinkronisasi Database (Opsional jika menggunakan PostgreSQL lokal)
```bash
npx prisma db push
npm run seed
```
*(Catatan: Aplikasi memiliki mode offline/mock fallback otomatis di `lib/storage.ts` sehingga dapat langsung dijalankan dan diuji bahkan tanpa PostgreSQL lokal).*

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka browser di **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Akun Demo Bawaan

Untuk pengujian cepat, Anda dapat menggunakan tombol **1-Klik Login Demo** di halaman login atau menggunakan kredensial berikut:

| Peran | Email | Kata Sandi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Siswa** | `siswa@sahabatbk.sch.id` | `siswa123` | Budi Pratama (Kelas 11 MIPA 2) |
| **Guru BK** | `gurubk@sahabatbk.sch.id` | `guru123` | Dra. Siti Rahmawati, M.Pd., Kons. |
| **Admin** | `admin@sahabatbk.sch.id` | `admin123` | Administrator Sistem Sekolah |

---

## 🌐 Panduan Deploy Online

### 1. Database PostgreSQL Cloud Gratis
Daftar di **[Neon.tech](https://neon.tech/)** atau **[Supabase](https://supabase.com/)**, buat project baru, dan dapatkan connection string:
```text
postgresql://user:password@ep-xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Push Schema ke Database Cloud
```bash
# Pastikan DATABASE_URL di .env mengarah ke Neon/Supabase
npx prisma db push
npm run seed
```

### 3. Deploy ke Vercel (1 Menit)
1. Buka **[Vercel](https://vercel.com/)** dan login dengan akun GitHub Anda.
2. Klik **Add New Project** → pilih repositori **`DimasArbiArdian/sahabat-bk`**.
3. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL`: *(Connection string dari Neon / Supabase)*
   - `NEXTAUTH_SECRET`: *(String rahasia JWT bebas)*
4. Klik **Deploy**. Selesai! Web Anda langsung aktif dengan domain HTTPS gratis.

---

## 📁 Struktur Direktori

```text
sahabat-bk/
├── app/
│   ├── admin/                # Portal dashboard & login Admin
│   ├── api/                  # API routes (auth, module, schedule, user)
│   ├── auth/                 # Halaman login, register, forgot-password
│   ├── pages/
│   │   └── student/          # Dashboard, asesmen, kotak suara, modul, jadwal
│   ├── teacher/              # Dashboard Guru BK, kelola modul & jadwal konseling
│   ├── globals.css           # Desain sistem & Plus Jakarta Sans
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page beranda modern
├── components/
│   ├── ui/                   # Button, Card, input primitives
│   ├── layout-wrapper.tsx    # Sidebar responsif & role switcher
│   └── auth-wrapper.tsx      # Manajemen proteksi rute
├── lib/
│   ├── mock-data.ts          # Dataset realistis sekolah & akun demo
│   ├── storage.ts            # Local storage sync & state resilience
│   └── utils.ts              # Helper classnames & Tailwind merge
├── prisma/
│   └── schema.prisma         # Schema database PostgreSQL
└── public/                   # Asset logo & ilustrasi
```

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">
  Dibuat dengan ❤️ untuk kemajuan Bimbingan & Konseling Sekolah Indonesia oleh <b><a href="https://github.com/DimasArbiArdian">Dimas Arbi Ardian</a></b>
</div>
