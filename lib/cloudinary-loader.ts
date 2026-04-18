export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  
  // If the src is already a full Cloudinary URL, we can inject the parameters
  if (src.includes('cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`;
    }
  }
  
  // If not Cloudinary or malformed, return original
  return src;
}
