import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  // 1. Ensure default school exists
  let school = await prisma.school.findFirst({
    where: { name: "SMA Negeri 1 Prestasi Bangsa" },
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        name: "SMA Negeri 1 Prestasi Bangsa",
        address: "Jl. Pendidikan No. 45, Jakarta",
      },
    });
    console.log("✅ Default school created successfully!");
  }

  // 2. Ensure admin exists
  const adminExists = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (adminExists) {
    await prisma.user.deleteMany({
      where: {
        role: "ADMIN",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      fullname: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
      verified: true,
    },
  });

  console.log("✅ Admin created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
