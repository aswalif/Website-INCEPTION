import { useState, useEffect } from 'react';

// Font untuk Hero Section: gabungan Satoshi, Figtree, dan Space Grotesk
const GOOGLE_FONT_ID = 'hero-figtree-space-grotesk-font';
const GOOGLE_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap';
const SATOSHI_FONT_ID = 'hero-satoshi-font';
const SATOSHI_FONT_HREF =
  'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap';
const FONT_STACK =
  "'Satoshi', 'Figtree', 'Space Grotesk', ui-sans-serif, system-ui, sans-serif";

// Kombinasi font khusus untuk judul besar Hero (terinspirasi dari pasangan
// Baskerville Old Face + Haettenschweiler): serif display dramatis dipadukan
// dengan condensed caps yang tegas sebagai aksen.
const HEADLINE_FONT_ID = 'hero-headline-font';
const HEADLINE_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Bebas+Neue&display=swap';
const HEADLINE_SERIF_STACK = "'Fraunces', Georgia, 'Times New Roman', serif";
const HEADLINE_CONDENSED_STACK =
  "'Bebas Neue', 'Haettenschweiler', 'Arial Narrow', sans-serif";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load font "Satoshi" (Fontshare) + "Figtree" & "Space Grotesk" (Google Fonts) untuk Hero Section
  useEffect(() => {
    if (!document.getElementById(SATOSHI_FONT_ID)) {
      const link = document.createElement('link');
      link.id = SATOSHI_FONT_ID;
      link.rel = 'stylesheet';
      link.href = SATOSHI_FONT_HREF;
      document.head.appendChild(link);
    }
    if (!document.getElementById(GOOGLE_FONT_ID)) {
      const link = document.createElement('link');
      link.id = GOOGLE_FONT_ID;
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONT_HREF;
      document.head.appendChild(link);
    }
    if (!document.getElementById(HEADLINE_FONT_ID)) {
      const link = document.createElement('link');
      link.id = HEADLINE_FONT_ID;
      link.rel = 'stylesheet';
      link.href = HEADLINE_FONT_HREF;
      document.head.appendChild(link);
    }
  }, []);

  const slides = [
    // Slide 1: Pendaftaran
    {
      type: 'pendaftaran',
      image: '/hero-bg.jpg',
      title: 'Daftar Sekarang!!',
      subtitle: 'jadilah bagian dari',
      highlight: 'Generasi Masa Depan!',
      badge: 'SEKOLAH INFORMATIKA NYATA & Pusat Keunggulan 🏅',
      buttonText: 'Bergabunglah dengan Kami',
      link: 'https://ppdb.smktelkom1medan.sch.id',
    },
    // Slide 2: Selamat Datang
    {
      type: 'welcome',
      image: '/gedung-baru.jpg',
      welcomeText: 'Selamat Datang di',
      title: 'Website SMK Telkom Medan',
      badge: 'SMK Pusat Keunggulan 🏅 Sekolah berbasis IT ter-baik di Sumatera Utara dengan Akreditasi "A"',
      buttonText: 'Mulai',
      link: '#profil',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section
      id="hero"
      className="relative w-screen h-screen min-h-screen overflow-hidden select-none bg-slate-950"
      style={{ fontFamily: FONT_STACK }}
    >
      <style>{`
        @keyframes hero-content-in {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-in { animation: hero-content-in 0.8s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -22px); }
        }
        .animate-orb-float { animation: orb-float 9s ease-in-out infinite; }
        .animate-orb-float-slow { animation: orb-float 13s ease-in-out infinite; animation-delay: -4s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-hero-in,
          .animate-orb-float,
          .animate-orb-float-slow { animation: none; }
        }
      `}</style>

      {/* Carousel Gambar Background dengan Animasi Pergerakan (Zoom & Scale Effect) */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
              index === currentSlide ? 'scale-110 translate-y-2' : 'scale-100 translate-y-0'
            }`}
          />
          {/* Overlay gradien berlapis agar kartu kaca tetap terbaca dan terasa dalam (depth) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-transparent" />
        </div>
      ))}

      {/* Elemen dekoratif kaca yang melayang lembut (glassmorphism depth) */}
      <div
        aria-hidden="true"
        className="animate-orb-float pointer-events-none absolute -top-24 right-[-6rem] z-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-orb-float-slow pointer-events-none absolute bottom-[-8rem] left-[-6rem] z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />

      {/* Slide 1: Tampilan Pendaftaran */}
      {slides[currentSlide].type === 'pendaftaran' && (
        <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center justify-end px-6 pt-16 text-right">
          <div
            key={`pendaftaran-${currentSlide}`}
            className="animate-hero-in w-full max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10 backdrop-blur-2xl sm:p-10"
          >
            <div className="space-y-4 text-white">
              <h1
                className="text-3xl font-black leading-tight sm:text-5xl"
                style={{ fontFamily: HEADLINE_SERIF_STACK }}
              >
                {slides[currentSlide].title} <br />
                <span
                  className="text-xl font-normal tracking-wider text-gray-200 sm:text-3xl"
                  style={{ fontFamily: HEADLINE_CONDENSED_STACK }}
                >
                  {slides[currentSlide].subtitle}
                </span>{' '}
                <br />
                <span className="text-3xl font-black text-red-500 drop-shadow-md sm:text-6xl">
                  {slides[currentSlide].highlight}
                </span>
              </h1>

              <p className="pt-2 text-sm font-semibold text-slate-200/90 sm:text-base">
                {slides[currentSlide].badge}
              </p>

              <div className="flex justify-end pt-3">
                <a
                  href={slides[currentSlide].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-white/25 bg-gradient-to-r from-red-600/90 to-red-500/90 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/40 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-red-500/40"
                >
                  {slides[currentSlide].buttonText}
                </a>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 text-white">
                <span className="text-xs font-bold text-slate-200">Ikuti kami:</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-400/50 hover:bg-red-500/25"
                >
                  f
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-400/50 hover:bg-red-500/25"
                >
                  📷
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-400/50 hover:bg-red-500/25"
                >
                  🎵
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide 2: Tampilan Ucapan Selamat Datang */}
      {slides[currentSlide].type === 'welcome' && (
        <div className="relative z-20 mx-auto flex h-full max-w-4xl items-center justify-center px-6 pt-16 text-center">
          <div
            key={`welcome-${currentSlide}`}
            className="animate-hero-in w-full rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10 backdrop-blur-2xl sm:p-12"
          >
            <div className="space-y-4 text-white">
              <span className="inline-block rounded-full border border-white/20 bg-red-600/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {slides[currentSlide].welcomeText}
              </span>

              <h1
                className="text-3xl font-black leading-tight drop-shadow-lg sm:text-5xl"
                style={{ fontFamily: HEADLINE_SERIF_STACK }}
              >
                {slides[currentSlide].title}
              </h1>

              <p className="mx-auto max-w-2xl text-sm font-medium text-slate-200/90 sm:text-base">
                {slides[currentSlide].badge}
              </p>

              <div className="pt-4">
                <a
                  href={slides[currentSlide].link}
                  className="inline-block rounded-full border border-white/25 bg-gradient-to-r from-red-600/90 to-red-500/90 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/40 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-red-500/40"
                >
                  {slides[currentSlide].buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Navigasi Panah (Bawah Kiri) */}
      <div className="absolute bottom-10 left-10 z-30 flex items-center gap-3">
        <button
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 font-bold text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-red-300/50 hover:bg-red-500/30 active:scale-95"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/15 font-bold text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-red-300/50 hover:bg-red-500/30 active:scale-95"
        >
          →
        </button>
      </div>
    </section>
  );
}