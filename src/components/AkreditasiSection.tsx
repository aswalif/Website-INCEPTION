import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Award, CalendarCheck, Maximize2, ShieldCheck, X } from "lucide-react";
import fotoSertifikat from "../assets/sertifikat-akreditasi.jpg";

const CERT_ALT = "Sertifikat Akreditasi BAN-SM SMKS Telkom Sandhy Putra Medan";
const SCORE = 96;
const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True sekali saat elemen masuk viewport (25% terlihat). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}

/** Angka naik dari 0 ke target saat active = true. */
function useCountUp(target: number, active: boolean, duration = 1600): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

type Direction = "up" | "left" | "right" | "scale";

const HIDDEN: Record<Direction, string> = {
  up: "translate-y-8 opacity-0",
  left: "-translate-x-10 opacity-0",
  right: "translate-x-10 opacity-0",
  scale: "scale-90 opacity-0",
};

interface RevealProps {
  show: boolean;
  delay?: number;
  from?: Direction;
  className?: string;
  children: ReactNode;
}

function Reveal({
  show,
  delay = 0,
  from = "up",
  className = "",
  children,
}: RevealProps) {
  return (
    <div
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        show
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : HIDDEN[from]
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ScoreRing({ active }: { active: boolean }) {
  const score = useCountUp(SCORE, active);
  return (
    <div
      className="relative h-40 w-40 shrink-0 sm:h-44 sm:w-44"
      role="img"
      aria-label={`Nilai akreditasi ${SCORE} dari 100`}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          fill="none"
          strokeWidth="8"
          className="stroke-slate-200"
        />
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={active ? RING_C * (1 - SCORE / 100) : RING_C}
          className="stroke-red-600 transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold tabular-nums tracking-tighter text-slate-900 sm:text-6xl">
          {score}
        </span>
        <span className="text-sm font-semibold text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

const STATS = [
  { icon: ShieldCheck, value: "A", label: "Terakreditasi (Unggul)" },
  { icon: CalendarCheck, value: "31 Des 2026", label: "Masa Berlaku" },
] as const;

export default function AkreditasiSection() {
  const { ref, inView } = useInView<HTMLElement>();
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  useEffect(() => {
    if (!isCertificateOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsCertificateOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isCertificateOpen]);

  return (
    <section
      ref={ref}
      id="akreditasi"
      aria-labelledby="akreditasi-heading"
      className="relative isolate overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-28"
    >
      {/* Dekorasi: blur merah + pola titik yang perlahan muncul */}
      <div
        aria-hidden="true"
        className={`absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-red-500/10 blur-3xl transition-all duration-[1500ms] motion-reduce:transition-none ${
          inView ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)] transition-opacity duration-[1500ms] motion-reduce:transition-none ${
          inView ? "opacity-40" : "opacity-0"
        }`}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Kiri */}
        <div>
          <Reveal show={inView} from="left">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`h-px bg-red-600 transition-all duration-1000 motion-reduce:transition-none ${
                  inView ? "w-12" : "w-0"
                }`}
              />
              <span className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold tracking-widest text-red-600">
                AKREDITASI SEKOLAH
              </span>
            </div>
          </Reveal>

          <Reveal show={inView} delay={120}>
            <h2
              id="akreditasi-heading"
              className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl xl:text-5xl"
            >
              Terakreditasi A (Unggul)
            </h2>
          </Reveal>

          <Reveal show={inView} delay={240}>
            <p className="mt-4 max-w-lg leading-relaxed text-slate-600 sm:text-lg">
              SMKS Telkom Sandhy Putra Medan memperoleh nilai akreditasi 96/100
              berdasarkan penetapan BAN-SM.
            </p>
          </Reveal>

          <Reveal show={inView} from="scale" delay={360} className="mt-8">
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">
              <ScoreRing active={inView} />
              <ul className="grid w-full gap-3">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">96 / 100</p>
                    <p className="text-sm text-slate-600">Nilai Akreditasi</p>
                  </div>
                </li>
                {STATS.map(({ icon: Icon, value, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{value}</p>
                      <p className="text-sm text-slate-600">{label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Kanan: sertifikat */}
        <Reveal show={inView} from="right" delay={300} className="relative">
          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            aria-label="Lihat sertifikat akreditasi ukuran penuh"
            className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600/40"
          >
            <img
              src={fotoSertifikat}
              alt={CERT_ALT}
              loading="lazy"
              className="aspect-[1579/1117] w-full bg-white object-contain transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            {/* Kilau yang menyapu sekali saat muncul */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-[1400ms] ease-out motion-reduce:hidden ${
                inView ? "translate-x-[400%]" : "translate-x-0"
              }`}
              style={{ transitionDelay: inView ? "900ms" : "0ms" }}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md">
                <Maximize2
                  className="h-4 w-4 text-red-600"
                  aria-hidden="true"
                />
                Lihat Sertifikat Penuh
              </span>
            </span>
          </button>

          {/* Badge melayang yang muncul belakangan */}
          <div
            aria-hidden="true"
            style={{ transitionDelay: inView ? "1100ms" : "0ms" }}
            className={`absolute -bottom-4 left-4 rounded-2xl border border-red-100 bg-white px-4 py-2 shadow-md transition-all duration-700 motion-reduce:transition-none sm:-left-4 ${
              inView
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-75 opacity-0"
            }`}
          >
            <p className="text-xs font-semibold text-slate-500">
              Dikeluarkan oleh
            </p>
            <p className="text-sm font-bold text-red-600">BAN-SM</p>
          </div>
        </Reveal>
      </div>

      {/* Lightbox: di-portal ke <body> supaya di atas navbar */}
      {createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sertifikat akreditasi ukuran penuh"
          aria-hidden={!isCertificateOpen}
          onClick={() => setIsCertificateOpen(false)}
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm transition-opacity duration-300 sm:p-8 ${
            isCertificateOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsCertificateOpen(false)}
            tabIndex={isCertificateOpen ? 0 : -1}
            aria-label="Tutup tampilan sertifikat"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition-all duration-200 hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 active:scale-95 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <img
            src={fotoSertifikat}
            alt={CERT_ALT}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-full max-w-full rounded-xl bg-white object-contain shadow-2xl transition-all duration-300 motion-reduce:transition-none ${
              isCertificateOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          />
        </div>,
        document.body,
      )}
    </section>
  );
}
