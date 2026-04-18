"use client";

import Image, { ImageProps } from "next/image";
import cloudinaryLoader from "@/lib/cloudinary-loader";

export default function ClientImage(props: ImageProps) {
  return <Image loader={cloudinaryLoader} {...props} />;
}
