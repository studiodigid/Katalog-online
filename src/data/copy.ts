export type Lang = 'id' | 'en';

/**
 * ID dan EN ditulis terpisah untuk audiens masing-masing, bukan terjemahan literal.
 * Halaman ini hanya membahas DIGID 3D Catalog. Tidak ada harga dan tidak ada klaim penjualan.
 */

const id = {
  meta: { title: 'DIGID Studio — DIGID 3D Catalog untuk Bisnis Apparel' },
  brand: { name: 'DIGID STUDIO', tagline: 'DIGID 3D Catalog' },
  nav: {
    catalog: 'Katalog 3D',
    how: 'Cara Kerja',
    examples: 'Contoh',
    start: 'Mulai Sekarang',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    language: 'Bahasa',
    skip: 'Langsung ke konten',
  },
  hero: {
    title: 'Katalog Apparel Anda, Kini Bisa Dilihat dalam 3D.',
    body: 'Tampilkan produk dari berbagai sisi, biarkan pelanggan mengeksplorasi sendiri, lalu arahkan mereka langsung ke WhatsApp untuk order.',
    primary: 'Buat Katalog Saya',
    secondary: 'Lihat Contoh 3D',
    note: 'Tanpa aplikasi khusus dan tanpa login pelanggan. Order tetap lewat WhatsApp.',
  },
  viewer: {
    label: 'Style3D Baseball Jacket',
    badge: '3D Product Demo',
    openDemo: 'Buka Demo 3D',
    hint: 'Geser untuk memutar. Cubit atau scroll untuk zoom.',
    loading: 'Memuat model 3D',
    canvasLabel: 'Model 3D interaktif Style3D Baseball Jacket. Geser untuk memutar.',
    zoomIn: 'Perbesar',
    zoomOut: 'Perkecil',
    reset: 'Reset tampilan',
    spin: 'Putar otomatis',
    stopSpin: 'Hentikan putar otomatis',
    fullscreen: 'Layar penuh',
    exitFullscreen: 'Keluar dari layar penuh',
    errorTitle: '3D Product Preview',
    errorBody: 'Pratinjau interaktif belum bisa dimuat.',
    errorHint: 'Coba buka demo 3D-nya.',
  },
  problem: {
    title: 'Katalog yang hanya berisi foto sering belum cukup.',
    intro:
      'Pelanggan ingin melihat produk dengan jelas sebelum order. Kalau katalog hanya foto, pertanyaannya pindah ke chat Anda.',
    items: [
      {
        title: 'Pelanggan minta foto sisi lain',
        text: 'Bagian belakang atau samping harus dikirim satu per satu lewat chat.',
      },
      {
        title: 'Pelanggan minta detail produk',
        text: 'Detail kecil sering ditanyakan karena kurang jelas di foto.',
      },
      {
        title: 'Sales kirim foto berulang',
        text: 'Foto yang sama dikirim lagi ke setiap pelanggan yang bertanya.',
      },
      {
        title: 'Produk sulit dibayangkan',
        text: 'Satu atau dua foto belum cukup untuk membayangkan bentuk produk sebenarnya.',
      },
    ],
  },
  demo: {
    title: 'Bukan sekadar foto produk.',
    body: 'Biarkan pelanggan melihat produk dari berbagai sisi sebelum menghubungi Anda.',
    line: 'Putar. Zoom. Lihat detail. Lalu lanjutkan order melalui WhatsApp.',
    cta: 'Buat Katalog Saya',
  },
  how: {
    title: 'Sesederhana ini.',
    steps: [
      { title: 'Kirim Produk', text: 'Kirim foto, informasi produk, dan kebutuhan katalog Anda.' },
      { title: 'DIGID Siapkan Katalog', text: 'Kami menyiapkan tampilan 3D dan halaman katalog.' },
      {
        title: 'Bagikan Link',
        text: 'Gunakan link katalog di WhatsApp, Instagram, website, atau media lainnya.',
      },
      {
        title: 'Customer Order',
        text: 'Pelanggan melihat produk lalu menghubungi Anda melalui WhatsApp.',
      },
    ],
  },
  assets: {
    title: 'Belum punya file 3D? Tidak masalah.',
    body: 'Anda tidak perlu menyiapkan model 3D sendiri. Kirim informasi produk Anda, lalu kami cek kebutuhan aset 3D-nya.',
  },
  useCases: {
    title: 'Cocok untuk berbagai produk apparel.',
    items: ['Jersey', 'Jacket', 'T-Shirt', 'Polo', 'Uniform', 'Custom Apparel'],
  },
  benefits: {
    title: 'Apa yang berubah untuk bisnis Anda?',
    items: [
      { title: 'Produk lebih mudah dilihat', text: 'Pelanggan bisa memutar dan mengeksplorasi produk.' },
      { title: 'Tampilan lebih profesional', text: 'Katalog terlihat rapi dan modern.' },
      {
        title: 'Lebih sedikit pertanyaan foto berulang',
        text: 'Pelanggan bisa melihat sisi lain produk sendiri.',
      },
      { title: 'Link mudah dibagikan', text: 'Satu link untuk WhatsApp, Instagram, dan website.' },
      { title: 'Tetap menggunakan WhatsApp', text: 'Pelanggan tetap menghubungi Anda seperti biasa.' },
      {
        title: 'Bisa dimulai dari beberapa produk',
        text: 'Tidak perlu memasukkan seluruh katalog sekaligus.',
      },
    ],
    disclaimer:
      'Manfaat bergantung pada produk dan cara Anda memakainya. Kami tidak menjanjikan kenaikan penjualan tertentu.',
    grow: 'Mulai sederhana. Kembangkan saat bisnis Anda membutuhkan lebih banyak.',
  },
  finalCta: {
    title: 'Siap membuat katalog produk Anda lebih interaktif?',
    body: 'Mulai dari beberapa produk. Kami bantu siapkan katalog 3D yang siap dibagikan ke pelanggan.',
    primary: 'Buat Katalog Saya',
    secondary: 'Lihat Contoh 3D',
  },
  footer: { text: 'DIGID 3D Catalog: katalog online 3D untuk bisnis apparel.' },
};

type Copy = typeof id;

const en: Copy = {
  meta: { title: 'DIGID Studio — DIGID 3D Catalog for Apparel Businesses' },
  brand: { name: 'DIGID STUDIO', tagline: 'DIGID 3D Catalog' },
  nav: {
    catalog: '3D Catalog',
    how: 'How It Works',
    examples: 'Examples',
    start: 'Get Started',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    skip: 'Skip to content',
  },
  hero: {
    title: 'Your Apparel Catalog, Now in 3D.',
    body: 'Show your products from every angle, let customers explore on their own, then send them straight to WhatsApp to order.',
    primary: 'Build My Catalog',
    secondary: 'See a 3D Example',
    note: 'No app to install and no customer login. Orders still arrive on WhatsApp.',
  },
  viewer: {
    label: 'Style3D Baseball Jacket',
    badge: '3D Product Demo',
    openDemo: 'Open 3D Demo',
    hint: 'Drag to rotate. Pinch or scroll to zoom.',
    loading: 'Loading 3D model',
    canvasLabel: 'Interactive 3D model of the Style3D Baseball Jacket. Drag to rotate.',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset view',
    spin: 'Auto-rotate',
    stopSpin: 'Stop auto-rotate',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    errorTitle: '3D Product Preview',
    errorBody: 'Unable to load the interactive preview.',
    errorHint: 'Try opening the 3D Demo.',
  },
  problem: {
    title: 'A catalog of photos alone often falls short.',
    intro:
      "Customers want a clear look at a product before they order. When the catalog is only photos, the questions land in your chat.",
    items: [
      {
        title: 'Customers ask for the other side',
        text: 'The back or the side has to be sent over chat, one photo at a time.',
      },
      {
        title: 'Customers ask about details',
        text: "Small details get asked about because they're hard to make out in photos.",
      },
      {
        title: 'Sales resend the same photos',
        text: 'The same pictures go out again to every customer who asks.',
      },
      {
        title: 'Hard to picture the product',
        text: "One or two photos aren't enough to imagine what the product really looks like.",
      },
    ],
  },
  demo: {
    title: 'More than a product photo.',
    body: 'Let customers see your product from every side before they get in touch.',
    line: 'Rotate. Zoom. Check the details. Then order on WhatsApp.',
    cta: 'Build My Catalog',
  },
  how: {
    title: 'It really is this simple.',
    steps: [
      { title: 'Send Your Products', text: 'Share photos, product info, and what you need from the catalog.' },
      { title: 'We Build the Catalog', text: 'We prepare the 3D views and the catalog pages.' },
      {
        title: 'Share the Link',
        text: 'Use the catalog link on WhatsApp, Instagram, your website, or anywhere else.',
      },
      {
        title: 'Customers Order',
        text: 'Customers look over the product, then message you on WhatsApp.',
      },
    ],
  },
  assets: {
    title: "Don't have a 3D file? No problem.",
    body: "You don't need to prepare a 3D model yourself. Send us your product details and we'll check what 3D assets are needed.",
  },
  useCases: {
    title: 'A fit for all kinds of apparel.',
    items: ['Jerseys', 'Jackets', 'T-Shirts', 'Polos', 'Uniforms', 'Custom Apparel'],
  },
  benefits: {
    title: 'What changes for your business?',
    items: [
      { title: 'Products are easier to see', text: 'Customers can rotate and explore each product.' },
      { title: 'A more professional look', text: 'Your catalog looks tidy and modern.' },
      {
        title: 'Fewer repeat photo requests',
        text: 'Customers can check the other sides themselves.',
      },
      { title: 'One link to share', text: 'The same link works on WhatsApp, Instagram, and your website.' },
      { title: 'Still on WhatsApp', text: 'Customers keep contacting you the way they already do.' },
      {
        title: 'Start with a few products',
        text: "No need to put your whole catalog in at once.",
      },
    ],
    disclaimer:
      "Benefits depend on your products and how you use the catalog. We don't promise specific sales gains.",
    grow: 'Start simple. Grow when your business needs more.',
  },
  finalCta: {
    title: 'Ready to make your product catalog more interactive?',
    body: 'Start with a few products. We will help you set up a 3D catalog that is ready to share with customers.',
    primary: 'Build My Catalog',
    secondary: 'See a 3D Example',
  },
  footer: { text: 'DIGID 3D Catalog: 3D online catalogs for apparel businesses.' },
};

export const copy: Record<Lang, Copy> = { id, en };
export type { Copy };
