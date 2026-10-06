import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Cable,
  Cpu,
  Flame,
  Network,
  Router,
  ShieldCheck,
  Wifi,
  X,
  ZoomIn,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Gambar sertifikat (auto-import Vite) ───────────── */
const images = import.meta.glob<{ default: string }>(
  "../assets/mikrotik/*.jpg",
  { eager: true },
);

const imageByFile: Record<string, string> = Object.fromEntries(
  Object.entries(images).map(([path, mod]) => [
    path.split("/").pop() as string,
    mod.default,
  ]),
);

interface Certificate {
  name: string;
  track: "MTCNA" | "MTCRE";
  number: string;
  date: string;
  file: string;
}

const CERTIFICATES: Certificate[] = [
  {
    name: "Khairunnisa Alwita",
    track: "MTCNA",
    number: "2311NA6854",
    date: "02 Nov 2023",
    file: "Serfikat-MTCNA-Khairunnisa-Alwita-1.jpg",
  },
  {
    name: "Muhammad Sobri Ali Wardana",
    track: "MTCNA",
    number: "1912NA5422",
    date: "12 Des 2019",
    file: "Serfikat-MTCNA-Sobri.jpg",
  },
  {
    name: "Ikhwan El Akmal Pakpahan",
    track: "MTCNA",
    number: "2302NA4988",
    date: "23 Feb 2023",
    file: "Sertifikat-MTCNA-kemal-1.jpg",
  },
  {
    name: "Ikhwan El Akmal Pakpahan",
    track: "MTCRE",
    number: "2302RE5200",
    date: "24 Feb 2023",
    file: "sertifikat-MTCRE-kemal-1.jpg",
  },
];

/* ───────────── Keunggulan ───────────── */
const PILLARS = [
  {
    number: "01",
    icon: BadgeCheck,
    title: "Ujian MTCNA gratis",
    desc: "Siswa TKJ mengikuti ujian sertifikasi MTCNA tanpa biaya tambahan, langsung di sekolah.",
  },
  {
    number: "02",
    icon: BookOpenCheck,
    title: "Kurikulum resmi terintegrasi",
    desc: "Materi resmi MikroTik berjalan seiring kurikulum jurusan, bukan kelas tambahan terpisah.",
  },
  {
    number: "03",
    icon: Router,
    title: "Lab RouterBoard real device",
    desc: "Praktik memakai perangkat RouterBoard asli, dari konfigurasi dasar sampai skenario jaringan penuh.",
  },
  {
    number: "04",
    icon: Award,
    title: "Sertifikat diakui industri",
    desc: "Gelar MTCNA dan MTCRE dikenal perusahaan jaringan dan ISP di Indonesia maupun luar negeri.",
  },
];

/* ───────────── Silabus MTCNA ───────────── */
const MODULES = [
  {
    number: "01",
    icon: Cpu,
    title: "RouterOS Basics",
    summary:
      "Mengenal RouterOS, mengakses perangkat, dan menyusun konfigurasi dasar.",
    topics: [
      "Winbox, WebFig, dan terminal",
      "Konfigurasi default dan reset",
      "Alamat IP, ARP, dan DHCP",
      "Backup, restore, dan Netinstall",
      "Manajemen paket dan pengguna",
    ],
  },
  {
    number: "02",
    icon: Network,
    title: "Bridging & Routing",
    summary:
      "Menghubungkan segmen jaringan dan mengarahkan lalu lintas antar-subnet.",
    topics: [
      "Bridge dan port",
      "Static routing",
      "Gateway dan routing table",
      "Dasar VLAN pada bridge",
    ],
  },
  {
    number: "03",
    icon: Wifi,
    title: "Network Wireless",
    summary:
      "Membangun dan mengamankan jaringan nirkabel dengan perangkat MikroTik.",
    topics: [
      "Standar 802.11 dan frekuensi",
      "Mode Access Point dan Station",
      "Wireless security dan access list",
      "Troubleshooting sinyal",
    ],
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Firewall & QoS",
    summary: "Mengamankan jaringan dan mengatur pembagian bandwidth.",
    topics: [
      "Filter rule dan connection tracking",
      "NAT: srcnat dan dstnat",
      "Address list",
      "Simple queue dan limit bandwidth",
    ],
  },
  {
    number: "05",
    icon: Cable,
    title: "Tunnels & MikroTik Tools",
    summary: "Menghubungkan lokasi berbeda dan memantau kondisi jaringan.",
    topics: [
      "PPP, PPPoE, dan PPTP",
      "Ping, traceroute, dan torch",
      "Bandwidth test",
      "Graphing dan monitoring",
    ],
  },
];

export default function MikrotikAcademyPage() {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const modulePanelRef = useRef<HTMLDivElement>(null);
  const moduleContentRef = useRef<HTMLDivElement>(null);
  const moduleTitleRef = useRef<HTMLHeadingElement>(null);
  const moduleSummaryRef = useRef<HTMLParagraphElement>(null);
  const moduleTopicsRef = useRef<HTMLUListElement>(null);
  const moduleButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const moduleHasMountedRef = useRef(false);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState(0);

  const certs = useMemo(
    () =>
      CERTIFICATES.map((c) => ({
        ...c,
        src: imageByFile[c.file] as string | undefined,
      })),
    [],
  );

  const closeBox = useCallback(() => setLightbox(null), []);

  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) =>
        i === null ? i : (i + dir + certs.length) % certs.length,
      ),
    [certs.length],
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  /* ───────────── GSAP storytelling animation ───────────── */
  useLayoutEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      /* Award-site style: smooth page entrance */
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .from(".mk-page", { opacity: 0, duration: 0.35 })
        .from(".mk-hero-kicker", { y: 30, opacity: 0, duration: 0.7 })
        .from(
          ".mk-hero-title-line",
          {
            yPercent: 120,
            opacity: 0,
            duration: 1.05,
            stagger: 0.11,
          },
          "-=0.45",
        );

      /* Floating progress line — lightweight, no layout animation */
      gsap.to(".mk-progress-bar", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });

      /* Scroll progress number */
      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const value = Math.round(self.progress * 100);
          const node = document.querySelector(".mk-progress-value");
          if (node) node.textContent = String(value).padStart(2, "0");
        },
      });

      /* Magnetic buttons / links */
      gsap.utils.toArray<HTMLElement>(".mk-magnetic").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(el, "y", {
          duration: 0.45,
          ease: "power3.out",
        });

        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.12);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.12);
        };

        const leave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);

        return () => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        };
      });

      /* Hero depth */
      gsap.to(".mk-hero-copy, .mk-hero-actions", {
        yPercent: -18,
        opacity: 0.75,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* Big typography moves slower than the viewport */
      gsap.to(".mk-hero-title-line", {
        xPercent: -3,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.from(".mk-story-word", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".mk-story-heading",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".mk-section-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".mk-section-line",
          start: "top 85%",
          once: true,
        },
      });

      gsap.fromTo(
        ".mk-cert-image",
        { scale: 1.035 },
        {
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "#sertifikat",
            start: "top 82%",
            once: true,
          },
        },
      );

      /* Image/card tilt only while hovering */
      gsap.utils.toArray<HTMLElement>(".mk-tilt").forEach((card) => {
        const image = card.querySelector<HTMLElement>(".mk-tilt-image");
        const move = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateY: px * 5,
            rotateX: -py * 5,
            duration: 0.45,
            ease: "power3.out",
            transformPerspective: 900,
          });
          if (image) {
            gsap.to(image, {
              x: px * 10,
              y: py * 10,
              scale: 1.035,
              duration: 0.45,
              ease: "power3.out",
            });
          }
        };
        const leave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.65,
            ease: "elastic.out(1, .65)",
          });
          if (image)
            gsap.to(image, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: "power3.out",
            });
        };
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
      });

      /* Section-to-section cinematic scale */
      gsap.utils.toArray<HTMLElement>(".mk-cinematic").forEach((section) => {
        gsap.fromTo(
          section,
          { clipPath: "inset(7% 0% 7% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 45%",
              scrub: 1,
            },
          },
        );
      });

      gsap.from(".mk-big-number", {
        xPercent: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".mk-big-number",
          start: "top 80%",
          once: true,
        },
      });

      gsap.to(".mk-cta-glow", {
        y: -50,
        x: 40,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.from(".mk-final-title span", {
        yPercent: 110,
        opacity: 0,
        stagger: 0.09,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".mk-final-title",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".mk-hero-kicker", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".mk-hero-title-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.05,
        stagger: 0.1,
        delay: 0.08,
        ease: "power4.out",
      });

      gsap.from(".mk-hero-copy, .mk-hero-actions", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(".mk-orbit", {
        scale: 0.7,
        opacity: 0,
        rotation: -25,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.to(".mk-orbit-inner", {
        rotation: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".mk-hero-grid", {
        yPercent: 15,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>(".mk-reveal").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".mk-reveal-stagger").forEach((group) => {
        gsap.from(group.children, {
          y: 45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 82%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".mk-marquee").forEach((el) => {
        gsap.to(el, {
          xPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeBox, step]);

  useEffect(() => {
    if (!lightboxRef.current) return;

    if (lightbox !== null) {
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
      );
    }
  }, [lightbox]);

  const current = lightbox !== null ? certs[lightbox] : null;
  const mod = MODULES[activeModule];

  /*
   * Anime.js module transition
   * Hanya menganimasikan transform/opacity agar perpindahan tetap ringan.
   */
  useEffect(() => {
    if (!moduleHasMountedRef.current) {
      moduleHasMountedRef.current = true;
      return;
    }

    const panel = modulePanelRef.current;
    const content = moduleContentRef.current;
    const title = moduleTitleRef.current;
    const summary = moduleSummaryRef.current;
    const topics = moduleTopicsRef.current;

    if (!panel || !content || !title || !summary || !topics) return;

    const topicItems = Array.from(topics.children);
    const button = moduleButtonsRef.current[activeModule];
    const previousButtons = moduleButtonsRef.current.filter(
      (item, index) => item && index !== activeModule,
    );

    // Panel diberi sedikit depth saat modul berganti.
    animate(panel, {
      scale: [0.985, 1],
      duration: 650,
      ease: "out(4)",
    });

    // Konten lama keluar lalu konten React yang baru masuk dengan reveal.
    animate(content, {
      opacity: [0, 1],
      translateY: [34, 0],
      duration: 620,
      ease: "out(4)",
    });

    animate(title, {
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 700,
      ease: "out(4)",
    });

    animate(summary, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 560,
      delay: 90,
      ease: "out(4)",
    });

    animate(topicItems, {
      opacity: [0, 1],
      translateX: [22, 0],
      duration: 500,
      delay: (_el, index) => 150 + index * 65,
      ease: "out(4)",
    });

    if (button) {
      animate(button, {
        scale: [0.985, 1.015, 1],
        duration: 560,
        ease: "out(4)",
      });

      const icon = button.querySelector<HTMLElement>("[data-module-icon]");
      if (icon) {
        animate(icon, {
          scale: [0.72, 1.08, 1],
          rotate: [-8, 0],
          duration: 620,
          ease: "out(4)",
        });
      }
    }

    previousButtons.forEach((item) => {
      if (!item) return;

      animate(item, {
        scale: [1.01, 1],
        duration: 360,
        ease: "out(3)",
      });
    });
  }, [activeModule]);

  return (
    <main ref={pageRef} className="mk-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mk-page {
          --telkom-red: #e31e24;
          --telkom-red-dark: #b90f16;
          --ink: #171717;
          --muted: #6d6d6d;
          --line: rgba(23,23,23,.14);
          --soft: #f4f4f1;
          --paper: #fafaf7;
          background: var(--paper);
          color: var(--ink);
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          overflow: hidden;
        }

        .mk-serif {
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          letter-spacing: -.035em;
        }

        .mk-mono {
          font-family: 'DM Mono', monospace;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .mk-grid {
          background-image:
            linear-gradient(to right, rgba(23,23,23,.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(23,23,23,.055) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .mk-line {
          border-color: var(--line);
        }

        .mk-outline {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent;
        }

        .mk-outline-white {
          -webkit-text-stroke: 1.5px rgba(255,255,255,.85);
          color: transparent;
        }

        .mk-clip {
          overflow: hidden;
        }

        .mk-hero-title-line {
          display: block;
          transform: translateZ(0);
        }

        .mk-orbit {
          width: min(46vw, 560px);
          aspect-ratio: 1;
          border: 1px solid rgba(23,23,23,.18);
          border-radius: 50%;
          position: relative;
        }

        .mk-orbit::before,
        .mk-orbit::after {
          content: "";
          position: absolute;
          inset: 12%;
          border: 1px dashed rgba(227,30,36,.42);
          border-radius: 50%;
        }

        .mk-orbit::after {
          inset: 27%;
          border-style: solid;
          border-color: rgba(23,23,23,.12);
        }

        .mk-orbit-dot {
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: var(--telkom-red);
          box-shadow: 0 0 0 8px rgba(227,30,36,.10);
        }

        .mk-orbit-dot.one { top: 12%; left: 58%; }
        .mk-orbit-dot.two { bottom: 22%; left: 11%; background: var(--ink); }
        .mk-orbit-dot.three { right: 4%; bottom: 34%; }

        .mk-network-card {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 110px;
          border-radius: 22px;
          background: var(--ink);
          color: white;
          display: grid;
          place-items: center;
          box-shadow: 0 28px 70px rgba(0,0,0,.18);
        }

        .mk-network-card::after {
          content: "MIKROTIK";
          position: absolute;
          bottom: 14px;
          font: 500 9px 'DM Mono', monospace;
          letter-spacing: .18em;
          color: rgba(255,255,255,.45);
        }

        .mk-scanline {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 49.5%,
            rgba(227,30,36,.07) 50%,
            transparent 50.5%
          );
          background-size: 100% 10px;
          opacity: .6;
        }

        .mk-card-hover {
          transition: transform .45s cubic-bezier(.22,1,.36,1), border-color .35s ease, background-color .35s ease;
        }

        .mk-card-hover:hover {
          transform: translateY(-8px);
        }

        .mk-red-button {
          transition: transform .35s cubic-bezier(.22,1,.36,1), background-color .25s ease;
        }

        .mk-red-button:hover {
          transform: translateY(-3px);
          background: var(--telkom-red-dark);
        }

        .mk-arrow-link {
          transition: gap .35s ease, color .25s ease;
        }

        .mk-arrow-link:hover {
          gap: 14px;
          color: var(--telkom-red);
        }

        .mk-marquee {
          width: max-content;
        }

        @media (max-width: 768px) {
          .mk-orbit {
            width: min(88vw, 440px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mk-page * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ═════ HERO ═════ */}
      <section
        ref={heroRef}
        className="mk-cinematic relative min-h-screen overflow-hidden border-b mk-line"
      >
        <div className="mk-hero-grid mk-grid absolute inset-0 opacity-70" />
        <div className="mk-scanline" />

        <div className="relative mx-auto grid min-h-screen max-w-[1500px] items-center gap-14 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-20">
          <div className="lg:col-span-7">
            <div className="mk-hero-kicker mk-mono mb-8 flex items-center gap-3 text-[10px]">
              <span className="h-px w-10 bg-[var(--telkom-red)]" />
              Official certification journey
            </div>

            <div className="mk-clip">
              <h1 className="mk-serif text-[17vw] leading-[.76] sm:text-[13vw] lg:text-[9.6vw]">
                <span className="mk-hero-title-line">Connect.</span>
                <span className="mk-hero-title-line italic text-[var(--telkom-red)]">
                  Learn.
                </span>
                <span className="mk-hero-title-line mk-outline">Certify.</span>
              </h1>
            </div>

            <p className="mk-hero-copy mt-10 max-w-xl text-sm leading-7 text-black/60 sm:text-base">
              Perjalanan siswa SMK Telkom Medan untuk memahami dunia networking,
              berlatih menggunakan perangkat nyata, lalu membawa kompetensi
              MikroTik ke level sertifikasi internasional.
            </p>

            <div className="mk-hero-actions mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#cerita"
                className="mk-red-button mk-magnetic inline-flex items-center gap-3 rounded-full bg-[var(--telkom-red)] px-6 py-3.5 text-xs font-extrabold text-white"
              >
                Explore the journey <ArrowDown size={15} />
              </a>

              <Link
                to="/"
                className="mk-arrow-link inline-flex items-center gap-2 text-xs font-extrabold"
              >
                <ArrowLeft size={15} /> Kembali ke beranda
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:col-span-5">
            <div className="mk-orbit">
              <div className="mk-orbit-inner absolute inset-0">
                <span className="mk-orbit-dot one" />
                <span className="mk-orbit-dot two" />
                <span className="mk-orbit-dot three" />
              </div>

              <div className="mk-network-card">
                <Router size={42} strokeWidth={1.2} />
              </div>

              <span className="absolute left-[7%] top-[50%] -translate-y-1/2">
                <span className="mk-mono text-[8px] text-black/40">
                  NETWORK
                </span>
              </span>
              <span className="absolute right-[5%] top-[22%]">
                <span className="mk-mono text-[8px] text-black/40">
                  ROUTEROS
                </span>
              </span>
              <span className="absolute bottom-[12%] right-[23%]">
                <span className="mk-mono text-[8px] text-black/40">
                  CERTIFIED
                </span>
              </span>
            </div>
          </div>

          <div className="absolute bottom-7 left-5 hidden items-center gap-3 sm:left-8 lg:flex lg:left-12">
            <span className="h-10 w-px bg-black/20" />
            <span className="mk-mono text-[9px] text-black/40">
              Scroll to begin
            </span>
          </div>

          <div className="absolute bottom-7 right-5 hidden lg:block lg:right-12">
            <span className="mk-mono text-[9px] text-black/35">01 — 05</span>
          </div>
        </div>
      </section>

      {/* ═════ STORY INTRO ═════ */}
      <section
        id="cerita"
        className="relative border-b mk-line bg-[var(--ink)] text-white"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="mk-mono text-[10px] text-white/40">
                01 / The story
              </span>
            </div>

            <div className="mk-reveal lg:col-span-8">
              <p className="mk-serif mk-story-heading text-[10vw] leading-[.85] sm:text-[8vw] lg:text-[7vw]">
                <span className="mk-story-word inline-block">
                  Dari kelas jaringan
                </span>
                <span className="mk-story-word inline-block text-[var(--telkom-red)]">
                  {" "}
                  menjadi
                </span>
                <br />
                <span className="mk-story-word mk-outline-white inline-block">
                  kompetensi nyata.
                </span>
              </p>

              <p className="mt-12 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                SMK Telkom Medan memegang lisensi resmi dari MikroTik SIA
                (Latvia) untuk menyelenggarakan ujian sertifikasi MTCNA bagi
                siswanya. Siswa belajar, berlatih, dan diuji di sekolah sendiri.
              </p>
            </div>
          </div>
        </div>

        <div className="mk-marquee border-t border-white/10 py-5">
          <div className="mk-mono flex items-center gap-10 whitespace-nowrap text-[10px] text-white/25">
            <span>MIKROTIK ACADEMY</span>
            <span>•</span>
            <span>NETWORKING</span>
            <span>•</span>
            <span>ROUTEROS</span>
            <span>•</span>
            <span>MTCNA</span>
            <span>•</span>
            <span>SMK TELKOM MEDAN</span>
            <span>•</span>
            <span>MIKROTIK ACADEMY</span>
            <span>•</span>
            <span>NETWORKING</span>
          </div>
        </div>
      </section>

      {/* ═════ WHAT IT MEANS ═════ */}
      <section className="border-b mk-line">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="mk-mono text-[10px] text-black/40">
                02 / Why it matters
              </span>
              <h2 className="mk-serif mt-6 text-5xl leading-[.9] sm:text-6xl">
                Bukan sekadar
                <span className="text-[var(--telkom-red)]"> teori.</span>
              </h2>
            </div>

            <div className="lg:col-span-8">
              <div className="mk-reveal-stagger grid gap-4 sm:grid-cols-2">
                {PILLARS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <article
                      key={p.title}
                      className="mk-card-hover group min-h-[300px] border mk-line bg-white p-7 sm:p-9"
                    >
                      <div className="flex items-start justify-between">
                        <span className="mk-mono text-[9px] text-black/30">
                          {p.number}
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--telkom-red)] text-white">
                          <Icon size={20} strokeWidth={1.7} />
                        </span>
                      </div>

                      <div className="mt-20">
                        <h3 className="text-xl font-extrabold tracking-tight">
                          {p.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-black/55">
                          {p.desc}
                        </p>
                      </div>

                      <div className="mt-7 h-px w-0 bg-[var(--telkom-red)] transition-all duration-500 group-hover:w-full" />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ CERTIFICATES ═════ */}
      <section
        id="sertifikat"
        className="mk-cinematic border-b mk-line bg-[#efefeb]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="mk-mono text-[10px] text-black/40">
                03 / Proof of work
              </span>
              <h2 className="mk-serif mt-6 text-6xl leading-[.84] sm:text-7xl">
                Proof
                <br />
                <span className="text-[var(--telkom-red)]">inside.</span>
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-7 text-black/55">
                Instruktur membawa sertifikasi yang menjadi bagian dari
                ekosistem pembelajaran MikroTik di sekolah.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="mk-reveal-stagger grid gap-5 sm:grid-cols-2">
                {certs.map((c, i) => (
                  <button
                    key={c.number}
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="mk-card-hover mk-tilt group overflow-hidden border mk-line bg-white text-left"
                    aria-label={`Perbesar sertifikat ${c.track} ${c.name}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white">
                      {c.src ? (
                        <img
                          src={c.src}
                          alt={`Sertifikat ${c.track} atas nama ${c.name}`}
                          loading="lazy"
                          decoding="async"
                          className="mk-cert-image mk-tilt-image h-full w-full object-contain p-5 transition duration-700"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-6 text-center text-xs text-black/45">
                          Letakkan {c.file} di src/assets/mikrotik/
                        </div>
                      )}

                      <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-white opacity-0 transition group-hover:opacity-100">
                        <ZoomIn size={15} />
                      </span>

                      <span className="mk-mono absolute right-4 top-4 rounded-full bg-[var(--telkom-red)] px-3 py-1.5 text-[8px] font-medium text-white">
                        {c.track}
                      </span>
                    </div>

                    <div className="border-t mk-line p-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm font-extrabold">{c.name}</p>
                          <p className="mt-1 text-[11px] text-black/45">
                            No. {c.number} · {c.date}
                          </p>
                        </div>
                        <ArrowUpRight
                          size={17}
                          className="shrink-0 text-black/30 transition group-hover:text-[var(--telkom-red)]"
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ CURRICULUM ═════ */}
      <section id="silabus" className="mk-cinematic border-b mk-line bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="mk-mono text-[10px] text-black/40">
                04 / The curriculum
              </span>
              <h2 className="mk-serif mt-6 text-6xl leading-[.84] sm:text-7xl">
                Five
                <br />
                <span className="text-[var(--telkom-red)]">chapters.</span>
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-7 text-black/55">
                Lima modul membentuk perjalanan dari dasar RouterOS sampai
                troubleshooting dan monitoring jaringan.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
                <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                  {MODULES.map((m, i) => {
                    const Icon = m.icon;
                    const active = i === activeModule;

                    return (
                      <button
                        key={m.title}
                        ref={(el) => {
                          moduleButtonsRef.current[i] = el;
                        }}
                        type="button"
                        onClick={() => {
                          if (i === activeModule) return;
                          setActiveModule(i);
                        }}
                        className={`group flex min-w-[210px] items-center justify-between border-b px-1 py-4 text-left transition lg:min-w-0 ${
                          active
                            ? "border-[var(--telkom-red)]"
                            : "border-black/10 hover:border-black/30"
                        }`}
                        aria-selected={active}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            data-module-icon
                            className={`grid h-9 w-9 place-items-center rounded-full ${
                              active
                                ? "bg-[var(--telkom-red)] text-white"
                                : "bg-[#f0f0ec] text-black/50"
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="text-xs font-extrabold">
                            {m.title}
                          </span>
                        </span>
                        <span className="mk-mono text-[8px] text-black/25">
                          {m.number}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div
                  ref={modulePanelRef}
                  className="relative min-h-[430px] overflow-hidden bg-[var(--ink)] p-7 text-white sm:p-10 lg:p-12"
                >
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-[var(--telkom-red)]/50" />

                  <div ref={moduleContentRef} className="relative">
                    <div className="flex items-center justify-between">
                      <span className="mk-mono text-[9px] text-white/35">
                        Module {mod.number}
                      </span>
                      <span className="text-[var(--telkom-red)]">●</span>
                    </div>

                    <h3
                      ref={moduleTitleRef}
                      className="mk-serif mt-20 text-5xl leading-none sm:text-6xl"
                    >
                      {mod.title}
                    </h3>

                    <p
                      ref={moduleSummaryRef}
                      className="mt-5 max-w-xl text-sm leading-7 text-white/55"
                    >
                      {mod.summary}
                    </p>

                    <ul
                      ref={moduleTopicsRef}
                      className="mt-9 grid gap-3 sm:grid-cols-2"
                    >
                      {mod.topics.map((topic) => (
                        <li
                          key={topic}
                          className="flex items-start gap-3 border-t border-white/10 py-3 text-xs leading-5 text-white/75"
                        >
                          <Flame
                            size={14}
                            className="mt-0.5 shrink-0 text-[var(--telkom-red)]"
                          />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ FINAL CTA ═════ */}
      <section className="mk-cinematic relative overflow-hidden bg-[var(--telkom-red)] text-white">
        <div className="mk-cta-glow pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute inset-0 opacity-15">
          <div className="mk-grid h-full w-full [background-image:linear-gradient(to_right,rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.22)_1px,transparent_1px)]" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="mk-mono text-[10px] text-white/60">
                05 / Next chapter
              </span>
            </div>

            <div className="mk-reveal lg:col-span-8">
              <h2 className="mk-serif text-[14vw] leading-[.78] sm:text-[10vw] lg:text-[8vw]">
                <span className="inline-block">Your</span>
                <br />
                <span className="mk-outline-white inline-block">network</span>
                <br />
                <span className="inline-block">starts here.</span>
              </h2>

              <p className="mt-12 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Mulai kariermu di bidang jaringan dari bangku SMK dan bangun
                kompetensi yang bisa dibawa ke dunia industri.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/ppdb"
                  className="mk-magnetic inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-extrabold text-[var(--telkom-red)] transition hover:-translate-y-1"
                >
                  Daftar PPDB sekarang <ArrowUpRight size={15} />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-3 rounded-full border border-white/40 px-7 py-4 text-xs font-extrabold text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  Kembali ke beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ FOOTER ═════ */}
      <footer className="bg-[var(--ink)] px-5 py-7 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="mk-mono text-[9px] text-white/40">
            SMK TELKOM MEDAN
          </span>
          <span className="mk-mono text-[9px] text-white/25">
            MikroTik Academy · Networking · MTCNA
          </span>
        </div>
      </footer>

      {/* ═════ LIGHTBOX ═════ */}
      {current && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Sertifikat ${current.track} ${current.name}`}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-4 sm:p-8"
          onClick={closeBox}
        >
          <div
            className="flex items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-sm font-bold">
                {current.name}{" "}
                <span className="ml-2 rounded-full bg-[var(--telkom-red)] px-2.5 py-1 text-[9px]">
                  {current.track}
                </span>
              </p>
              <p className="mt-1 text-xs text-white/40">
                No. {current.number} · {current.date}
              </p>
            </div>

            <button
              type="button"
              onClick={closeBox}
              autoFocus
              aria-label="Tutup"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X size={21} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center py-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Sertifikat sebelumnya"
              className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            >
              <ChevronLeft size={24} />
            </button>

            {current.src && (
              <img
                src={current.src}
                alt={`Sertifikat ${current.track} atas nama ${current.name}`}
                decoding="async"
                className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-2xl"
              />
            )}

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Sertifikat berikutnya"
              className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="mk-mono text-center text-[8px] text-white/30">
            {(lightbox as number) + 1} / {certs.length} · Arrow keys · Esc
          </p>
        </div>
      )}
    </main>
  );
}
