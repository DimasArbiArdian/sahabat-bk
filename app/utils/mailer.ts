import nodemailer from "nodemailer";

const hasMailCredentials =
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD &&
  process.env.EMAIL_SERVER_PASSWORD !== "your-app-password" &&
  !process.env.EMAIL_SERVER_PASSWORD.includes("your-");

const transporter = hasMailCredentials
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  : null;

export const sendVerificationEmail = async (email: string, code: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const link = `${baseUrl}/auth/verify?code=${code}`;

  if (!transporter) {
    console.log(`[AUTH] Verification code for ${email}: ${code} (Verification link: ${link})`);
    return;
  }

  try {
    await transporter.sendMail({
      to: email,
      subject: "Verifikasi Akun Sahabat BK",
      text: `Halo,\n\nTerima kasih telah mendaftar di Sahabat BK.\nSilakan klik tautan berikut untuk memverifikasi akun Anda:\n${link}\n\nKode Verifikasi: ${code}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #0d9488;">Verifikasi Akun Sahabat BK</h2>
          <p>Terima kasih telah mendaftar di <strong>Sahabat BK</strong>. Silakan klik tombol di bawah ini untuk mengaktifkan akun Anda:</p>
          <p style="margin: 25px 0;">
            <a href="${link}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verifikasi Akun Saya</a>
          </p>
          <p style="font-size: 13px; color: #777;">Atau gunakan kode verifikasi: <strong>${code}</strong></p>
        </div>
      `,
    });
  } catch (err) {
    console.warn("Failed to send verification email (non-fatal):", err);
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const link = `${baseUrl}/auth/reset-password?token=${token}`;

  if (!transporter) {
    console.log(`[AUTH] Password reset token for ${email}: ${token} (Reset link: ${link})`);
    return;
  }

  try {
    await transporter.sendMail({
      to: email,
      subject: "Atur Ulang Kata Sandi Sahabat BK",
      text: `Klik tautan berikut untuk mengatur ulang kata sandi Anda: ${link}`,
    });
  } catch (err) {
    console.warn("Failed to send reset password email (non-fatal):", err);
  }
};
