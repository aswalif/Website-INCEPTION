import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import {
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

/* -------------------------------------------------------------------------- */
/*  CONFIG — mudah diganti                                                    */
/* -------------------------------------------------------------------------- */

const ROUTES = {
  home: "/",
  ppdb: "/ppdb",
  kontak: "/kontak",
} as const;

const ciscoAssets = import.meta.glob<{ default: string }>(
  "../assets/sertifikatcisco.png",
  { eager: true }
);

const certificateSrc: string | null = (() => {
  const entry = Object.entries(ciscoAssets).find(([path]) =>
    path.toLowerCase().endsWith("/sertifikatcisco.png")
  );
  return entry?.[1]?.default ?? null;
})();

const CERTIFICATE_ALT =
  "Sertifikat penghargaan Cisco Networking Academy untuk Ichwan M. Zein";

const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const SECTION = "py-20 md:py-28 lg:py-32";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */

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
      "Pembelajaran networking dengan materi seperti CCNA, cybersecurity, dan IoT yang relevan dengan kebutuhan industri.",
  },
  {
    icon: BadgeCheck,
    title: "Instruktur Tersertifikasi",
    content:
      "Siswa mendapatkan bimbingan dari instruktur yang memiliki kompetensi dan pengalaman dalam ekosistem Cisco Networking Academy.",
  },
  {
    icon: Network,
    title: "Laboratorium Jaringan",
    content:
      "Pembelajaran praktik menggunakan perangkat jaringan dan Cisco Packet Tracer untuk menghubungkan teori dengan simulasi maupun praktik.",
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
      "Fondasi jaringan komputer, dari model referensi hingga konfigurasi dasar.",
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
      "Menghubungkan banyak perangkat dan jaringan dengan switching, routing, dan wireless.",
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
      "Menggabungkan pemrograman dengan jaringan melalui otomasi dan API.",
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
  { value: 15, suffix: "+", label: "Tahun Mitra Resmi" },
  { value: 1000, suffix: "+", label: "Siswa Tersertifikasi" },
  { value: 100, suffix: "%", label: "Peralatan Standar Cisco" },
  { value: 10, suffix: "+", label: "Instruktur Resmi" },
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

/* -------------------------------------------------------------------------- */
/*  HOOKS                                                                     */
/* -------------------------------------------------------------------------- */

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
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
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
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}

/* -------------------------------------------------------------------------- */
/*  SMALL BUILDING BLOCKS                                                     */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
      <span className="text-[#E31E24]">{number}</span>
      <span className="text-slate-300">/</span>
      <span>{label}</span>
      <span aria-hidden="true" className="h-px w-10 bg-slate-300" />
    </div>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`al-display mt-5 break-words text-[2rem] leading-[1.05] tracking-tight text-[#1B1416] sm:text-5xl lg:text-6xl ${className}`}
    >
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
/*  CERTIFICATE                                                               */
/* -------------------------------------------------------------------------- */

function CertificatePlaceholder() {
  return (
    <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-lg border border-slate-200"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E31E24]/[0.06] blur-2xl"
      />
      <Award className="relative h-8 w-8 text-[#E31E24]" aria-hidden="true" />
      <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
        Certificate
      </p>
      <p className="al-display relative mt-3 text-2xl leading-tight text-[#1B1416] sm:text-3xl">
        CISCO NETWORKING
        <br />
        ACADEMY
      </p>
      <span
        aria-hidden="true"
        className="relative mt-5 h-px w-12 bg-[#E31E24]"
      />
      <p className="relative mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
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
        onError={() => setFailed(true)}
        className={imageClassName}
      />
    </div>
  );
}

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
      } else if (event.key === "Tab") {
        // Hanya ada satu elemen fokus di dalam dialog.
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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1B1416]/70 p-4 backdrop-blur-md transition-[opacity,visibility] duration-300 sm:p-8 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-5xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="min-w-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Instructor Recognition • 08 Jul 2019
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            aria-label="Tutup preview sertifikat"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors duration-300 hover:bg-white hover:text-[#1B1416] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl sm:p-3">
          <CertificateVisual
            className="flex w-full justify-center"
            imageClassName="max-h-[78vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PILLAR / CURRICULUM / STAT                                                */
/* -------------------------------------------------------------------------- */

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const Icon = pillar.icon;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-colors duration-300 group-hover:border-red-200 group-hover:bg-[#E31E24]/5">
          <Icon
            className="h-5 w-5 text-slate-500 transition-colors duration-300 group-hover:text-[#E31E24]"
            aria-hidden="true"
          />
        </span>
        <span className="text-[11px] font-semibold tracking-[0.2em] text-slate-300">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-8 text-lg font-semibold leading-snug text-[#1B1416]">
        {pillar.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {pillar.content}
      </p>
    </article>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function CurriculumItem({
  program,
  index,
  isOpen,
  onToggle,
}: {
  program: Program;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const buttonId = `program-trigger-${index}`;
  const panelId = `program-panel-${index}`;

  return (
    <div className="border-b border-slate-200">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={`group flex w-full items-start gap-4 py-6 text-left sm:gap-6 ${FOCUS}`}
        >
          <span
            className={`al-display pt-0.5 text-2xl leading-none transition-colors duration-300 sm:text-3xl ${
              isOpen ? "text-[#E31E24]" : "text-slate-300"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold leading-snug text-[#1B1416] transition-colors duration-300 group-hover:text-[#E31E24] sm:text-lg">
              {program.title}
            </span>
            <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">
              {program.summary}
            </span>
          </span>
          <span
            className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              isOpen
                ? "border-[#E31E24] bg-[#E31E24]/5"
                : "border-slate-200 group-hover:border-slate-300"
            }`}
          >
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-300 ${
                isOpen ? "rotate-180 text-[#E31E24]" : "text-slate-500"
              }`}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 pb-8 pl-0 sm:pl-[3.75rem] md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {program.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Tools
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {program.tools.map((tool) => (
                    <Tag key={tool}>{tool}</Tag>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Learning Outcome
              </p>
              <ul className="mt-3 space-y-3">
                {program.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#E31E24]"
                      aria-hidden="true"
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
}

function StatItem({ stat }: { stat: Stat }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const count = useCountUp(stat.value, inView);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      className="border-t border-slate-200 pt-6"
    >
      <p
        aria-hidden="true"
        className="al-display text-4xl leading-none text-[#E31E24] md:text-5xl lg:text-6xl"
      >
        {count}
        {stat.suffix}
      </p>
      <p
        aria-hidden="true"
        className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600"
      >
        {stat.label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function CiscoAcademyPage() {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [openProgram, setOpenProgram] = useState<number | null>(0);

  const openCertificate = useCallback(() => setIsCertificateOpen(true), []);
  const closeCertificate = useCallback(() => setIsCertificateOpen(false), []);

  return (
    <main className="overflow-x-hidden bg-white text-[#1B1416] antialiased">
      {/* ------------------------------ 01 HERO ------------------------------ */}
      <section className="relative overflow-hidden bg-white pb-20 pt-32 md:pb-28 md:pt-40 lg:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(27,20,22,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,20,22,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 25%, black 15%, transparent 72%)",
            maskImage:
              "radial-gradient(ellipse at 30% 25%, black 15%, transparent 72%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-[#E31E24]/[0.07] blur-3xl"
        />

        <div className={`${CONTAINER} relative`}>
          <Link
            to={ROUTES.home}
            className={`group inline-flex items-center gap-2 rounded-full py-2 text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-[#E31E24] ${FOCUS}`}
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Kembali ke Beranda
          </Link>

          <div className="mt-10 inline-flex max-w-full items-center rounded-full border border-[#E31E24]/20 bg-[#E31E24]/5 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E31E24] sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
            Official NetAcad Partner • Since 2009
          </div>

          <h1 className="al-display mt-8 text-[2.25rem] leading-[0.95] tracking-tight text-[#1B1416] min-[400px]:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block">
              CISCO <br className="sm:hidden" />
              NETWORKING
            </span>
            <span className="block text-[#E31E24]">ACADEMY</span>
          </h1>

          <p className="al-display mt-8 text-2xl leading-[1.1] tracking-tight text-slate-400 sm:text-3xl md:text-4xl lg:text-5xl">
            STANDARISASI
            <br />
            <span className="text-[#1B1416]">JARINGAN GLOBAL</span>
          </p>

          <p className="mt-10 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            SMK Telkom Medan menghadirkan pembelajaran jaringan berstandar
            industri melalui Cisco Networking Academy untuk membekali siswa
            dengan kompetensi networking, cybersecurity, dan teknologi jaringan
            yang relevan dengan kebutuhan dunia kerja.
          </p>

          <div className="mt-16 flex flex-col gap-3 border-t border-slate-200 pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="text-[#E31E24]">01</span> / Cisco Academy
            </span>
            <span>Network • Education • Industry</span>
          </div>
        </div>
      </section>

      {/* --------------------------- 02 INTRODUCTION -------------------------- */}
      <section className={`border-t border-slate-200 bg-white ${SECTION}`}>
        <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-6">
            <SectionLabel number="01" label="About the Program" />
            <SectionHeading>
              Belajar Networking
              <br />
              <span className="text-slate-400">Dengan Standar</span>{" "}
              <span className="text-[#E31E24]">Industri</span>
            </SectionHeading>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6 lg:pt-12">
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Cisco Networking Academy menghubungkan dunia pendidikan dengan
              kebutuhan industri teknologi. Di SMK Telkom Medan, siswa belajar
              networking, cybersecurity, hingga IoT dengan materi yang
              berstandar global serta praktik langsung pada perangkat jaringan
              dan Cisco Packet Tracer.
            </p>

            <ul
              aria-label="Education, Industry, Networking"
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              <li>Education</li>
              <li aria-hidden="true" className="text-[#E31E24]">
                +
              </li>
              <li>Industry</li>
              <li aria-hidden="true" className="text-[#E31E24]">
                +
              </li>
              <li>Networking</li>
            </ul>

            <div className="mt-10 flex items-stretch gap-5 border-t border-slate-200 pt-8">
              <span
                aria-hidden="true"
                className="w-px self-stretch bg-[#E31E24]"
              />
              <p className="al-display text-2xl leading-[1.1] text-[#1B1416] sm:text-3xl">
                FROM CLASSROOM
                <br />
                <span className="text-[#E31E24]">TO REAL NETWORK</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------- 03 CERTIFICATE SECTION ---------------------- */}
      <section className={`border-t border-slate-200 bg-slate-50 ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionLabel number="02" label="Recognition" />
            <SectionHeading>
              Pengakuan Untuk
              <br />
              <span className="text-[#E31E24]">Instruktur</span> Berpengalaman
            </SectionHeading>
          </Reveal>

          <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <button
                type="button"
                onClick={openCertificate}
                aria-label="Perbesar sertifikat penghargaan Cisco Networking Academy"
                aria-haspopup="dialog"
                className={`group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-lg sm:p-3 ${FOCUS}`}
              >
                <CertificateVisual
                  className="overflow-hidden rounded-xl"
                  imageClassName="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
                />
                <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1B1416] shadow-sm transition-colors duration-300 group-hover:border-[#E31E24] group-hover:text-[#E31E24]">
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  Perbesar
                </span>
              </button>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E31E24]">
                <Award className="h-4 w-4" aria-hidden="true" />
                Instructor Recognition
              </p>
              <p className="al-display mt-4 text-3xl leading-[1.05] text-[#1B1416] sm:text-4xl">
                10 Years of
                <br />
                Active Service
              </p>
              <p className="mt-3 text-sm font-medium text-slate-600">
                Cisco Networking Academy
              </p>

              <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                <div className="py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Awarded to
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-[#1B1416]">
                    Ichwan M. Zein
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Director
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-[#1B1416]">
                    Lynn Bloomer
                  </dd>
                  <dd className="text-sm text-slate-600">
                    Director, Cisco Networking Academy
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Date
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-[#1B1416]">
                    08 Jul 2019
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={openCertificate}
                aria-haspopup="dialog"
                className={`group mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1416] transition-all duration-300 hover:border-[#E31E24] hover:text-[#E31E24] ${FOCUS}`}
              >
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                Lihat Sertifikat
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------- 04 FOUR PILLARS -------------------------- */}
      <section className={`border-t border-slate-200 bg-white ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionLabel number="03" label="Why Cisco" />
            <SectionHeading>
              Empat Pilar
              <br />
              Pembelajaran <span className="text-[#E31E24]">Cisco</span> Academy
            </SectionHeading>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90} className="h-full">
                <PillarCard pillar={pillar} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- 05 LEARNING PATH -------------------------- */}
      <section className={`border-t border-slate-200 bg-slate-50 ${SECTION}`}>
        <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionLabel number="04" label="Learning Path" />
              <SectionHeading>
                Dari Fundamental
                <br />
                <span className="text-slate-400">Menuju Kompetensi</span>{" "}
                <span className="text-[#E31E24]">Network Engineer</span>
              </SectionHeading>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
                Empat program yang disusun bertahap, dari dasar jaringan hingga
                keamanan dan otomasi.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="border-t border-slate-200">
              {PROGRAMS.map((program, index) => (
                <CurriculumItem
                  key={program.title}
                  program={program}
                  index={index}
                  isOpen={openProgram === index}
                  onToggle={() =>
                    setOpenProgram((current) =>
                      current === index ? null : index
                    )
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ 06 IMPACT ------------------------------ */}
      <section className={`border-t border-slate-200 bg-white ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionLabel number="05" label="Impact" />
            <SectionHeading>
              Kemitraan yang
              <br />
              <span className="text-[#E31E24]">Terukur</span>
            </SectionHeading>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:mt-20 lg:grid-cols-4">
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- 07 NETWORK LAB --------------------------- */}
      <section className={`border-t border-slate-200 bg-slate-50 ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionLabel number="06" label="Practice" />
            <SectionHeading>
              From Theory
              <br />
              <span className="text-[#E31E24]">To Real Network</span>
            </SectionHeading>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600">
              Siswa menghubungkan teori dengan simulasi dan praktik langsung
              menggunakan perangkat jaringan dan Cisco Packet Tracer.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ol className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-4 lg:gap-8">
              <span
                aria-hidden="true"
                className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-slate-300 lg:block"
              />
              {LAB_NODES.map((node, index) => {
                const Icon = node.icon;
                const isLast = index === LAB_NODES.length - 1;

                return (
                  <li
                    key={node.name}
                    className="relative flex items-start gap-5 lg:flex-col lg:items-center lg:text-center"
                  >
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-8 top-16 -bottom-10 w-px bg-slate-300 lg:hidden"
                      />
                    )}
                    <span className="relative z-10 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors duration-300 hover:border-red-200">
                      <Icon
                        className="h-6 w-6 text-[#E31E24]"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0 pt-1 lg:pt-5">
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="al-display mt-1 text-2xl text-[#1B1416]">
                        {node.name}
                      </h3>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                        {node.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-14 flex items-start gap-4 border-t border-slate-200 pt-8 lg:mt-20">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                <ShieldCheck
                  className="h-5 w-5 text-[#E31E24]"
                  aria-hidden="true"
                />
              </span>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                Keamanan jaringan dipelajari melalui program Cybersecurity
                Essentials sebagai bagian dari jalur belajar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------- 08 CTA ------------------------------- */}
      <section className={`bg-white ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#E31E24] px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "56px 56px",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at 80% 20%, black 10%, transparent 70%)",
                  maskImage:
                    "radial-gradient(ellipse at 80% 20%, black 10%, transparent 70%)",
                }}
              />
              <span
                aria-hidden="true"
                className="al-display pointer-events-none absolute -bottom-10 right-4 select-none text-[9rem] leading-none text-white/[0.08] sm:text-[13rem]"
              >
                07
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-white/15 sm:inset-4"
              />

              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                  07 / Join Us
                </p>
                <h2 className="al-display mt-5 max-w-3xl break-words text-[1.75rem] leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                  SIAP MEMBANGUN MASA DEPAN
                  <br />
                  DI DUNIA NETWORKING?
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
                  Bergabung bersama SMK Telkom Medan dan mulai perjalananmu di
                  Cisco Networking Academy.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={ROUTES.ppdb}
                    className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold tracking-wide text-[#E31E24] transition-all duration-300 hover:bg-[#1B1416] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E31E24] sm:w-auto"
                  >
                    DAFTAR PPDB
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    to={ROUTES.kontak}
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/50 px-7 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E31E24] sm:w-auto"
                  >
                    HUBUNGI KAMI
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CertificateModal open={isCertificateOpen} onClose={closeCertificate} />
    </main>
  );
}