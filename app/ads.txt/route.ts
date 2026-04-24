/**
 * CHANGELOG
 * Version: 2.1.4
 * Date: 2026-04-24
 * Description: Implementasi Dynamic Route Handler untuk ads.txt.
 * Menarik data dari database via getAdSettings, melakukan sanitasi string,
 * dan menerapkan strategi caching tingkat lanjut untuk optimalisasi bot crawler.
 */

import { getAdSettings } from '@/lib/actions/ads';

// Memastikan route ini selalu mengambil data terbaru dari database (SSR)
export const dynamic = 'force-dynamic';

export async function GET() {
  const adSettings = await getAdSettings();
  
  // Default fallback jika database kosong, gunakan ID yang ada di metadata lu
  let pubId = "pub-9194845612370151"; 
  
  if (adSettings?.publisherId) {
    // Sanitasi: Hilangkan spasi dan awalan 'ca-' karena ads.txt hanya butuh format 'pub-xxx'
    let rawId = adSettings.publisherId.trim();
    if (rawId.startsWith('ca-')) {
      rawId = rawId.substring(3);
    }
    pubId = rawId;
  }

  // Format standar Google AdSense
  const adsTxtContent = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

  return new Response(adsTxtContent, {
    headers: {
      "Content-Type": "text/plain",
      // Caching: Biarkan bot cache selama 1 jam, tapi revalidate di background setiap hari
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
