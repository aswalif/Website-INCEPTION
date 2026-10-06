import React, { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Types & data (TIDAK DIUBAH)                                               */
/* -------------------------------------------------------------------------- */

export interface ProfilProps {
  heroImageUrl?: string;
  onExploreMore?: () => void;
  className?: string;
}

interface DRealItem {
  letter: string;
  title: string;
  indonesian: string;
  description: string;
}

interface HighlightItem {
  id: string;
  label: string;
  title: string;
  mark: string;
  description: string;
  theme: "red" | "ink" | "blush";
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "akreditasi",
    label: "Unggul dan teruji",
    title: "Akreditasi A",
    mark: "A",
    description:
      "Kurikulum dan fasilitas berstandar tinggi, diverifikasi lembaga akreditasi nasional. Menjadi jaminan mutu pembelajaran yang diakui secara resmi oleh pemerintah.",
    theme: "red",
  },
  {
    id: "iso",
    label: "Sistem mutu",
    title: "ISO 9001",
    mark: "ISO",
    description:
      "Manajemen mutu pendidikan yang terintegrasi di seluruh proses belajar, mulai dari kurikulum, pengajaran, hingga evaluasi hasil belajar siswa.",
    theme: "ink",
  },
  {
    id: "tik",
    label: "Pusat teknologi",
    title: "Spesialisasi TIK",
    mark: "TIK",
    description:
      "Kompetensi teknologi yang disiapkan langsung untuk kebutuhan industri, mencakup jaringan, perangkat lunak, desain, hingga produksi konten digital.",
    theme: "blush",
  },
];

const THEMES: Record<
  HighlightItem["theme"],
  { card: string; pill: string; stroke: string }
> = {
  red: {
    card: "bg-red-600 text-white",
    pill: "bg-white text-red-600",
    stroke: "[--stroke:rgba(255,255,255,0.4)]",
  },
  ink: {
    card: "bg-neutral-950 text-white",
    pill: "bg-red-600 text-white",
    stroke: "[--stroke:rgba(255,255,255,0.2)]",
  },
  blush: {
    card: "bg-[#FFE7E1] text-neutral-950",
    pill: "bg-neutral-950 text-white",
    stroke: "[--stroke:rgba(227,30,36,0.4)]",
  },
};

const DREAL_ITEMS: DRealItem[] = [
  {
    letter: "D",
    title: "Discipline",
    indonesian: "Disiplin",
    description:
      "Membentuk ketertiban, ketepatan waktu, dan konsistensi dalam belajar maupun bersikap.",
  },
  {
    letter: "R",
    title: "Religious",
    indonesian: "Religius",
    description:
      "Memperkuat nilai keimanan, ketaqwaan, serta etika moral dalam aktivitas akademik dan sosial.",
  },
  {
    letter: "A",
    title: "Awareness",
    indonesian: "Kepedulian",
    description:
      "Menumbuhkan kepekaan sosial, empati, serta kepedulian terhadap lingkungan sekitar.",
  },
  {
    letter: "L",
    title: "Learned",
    indonesian: "Pembelajar",
    description:
      "Mendorong rasa ingin tahu, keteladanan, dan semangat untuk terus mengembangkan wawasan.",
  },
  {
    letter: "I",
    title: "Innovative",
    indonesian: "Inovatif",
    description:
      "Mengembangkan kreativitas dan kemampuan menghasilkan solusi di tengah perkembangan teknologi.",
  },
  {
    letter: "C",
    title: "Communicative",
    indonesian: "Komunikatif",
    description:
      "Membangun kemampuan berkomunikasi secara efektif, santun, lugas, dan profesional.",
  },
  {
    letter: "T",
    title: "Tolerance",
    indonesian: "Toleransi",
    description:
      "Menghargai keberagaman, menghormati perbedaan, dan menjaga keharmonisan bersama.",
  },
];

const MARQUEE_ITEMS = [
  "AKHLAK is Number One",
  "Akreditasi A",
  "ISO 9001",
  "Spesialisasi TIK",
  "D'REAL ICT",
];

const STATEMENT =
  "SMK Telkom Medan adalah sekolah kejuruan unggulan bidang TIK di bawah naungan Yayasan Pendidikan Telkom, mencetak generasi profesional, kompeten, dan berkarakter di era digital.";
const STATEMENT_HIGHLIGHT = new Set([
  "TIK",
  "profesional,",
  "kompeten,",
  "berkarakter",
]);
const STATEMENT_WORDS = STATEMENT.split(" ");

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/* -------------------------------------------------------------------------- */
/*  Animation helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Mengembalikan [ref, inView]; sekali true tetap true. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/** Reveal: fade + slide + blur-in saat masuk viewport. */
function Reveal({
  children,
  delay = 0,
  className = "",
  from = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "up" | "left" | "right" | "scale";
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const hidden = {
    up: "translate-y-10",
    left: "-translate-x-12",
    right: "translate-x-12",
    scale: "scale-90",
  }[from];
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionTimingFunction: EASE }}
      className={`transition-all duration-1000 ${
        inView
          ? "opacity-100 blur-0 translate-x-0 translate-y-0 scale-100"
          : `opacity-0 blur-sm ${hidden}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

function MaskLine({
  children,
  className = "",
  delay = 0,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animate?: boolean;
}) {
  return (
    <span className="pf-line overflow-hidden block">
      <span
        style={{
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: EASE,
        }}
        className={`block transform transition-all duration-1000 ${
          animate
            ? "translate-y-0 rotate-0 opacity-100"
            : "translate-y-[115%] rotate-3 opacity-0"
        } ${className}`}
      >
        {children}
      </span>
    </span>
  );
}

/** MaskLine yang terpicu oleh scroll-nya sendiri (untuk section di bawah hero). */
function ScrollMask({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.3);
  return (
    <span ref={ref} className="block">
      <MaskLine animate={inView} delay={delay} className={className}>
        {children}
      </MaskLine>
    </span>
  );
}

function Pill({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-bold tracking-wide sm:text-sm ${
        tone === "dark"
          ? "border-white/80 text-white"
          : "border-neutral-950 text-neutral-950"
      }`}
    >
      <span className="pf-dot h-2 w-2 rounded-full bg-red-600" />
      {children}
    </span>
  );
}

/** Kartu kredensial sticky dengan animasi isi bertahap. */
function CredentialCard({
  item,
  index,
  total,
}: {
  item: HighlightItem;
  index: number;
  total: number;
}) {
  const [ref, inView] = useInView<HTMLElement>(0.25);
  const t = THEMES[item.theme];
  const step = (d: number) =>
    ({
      transitionDelay: `${d}ms`,
      transitionTimingFunction: EASE,
    }) as React.CSSProperties;

  return (
    <article
      ref={ref}
      style={{ top: `calc(5.5rem + ${index * 0.9}rem)`, zIndex: index + 1 }}
      className={`pf-card group sticky mb-8 flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-neutral-950 p-6 sm:p-10 md:mb-14 md:min-h-[28rem] md:rounded-[2.5rem] md:p-14 ${t.card}`}
    >
      <span
        aria-hidden="true"
        style={step(200)}
        className={`pf-display pf-outline pointer-events-none absolute -bottom-4 right-2 select-none text-[9rem] leading-none transition-all duration-[1400ms] group-hover:-translate-y-4 group-hover:-rotate-3 sm:text-[14rem] md:-bottom-14 md:right-8 md:text-[26rem] ${t.stroke} ${
          inView ? "translate-x-0 opacity-100" : "translate-x-40 opacity-0"
        }`}
      >
        {item.mark}
      </span>

      <div className="relative flex flex-1 flex-col justify-between gap-12">
        <div
          style={step(100)}
          className={`flex items-center justify-end gap-4 transition-all duration-1000 ${
            inView ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          }`}
        >
          <span className="pf-display text-xl sm:text-3xl">
            {index + 1}/{total}
          </span>
        </div>

        <div>
          <h4 className="pf-display text-[clamp(3rem,10vw,8rem)] leading-[0.9]">
            <MaskLine animate={inView} delay={250}>
              {item.title}
            </MaskLine>
          </h4>
          <p
            style={step(550)}
            className={`mt-5 max-w-xl text-base font-medium leading-7 transition-all duration-1000 md:text-lg md:leading-8 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Profil({
  heroImageUrl,
  onExploreMore,
  className = "",
}: ProfilProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const heroMediaRef = useRef<HTMLDivElement | null>(null);
  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const statementRef = useRef<HTMLParagraphElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [mediaIn, setMediaIn] = useState(false);
  const [activeDReal, setActiveDReal] = useState<DRealItem>(DREAL_ITEMS[0]);
  const [imageError, setImageError] = useState(false);
  const [litWords, setLitWords] = useState(0);

  const [ainoRef, ainoIn] = useInView<HTMLDivElement>(0.3);
  const [listRef, listIn] = useInView<HTMLDivElement>(0.1);

  const imagePath =
    heroImageUrl || new URL("../assets/profil-16PQAoLO.webp", import.meta.url).href;

  useEffect(() => {
    const titleObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          titleObs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    const mediaObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMediaIn(true);
          mediaObs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (heroTitleRef.current) titleObs.observe(heroTitleRef.current);
    if (heroMediaRef.current) mediaObs.observe(heroMediaRef.current);
    return () => {
      titleObs.disconnect();
      mediaObs.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const sec = sectionRef.current;

      if (sec && progressRef.current) {
        const r = sec.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        progressRef.current.style.transform = `scaleX(${p})`;
      }

      if (heroMediaRef.current && heroImgRef.current) {
        const r = heroMediaRef.current.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - vh / 2) / vh;
        heroImgRef.current.style.transform = `scale(1.08) translateY(${offset * -28}px)`;
      }

      if (badgeRef.current && heroMediaRef.current) {
        const r = heroMediaRef.current.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - vh / 2) / vh;
        badgeRef.current.style.transform = `translateY(${offset * -40}px)`;
      }

      if (heroTitleRef.current) {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const r = heroTitleRef.current.getBoundingClientRect();
        const p = reduce
          ? 0
          : Math.min(1, Math.max(0, (120 - r.top) / r.height));
        const eased = p * p * (3 - 2 * p);
        heroTitleRef.current
          .querySelectorAll<HTMLElement>("[data-pf-line]")
          .forEach((el, idx) => {
            const dir = Number(el.dataset.pfLine);
            const x = dir * eased * window.innerWidth * (0.22 + idx * 0.04);
            const skew = dir * eased * -10;
            el.style.transform = `translate3d(${x}px, ${eased * idx * -14}px, 0) skewX(${skew}deg)`;
            el.style.opacity = String(1 - eased * 0.9);
          });
        heroTitleRef.current.style.filter = `blur(${eased * 6}px)`;
      }

      if (statementRef.current) {
        const r = statementRef.current.getBoundingClientRect();
        const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
        const n = Math.round(
          Math.min(1, Math.max(0, p)) * STATEMENT_WORDS.length,
        );
        setLitWords((prev) => (prev === n ? prev : n));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="profil"
      className={`pf-root relative bg-white text-neutral-950 ${className}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .pf-root { overflow-x: clip; }
        .pf-root .pf-display {
          font-family: 'Anton', 'Bebas Neue', 'Arial Narrow', Impact, sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.005em;
        }
        .pf-line { display: block; overflow: hidden; padding-bottom: 0.08em; margin-bottom: -0.08em; }
        .pf-outline {
          color: transparent;
          -webkit-text-stroke: 2px var(--stroke, #0a0a0a);
        }
        @media (min-width: 768px) { .pf-outline { -webkit-text-stroke-width: 3px; } }

        /* ---- Keyframes ---- */
        @keyframes marquee-drift { from { transform: translateX(0%); } to { transform: translateX(-50%); } }
        .animate-marquee-slow { animation: marquee-drift 28s linear infinite; }
        .pf-marquee:hover .animate-marquee-slow { animation-play-state: paused; }

        @keyframes pf-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-22px) rotate(4deg); } }
        .pf-float { animation: pf-float 6s ease-in-out infinite; }

        @keyframes pf-spin { to { transform: rotate(405deg); } }
        .pf-spin-slow { animation: pf-spin 24s linear infinite; }

        @keyframes pf-pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(227,30,36,.6); } 70% { box-shadow: 0 0 0 8px rgba(227,30,36,0); } }
        .pf-dot { animation: pf-pulse-dot 2s ease-out infinite; }

        @keyframes pf-ring { 0% { box-shadow: 0 0 0 0 rgba(227,30,36,.55); } 100% { box-shadow: 0 0 0 22px rgba(227,30,36,0); } }
        .pf-cta { animation: pf-ring 2.2s ease-out infinite; position: relative; overflow: hidden; }
        .pf-cta::after {
          content: ""; position: absolute; inset: 0; width: 40%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-150%) skewX(-20deg);
          animation: pf-shine 3.2s ease-in-out infinite;
        }
        @keyframes pf-shine { 0%,60% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(350%) skewX(-20deg); } }

        @keyframes pf-letter-pop {
          0% { transform: translateY(115%) rotate(8deg); }
          60% { transform: translateY(-6%) rotate(-2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .pf-aino-letter { display: block; transform: translateY(115%); }
        .pf-aino-in .pf-aino-letter { animation: pf-letter-pop 1.1s cubic-bezier(0.34, 1.4, 0.64, 1) forwards; }
        .pf-aino-in .pf-aino-letter:hover { color: #E31E24; transition: color .3s; }

        @keyframes pf-badge-in { from { opacity: 0; transform: scale(.2) rotate(-180deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
        .pf-badge-in { animation: pf-badge-in 1.4s cubic-bezier(0.34, 1.4, 0.64, 1) .6s both; }

        .pf-card { transition: box-shadow .5s ease; }
        .pf-card:hover { box-shadow: 0 30px 60px -20px rgba(0,0,0,.35); }

        .pf-word { transition: opacity .45s ease, transform .6s cubic-bezier(0.16,1,0.3,1), filter .45s ease; }

        @media (prefers-reduced-motion: reduce) {
          .pf-root *, .pf-root *::before, .pf-root *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
          .pf-aino-letter { transform: none !important; }
        }
      `}</style>

      {/* Progress bar scroll */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
        <div
          ref={progressRef}
          className="h-full origin-left bg-red-600"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* ============================ HERO ============================ */}
      <div className="mx-auto max-w-[1400px] px-5 pb-4 pt-20 sm:px-8 md:pt-28">
        <h2
          ref={heroTitleRef}
          className="pf-display mt-6 text-[clamp(3.75rem,16vw,15rem)] leading-[0.88]"
        >
          <div data-pf-line="1" style={{ willChange: "transform, opacity" }}>
            <MaskLine animate={isVisible} delay={100}>
              Profil
            </MaskLine>
          </div>
          <div data-pf-line="-1" style={{ willChange: "transform, opacity" }}>
            <MaskLine className="text-red-600" animate={isVisible} delay={220}>
              SMK Telkom
            </MaskLine>
          </div>
          <div data-pf-line="1" style={{ willChange: "transform, opacity" }}>
            <MaskLine animate={isVisible} delay={340}>
              Medan
            </MaskLine>
          </div>
        </h2>
      </div>

      {/* =========================== MARQUEE =========================== */}
      <div className="pf-marquee overflow-hidden py-10 md:py-16">
        <Reveal from="scale">
          <div className="-ml-[5%] w-[110%] -rotate-1 border-y-2 border-neutral-950 bg-red-600 py-3 transition-transform duration-700 hover:-rotate-2 md:py-4">
            <div className="flex w-max whitespace-nowrap animate-marquee-slow">
              {[0, 1].map((g) => (
                <div
                  key={g}
                  className="flex shrink-0 items-center"
                  aria-hidden={g === 1}
                >
                  {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((word, i) => (
                    <React.Fragment key={`${g}-${i}`}>
                      <span
                        className={`pf-display px-5 text-4xl md:px-8 md:text-6xl ${
                          i % 2 === 0
                            ? "text-white"
                            : "pf-outline [--stroke:#fff]"
                        }`}
                      >
                        {word}
                      </span>
                      <span className="pf-spin-slow inline-block text-2xl text-neutral-950 md:text-4xl">
                        ✦
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ========================== STATEMENT ========================== */}
      <div className="mx-auto max-w-[1400px] px-5 pt-6 sm:px-8 md:pt-12">
        <p
          ref={statementRef}
          className="pf-display text-[clamp(1.9rem,6.2vw,5.5rem)] leading-[1.04]"
        >
          {STATEMENT_WORDS.map((w, i) => {
            const lit = i < litWords;
            return (
              <span
                key={i}
                style={{
                  opacity: lit ? 1 : 0.15,
                  filter: lit ? "blur(0px)" : "blur(2px)",
                  transform: lit ? "translateY(0)" : "translateY(0.2em)",
                }}
                className={`pf-word mr-[0.22em] inline-block ${
                  STATEMENT_HIGHLIGHT.has(w) ? "text-red-600 font-bold" : ""
                }`}
              >
                {w}
              </span>
            );
          })}
        </p>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5" from="left">
            <h3 className="pf-display mt-5 text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
              Membangun generasi unggul di era digital
            </h3>

            <div ref={heroMediaRef} className="relative mt-8 md:mt-10">
              <div
                ref={badgeRef}
                className="absolute -right-2 -top-8 z-10 h-20 w-20 sm:h-24 sm:w-24 md:-right-4 md:-top-10 md:h-28 md:w-28"
                aria-hidden="true"
              >
                <div
                  className={`h-full w-full ${mediaIn ? "pf-badge-in" : "opacity-0"}`}
                >
                  <div className="pf-spin-slow h-full w-full transition-transform duration-500 hover:scale-110">
                    <svg viewBox="0 0 200 200" className="h-full w-full">
                      <defs>
                        <path
                          id="pf-badge-path"
                          d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
                        />
                      </defs>
                      <circle cx="100" cy="100" r="98" fill="#0a0a0a" />
                      <text
                        fill="#fff"
                        fontSize="21"
                        fontFamily="'Anton', Impact, sans-serif"
                        letterSpacing="2"
                      >
                        <textPath
                          href="#pf-badge-path"
                          textLength="470"
                          lengthAdjust="spacing"
                        >
                          AKREDITASI A + ISO 9001 + TIK +
                        </textPath>
                      </text>
                      <circle cx="100" cy="100" r="50" fill="#E31E24" />
                      <text
                        x="100"
                        y="122"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="66"
                        fontFamily="'Anton', Impact, sans-serif"
                      >
                        A
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {!imageError ? (
                <div
                  style={{
                    transitionTimingFunction: EASE,
                    clipPath: mediaIn
                      ? "inset(0% 0% 0% 0% round 24px)"
                      : "inset(18% 12% 18% 12% round 60px)",
                  }}
                  className={`relative overflow-hidden border-2 border-neutral-950 bg-neutral-100 transition-all duration-[1600ms] ${
                    mediaIn ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    ref={heroImgRef}
                    src={imagePath}
                    alt="Profil SMK Telkom Medan"
                    onError={() => setImageError(true)}
                    style={{
                      transform: "scale(1.08)",
                      willChange: "transform",
                    }}
                    className="block aspect-[4/3] h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] border-2 border-dashed border-neutral-400 bg-neutral-50 text-center">
                  <div>
                    <p className="pf-display text-3xl">SMK Telkom Medan</p>
                    <p className="mt-1 text-sm font-medium text-neutral-500">
                      Gambar profil tidak ditemukan
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <div className="space-y-5 text-base font-medium leading-8 text-neutral-700 md:text-lg lg:col-span-7">
            <Reveal delay={100} from="right">
              <p>
                <strong className="font-bold text-neutral-950">
                  SMK Telkom Medan
                </strong>{" "}
                adalah sekolah menengah kejuruan unggulan di bidang Teknologi
                Informasi dan Komunikasi (TIK) di bawah naungan Yayasan
                Pendidikan Telkom. Berdiri dengan semangat mencetak generasi
                profesional dan kompeten di era digital, SMK Telkom Medan telah
                terakreditasi{" "}
                <strong className="font-bold text-red-600">
                  &quot;A&quot;
                </strong>{" "}
                dan mengimplementasikan standar mutu pendidikan berbasis ISO
                9001.
              </p>
            </Reveal>

            <Reveal delay={200} from="right">
              <p>
                Dengan mengusung moto{" "}
                <strong className="font-bold text-neutral-950">
                  AINO (AKHLAK is Number One)
                </strong>{" "}
                dan nilai-nilai{" "}
                <strong className="font-bold text-neutral-950">
                  D&apos;REAL ICT
                </strong>{" "}
                (Discipline, Religious, Awareness, Learned, Innovative,
                Communicative, Tolerance), sekolah ini berkomitmen untuk
                mengembangkan potensi siswa dalam aspek akademik, keterampilan,
                dan karakter.
              </p>
            </Reveal>

            <Reveal delay={300} from="right">
              <p>
                Sebagai institusi pendidikan yang terus berkembang, SMK Telkom
                Medan berkomitmen untuk melibatkan seluruh komponen sekolah
                dalam mewujudkan visi menjadi pusat pendidikan teknologi yang
                disiplin, religius, dan inovatif, sekaligus menjadi teladan
                dalam membangun toleransi dan komunikasi yang baik di
                masyarakat.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ====================== CREDENTIAL STACK ====================== */}
      <div className="mx-auto mt-28 max-w-[1400px] px-5 sm:px-8 md:mt-44">
        <h3 className="pf-display mt-5 text-[clamp(3rem,11vw,10rem)] leading-[0.9]">
          <ScrollMask delay={100}>Unggul</ScrollMask>
          <ScrollMask delay={200}>
            dan <span className="text-red-600">teruji</span>
          </ScrollMask>
        </h3>

        <div className="mt-10 md:mt-16">
          {HIGHLIGHTS.map((item, i) => (
            <CredentialCard
              key={item.id}
              item={item}
              index={i}
              total={HIGHLIGHTS.length}
            />
          ))}
        </div>
      </div>

      {/* ============================= AINO ============================ */}
      <div className="mx-auto mt-20 max-w-[1400px] px-5 sm:px-8 md:mt-36">
        <div
          ref={ainoRef}
          className={`relative overflow-hidden rounded-[2rem] border-2 border-neutral-950 bg-neutral-950 px-6 py-14 text-white transition-all duration-[1400ms] sm:px-10 md:rounded-[3rem] md:px-16 md:py-24 ${
            ainoIn ? "pf-aino-in scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          style={{ transitionTimingFunction: EASE }}
        >
          <div
            className={`absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600 transition-transform duration-[1800ms] md:-right-32 md:-top-32 md:h-[30rem] md:w-[30rem] ${
              ainoIn ? "scale-100" : "scale-0"
            }`}
            style={{ transitionTimingFunction: EASE }}
          >
            <div className="pf-float h-full w-full rounded-full" />
          </div>
          <div className="pf-spin-slow absolute -bottom-16 left-[38%] h-40 w-40 rotate-45 border-2 border-white/30 md:h-64 md:w-64" />

          <div className="relative">
            <h3 className="pf-display mt-6 flex text-[clamp(7rem,34vw,30rem)] leading-[0.85]">
              <span className="sr-only">AINO</span>
              {"AINO".split("").map((l, i) => (
                <span key={i} aria-hidden="true" className="pf-line">
                  <span
                    style={{ animationDelay: `${i * 140 + 300}ms` }}
                    className="pf-aino-letter cursor-default"
                  >
                    {l}
                  </span>
                </span>
              ))}
            </h3>

            <p
              style={{
                transitionDelay: "1200ms",
                transitionTimingFunction: EASE,
              }}
              className={`pf-display mt-4 text-3xl leading-none transition-all duration-1000 sm:text-5xl md:text-7xl ${
                ainoIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <span className="text-red-500">AKHLAK</span>{" "}
              <span className="pf-outline [--stroke:#fff]">is</span> Number One
            </p>

            <p
              style={{
                transitionDelay: "1450ms",
                transitionTimingFunction: EASE,
              }}
              className={`mt-6 max-w-xl text-base font-medium leading-7 text-white/80 transition-all duration-1000 md:text-lg md:leading-8 ${
                ainoIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Menjadikan nilai akhlak sebagai landasan dalam membentuk peserta
              didik yang berintegritas dan berkarakter.
            </p>
          </div>
        </div>
      </div>

      {/* =========================== D'REAL ICT ========================= */}
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-24 sm:px-8 md:pb-36 md:pt-40">
        <Reveal></Reveal>
        <h3 className="pf-display mt-5 text-[clamp(3.25rem,13vw,12rem)] leading-[0.9]">
          <ScrollMask delay={100}>
            D&apos;<span className="text-red-600">REAL</span> ICT
          </ScrollMask>
        </h3>
        <Reveal delay={200}>
          <p className="mt-4 max-w-xl text-base font-medium text-neutral-700 md:text-lg">
            Nilai yang menjadi bagian dari karakter siswa SMK Telkom Medan.
            Pilih satu huruf untuk melihat maknanya.
          </p>
        </Reveal>

        <div
          ref={listRef}
          className="mt-10 border-b-2 border-neutral-950 md:mt-14"
        >
          {DREAL_ITEMS.map((item, index) => {
            const active = activeDReal.letter === item.letter;
            return (
              <div
                key={item.letter}
                style={{
                  transitionDelay: listIn ? `${index * 90}ms` : "0ms",
                  transitionTimingFunction: EASE,
                }}
                className={`group border-t-2 border-neutral-950 transition-all duration-700 ${
                  listIn
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-16 opacity-0"
                } ${active ? "bg-neutral-950 text-white" : "hover:bg-[#FFE7E1]"}`}
              >
                <button
                  type="button"
                  id={`dreal-btn-${item.letter}`}
                  aria-expanded={active}
                  aria-controls={`dreal-panel-${item.letter}`}
                  onClick={() => setActiveDReal(item)}
                  className="flex w-full items-center gap-4 px-3 py-4 text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-red-600 sm:gap-8 sm:px-6 md:py-6"
                >
                  <span
                    className={`hidden w-8 text-sm font-bold sm:block ${
                      active ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`pf-display inline-block w-[0.8em] text-6xl leading-none text-red-600 transition-transform duration-500 sm:text-7xl md:text-8xl ${
                      active
                        ? "scale-110 -rotate-6"
                        : "group-hover:-translate-y-1 group-hover:scale-110"
                    }`}
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {item.letter}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`pf-display block truncate text-2xl leading-none transition-transform duration-500 sm:text-4xl md:text-6xl ${
                        active ? "translate-x-3" : "group-hover:translate-x-3"
                      }`}
                      style={{ transitionTimingFunction: EASE }}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`mt-1.5 block text-xs font-bold tracking-wide sm:text-sm ${
                        active ? "text-white/70" : "text-neutral-500"
                      }`}
                    >
                      {item.indonesian}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 leading-none transition-all duration-500 md:h-14 md:w-14 ${
                      active
                        ? "rotate-180 border-white bg-red-600 text-white"
                        : "border-neutral-950 text-neutral-950 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 md:h-6 md:w-6"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`dreal-panel-${item.letter}`}
                  role="region"
                  aria-labelledby={`dreal-btn-${item.letter}`}
                  aria-hidden={!active}
                  style={{
                    gridTemplateRows: active ? "1fr" : "0fr",
                    transitionTimingFunction: EASE,
                  }}
                  className="grid transition-[grid-template-rows] duration-700"
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      style={{
                        transitionDelay: active ? "150ms" : "0ms",
                        transitionTimingFunction: EASE,
                      }}
                      className={`max-w-2xl px-3 pb-7 text-base font-medium leading-7 text-white/85 transition-all duration-700 sm:pl-[7.5rem] md:pl-[11rem] md:text-lg md:leading-8 ${
                        active
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {onExploreMore && (
          <Reveal
            className="mt-12 flex justify-center md:justify-end"
            from="scale"
          >
            <button
              type="button"
              onClick={onExploreMore}
              className="pf-cta group inline-flex items-center gap-5 rounded-full border-2 border-neutral-950 bg-red-600 py-2 pl-7 pr-2 text-sm font-bold text-white outline-none transition-all duration-300 hover:scale-105 hover:bg-neutral-950 focus-visible:ring-4 focus-visible:ring-red-300 active:scale-95 md:text-base"
            >
              Info Pendaftaran
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-950 transition-transform duration-500 group-hover:rotate-45 md:h-12 md:w-12">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
