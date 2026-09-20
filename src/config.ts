import type { Lang } from './data/copy';

export const DEMO_URL = 'https://3d.digidstudio.com';

export const HERO_GLB_URL =
  'https://ik.imagekit.io/digidstudio/glb%20Style3D%20Baseball%20Jacket%20v1.0-optimized.glb';

export const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

export const WHATSAPP_NUMBER = '6288973641682';

/** Pesan otomatis WhatsApp. Menyebut "DIGID 3D Catalog" agar tim tahu asal layanan. */
const WA_MESSAGES: Record<Lang, string> = {
  id: 'Hi DIGID Studio, saya tertarik membuat DIGID 3D Catalog (katalog online 3D) untuk produk apparel saya.',
  en: "Hi DIGID Studio, I'm interested in a DIGID 3D Catalog (3D online catalog) for my apparel products.",
};

export function whatsappUrl(lang: Lang): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MESSAGES[lang])}`;
}
