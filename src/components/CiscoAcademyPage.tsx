import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Globe,
  Maximize2,
  Monitor,
  Network,
  Router,
  Server,
  ShieldCheck,
  X,
  ZoomIn,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* =========================================================
   CISCO NETWORKING ACADEMY
   AWWWARDS STYLE — SMK TELKOM MEDAN
   ========================================================= */

const ROUTES = {
  home: "/",
  ppdb: "/ppdb",
  kontak: "/kontak",
};

const ciscoAssets = import.meta.glob<{ default: string }>(
  "../assets/sertifikatcisco.png",
  {
    eager: true,
  },
);

const certificateSrc: string | null = (() => {
  const entry = Object.entries(ciscoAssets).find(([path]) =>
    path.toLowerCase().endsWith("/sertifikatcisco.png"),
  );

  return entry?.[1]?.default ?? null;
})();

const CERTIFICATE_ALT =
  "Sertifikat penghargaan Cisco Networking Academy untuk Ichwan M. Zein";

const CONTAINER =
  "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-16";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613] focus-visible:ring-offset-2";

/* =========================================================
   DATA
   ========================================================= */

interface Pillar {
  icon: LucideIcon;
  title: string;
  content: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Globe,
    title: "Kurikulum Berstandar Global",
    content:
      "Pembelajaran networking dengan materi seperti CCNA, cybersecurity, dan network automation yang relevan dengan kebutuhan industri.",
  },
  {
    icon: BadgeCheck,
    title: "Instruktur Tersertifikasi",
    content:
      "Siswa mendapatkan bimbingan dari instruktur yang memiliki kompetensi dalam ekosistem Cisco Networking Academy.",
  },
  {
    icon: Network,
    title: "Laboratorium Jaringan",
    content:
      "Pembelajaran praktik menggunakan perangkat jaringan dan Cisco Packet Tracer untuk menghubungkan teori dengan praktik.",
  },
  {
    icon: Award,
    title: "Sertifikasi Internasional",
    content:
      "Siswa dipersiapkan untuk membangun kompetensi dan mengikuti jalur sertifikasi industri networking.",
  },
];

interface Program {
  title: string;
  summary: string;
  skills: string[];
  tools: string[];
  outcomes: string[];
}

const PROGRAMS: Program[] = [
  {
    title: "CCNA: Introduction to Networks",
    summary:
      "Fondasi jaringan komputer, dari model jaringan hingga konfigurasi dasar.",
    skills: ["TCP/IP", "IP Addressing", "Subnetting", "Ethernet"],
    tools: ["Cisco Packet Tracer", "Perangkat jaringan"],
    outcomes: [
      "Memahami cara data berpindah di dalam sebuah jaringan.",
      "Mampu merancang dan mengonfigurasi jaringan berskala kecil.",
    ],
  },

  {
    title: "CCNA: Switching, Routing, and Wireless Essentials",
    summary:
      "Menghubungkan banyak perangkat dan jaringan melalui switching, routing, dan wireless.",
    skills: ["Switching", "VLAN", "Routing", "Wireless"],
    tools: ["Cisco Packet Tracer", "Perangkat jaringan"],
    outcomes: [
      "Mampu membangun jaringan yang terhubung antar segmen.",
      "Memahami dasar konfigurasi jaringan nirkabel.",
    ],
  },

  {
    title: "Cybersecurity Essentials",
    summary:
      "Pengenalan keamanan jaringan dan perlindungan data untuk dunia kerja.",
    skills: [
      "Network Security",
      "Threat Awareness",
      "Data Protection",
      "Security Practices",
    ],
    tools: ["Cisco Packet Tracer"],
    outcomes: [
      "Mengenali ancaman umum pada jaringan dan data.",
      "Menerapkan praktik dasar untuk menjaga keamanan sistem.",
    ],
  },

  {
    title: "DevNet Associate",
    summary:
      "Menggabungkan pemrograman dengan jaringan melalui automation dan API.",
    skills: ["Python", "Automation", "APIs", "Network Programmability"],
    tools: ["Python", "API"],
    outcomes: [
      "Memahami dasar otomasi pada infrastruktur jaringan.",
      "Mampu menulis skrip sederhana untuk berinteraksi dengan perangkat dan layanan.",
    ],
  },
];

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  {
    value: 15,
    suffix: "+",
    label: "Tahun Mitra Resmi",
  },
  {
    value: 1000,
    suffix: "+",
    label: "Siswa Tersertifikasi",
  },
  {
    value: 100,
    suffix: "%",
    label: "Peralatan Standar Cisco",
  },
  {
    value: 10,
    suffix: "+",
    label: "Instruktur Resmi",
  },
];

interface LabNode {
  icon: LucideIcon;
  name: string;
  description: string;
}

const LAB_NODES: LabNode[] = [
  {
    icon: Router,
    name: "Router",
    description: "Menghubungkan jaringan dan menentukan jalur data.",
  },
  {
    icon: Network,
    name: "Switch",
    description: "Menghubungkan perangkat dalam satu jaringan lokal.",
  },
  {
    icon: Server,
    name: "Server",
    description: "Menyediakan layanan dan sumber daya bagi jaringan.",
  },
  {
    icon: Monitor,
    name: "Client",
    description: "Perangkat pengguna yang mengakses layanan jaringan.",
  },
];

/* =========================================================
   HOOKS
   ========================================================= */

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);

  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    inView,
  };
}

function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setValue(target);
      return;
    }

    let raf = 0;

    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}

/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);

  const hidden =
    direction === "left"
      ? "-translate-x-10"
      : direction === "right"
        ? "translate-x-10"
        : "translate-y-10";

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`
        transition-all
        duration-1000
        ease-[cubic-bezier(.16,1,.3,1)]
        motion-reduce:transition-none
        ${
          inView
            ? "translate-x-0 translate-y-0 opacity-100"
            : `${hidden} opacity-0`
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* =========================================================
   CHAPTER LABEL
   ========================================================= */

function Chapter({
  number,
  label,
  dark = false,
}: {
  number: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        text-[10px]
        font-bold
        uppercase
        tracking-[0.28em]
        ${dark ? "text-white/55" : "text-slate-500"}
      `}
    >
      <span className={dark ? "text-[#FF3340]" : "text-[#E30613]"}>
        {number}
      </span>

      <span className={dark ? "text-white/20" : "text-slate-300"}>/</span>

      <span>{label}</span>

      <span
        className={`
          h-px
          w-12
          ${dark ? "bg-white/20" : "bg-slate-300"}
        `}
      />
    </div>
  );
}

/* =========================================================
   GIANT TYPOGRAPHY
   ========================================================= */

function GiantWord({
  children,
  muted = false,
  red = false,
  className = "",
}: {
  children: ReactNode;
  muted?: boolean;
  red?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`
        block
        al-display
        text-[clamp(3.5rem,11vw,10rem)]
        font-black
        leading-[0.78]
        tracking-[-0.055em]
        ${red ? "text-[#E30613]" : muted ? "text-slate-300" : "text-[#111111]"}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/* =========================================================
   CERTIFICATE
   ========================================================= */

function CertificatePlaceholder() {
  return (
    <div
      className="
        relative
        flex
        aspect-[4/3]
        w-full
        flex-col
        items-center
        justify-center
        overflow-hidden
        bg-white
        p-6
        text-center
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-4
          border
          border-slate-200
        "
      />

      <Award className="relative h-9 w-9 text-[#E30613]" />

      <p
        className="
          relative
          mt-5
          text-[10px]
          font-bold
          uppercase
          tracking-[0.3em]
          text-slate-500
        "
      >
        Certificate
      </p>

      <p
        className="
          al-display
          relative
          mt-3
          text-3xl
          leading-tight
          text-[#111111]
        "
      >
        CISCO NETWORKING
        <br />
        ACADEMY
      </p>

      <span
        className="
          relative
          mt-5
          h-px
          w-14
          bg-[#E30613]
        "
      />

      <p
        className="
          relative
          mt-4
          text-[10px]
          font-bold
          uppercase
          tracking-[0.22em]
          text-slate-500
        "
      >
        10 Years of Active Service
      </p>
    </div>
  );
}

function CertificateVisual({
  className = "",
  imageClassName = "",
}: {
  className?: string;
  imageClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!certificateSrc || failed) {
    return (
      <div className={className}>
        <CertificatePlaceholder />
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={certificateSrc}
        alt={CERTIFICATE_ALT}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={imageClassName}
      />
    </div>
  );
}

/* =========================================================
   CERTIFICATE MODAL
   ========================================================= */

function CertificateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);

      document.body.style.overflow = previousOverflow;

      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Preview sertifikat Cisco Networking Academy"
      aria-hidden={!open}
      onClick={onClose}
      className={`
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[#080808]/90
        p-4
        backdrop-blur-xl
        transition-[opacity,visibility]
        duration-500
        sm:p-8
        ${open ? "visible opacity-100" : "invisible opacity-0"}
      `}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`
          w-full
          max-w-6xl
          transition-transform
          duration-500
          ${open ? "scale-100" : "scale-[0.96]"}
        `}
      >
        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.24em]
              text-white/50
            "
          >
            Instructor Recognition • 08 Jul 2019
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            aria-label="Tutup preview sertifikat"
            className={`
              ${FOCUS}
              inline-flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-white/10
              text-white
              transition
              hover:bg-white
              hover:text-black
            `}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          className="
            overflow-hidden
            bg-white
            p-2
            shadow-2xl
            sm:p-3
          "
        >
          <CertificateVisual
            className="flex w-full justify-center"
            imageClassName="
              max-h-[78vh]
              w-auto
              max-w-full
              object-contain
            "
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function CiscoAcademyPage() {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const [openProgram, setOpenProgram] = useState<number | null>(0);

  const openCertificate = useCallback(() => setIsCertificateOpen(true), []);

  const closeCertificate = useCallback(() => setIsCertificateOpen(false), []);

  return (
    <main
      className="
        overflow-x-hidden
        bg-white
        text-[#111111]
        antialiased
      "
    >
      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        className="
          relative
          min-h-[100svh]
          overflow-hidden
          bg-[#F7F7F5]
        "
      >
        {/* GRID BACKGROUND */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-70
          "
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(17,17,17,.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,.055) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(circle at 70% 35%, black 0%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(circle at 70% 35%, black 0%, transparent 65%)",
          }}
        />

        {/* RED GLOW */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[18vw]
            top-[10vh]
            h-[65vw]
            w-[65vw]
            max-h-[850px]
            max-w-[850px]
            rounded-full
            bg-[#E30613]
            opacity-[0.08]
            blur-[100px]
          "
        />

        <div
          className={`
            ${CONTAINER}
            relative
            flex
            min-h-[100svh]
            flex-col
            justify-between
            py-7
            sm:py-10
          `}
        >
          {/* TOP */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <Link
              to={ROUTES.home}
              className={`
                ${FOCUS}
                group
                inline-flex
                items-center
                gap-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-slate-600
                transition
                hover:text-[#E30613]
              `}
            >
              <ArrowLeft
                className="
                  h-4
                  w-4
                  transition
                  group-hover:-translate-x-1
                "
              />
              Kembali
            </Link>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-slate-400
              "
            >
              SMK TELKOM MEDAN
            </span>
          </div>

          {/* MAIN TITLE */}

          <div
            className="
              relative
              py-16
              sm:py-20
            "
          >
            <Reveal>
              <div
                className="
                  mb-7
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-[#E30613]
                  "
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <GiantWord>CISCO</GiantWord>

              <GiantWord muted>NETWORKING</GiantWord>

              <GiantWord red>ACADEMY</GiantWord>
            </Reveal>

            <Reveal
              delay={220}
              className="
                mt-12
                max-w-xl
                sm:ml-[25%]
                sm:max-w-2xl
              "
            >
              <p
                className="
                  text-base
                  leading-relaxed
                  text-slate-600
                  sm:text-lg
                "
              >
                Membentuk generasi yang mampu memahami, membangun, dan menjaga
                jaringan dengan standar industri teknologi global.
              </p>
            </Reveal>
          </div>

          {/* BOTTOM */}

          <div
            className="
              flex
              items-end
              justify-between
              border-t
              border-black/10
              pt-5
            "
          >
            <a
              href="#intro"
              className={`
                ${FOCUS}
                group
                flex
                items-center
                gap-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
              `}
            >
              Scroll to explore
              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E30613]
                  text-white
                  transition
                  group-hover:translate-y-1
                "
              >
                <ArrowDown className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
          ===================================================== */}

      <section
        id="intro"
        className="
          relative
          bg-white
          py-28
          sm:py-36
          lg:py-48
        "
      >
        <div className={CONTAINER}>
          <div
            className="
              grid
              gap-16
              lg:grid-cols-12
              lg:gap-12
            "
          >
            <Reveal className="lg:col-span-7">
              <h2
                className="
                  al-display
                  mt-8
                  max-w-5xl
                  text-[clamp(3rem,7vw,7rem)]
                  font-black
                  leading-[0.86]
                  tracking-[-0.05em]
                "
              >
                DARI <span className="text-slate-300">KELAS</span>
                <br />
                MENUJU <span className="text-[#E30613]">INDUSTRI.</span>
              </h2>
            </Reveal>

            <Reveal
              delay={120}
              direction="right"
              className="
                lg:col-span-4
                lg:col-start-9
                lg:pt-24
              "
            >
              <p
                className="
                  text-lg
                  leading-relaxed
                  text-slate-600
                "
              >
                Cisco Networking Academy menghubungkan dunia pendidikan dengan
                kebutuhan industri teknologi. Di SMK Telkom Medan, teori tidak
                berhenti di papan tulis.
              </p>

              <div
                className="
                  mt-10
                  border-l-2
                  border-[#E30613]
                  pl-5
                "
              >
                <p
                  className="
                    al-display
                    text-2xl
                    leading-tight
                  "
                >
                  FROM CLASSROOM
                  <br />
                  <span className="text-[#E30613]">TO REAL NETWORK.</span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CISCO
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#E30613]
          py-28
          text-white
          sm:py-36
          lg:py-48
        "
      >
        {/* DECORATION */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[-15%]
            top-[-20%]
            h-[600px]
            w-[600px]
            rounded-full
            border
            border-white/10
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[-5%]
            top-[-10%]
            h-[420px]
            w-[420px]
            rounded-full
            border
            border-white/10
          "
        />

        <div className={CONTAINER}>
          <Reveal>
            <h2
              className="
                al-display
                mt-8
                max-w-5xl
                text-[clamp(3.5rem,8vw,8rem)]
                font-black
                leading-[0.82]
                tracking-[-0.055em]
              "
            >
              EMPAT PILAR.
              <br />
              SATU TUJUAN
            </h2>
          </Reveal>

          <div
            className="
              mt-20
              grid
              overflow-hidden
              border
              border-white/20
              bg-white/20
              md:grid-cols-2
              lg:mt-28
              lg:grid-cols-4
            "
          >
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <Reveal
                  key={pillar.title}
                  delay={index * 90}
                  className="h-full"
                >
                  <article
                    className="
                        group
                        h-full
                        bg-[#E30613]
                        p-7
                        transition
                        duration-500
                        hover:bg-[#111111]
                        sm:p-9
                      "
                  >
                    <div
                      className="
                          flex
                          items-start
                          justify-between
                        "
                    >
                      <Icon
                        className="
                            h-7
                            w-7
                            text-white
                          "
                      />

                      <span
                        className="
                            text-[10px]
                            font-bold
                            tracking-[0.2em]
                            text-white/50
                          "
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <h3
                      className="
                          mt-16
                          text-xl
                          font-bold
                          leading-tight
                        "
                    >
                      {pillar.title}
                    </h3>

                    <p
                      className="
                          mt-4
                          text-sm
                          leading-relaxed
                          text-white/70
                        "
                    >
                      {pillar.content}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          LEARNING PATH
          ===================================================== */}

      <section
        className="
          relative
          bg-[#111111]
          py-28
          text-white
          sm:py-36
          lg:py-48
        "
      >
        <div className={CONTAINER}>
          <div
            className="
              grid
              gap-16
              lg:grid-cols-12
              lg:gap-20
            "
          >
            <Reveal className="lg:col-span-5">
              <div
                className="
                  lg:sticky
                  lg:top-28
                "
              >
                <h2
                  className="
                    al-display
                    mt-8
                    text-[clamp(3.2rem,6vw,6.5rem)]
                    font-black
                    leading-[0.84]
                    tracking-[-0.05em]
                  "
                >
                  LEARN.
                  <br />
                  BUILD.
                  <br />
                  <span className="text-[#E30613]">CONNECT.</span>
                </h2>

                <p
                  className="
                    mt-8
                    max-w-md
                    text-base
                    leading-relaxed
                    text-white/55
                  "
                >
                  Empat program bertahap membawa siswa dari fundamental jaringan
                  menuju cybersecurity dan network programmability.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-7">
              <div
                className="
                  border-t
                  border-white/15
                "
              >
                {PROGRAMS.map((program, index) => {
                  const isOpen = openProgram === index;

                  const buttonId = `program-trigger-${index}`;

                  const panelId = `program-panel-${index}`;

                  return (
                    <div
                      key={program.title}
                      className="
                          border-b
                          border-white/15
                        "
                    >
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          onClick={() =>
                            setOpenProgram((current) =>
                              current === index ? null : index,
                            )
                          }
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className={`
                              ${FOCUS}
                              group
                              flex
                              w-full
                              items-center
                              gap-5
                              py-7
                              text-left
                            `}
                        >
                          <span
                            className={`
                                al-display
                                w-12
                                shrink-0
                                text-3xl
                                transition
                                ${isOpen ? "text-[#E30613]" : "text-white/20"}
                              `}
                          >
                            0{index + 1}
                          </span>

                          <span
                            className="
                                min-w-0
                                flex-1
                              "
                          >
                            <span
                              className="
                                  block
                                  text-lg
                                  font-bold
                                  sm:text-2xl
                                "
                            >
                              {program.title}
                            </span>

                            <span
                              className="
                                  mt-2
                                  block
                                  max-w-xl
                                  text-sm
                                  leading-relaxed
                                  text-white/45
                                "
                            >
                              {program.summary}
                            </span>
                          </span>

                          <span
                            className={`
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                transition
                                ${
                                  isOpen
                                    ? "border-[#E30613] bg-[#E30613] text-white"
                                    : "border-white/20 text-white/50"
                                }
                              `}
                          >
                            <ChevronDown
                              className={`
                                  h-4
                                  w-4
                                  transition
                                  ${isOpen ? "rotate-180" : ""}
                                `}
                            />
                          </span>
                        </button>
                      </h3>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`
                            grid
                            transition-[grid-template-rows,opacity]
                            duration-500
                            ${
                              isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }
                          `}
                      >
                        <div
                          className="
                              overflow-hidden
                            "
                        >
                          <div
                            className="
                                grid
                                gap-8
                                pb-8
                                pl-0
                                sm:pl-[4.25rem]
                                md:grid-cols-2
                              "
                          >
                            <div>
                              <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.22em]
                                    text-white/35
                                  "
                              >
                                Skills
                              </p>

                              <div
                                className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    gap-2
                                  "
                              >
                                {program.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="
                                          rounded-full
                                          border
                                          border-white/15
                                          px-3
                                          py-1
                                          text-[11px]
                                          text-white/65
                                        "
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              <p
                                className="
                                    mt-7
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.22em]
                                    text-white/35
                                  "
                              >
                                Tools
                              </p>

                              <div
                                className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    gap-2
                                  "
                              >
                                {program.tools.map((tool) => (
                                  <span
                                    key={tool}
                                    className="
                                          rounded-full
                                          border
                                          border-white/15
                                          px-3
                                          py-1
                                          text-[11px]
                                          text-white/65
                                        "
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.22em]
                                    text-white/35
                                  "
                              >
                                Learning Outcome
                              </p>

                              <ul
                                className="
                                    mt-4
                                    space-y-4
                                  "
                              >
                                {program.outcomes.map((outcome) => (
                                  <li
                                    key={outcome}
                                    className="
                                          flex
                                          gap-3
                                          text-sm
                                          leading-relaxed
                                          text-white/65
                                        "
                                  >
                                    <CheckCircle2
                                      className="
                                            mt-0.5
                                            h-4
                                            w-4
                                            shrink-0
                                            text-[#E30613]
                                          "
                                    />

                                    <span>{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          IMPACT
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#F3F3F1]
          py-28
          sm:py-36
          lg:py-48
        "
      >
        <div className={CONTAINER}>
          <Reveal>
            <h2
              className="
                al-display
                mt-8
                max-w-5xl
                text-[clamp(3.5rem,8vw,8rem)]
                font-black
                leading-[0.8]
                tracking-[-0.055em]
              "
            >
              NUMBERS
              <br />
              <span className="text-[#E30613]">THAT MATTER.</span>
            </h2>
          </Reveal>

          <div
            className="
              mt-20
              grid
              grid-cols-2
              border-l
              border-t
              border-black/10
              lg:mt-28
              lg:grid-cols-4
            "
          >
            {STATS.map((stat) => {
              const { ref, inView } = useInView<HTMLDivElement>(0.4);

              const count = useCountUp(stat.value, inView);

              return (
                <div
                  key={stat.label}
                  ref={ref}
                  className="
                    border-b
                    border-r
                    border-black/10
                    p-6
                    sm:p-9
                    lg:p-10
                  "
                >
                  <p
                    className="
                      al-display
                      text-[clamp(3rem,6vw,6rem)]
                      font-black
                      leading-none
                      tracking-[-0.05em]
                      text-[#111111]
                    "
                  >
                    {count}
                    {stat.suffix}
                  </p>

                  <p
                    className="
                      mt-5
                      max-w-[150px]
                      text-[10px]
                      font-bold
                      uppercase
                      leading-relaxed
                      tracking-[0.2em]
                      text-slate-500
                    "
                  >
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CERTIFICATE
          ===================================================== */}

      <section
        className="
          bg-white
          py-28
          sm:py-36
          lg:py-48
        "
      >
        <div className={CONTAINER}>
          <div
            className="
              grid
              items-center
              gap-14
              lg:grid-cols-12
              lg:gap-20
            "
          >
            <Reveal className="lg:col-span-5">
              <h2
                className="
                  al-display
                  mt-8
                  text-[clamp(3.2rem,6vw,6.5rem)]
                  font-blac
                  leading-[0.83]
                  tracking-[-0.05em]
                "
              >
                PROOF
                <br />
                OF
                <br />
                <span className="text-[#E30613]">EXCELLENCE.</span>
              </h2>

              <p
                className="
                  mt-8
                  max-w-md
                  text-base
                  leading-relaxed
                  text-slate-600
                "
              >
                Pengakuan terhadap perjalanan instruktur dan ekosistem
                pembelajaran Cisco Networking Academy di SMK Telkom Medan.
              </p>

              <button
                type="button"
                onClick={openCertificate}
                aria-haspopup="dialog"
                className={`
                  ${FOCUS}
                  mt-8
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#111111]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-[#E30613]
                `}
              >
                <Maximize2 className="h-4 w-4" />
                Lihat Sertifikat
              </button>
            </Reveal>

            <Reveal delay={150} direction="right" className="lg:col-span-7">
              <button
                type="button"
                onClick={openCertificate}
                aria-label="Perbesar sertifikat penghargaan Cisco Networking Academy"
                aria-haspopup="dialog"
                className={`
                  ${FOCUS}
                  group
                  relative
                  block
                  w-full
                  overflow-hidden
                  bg-[#F3F3F1]
                  p-3
                  text-left
                  sm:p-5
                `}
              >
                <div
                  className="
                    overflow-hidden
                    bg-white
                  "
                >
                  <CertificateVisual
                    className="overflow-hidden"
                    imageClassName="
                      block
                      h-auto
                      w-full
                      transition
                      duration-700
                      group-hover:scale-[1.025]
                    "
                  />
                </div>

                <span
                  className="
                    absolute
                    bottom-7
                    right-7
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#111111]
                    px-4
                    py-2.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-white
                    transition
                    group-hover:bg-[#E30613]
                  "
                >
                  <ZoomIn className="h-4 w-4" />
                  Preview
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          REAL NETWORK
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#111111]
          py-28
          text-white
          sm:py-36
          lg:py-48
        "
      >
        <div className={CONTAINER}>
          <Reveal>
            <h2
              className="
                al-display
                mt-8
                max-w-6xl
                text-[clamp(3.5rem,8vw,8rem)]
                font-black
                leading-[0.8]
                tracking-[-0.055em]
              "
            >
              FROM THEORY
              <br />
              <span className="text-[#E30613]">TO REAL NETWORK.</span>
            </h2>

            <p
              className="
                mt-8
                max-w-2xl
                text-base
                leading-relaxed
                text-white/50
                sm:text-lg
              "
            >
              Siswa menghubungkan teori dengan simulasi dan praktik langsung
              menggunakan perangkat jaringan dan Cisco Packet Tracer.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="
                relative
                mt-24
                lg:mt-32
              "
            >
              {/* CONNECTION LINE */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  left-[12%]
                  right-[12%]
                  top-12
                  hidden
                  h-px
                  bg-gradient-to-r
                  from-[#E30613]
                  via-white/20
                  to-[#E30613]
                  lg:block
                "
              />

              <ol
                className="
                  grid
                  gap-12
                  lg:grid-cols-4
                  lg:gap-8
                "
              >
                {LAB_NODES.map((node, index) => {
                  const Icon = node.icon;

                  return (
                    <li
                      key={node.name}
                      className="
                          relative
                          text-center
                        "
                    >
                      <div
                        className="
                            mx-auto
                            flex
                            h-24
                            w-24
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/15
                            bg-[#181818]
                            shadow-[0_0_0_12px_#111111]
                          "
                      >
                        <Icon
                          className="
                              h-8
                              w-8
                              text-[#E30613]
                            "
                        />
                      </div>

                      <p
                        className="
                            mt-8
                            text-[10px]
                            font-bold
                            tracking-[0.25em]
                            text-white/25
                          "
                      >
                        0{index + 1}
                      </p>

                      <h3
                        className="
                            al-display
                            mt-2
                            text-3xl
                            font-bold
                          "
                      >
                        {node.name}
                      </h3>

                      <p
                        className="
                            mx-auto
                            mt-3
                            max-w-xs
                            text-sm
                            leading-relaxed
                            text-white/45
                          "
                      >
                        {node.description}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div
              className="
                mt-20
                flex
                items-start
                gap-4
                border-t
                border-white/10
                pt-8
              "
            >
              <ShieldCheck
                className="
                  mt-0.5
                  h-5
                  w-5
                  shrink-0
                  text-[#E30613]
                "
              />

              <p
                className="
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-white/45
                "
              >
                Keamanan jaringan dipelajari melalui program Cybersecurity
                Essentials sebagai bagian dari jalur belajar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#E30613]
          py-32
          text-white
          sm:py-40
          lg:py-52
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-20
          "
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(circle at 70% 40%, black, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 70% 40%, black, transparent 70%)",
          }}
        />

        <div
          className={`
            ${CONTAINER}
            relative
          `}
        >
          <Reveal>
            <h2
              className="
                al-display
                mt-10
                max-w-6xl
                text-[clamp(4rem,10vw,10rem)]
                font-black
                leading-[0.76]
                tracking-[-0.06em]
              "
            >
              BUILD
              <br />
              THE
              <br />
              NETWORK
            </h2>

            <div
              className="
                mt-14
                flex
                flex-col
                gap-8
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <p
                className="
                  max-w-xl
                  text-base
                  leading-relaxed
                  text-white/75
                  sm:text-lg
                "
              >
                Bergabung bersama SMK Telkom Medan dan mulai perjalananmu di
                Cisco Networking Academy.
              </p>

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  to={ROUTES.ppdb}
                  className={`
                    ${FOCUS}
                    group
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-white
                    px-7
                    py-3
                    text-sm
                    font-bold
                    text-[#E30613]
                    transition
                    hover:bg-[#111111]
                    hover:text-white
                  `}
                >
                  DAFTAR PPDB
                  <ArrowRight
                    className="
                      h-4
                      w-4
                      transition
                      group-hover:translate-x-1
                    "
                  />
                </Link>

                <Link
                  to={ROUTES.kontak}
                  className={`
                    ${FOCUS}
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/50
                    px-7
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:border-white
                    hover:bg-white/10
                  `}
                >
                  HUBUNGI KAMI
                </Link>
              </div>
            </div>
          </Reveal>

          <div
            className="
              mt-28
              flex
              flex-col
              gap-3
              border-t
              border-white/20
              pt-6
              text-[10px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-white/50
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          ></div>
        </div>
      </section>

      {/* =====================================================
          CERTIFICATE MODAL
          ===================================================== */}

      <CertificateModal open={isCertificateOpen} onClose={closeCertificate} />
    </main>
  );
}
