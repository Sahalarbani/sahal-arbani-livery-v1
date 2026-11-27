import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  // SEC3: daftar media Cloudinary hanya untuk admin. Sebelumnya endpoint ini
  // tanpa auth dan mengembalikan semua aset upload (termasuk draft) ke publik.
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // ✅ UPDATE: Gw naikin max_results jadi 500 (Maksimal Cloudinary)
    const results = await cloudinary.api.resources({
      type: "upload",
      prefix: "arbskin_uploads", 
      max_results: 500, 
      direction: "desc",
    });

    return NextResponse.json(results.resources);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Gagal ambil gambar" }, { status: 500 });
  }
}

