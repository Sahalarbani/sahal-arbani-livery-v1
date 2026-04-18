import { prisma } from "@/lib/prisma";

export async function setAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(`Success: User ${email} is now an admin.`);
    return user;
  } catch (error) {
    console.error(`Error: Could not find user with email ${email}. Make sure they have logged in at least once.`);
    throw error;
  }
}

// Script ini dimaksudkan untuk dijalankan via shell jika diperlukan, 
// atau dipanggil lewat server action sementara.
if (require.main === module) {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email address.");
    process.exit(1);
  }
  setAdmin(email);
}
