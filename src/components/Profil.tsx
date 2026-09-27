import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
  description: string;
  position: "above" | "below";
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "akreditasi",
    label: "Unggul dan teruji",
    title: "Akreditasi A",
    description:
      "Kurikulum dan fasilitas berstandar tinggi, diverifikasi lembaga akreditasi nasional. Menjadi jaminan mutu pembelajaran yang diakui secara resmi oleh pemerintah.",
    position: "above",
  },
  {
    id: "iso",
    label: "Sistem mutu",
    title: "ISO 9001",
    description:
      "Manajemen mutu pendidikan yang terintegrasi di seluruh proses belajar, mulai dari kurikulum, pengajaran, hingga evaluasi hasil belajar siswa.",
    position: "below",
  },
  {
    id: "tik",
    label: "Pusat teknologi",
    title: "Spesialisasi TIK",
    description:
      "Kompetensi teknologi yang disiapkan langsung untuk kebutuhan industri, mencakup jaringan, perangkat lunak, desain, hingga produksi konten digital.",
    position: "above",
  },
];

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

const TRACE_POSITIONS = ["14%", "50%", "86%"];

export default function Profil({
  heroImageUrl,
  onExploreMore,
  className = "",
}: ProfilProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const textContentRef = useRef<HTMLDivElement | null>(null);
  const traceRef = useRef<HTMLDivElement | null>(null);
  const traceDetailRef = useRef<HTMLDivElement | null>(null);
  const ainoBannerRef = useRef<HTMLDivElement | null>(null);
  const drealGridRef = useRef<HTMLDivElement | null>(null);

  const [activeDReal, setActiveDReal] = useState<DRealItem>(DREAL_ITEMS[0]);
  const [activeHighlight, setActiveHighlight] = useState<HighlightItem>(
    HIGHLIGHTS[0],
  );
  const [imageError, setImageError] = useState(false);

  const imagePath =
    heroImageUrl || new URL("../assets/profil.png", import.meta.url).href;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%",
            },
          },
        );
      }

      // 2. Main Image Animation
      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 3. Text Paragraph Reveal
      if (textContentRef.current) {
        gsap.fromTo(
          textContentRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textContentRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 4. Credential network-trace: one orchestrated sequence
      //    (line draws in -> nodes pop in -> labels fade up)
      if (traceRef.current) {
        const line = traceRef.current.querySelectorAll("[data-trace-line]");
        const nodes = traceRef.current.querySelectorAll("[data-trace-node]");
        const labels = traceRef.current.querySelectorAll("[data-trace-label]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: traceRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power2.inOut", force3D: true },
        )
          .fromTo(
            nodes,
            { scale: 0, rotation: 45 },
            {
              scale: 1,
              rotation: 45,
              duration: 0.45,
              ease: "back.out(2.2)",
              stagger: 0.15,
              force3D: true,
            },
            "-=0.35",
          )
          .fromTo(
            labels,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.15,
            },
            "-=0.5",
          );
      }

      // 5. AINO Banner
      if (ainoBannerRef.current) {
        gsap.fromTo(
          ainoBannerRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ainoBannerRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 6. D'REAL ICT Grid
      if (drealGridRef.current) {
        gsap.fromTo(
          drealGridRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: drealGridRef.current,
              start: "top 90%",
            },
          },
        );
      }

      // Refresh ScrollTrigger agar perhitungan kalkulasi posisi tepat
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Crossfade the detail panel whenever the active credential changes
  useEffect(() => {
    if (!traceDetailRef.current) return;
    gsap.fromTo(
      traceDetailRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [activeHighlight]);

  return (
    <section
      ref={sectionRef}
      id="profil"
      className={`bg-white py-20 text-slate-900 md:py-28  dark:text-slate-100 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl">
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-black">
            Profil{" "}
            <span className="text-red-600 dark:text-red-500">
              SMK Telkom Medan
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-900  font-normal">
            Membangun generasi profesional, kompeten, dan berkarakter di era
            digital.
          </p>
        </div>

        {/* Main Profile */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gambar Komposit */}
          <div ref={imageWrapperRef}>
            {!imageError ? (
              <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-hidden rounded-[22px]">
                  <img
                    src={imagePath}
                    alt="Profil SMK Telkom Medan"
                    onError={() => setImageError(true)}
                    className="block h-auto w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="absolute bottom-5 left-5 rounded-xl border border-white/60 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    SMK Telkom Medan
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Pendidikan teknologi & karakter
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">
                    SMK Telkom Medan
                  </p>
                  <p className="mt-1 text-sm font-normal text-slate-500">
                    Profil-Sekolah.png tidak ditemukan
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div ref={textContentRef}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-red-600 dark:text-red-500">
              Mengenal lebih dekat
            </p>

            <h3 className="text-2xl font-bold leading-tight text-slate-950 sm:text-3xl dark:text-black">
              Membangun Generasi Unggul di Era Digital
            </h3>

            <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-900 font-medium dark:text-slate-500">
              <p>
                <strong className="font-bold text-slate-950 dark:text-black">
                  SMK Telkom Medan
                </strong>{" "}
                adalah sekolah menengah kejuruan unggulan di bidang Teknologi
                Informasi dan Komunikasi (TIK) di bawah naungan Yayasan
                Pendidikan Telkom. Berdiri dengan semangat mencetak generasi
                profesional dan kompeten di era digital, SMK Telkom Medan telah
                terakreditasi{" "}
                <strong className="font-bold text-red-600 dark:text-red-400">
                  "A"
                </strong>{" "}
                dan mengimplementasikan standar mutu pendidikan berbasis ISO
                9001.
              </p>

              <p>
                Dengan mengusung moto{" "}
                <strong className="font-bold text-slate-950 dark:text-red-500">
                  AINO (AKHLAK is Number One)
                </strong>{" "}
                dan nilai-nilai{" "}
                <strong className="font-bold text-slate-950 dark:text-white">
                  D'REAL ICT
                </strong>{" "}
                (Discipline, Religious, Awareness, Learned, Innovative,
                Communicative, Tolerance), sekolah ini berkomitmen untuk
                mengembangkan potensi siswa dalam aspek akademik, keterampilan,
                dan karakter.
              </p>

              <p>
                Sebagai institusi pendidikan yang terus berkembang, SMK Telkom
                Medan berkomitmen untuk melibatkan seluruh komponen sekolah
                dalam mewujudkan visi menjadi pusat pendidikan teknologi yang
                disiplin, religius, dan inovatif, sekaligus menjadi teladan
                dalam membangun toleransi dan komunikasi yang baik di
                masyarakat.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-7 flex flex-wrap gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
              {[].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Credential network trace (klik tiap kredensial untuk lihat penjelasan) */}
        <div ref={traceRef} className="mt-24">
          {/* Desktop / tablet: horizontal schematic, klik untuk memilih */}
          <div className="relative hidden h-[140px] md:block">
            <div
              data-trace-line
              className="absolute left-[8%] right-[8%] top-1/2 h-px origin-left bg-slate-300 dark:bg-slate-700"
            />

            {HIGHLIGHTS.map((item, index) => {
              const left = TRACE_POSITIONS[index];
              const isAbove = item.position === "above";
              const isActive = activeHighlight.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveHighlight(item)}
                  aria-pressed={isActive}
                  className="group absolute inset-y-0 w-[170px] -translate-x-1/2 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  style={{ left }}
                >
                  <span
                    data-trace-node
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${
                      isActive
                        ? "h-3.5 w-3.5 bg-red-600"
                        : "h-2.5 w-2.5 bg-slate-400 group-hover:bg-red-400 dark:bg-slate-600"
                    }`}
                  />

                  <span
                    data-trace-label
                    className="absolute left-1/2 block w-full -translate-x-1/2 text-center"
                    style={
                      isAbove
                        ? { bottom: "calc(50% + 16px)" }
                        : { top: "calc(50% + 16px)" }
                    }
                  >
                    <span
                      className={`block text-xs font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`mt-1 block text-lg font-bold transition-colors duration-300 ${
                        isActive
                          ? "text-slate-950 dark:text-white"
                          : "text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                      }`}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile: daftar vertikal, klik untuk memilih */}
          <div className="relative space-y-1 pl-6 md:hidden">
            <div
              data-trace-line
              className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-slate-300 dark:bg-slate-700"
            />

            {HIGHLIGHTS.map((item) => {
              const isActive = activeHighlight.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveHighlight(item)}
                  aria-pressed={isActive}
                  className="group relative flex w-full items-center gap-4 rounded-lg py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <span
                    data-trace-node
                    className={`absolute -left-6 h-2.5 w-2.5 shrink-0 -translate-x-1/2 transition-colors duration-300 ${
                      isActive
                        ? "bg-red-600"
                        : "bg-slate-400 group-hover:bg-red-400 dark:bg-slate-600"
                    }`}
                  />
                  <span data-trace-label>
                    <span
                      className={`block text-xs font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-base font-bold transition-colors duration-300 ${
                        isActive
                          ? "text-slate-950 dark:text-white"
                          : "text-slate-500 dark:text-slate-500"
                      }`}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel: penjelasan kredensial yang aktif */}
          <div
            ref={traceDetailRef}
            className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {activeHighlight.label}
            </p>
            <h4 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
              {activeHighlight.title}
            </h4>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 font-medium dark:text-slate-300">
              {activeHighlight.description}
            </p>
          </div>
        </div>

        {/* AINO Banner */}
        <div ref={ainoBannerRef} className="mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-2xl sm:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/25 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-blue-600/15 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                  Moto Utama Sekolah
                </p>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-4xl font-black tracking-tight sm:text-5xl">
                    AINO
                  </h3>

                  <span className="text-lg font-semibold italic text-red-400 sm:text-xl">
                    "AKHLAK is Number One"
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 font-medium sm:text-base">
                  Menjadikan nilai akhlak sebagai landasan dalam membentuk
                  peserta didik yang berintegritas dan berkarakter.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* D'REAL ICT */}
        <div className="mt-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-900">
              Karakter Siswa
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-black">
              D'REAL ICT
            </h3>

            <p className="mt-2 text-sm text-slate-700 font-medium sm:text-base dark:text-slate-500">
              Nilai yang menjadi bagian dari karakter siswa SMK Telkom Medan.
            </p>
          </div>

          <div
            ref={drealGridRef}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7"
          >
            {DREAL_ITEMS.map((item, index) => {
              const selected = activeDReal.letter === item.letter;

              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => setActiveDReal(item)}
                  className={`min-h-[118px] rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                    selected
                      ? "border-red-600 bg-slate-950 text-white shadow-xl dark:bg-slate-800"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-2xl font-black ${
                        selected
                          ? "text-red-400"
                          : "text-red-600 dark:text-red-500"
                      }`}
                    >
                      {item.letter}
                    </span>

                    <span
                      className={`text-[10px] font-bold ${
                        selected
                          ? "text-slate-400"
                          : "text-slate-500 dark:text-slate-500"
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-6">
                    <p
                      className={`text-[11px] font-medium ${
                        selected
                          ? "text-slate-300"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.title}
                    </p>

                    <p
                      className={`mt-0.5 text-xs font-bold ${
                        selected
                          ? "text-white"
                          : "text-slate-950 dark:text-white"
                      }`}
                    >
                      {item.indonesian}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Detail */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                  {activeDReal.indonesian}
                </h4>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-800 font-medium dark:text-slate-300">
                  {activeDReal.description}
                </p>
              </div>

              {onExploreMore && (
                <button
                  type="button"
                  onClick={onExploreMore}
                  className="shrink-0 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 dark:bg-white dark:text-slate-950 dark:hover:bg-red-500 dark:hover:text-white"
                >
                  Info Pendaftaran
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
