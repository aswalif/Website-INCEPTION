import React, { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs"; // anime.js v4  ->  npm i animejs
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  company: string; // tampil besar sebagai "headline" visual
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Yudial Hukama",
    company: "Biznet",
    role: "Branch Supervisor Biznet",
    quote:
      "Sebuah kebanggaan menjadi alumni SMK Telkom Medan. Ilmu-ilmu yang didapatkan dari para guru terbaik dan berpengalaman dapat langsung diaplikasikan pada dunia profesional !",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    rating: 5,
  },
  {
    id: 2,
    name: "Rio Purba",
    company: "Designpreneur",
    role: "Designprenuer",
    quote:
      "SMK Telkom Medan menjadi fondasi kuat bagi saya untuk menjadi seorang designpreneur. Ilmu yang saya dapatkan di sini sangat relevan dengan dunia kerja, terutama dalam bidang desain. Terima kasih SMK Telkom Medan!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    rating: 5,
  },
  {
    id: 3,
    name: "Ibnu Alwindra",
    company: "Huawei",
    role: "Huawei",
    quote:
      "Terima kasih untuk guru guru SMK Telkom Medan yang sangat friendly , yang mau mengajari saya detail tentang dunia telekomunikasi, pesan untuk adik-adik selalu semangat bersekolah di SMK Telkom Medan karna itu penting !",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    rating: 5,
  },
  {
    id: 4,
    name: "Raihan Asrawi",
    company: "Basarnas",
    role: "Basarnas",
    quote:
      "Saya merasa senang dan banyak ilmu yang saya dapatkan dari bersosial ke guru, lingkungan sekolah, dan banyak pengalaman yang saya dapatkan selama bersekolah di SMK Telkom Medan !",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
    rating: 5,
  },
  {
    id: 5,
    name: "Muhanisya Putri",
    company: "McDermott",
    role: "PT. McDermott Indonesia",
    quote:
      "Merupakan kebanggaan bisa bersekolah di SMK Telkom Medan, sekolah unggulan yang memiliki guru-guru yang kompeten dibidangnya dan selalu memberikan yang terbaik bagi para siswanya !",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    rating: 5,
  },
];

const AUTOPLAY_MS = 7000;

/* Token warna & font. Ubah di sini jika hex resmi website berbeda. */
const STYLE = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap");
.alu{
  --alu-red:#EE1C25;
  --alu-red-deep:#B8141B;
  --alu-ink:#1F2024;
  --alu-paper:#FFFFFF;
  --alu-mist:#F4F4F5;
  font-family:"Bricolage Grotesque",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
}
.alu-noscroll{scrollbar-width:none}
.alu-noscroll::-webkit-scrollbar{display:none}
`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Alumni: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const reduce = useRef(prefersReducedMotion()).current;
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressAnim = useRef<ReturnType<typeof animate> | null>(null);

  const total = testimonials.length;
  const t = testimonials[active];

  const go = (i: number) => setActive((i + total) % total);

  /** ambil elemen di dalam section ini saja */
  const q = (sel: string) =>
    rootRef.current
      ? Array.from(rootRef.current.querySelectorAll<HTMLElement>(sel))
      : [];

  // Tampilkan animasi hanya saat section masuk layar
  useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Intro: judul naik per kata, lalu elemen pendukung muncul
  useEffect(() => {
    if (!inView || reduce) return;
    const a = animate(q(".alu-title-word"), {
      translateY: ["110%", "0%"],
      duration: 1100,
      delay: stagger(110),
      ease: "outExpo",
    });
    const b = animate(q(".alu-fade"), {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 800,
      delay: stagger(120, { start: 450 }),
      ease: "outQuart",
    });
    return () => {
      a.pause();
      b.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Pergantian alumni: foto terbuka, nama perusahaan & kutipan naik
  useEffect(() => {
    if (!inView || reduce) return;
    const anims = [
      animate(q(".alu-portrait"), {
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        duration: 1000,
        ease: "outExpo",
      }),
      animate(q(".alu-img"), {
        scale: [1.3, 1],
        duration: 1400,
        ease: "outExpo",
      }),
      animate(q(".alu-char"), {
        translateY: ["105%", "0%"],
        duration: 900,
        delay: stagger(40, { start: 150 }),
        ease: "outExpo",
      }),
      animate(q(".alu-word"), {
        translateY: ["110%", "0%"],
        duration: 800,
        delay: stagger(14, { start: 350 }),
        ease: "outQuart",
      }),
      animate(q(".alu-meta"), {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 700,
        delay: stagger(100, { start: 700 }),
        ease: "outQuart",
      }),
    ];
    return () => anims.forEach((a) => a.pause());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inView]);

  // Autoplay dengan garis progres pada tab aktif
  useEffect(() => {
    if (!inView || reduce || !progressRef.current) return;
    const a = animate(progressRef.current, {
      scaleX: [0, 1],
      duration: AUTOPLAY_MS,
      ease: "linear",
      onComplete: () => setActive((p) => (p + 1) % total),
    });
    progressAnim.current = a;
    return () => {
      a.pause();
      progressAnim.current = null;
    };
  }, [active, inView, reduce, total]);

  // Jeda saat hover / fokus
  useEffect(() => {
    if (paused) progressAnim.current?.pause();
    else progressAnim.current?.play();
  }, [paused]);

  // Helper: kondisi awal tersembunyi (hilang bila reduced motion)
  const hide = (css: React.CSSProperties): React.CSSProperties | undefined =>
    reduce ? undefined : css;

  return (
    <section
      ref={rootRef}
      aria-labelledby="alumni-title"
      className="alu relative overflow-hidden bg-[var(--alu-paper)] py-16 text-[var(--alu-ink)] sm:py-24 lg:py-32"
    >
      <style>{STYLE}</style>

      <div
        className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Header */}
        <header className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="alumni-title"
              className="text-[clamp(2.5rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight"
            >
              {["Alumni", "SMK Telkom Medan"].map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <span
                    className="alu-title-word block"
                    style={hide({ transform: "translateY(110%)" })}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p
              className="alu-fade mt-5 max-w-md text-base text-[var(--alu-ink)]/70 sm:text-lg"
              style={hide({ opacity: 0 })}
            >
              Cerita langsung dari lulusan yang kini berkarya di dunia
              profesional.
            </p>
          </div>

          <div
            className="alu-fade flex items-center gap-3"
            style={hide({ opacity: 0 })}
          >
            <span className="mr-2 text-sm tabular-nums text-[var(--alu-ink)]/60">
              {active + 1} dari {total}
            </span>
            <button
              onClick={() => go(active - 1)}
              aria-label="Alumni sebelumnya"
              className="flex h-12 w-12 items-center justify-center border-2 border-[var(--alu-ink)] transition-colors hover:border-[var(--alu-red)] hover:bg-[var(--alu-red)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alu-red)] sm:h-14 sm:w-14"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Alumni berikutnya"
              className="flex h-12 w-12 items-center justify-center bg-[var(--alu-red)] text-white transition-colors hover:bg-[var(--alu-red-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alu-ink)] sm:h-14 sm:w-14"
            >
              <FaChevronRight />
            </button>
          </div>
        </header>

        {/* Panggung utama */}
        <div className="mt-12 grid items-center gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-14">
          <React.Fragment key={t.id}>
            {/* Foto */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md lg:max-w-none">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-3 translate-y-3 bg-[var(--alu-red)] sm:translate-x-5 sm:translate-y-5"
                />
                <div
                  className="alu-portrait relative h-full w-full overflow-hidden bg-[var(--alu-mist)]"
                  style={hide({ clipPath: "inset(0% 0% 100% 0%)" })}
                >
                  <img
                    src={t.avatar}
                    alt={`Foto ${t.name}`}
                    className="alu-img h-full w-full object-cover"
                    loading={active === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            </div>

            {/* Teks */}
            <div className="min-w-0 lg:col-span-7">
              <p
                aria-label={t.company}
                className="font-extrabold leading-none tracking-tight text-[var(--alu-red)] text-[clamp(2.25rem,7vw,5.5rem)]"
              >
                <span aria-hidden>
                  {Array.from(t.company).map((ch, i) => (
                    <span
                      key={i}
                      className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                    >
                      <span
                        className="alu-char inline-block"
                        style={hide({ transform: "translateY(105%)" })}
                      >
                        {ch}
                      </span>
                    </span>
                  ))}
                </span>
              </p>

              <blockquote className="mt-6 border-l-4 border-[var(--alu-red)] pl-5 sm:mt-8 sm:pl-7">
                <p className="max-w-[48ch] text-lg leading-snug sm:text-xl lg:text-2xl">
                  {t.quote.split(" ").map((w, i) => (
                    <React.Fragment key={i}>
                      <span className="inline-block overflow-hidden pb-[0.15em] align-bottom">
                        <span
                          className="alu-word inline-block"
                          style={hide({ transform: "translateY(110%)" })}
                        >
                          {w}
                        </span>
                      </span>{" "}
                    </React.Fragment>
                  ))}
                </p>
              </blockquote>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-8">
                <div className="alu-meta" style={hide({ opacity: 0 })}>
                  <p className="text-xl font-bold sm:text-2xl">{t.name}</p>
                  <p className="mt-0.5 text-sm text-[var(--alu-ink)]/60 sm:text-base">
                    {t.role}
                  </p>
                </div>
                <div
                  className="alu-meta flex gap-1 text-[var(--alu-red)]"
                  style={hide({ opacity: 0 })}
                  role="img"
                  aria-label={`Penilaian ${t.rating} dari 5`}
                >
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FaStar key={i} className="text-sm sm:text-base" />
                  ))}
                </div>
              </div>
            </div>
          </React.Fragment>
        </div>

        {/* Pemilih alumni */}
        <div
          className="alu-fade alu-noscroll -mx-5 mt-14 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 lg:mt-20"
          style={hide({ opacity: 0 })}
        >
          {testimonials.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.id}
                onClick={() => go(i)}
                aria-current={isActive}
                className={`group relative min-w-[12rem] shrink-0 snap-start border-t-2 border-[var(--alu-ink)]/15 pt-4 text-left transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alu-red)] sm:min-w-0 ${
                  isActive ? "opacity-100" : "opacity-55 hover:opacity-100"
                }`}
              >
                {isActive && (
                  <span
                    ref={progressRef}
                    aria-hidden
                    className="absolute -top-0.5 left-0 h-0.5 w-full origin-left bg-[var(--alu-red)]"
                    style={hide({ transform: "scaleX(0)" })}
                  />
                )}
                <span className="flex items-center gap-3">
                  <img
                    src={item.avatar.replace("w=800", "w=120")}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">
                      {item.name}
                    </span>
                    <span className="block truncate text-sm text-[var(--alu-ink)]/60">
                      {item.company}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Alumni;
