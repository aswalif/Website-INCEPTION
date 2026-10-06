import { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// FONT
// Hanya font yang benar-benar dipakai di Hero yang dimuat:
// - Satoshi        -> teks isi (badge, tombol, label)
// - Fraunces 900   -> judul (semua judul memakai font-black)
// - Bebas Neue     -> sub-judul "jadilah bagian dari"
// Figtree & Space Grotesk dulu hanya fallback di FONT_STACK yang hampir tidak
// pernah tampil, tetapi tetap diunduh -> sekarang dihapus (1 request CSS +
// beberapa file font lebih sedikit).
// ---------------------------------------------------------------------------
const SATOSHI_FONT_ID = 'hero-satoshi-font';
const SATOSHI_FONT_HREF =
  'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap';

const HEADLINE_FONT_ID = 'hero-headline-font';
const HEADLINE_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,900&family=Bebas+Neue&display=swap';

// Origin tempat FILE font (woff2) disimpan. Koneksinya dibuka lebih awal
// (preconnect) selagi file CSS font masih diunduh.
const FONT_FILE_ORIGINS = [
  'https://fonts.gstatic.com',
  'https://cdn.fontshare.com',
];

const FONT_STACK = "'Satoshi', ui-sans-serif, system-ui, sans-serif";

// Kombinasi font khusus untuk judul besar Hero (terinspirasi dari pasangan
// Baskerville Old Face + Haettenschweiler): serif display dramatis dipadukan
// dengan condensed caps yang tegas sebagai aksen.
const HEADLINE_SERIF_STACK = "'Fraunces', Georgia, 'Times New Roman', serif";
const HEADLINE_CONDENSED_STACK =
  "'Bebas Neue', 'Haettenschweiler', 'Arial Narrow', sans-serif";

// Ukuran teks fluid: tumbuh halus mengikuti lebar layar, dengan batas
// minimum dan maksimum sehingga tidak melonjak antar breakpoint dan
// tidak membesar tanpa batas di monitor lebar.
const SIZE_TITLE = 'clamp(1.75rem, 1.1rem + 3vw, 3.5rem)';
const SIZE_SUBTITLE = 'clamp(1.125rem, 0.85rem + 1.4vw, 1.875rem)';
const SIZE_HIGHLIGHT = 'clamp(1.875rem, 1.1rem + 3.4vw, 3.75rem)';

// Durasi auto-play carousel (ms)
const AUTOPLAY_MS = 6000;

// Ukuran asli gambar background. GANTI dengan ukuran file sebenarnya
// (lihat Properties file di /public). Karena gambar memakai h-full w-full
// object-cover, angka ini hanya menjadi petunjuk rasio untuk browser dan
// TIDAK mengubah tampilan.
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

// Hanya properti yang benar-benar berubah saat hover/focus/active yang
// di-transisikan (menggantikan transition-all). Tampilan sama persis.
const TRANSITION_CLASS =
  'transition-[transform,box-shadow,background-color,border-color] duration-300';

const CTA_CLASS = `inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 bg-gradient-to-r from-red-600/90 to-red-500/90 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-900/40 backdrop-blur-md ${TRANSITION_CLASS} hover:scale-105 hover:shadow-red-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:px-8`;

const SOCIAL_CLASS = `flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs backdrop-blur-md ${TRANSITION_CLASS} hover:scale-110 hover:border-red-400/50 hover:bg-red-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none motion-reduce:hover:scale-100`;

const ARROW_CLASS = `pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 font-bold text-white shadow-lg shadow-black/20 backdrop-blur-xl ${TRANSITION_CLASS} hover:scale-110 hover:border-red-300/50 hover:bg-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-12 sm:w-12`;

// CSS animasi dibuat sekali di luar komponen (bukan string baru di tiap render).
// Semua animasi hanya memakai transform & opacity -> dikerjakan compositor,
// tidak memicu layout.
const HERO_CSS = `
  @keyframes hero-content-in {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-hero-in {
    animation: hero-content-in 0.8s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes orb-float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(0, -22px); }
  }

  /* will-change hanya untuk 2 orb yang beranimasi terus-menerus */
  .animate-orb-float {
    animation: orb-float 9s ease-in-out infinite;
    will-change: transform;
  }

  .animate-orb-float-slow {
    animation: orb-float 13s ease-in-out infinite;
    animation-delay: -4s;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-hero-in,
    .animate-orb-float,
    .animate-orb-float-slow {
      animation: none;
      will-change: auto;
    }
  }
`;

const SLIDES = [
  // Slide 1: Pendaftaran
  {
    type: 'pendaftaran',
    image: '/hero-bg.webp',
    title: 'Daftar Sekarang!!',
    subtitle: 'jadilah bagian dari',
    highlight: 'Generasi Masa Depan!',
    badge: 'SEKOLAH INFORMATIKA NYATA & Pusat Keunggulan 🏅',
    buttonText: 'Bergabunglah dengan Kami',
    link: 'https://ppdb.telkomschools.sch.id/signup?lemdik=50',
  },

  // Slide 2: Selamat Datang
  {
    type: 'welcome',
    image: '/gedung-baru.webp',
    welcomeText: 'Selamat Datang di',
    title: 'Website SMK Telkom Medan',
    badge:
      'SMK Pusat Keunggulan 🏅 Sekolah berbasis IT ter-baik di Sumatera Utara dengan Akreditasi "A"',
    buttonText: 'Mulai',
    link: 'https://ppdb.telkomschools.sch.id/signup?lemdik=50',
  },
];

// Menambahkan <link> ke <head> hanya jika belum ada (aman dipanggil berulang)
function addHeadLink(id: string, attrs: Record<string, string>) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
  document.head.appendChild(link);
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Gambar slide berikutnya baru ikut diunduh setelah gambar slide 1 selesai
  // dimuat, supaya tidak berebut bandwidth dengan gambar yang menentukan LCP.
  const [imagesReady, setImagesReady] = useState(false);

  // Load font Hero. Stylesheet yang disisipkan lewat JS tidak memblokir render,
  // dan display=swap membuat teks langsung tampil dengan font fallback.
  useEffect(() => {
    FONT_FILE_ORIGINS.forEach((origin) => {
      addHeadLink(`hero-preconnect-${origin}`, {
        rel: 'preconnect',
        href: origin,
        crossorigin: 'anonymous',
      });
    });

    addHeadLink(SATOSHI_FONT_ID, {
      rel: 'stylesheet',
      href: SATOSHI_FONT_HREF,
    });

    addHeadLink(HEADLINE_FONT_ID, {
      rel: 'stylesheet',
      href: HEADLINE_FONT_HREF,
    });
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Auto-play: satu timer sekali jalan (setTimeout) per slide. Setiap slide
  // berganti (otomatis maupun lewat tombol panah) timer lama dibersihkan dan
  // dihitung ulang 6 detik dari awal -> perilaku sama seperti sebelumnya.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [currentSlide]);

  const current = SLIDES[currentSlide];

  return (
    <section
      id="hero"
      aria-label="Beranda SMK Telkom Medan"
      /*
        - w-full (bukan w-screen): w-screen = 100vw sudah termasuk lebar scrollbar,
          itulah penyebab horizontal scroll.
        - min-h clamp(32rem, 100svh, 56rem): tinggi mengikuti layar (svh = aman untuk
          address bar mobile), tapi tidak kurang dari 32rem dan tidak lebih dari 56rem
          (896px) agar tidak terlalu tinggi di monitor besar.
        - min-h (bukan h) agar konten boleh memanjang di layar kecil tanpa terpotong.
      */
      className="relative flex min-h-[clamp(32rem,100svh,56rem)] w-full select-none flex-col overflow-hidden bg-slate-950"
      style={{ fontFamily: FONT_STACK }}
    >
      <style>{HERO_CSS}</style>

      {/* Carousel Gambar Background dengan Animasi Pergerakan (Zoom & Scale Effect) */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          aria-hidden={index !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'z-10 opacity-100' : 'z-0 opacity-0'
          }`}
        >
          {/* Slide 1 selalu dirender dan diprioritaskan (LCP). Slide lain baru
              dirender setelah slide 1 selesai dimuat, atau saat slide itu aktif. */}
          {(index === 0 || imagesReady || index === currentSlide) && (
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
              onLoad={index === 0 ? () => setImagesReady(true) : undefined}
              className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                index === currentSlide
                  ? 'translate-y-2 scale-110'
                  : 'translate-y-0 scale-100'
              }`}
            />
          )}

          {/* Overlay gradien berlapis agar kartu kaca tetap terbaca dan terasa dalam (depth) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-transparent" />
        </div>
      ))}

      {/* Elemen dekoratif kaca yang melayang lembut (glassmorphism depth) */}
      <div
        aria-hidden="true"
        className="animate-orb-float pointer-events-none absolute -right-16 -top-16 z-10 h-48 w-48 rounded-full bg-red-500/20 blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72"
      />

      <div
        aria-hidden="true"
        className="animate-orb-float-slow pointer-events-none absolute -bottom-20 -left-16 z-10 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:-bottom-32 sm:-left-24 sm:h-80 sm:w-80"
      />

      {/* Slide 1: Tampilan Pendaftaran */}
      {current.type === 'pendaftaran' && (
        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center justify-end px-4 pb-24 pt-24 text-right sm:px-6 sm:pb-28 lg:px-8 lg:pb-14">
          <div
            key={`pendaftaran-${currentSlide}`}
            className="animate-hero-in w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10 backdrop-blur-2xl sm:p-8 md:max-w-xl lg:max-w-2xl lg:p-10"
          >
            <div className="space-y-3 text-white sm:space-y-4">
              <h1
                className="font-black leading-tight"
                style={{
                  fontFamily: HEADLINE_SERIF_STACK,
                  fontSize: SIZE_TITLE,
                }}
              >
                {current.title} <br />

                <span
                  className="font-normal tracking-wider text-gray-200"
                  style={{
                    fontFamily: HEADLINE_CONDENSED_STACK,
                    fontSize: SIZE_SUBTITLE,
                  }}
                >
                  {current.subtitle}
                </span>{' '}
                <br />

                <span
                  className="font-black text-red-500 drop-shadow-md"
                  style={{ fontSize: SIZE_HIGHLIGHT }}
                >
                  {current.highlight}
                </span>
              </h1>

              <p className="pt-1 text-sm font-semibold text-slate-200/90 sm:pt-2 sm:text-base">
                {current.badge}
              </p>

              <div className="flex justify-end pt-2 sm:pt-3">
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA_CLASS}
                >
                  {current.buttonText}
                </a>
              </div>

              {/* Media Sosial */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 text-white sm:gap-3 sm:pt-4">
                <span className="text-xs font-bold text-slate-200">
                  Ikuti kami:
                </span>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/p/SMK-Telkom-Medan-100063703027473/"
                  target="_blank"
                  rel="noreferrer"
                  className={SOCIAL_CLASS}
                  aria-label="Facebook SMK Telkom Medan"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.3 4.3c-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/smktelkommedan01"
                  target="_blank"
                  rel="noreferrer"
                  className={SOCIAL_CLASS}
                  aria-label="Instagram SMK Telkom Medan"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@smktelkom_medan"
                  target="_blank"
                  rel="noreferrer"
                  className={SOCIAL_CLASS}
                  aria-label="TikTok SMK Telkom Medan"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.96v13.67a2.89 2.89 0 1 1-2.89-2.89c.3 0 .59.05.86.13V8.88a6.84 6.84 0 0 0-.86-.05A6.85 6.85 0 1 0 15.82 15V8.98a8.72 8.72 0 0 0 5.1 1.64V6.69h-1.33Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide 2: Tampilan Ucapan Selamat Datang */}
      {current.type === 'welcome' && (
        <div className="relative z-20 mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 pb-24 pt-24 text-center sm:px-6 sm:pb-28 lg:pb-14">
          <div
            key={`welcome-${currentSlide}`}
            className="animate-hero-in w-full rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10 backdrop-blur-2xl sm:p-8 lg:p-12"
          >
            <div className="space-y-3 text-white sm:space-y-4">
              <span className="inline-block rounded-full border border-white/20 bg-red-600/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {current.welcomeText}
              </span>

              <h1
                className="font-black leading-tight drop-shadow-lg"
                style={{
                  fontFamily: HEADLINE_SERIF_STACK,
                  fontSize: SIZE_TITLE,
                }}
              >
                {current.title}
              </h1>

              <p className="mx-auto max-w-2xl text-sm font-medium text-slate-200/90 sm:text-base">
                {current.badge}
              </p>

              <div className="pt-2 sm:pt-4">
                <a href={current.link} className={CTA_CLASS}>
                  {current.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Navigasi Panah (Bawah Kiri).
          Dibungkus container yang sama dengan konten (max-w-7xl) agar posisinya
          selaras di semua ukuran layar; wrapper tidak menghalangi klik. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 pb-5 sm:pb-8">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
            className={ARROW_CLASS}
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide berikutnya"
            className={ARROW_CLASS}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}