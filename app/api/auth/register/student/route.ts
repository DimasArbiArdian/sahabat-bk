import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/utils/mailer";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema validasi input
const studentSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  fullname: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  studentId: z
    .string()
    .min(3, "NIS minimal 3 karakter"),
  grade: z.string().min(1, "Kelas wajib dipilih"),
  schoolId: z.string().min(1, "Sekolah wajib dipilih"),
  phoneNumber: z.string().min(8, "Nomor telepon minimal 8 digit"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalisasi nomor telepon jika dimulai dari 08...
    if (body.phoneNumber) {
      let clean = String(body.phoneNumber).replace(/[^0-9]/g, "");
      if (clean.startsWith("0")) {
        clean = "62" + clean.slice(1);
      }
      body.phoneNumber = clean;
    }

    const validatedData = studentSchema.safeParse(body);

    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      const firstError =
        Object.values(errors)
          .flat()
          .find((err) => err) || "Data yang dimasukkan tidak valid";

      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const {
      email,
      fullname,
      password,
      studentId,
      grade,
      schoolId,
      phoneNumber,
    } = validatedData.data;

    // Pastikan sekolah valid, jika ID tidak ada, gunakan sekolah pertama
    let targetSchoolId = schoolId;
    const schoolExists = await prisma.school.findUnique({
      where: { id: targetSchoolId },
    });

    if (!schoolExists) {
      let firstSchool = await prisma.school.findFirst();
      if (!firstSchool) {
        firstSchool = await prisma.school.create({
          data: {
            name: "SMA Negeri 1 Prestasi Bangsa",
            address: "Jl. Pendidikan No. 45, Jakarta",
          },
        });
      }
      targetSchoolId = firstSchool.id;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk." },
        { status: 400 }
      );
    }

    // Periksa apakah NIS sudah digunakan
    const existingStudentId = await prisma.student.findUnique({
      where: { studentId },
    });
    if (existingStudentId) {
      return NextResponse.json(
        { message: "NIS ini sudah terdaftar. Silakan gunakan NIS Anda yang sebenarnya." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.random().toString(36).substring(2, 8);

    // Cek apakah sistem email aktif
    const hasEmailConfig =
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD &&
      process.env.EMAIL_SERVER_PASSWORD !== "your-app-password" &&
      !process.env.EMAIL_SERVER_PASSWORD.includes("your-");

    // Jika SMTP email belum dikonfigurasi, langsung set verified: true agar siswa bisa langsung login
    const autoVerify = !hasEmailConfig;

    const newUser = await prisma.user.create({
      data: {
        email,
        fullname,
        password: hashedPassword,
        role: Role.STUDENT,
        verificationCode: autoVerify ? null : verificationCode,
        verified: autoVerify,
        student: {
          create: {
            studentId,
            grade: grade.startsWith("Kelas") ? grade : `Kelas ${grade}`,
            schoolId: targetSchoolId,
            phoneNumber,
          },
        },
      },
      include: { student: true },
    });

    // Kirim email verifikasi jika server email dikonfigurasi
    if (!autoVerify) {
      try {
        await sendVerificationEmail(email, verificationCode);
      } catch (e) {
        console.warn("Verification email sending failed:", e);
      }
    }

    return NextResponse.json(
      {
        message: autoVerify
          ? "Pendaftaran berhasil! Akun Anda telah aktif dan dapat langsung digunakan untuk masuk."
          : "Pendaftaran berhasil! Silakan periksa email Anda untuk memverifikasi akun.",
        autoVerified: autoVerify,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullname: newUser.fullname,
          role: newUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Student Registration Error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat pendaftaran. Pastikan data terisi dengan benar.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
