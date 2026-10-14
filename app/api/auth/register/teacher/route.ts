import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/utils/mailer";
import { z } from "zod";

const prisma = new PrismaClient();

const teacherSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  fullname: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  employeeId: z.string().min(3, "NIP minimal 3 karakter"),
  phoneNumber: z.string().min(8, "Nomor telepon minimal 8 digit"),
  schoolId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalisasi nomor telepon
    if (body.phoneNumber) {
      let clean = String(body.phoneNumber).replace(/[^0-9]/g, "");
      if (clean.startsWith("0")) {
        clean = "62" + clean.slice(1);
      }
      body.phoneNumber = clean;
    }

    const validatedData = teacherSchema.safeParse(body);

    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      const firstError =
        Object.values(errors)
          .flat()
          .find((err) => err) || "Data yang dimasukkan tidak valid";

      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { email, fullname, password, employeeId, phoneNumber, schoolId } =
      validatedData.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk." },
        { status: 400 }
      );
    }

    // Periksa NIP
    const existingEmployee = await prisma.teacher.findUnique({
      where: { employeeId },
    });
    if (existingEmployee) {
      return NextResponse.json(
        { message: "NIP ini sudah terdaftar di sistem." },
        { status: 400 }
      );
    }

    // Pastikan sekolah valid jika dipilih
    let targetSchoolId = schoolId;
    if (targetSchoolId) {
      const schoolExists = await prisma.school.findUnique({
        where: { id: targetSchoolId },
      });
      if (!schoolExists) {
        const firstSchool = await prisma.school.findFirst();
        targetSchoolId = firstSchool ? firstSchool.id : undefined;
      }
    } else {
      const firstSchool = await prisma.school.findFirst();
      targetSchoolId = firstSchool ? firstSchool.id : undefined;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.random().toString(36).substring(2, 8);

    const hasEmailConfig =
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD &&
      process.env.EMAIL_SERVER_PASSWORD !== "your-app-password" &&
      !process.env.EMAIL_SERVER_PASSWORD.includes("your-");

    const autoVerify = !hasEmailConfig;

    const newTeacher = await prisma.user.create({
      data: {
        email,
        fullname,
        password: hashedPassword,
        role: Role.TEACHER,
        verificationCode: autoVerify ? null : verificationCode,
        verified: autoVerify,
        teacher: {
          create: {
            employeeId,
            phoneNumber,
            schoolId: targetSchoolId,
          },
        },
      },
      include: { teacher: true },
    });

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
          ? "Pendaftaran Guru BK berhasil! Akun Anda telah aktif dan dapat langsung digunakan untuk masuk."
          : "Pendaftaran Guru BK berhasil! Silakan periksa email Anda untuk verifikasi.",
        autoVerified: autoVerify,
        user: {
          id: newTeacher.id,
          email: newTeacher.email,
          fullname: newTeacher.fullname,
          role: newTeacher.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Teacher Registration Error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat pendaftaran Guru BK.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
