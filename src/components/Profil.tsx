import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
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

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

/** One line of a masked headline: parent clips, child slides up. */
function MaskLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="pf-line">
      <span data-line className={`block will-change-transform ${className}`}>
        {children}
      </span>
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
      <span className="h-2 w-2 rounded-full bg-red-600" />
      {children}
    </span>
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
  const firstRun = useRef(true);

  const [activeDReal, setActiveDReal] = useState<DRealItem>(DREAL_ITEMS[0]);
  const [imageError, setImageError] = useState(false);

  const imagePath =
    heroImageUrl || new URL("../assets/profil.png", import.meta.url).href;

  /* ------------------------------ Main motion ----------------------------- */
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const q = <T extends Element = HTMLElement>(sel: string) =>
      gsap.utils.toArray<T>(sel, root);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Masked headline lines (hero, section titles, AINO letters)
      q("[data-lines]").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll("[data-line]"),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: { trigger: group, start: "top 88%", once: true },
          },
        );
      });

      // 2. Generic reveal, batched so items in view enter together
      const reveals = q("[data-reveal]");
      gsap.set(reveals, { opacity: 0, y: 36 });
      ScrollTrigger.batch(reveals, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: true,
          }),
      });

      // 3. Hero media: scales up + rounds off while scrolling in, inner zoom out
      const media = root.querySelector<HTMLElement>("[data-hero-img]");
      const mediaInner = root.querySelector<HTMLElement>("[data-hero-inner]");
      if (media) {
        gsap.fromTo(
          media,
          { scale: 0.86, borderRadius: "80px" },
          {
            scale: 1,
            borderRadius: "36px",
            ease: "none",
            scrollTrigger: {
              trigger: media,
              start: "top 98%",
              end: "top 35%",
              scrub: true,
            },
          },
        );
      }
      if (mediaInner) {
        gsap.fromTo(
          mediaInner,
          { scale: 1.18 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mediaInner,
              start: "top 98%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        );
      }

      // 4. Sticker badge spins with scroll progress
      const badge = root.querySelector<HTMLElement>("[data-badge]");
      if (badge) {
        gsap.to(badge, {
          rotation: 540,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      }

      // 5. Marquee: constant drift, boosted by scroll velocity & direction
      const track = root.querySelector<HTMLElement>("[data-marquee]");
      if (track) {
        const drift = gsap.to(track, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
        ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 4);
            gsap.to(drift, {
              timeScale: self.direction * boost,
              duration: 0.2,
              overwrite: true,
            });
            gsap.to(drift, {
              timeScale: self.direction,
              duration: 1,
              delay: 0.2,
              overwrite: false,
            });
          },
        });
      }

      // 6. Statement: words light up as you scroll
      const words = q("[data-word]");
      const statement = root.querySelector<HTMLElement>("[data-statement]");
      if (statement && words.length) {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: statement,
              start: "top 78%",
              end: "bottom 50%",
              scrub: true,
            },
          },
        );
      }

      // 7. Stacking credential cards: previous card shrinks as next covers it
      const cards = q("[data-stack-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.93,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top 20%",
            scrub: true,
          },
        });
      });

      // 8. AINO: parallax shapes
      q("[data-aino-shape]").forEach((el, i) => {
        gsap.to(el, {
          yPercent: i % 2 === 0 ? -35 : 30,
          rotation: i % 2 === 0 ? 0 : 90,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-aino]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // 9. D'REAL rows enter in sequence
      const rows = q("[data-dreal-row]");
      gsap.set(rows, { opacity: 0, y: 40 });
      ScrollTrigger.batch(rows, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            overwrite: true,
          }),
      });
    });

    // Fonts & images change layout height, so recalc trigger positions
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, []);

  /* --------------------- D'REAL accordion open / close -------------------- */
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.utils
      .toArray<HTMLElement>("[data-dreal-panel]", root)
      .forEach((panel) => {
        const open = panel.dataset.letter === activeDReal.letter;
        const to = { height: open ? "auto" : 0, opacity: open ? 1 : 0 };

        if (firstRun.current || reduce) {
          gsap.set(panel, to);
        } else {
          gsap.to(panel, {
            ...to,
            duration: 0.55,
            ease: "power3.inOut",
            overwrite: true,
            onComplete: () => ScrollTrigger.refresh(),
          });
        }
      });

    firstRun.current = false;
  }, [activeDReal]);

  /* -------------------------------- Render -------------------------------- */
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
      `}</style>

      {/* ============================ HERO ============================ */}
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-20 sm:px-8 md:pt-28">
        <div data-reveal>
          <Pill>Profil sekolah</Pill>
        </div>

        <h2
          data-lines
          className="pf-display mt-6 text-[clamp(3.75rem,16vw,15rem)] leading-[0.88]"
        >
          <MaskLine>Profil</MaskLine>
          <MaskLine className="text-red-600">SMK Telkom</MaskLine>
          <MaskLine>Medan</MaskLine>
        </h2>

        <div
          data-reveal
          className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-lg font-medium leading-7 text-neutral-700 md:text-xl">
            Membangun generasi profesional, kompeten, dan berkarakter di era
            digital.
          </p>

          <div className="flex flex-wrap gap-2">
            {["Akreditasi A", "ISO 9001", "Spesialisasi TIK"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hero media */}
        <div className="relative mt-12 md:mt-16">
          {/* Rotating sticker */}
          <div
            data-badge
            className="absolute -top-8 right-2 z-10 h-24 w-24 sm:-top-10 sm:right-6 sm:h-32 sm:w-32 md:-top-16 md:right-12 md:h-44 md:w-44"
            aria-hidden="true"
          >
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

          {!imageError ? (
            <div
              data-hero-img
              className="relative overflow-hidden border-2 border-neutral-950 bg-neutral-100"
              style={{ borderRadius: 36 }}
            >
              <div data-hero-inner>
                <img
                  src={imagePath}
                  alt="Profil SMK Telkom Medan"
                  onLoad={() => ScrollTrigger.refresh()}
                  onError={() => setImageError(true)}
                  className="block h-auto w-full object-contain"
                />
              </div>

              <div className="absolute bottom-4 left-4 rounded-2xl border-2 border-neutral-950 bg-white px-4 py-2.5 sm:bottom-6 sm:left-6">
                <p className="text-xs font-bold sm:text-sm">SMK Telkom Medan</p>
                <p className="mt-0.5 text-[11px] font-medium text-neutral-600 sm:text-xs">
                  Pendidikan teknologi &amp; karakter
                </p>
              </div>
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-[36px] border-2 border-dashed border-neutral-400 bg-neutral-50 text-center">
              <div>
                <p className="pf-display text-3xl">SMK Telkom Medan</p>
                <p className="mt-1 text-sm font-medium text-neutral-500">
                  Gambar profil tidak ditemukan
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================== MARQUEE =========================== */}
      <div className="overflow-hidden py-10 md:py-16">
        <div className="-ml-[5%] w-[110%] -rotate-1 border-y-2 border-neutral-950 bg-red-600 py-3 md:py-4">
          <div data-marquee className="flex w-max whitespace-nowrap">
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
                    <span className="text-2xl text-neutral-950 md:text-4xl">
                      ✦
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================== STATEMENT ========================== */}
      <div className="mx-auto max-w-[1400px] px-5 pt-6 sm:px-8 md:pt-12">
        <p
          data-statement
          className="pf-display text-[clamp(1.9rem,6.2vw,5.5rem)] leading-[1.04]"
        >
          {STATEMENT.split(" ").map((w, i) => (
            <span
              key={i}
              data-word
              className={`mr-[0.22em] inline-block ${
                STATEMENT_HIGHLIGHT.has(w) ? "text-red-600" : ""
              }`}
            >
              {w}
            </span>
          ))}
        </p>

        {/* Detail text */}
        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-5">
            <Pill>Mengenal lebih dekat</Pill>
            <h3 className="pf-display mt-5 text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
              Membangun generasi unggul di era digital
            </h3>
          </div>

          <div
            data-reveal
            className="space-y-5 text-base font-medium leading-8 text-neutral-700 md:text-lg lg:col-span-7"
          >
            <p>
              <strong className="font-bold text-neutral-950">
                SMK Telkom Medan
              </strong>{" "}
              adalah sekolah menengah kejuruan unggulan di bidang Teknologi
              Informasi dan Komunikasi (TIK) di bawah naungan Yayasan Pendidikan
              Telkom. Berdiri dengan semangat mencetak generasi profesional dan
              kompeten di era digital, SMK Telkom Medan telah terakreditasi{" "}
              <strong className="font-bold text-red-600">&quot;A&quot;</strong>{" "}
              dan mengimplementasikan standar mutu pendidikan berbasis ISO 9001.
            </p>

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

            <p>
              Sebagai institusi pendidikan yang terus berkembang, SMK Telkom
              Medan berkomitmen untuk melibatkan seluruh komponen sekolah dalam
              mewujudkan visi menjadi pusat pendidikan teknologi yang disiplin,
              religius, dan inovatif, sekaligus menjadi teladan dalam membangun
              toleransi dan komunikasi yang baik di masyarakat.
            </p>
          </div>
        </div>
      </div>

      {/* ====================== CREDENTIAL STACK ====================== */}
      <div className="mx-auto mt-28 max-w-[1400px] px-5 sm:px-8 md:mt-44">
        <div data-reveal>
          <Pill>Kredensial</Pill>
        </div>
        <h3
          data-lines
          className="pf-display mt-5 text-[clamp(3rem,11vw,10rem)] leading-[0.9]"
        >
          <MaskLine>Unggul</MaskLine>
          <MaskLine>
            dan <span className="text-red-600">teruji</span>
          </MaskLine>
        </h3>

        <div className="mt-10 md:mt-16">
          {HIGHLIGHTS.map((item, i) => {
            const t = THEMES[item.theme];
            return (
              <article
                key={item.id}
                data-stack-card
                style={{ top: `calc(5.5rem + ${i * 0.9}rem)`, zIndex: i + 1 }}
                className={`sticky mb-8 flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-neutral-950 p-6 sm:p-10 md:mb-14 md:min-h-[28rem] md:rounded-[2.5rem] md:p-14 ${t.card}`}
              >
                <span
                  aria-hidden="true"
                  className={`pf-display pf-outline pointer-events-none absolute -bottom-4 right-2 select-none text-[9rem] leading-none sm:text-[14rem] md:-bottom-14 md:right-8 md:text-[26rem] ${t.stroke}`}
                >
                  {item.mark}
                </span>

                <div className="relative flex flex-1 flex-col justify-between gap-12">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-bold sm:text-sm ${t.pill}`}
                    >
                      {item.label}
                    </span>
                    <span className="pf-display text-xl sm:text-3xl">
                      {i + 1}/{HIGHLIGHTS.length}
                    </span>
                  </div>

                  <div>
                    <h4 className="pf-display text-[clamp(3rem,10vw,8rem)] leading-[0.9]">
                      {item.title}
                    </h4>
                    <p className="mt-5 max-w-xl text-base font-medium leading-7 md:text-lg md:leading-8">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ============================= AINO ============================ */}
      <div className="mx-auto mt-20 max-w-[1400px] px-5 sm:px-8 md:mt-36">
        <div
          data-aino
          className="relative overflow-hidden rounded-[2rem] border-2 border-neutral-950 bg-neutral-950 px-6 py-14 text-white sm:px-10 md:rounded-[3rem] md:px-16 md:py-24"
        >
          <div
            data-aino-shape
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600 md:-right-32 md:-top-32 md:h-[30rem] md:w-[30rem]"
          />
          <div
            data-aino-shape
            className="absolute -bottom-16 left-[38%] h-40 w-40 rotate-45 border-2 border-white/30 md:h-64 md:w-64"
          />

          <div className="relative">
            <Pill tone="dark">Moto utama sekolah</Pill>y
            

            <h3
              data-lines
              className="pf-display mt-6 flex text-[clamp(7rem,34vw,30rem)] leading-[0.85]"
            >
              <span className="sr-only">AINO</span>
              {"AINO".split("").map((l, i) => (
                <span key={i} aria-hidden="true" className="pf-line">
                  <span data-line className="block will-change-transform">
                    {l}
                  </span>
                </span>
              ))}
            </h3>

            <p
              data-reveal
              className="pf-display mt-4 text-3xl leading-none sm:text-5xl md:text-7xl"
            >
              <span className="text-red-500">AKHLAK</span>{" "}
              <span className="pf-outline [--stroke:#fff]">is</span> Number One
            </p>

            <p
              data-reveal
              className="mt-6 max-w-xl text-base font-medium leading-7 text-white/80 md:text-lg md:leading-8"
            >
              Menjadikan nilai akhlak sebagai landasan dalam membentuk peserta
              didik yang berintegritas dan berkarakter.
            </p>
          </div>
        </div>
      </div>

      {/* =========================== D'REAL ICT ========================= */}
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-24 sm:px-8 md:pb-36 md:pt-40">
        <div data-reveal>
          <Pill>Karakter siswa</Pill>
        </div>
        <h3
          data-lines
          className="pf-display mt-5 text-[clamp(3.25rem,13vw,12rem)] leading-[0.9]"
        >
          <MaskLine>
            D&apos;<span className="text-red-600">REAL</span> ICT
          </MaskLine>
        </h3>
        <p
          data-reveal
          className="mt-4 max-w-xl text-base font-medium text-neutral-700 md:text-lg"
        >
          Nilai yang menjadi bagian dari karakter siswa SMK Telkom Medan. Pilih
          satu huruf untuk melihat maknanya.
        </p>

        <div className="mt-10 border-b-2 border-neutral-950 md:mt-14">
          {DREAL_ITEMS.map((item, index) => {
            const active = activeDReal.letter === item.letter;
            return (
              <div
                key={item.letter}
                data-dreal-row
                className={`border-t-2 border-neutral-950 transition-colors duration-300 ${
                  active ? "bg-neutral-950 text-white" : "hover:bg-[#FFE7E1]"
                }`}
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

                  <span className="pf-display w-[0.8em] text-6xl leading-none text-red-600 sm:text-7xl md:text-8xl">
                    {item.letter}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="pf-display block truncate text-2xl leading-none sm:text-4xl md:text-6xl">
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
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-2xl leading-none transition-transform duration-500 md:h-14 md:w-14 ${
                      active
                        ? "rotate-45 border-white bg-red-600"
                        : "border-neutral-950"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`dreal-panel-${item.letter}`}
                  role="region"
                  aria-labelledby={`dreal-btn-${item.letter}`}
                  data-dreal-panel
                  data-letter={item.letter}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl px-3 pb-7 text-base font-medium leading-7 text-white/85 sm:pl-[7.5rem] md:pl-[11rem] md:text-lg md:leading-8">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {onExploreMore && (
          <div data-reveal className="mt-12 flex justify-center md:justify-end">
            <button
              type="button"
              onClick={onExploreMore}
              className="group inline-flex items-center gap-5 rounded-full border-2 border-neutral-950 bg-red-600 py-2 pl-7 pr-2 text-sm font-bold text-white outline-none transition-colors duration-300 hover:bg-neutral-950 focus-visible:ring-4 focus-visible:ring-red-300 md:text-base"
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
          </div>
        )}
      </div>
    </section>
  );
}
