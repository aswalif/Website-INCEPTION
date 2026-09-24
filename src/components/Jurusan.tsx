import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Server,
  Code2,
  Palette,
  ChefHat,
  X,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  TYPES & DATA                                                              */
/* -------------------------------------------------------------------------- */

export interface JurusanData {
  id: string;
  kode: string;
  nama: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  badges: string[];
  karier: string[];
  image: string;
  icon: LucideIcon;
}

const JURUSAN_DATA: JurusanData[] = [
  {
    id: "tkj",
    kode: "TKJ",
    nama: "Teknik Komputer & Jaringan",
    subtitle: "Network Architecture, Cloud & Cybersecurity",
    description:
      "Mempelajari infrastruktur jaringan, server cloud, hingga pertahanan keamanan siber.",
    fullDescription:
      "Program keahlian TKJ membekali siswa dengan kompetensi instalasi dan konfigurasi jaringan komputer, administrasi server, virtualisasi cloud, hingga praktik keamanan siber tingkat dasar-menengah. Siswa berlatih langsung menggunakan perangkat Cisco dan Mikrotik di laboratorium jaringan bersertifikasi industri, serta mengerjakan studi kasus nyata seperti membangun infrastruktur jaringan skala kecil-menengah dan mendeteksi celah keamanan sistem.",
    badges: ["Cisco", "Mikrotik", "Cybersecurity", "Cloud Infrastructure"],
    karier: [
      "Network Engineer",
      "IT Support Specialist",
      "Administrator Jaringan",
      "Cyber Security Analyst",
      "Cloud Infrastructure Engineer",
      "Teknisi Infrastruktur IT",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    icon: Server,
  },
  {
    id: "rpl",
    kode: "RPL",
    nama: "Rekayasa Perangkat Lunak",
    subtitle: "Software Engineering, Web & Mobile Development",
    description:
      "Mengembangkan aplikasi web & mobile modern, basis data, dan arsitektur sistem.",
    fullDescription:
      "Program keahlian RPL mengajarkan siswa merancang, membangun, dan menguji aplikasi web maupun mobile menggunakan bahasa pemrograman dan framework modern. Kurikulum mencakup fundamental logika algoritma, basis data relasional, pengembangan fullstack, hingga praktik kolaborasi tim menggunakan version control—mempersiapkan siswa untuk terjun langsung ke industri software development maupun startup digital.",
    badges: ["Fullstack", "Mobile Apps", "Cloud Native", "UI/UX Integration"],
    karier: [
      "Software Engineer",
      "Web Developer",
      "Mobile App Developer",
      "Fullstack Developer",
      "Database Administrator",
      "DevOps / Cloud Engineer",
    ],
    image:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1600&auto=format&fit=crop",
    icon: Code2,
  },
  {
    id: "dkv",
    kode: "DKV",
    nama: "Desain Komunikasi Visual",
    subtitle: "Creative Branding, Motion & Visual Arts",
    description:
      "Eksplorasi kreativitas dalam desain grafis, videografi, 3D modeling, dan animasi.",
    fullDescription:
      "Program keahlian DKV mengasah kepekaan estetika dan kemampuan teknis siswa dalam mendesain identitas visual, memproduksi konten motion graphics, videografi, hingga eksplorasi 3D modeling. Siswa dilatih menggunakan software industri standar untuk menghasilkan karya branding, materi promosi, dan konten digital yang siap dipublikasikan maupun dipresentasikan ke klien nyata.",
    badges: [
      "Graphic Design",
      "Motion Graphics",
      "Videography",
      "UI/UX Design",
    ],
    karier: [
      "Graphic Designer",
      "Motion Designer",
      "Videographer / Editor",
      "UI/UX Designer",
      "Brand & Illustration Designer",
      "Content Creator",
    ],
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1600&auto=format&fit=crop",
    icon: Palette,
  },
  {
    id: "kuliner",
    kode: "Kuliner",
    nama: "Tata Boga",
    subtitle: "Culinary Arts, Gastronomy & Restaurant Management",
    description:
      "Seni olah masakan internasional, pastry & bakery, serta manajemen usaha kuliner modern.",
    fullDescription:
      "Program keahlian Tata Boga membentuk siswa menjadi praktisi kuliner yang menguasai teknik memasak masakan Nusantara maupun internasional, seni pastry & bakery, food styling untuk presentasi visual, hingga dasar-dasar manajemen operasional restoran. Siswa praktik langsung di dapur produksi standar industri dan dibimbing untuk memahami efisiensi biaya, higienitas, serta tren gastronomi terkini.",
    badges: [
      "Culinary Arts",
      "Pastry & Bakery",
      "Food Styling",
      "Restaurant Management",
    ],
    karier: [
      "Chef / Cook",
      "Pastry & Bakery Chef",
      "Food Stylist",
      "Restaurant / F&B Manager",
      "Food & Beverage Entrepreneur",
      "Catering Manager",
    ],
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop",
    icon: ChefHat,
  },
];

/* -------------------------------------------------------------------------- */
/*  DETAIL MODAL                                                              */
/* -------------------------------------------------------------------------- */

interface JurusanDetailModalProps {
  data: JurusanData | null;
  onClose: () => void;
}

const JurusanDetailModal: React.FC<JurusanDetailModalProps> = ({
  data,
  onClose,
}) => {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef(false);

  const handleClose = useCallback(() => {
    if (closingRef.current || !data) return;
    closingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        closingRef.current = false;
        onClose();
      },
    });

    tl.to(panelRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.97,
      duration: 0.35,
      ease: "power2.inOut",
    }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.3, ease: "power2.inOut" },
      "<",
    );
  }, [data, onClose]);

  /* Lock body scroll + Escape key handling */
  useEffect(() => {
    if (!data) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [data, handleClose]);

  /* Entrance animation */
  useLayoutEffect(() => {
    if (!data) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" },
      );

      gsap.fromTo(
        panelRef.current,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
      );

      gsap.fromTo(
        "[data-detail-reveal]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.2,
        },
      );

      gsap.fromTo(
        "[data-career-item]",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.32,
        },
      );
    }, panelRef);

    return () => ctx.revert();
  }, [data]);

  if (!data) return null;

  const Icon = data.icon;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail jurusan ${data.nama}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={panelRef}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup detail jurusan"
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition-colors duration-300 hover:bg-[#E30613] hover:text-white"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Header image */}
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-100">
            <img
              src={data.image}
              alt={`Ilustrasi jurusan ${data.nama}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 backdrop-blur-md">
                <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  {data.kode}
                </span>
              </div>
              <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                {data.nama}
              </h2>
              <p className="mt-1 text-sm font-medium text-white/80 sm:text-base">
                {data.subtitle}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-8 p-6 sm:p-8">
            {/* Deskripsi lengkap */}
            <div data-detail-reveal>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#990000]">
                Tentang Program
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {data.fullDescription}
              </p>
            </div>

            {/* Kompetensi / Badges */}
            <div data-detail-reveal>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#990000]">
                Kompetensi Unggulan
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Kesempatan Karier */}
            <div data-detail-reveal>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#990000]">
                Kesempatan Karier
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.karier.map((job) => (
                  <div
                    key={job}
                    data-career-item
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 transition-colors duration-300 hover:border-[#E30613]/30 hover:bg-[#E30613]/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E30613]/10 text-[#E30613]">
                      <Briefcase className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {job}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div data-detail-reveal className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#E30613] sm:w-auto sm:px-8"
              >
                <span>Tutup Detail</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-1 group-hover/btn:rotate-45"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  CARD SUB-COMPONENT                                                        */
/* -------------------------------------------------------------------------- */

interface JurusanCardProps {
  data: JurusanData;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  onDetail: (data: JurusanData) => void;
}

const JurusanCard: React.FC<JurusanCardProps> = ({
  data,
  index,
  cardRef,
  onDetail,
}) => {
  const isOffset = index % 2 === 1;
  const Icon = data.icon;

  return (
    <div
      ref={cardRef}
      className={`group relative opacity-0 ${isOffset ? "md:mt-16" : ""}`}
    >
      <div className="relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_2px_24px_-8px_rgba(15,23,42,0.08)] transition-shadow duration-500 hover:shadow-[0_24px_48px_-16px_rgba(227,6,19,0.25)]">
        {/* Image container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={data.image}
            alt={`Ilustrasi jurusan ${data.nama}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E30613]/0 via-transparent to-[#800000]/0 transition-colors duration-500 group-hover:from-[#E30613]/15 group-hover:to-[#800000]/10" />

          {/* Kode jurusan */}
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 backdrop-blur-md">
            <Icon className="h-4 w-4 text-white" strokeWidth={2} />
            <span className="text-sm font-bold tracking-wide text-white">
              {data.kode}
            </span>
          </div>

          {/* Nama & subtitle di atas gambar */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">
              {data.nama}
            </h3>
            <p className="mt-1 text-sm font-medium text-white/80">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
          <p className="text-[15px] leading-relaxed text-slate-600">
            {data.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm transition-colors duration-300 group-hover:border-[#E30613]/30 group-hover:bg-[#E30613]/5 group-hover:text-[#990000]"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            type="button"
            onClick={() => onDetail(data)}
            className="group/btn relative mt-2 inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-slate-900 py-3 pl-5 pr-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#E30613]"
          >
            <span className="relative z-10">Lihat Detail Jurusan</span>
            <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 ease-out group-hover/btn:translate-x-1 group-hover/btn:rotate-45">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  MAIN COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

const Jurusan: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedJurusan, setSelectedJurusan] = useState<JurusanData | null>(
    null,
  );

  const setCardRef = (el: HTMLDivElement | null, i: number) => {
    cardsRef.current[i] = el;
  };

  const handleOpenDetail = useCallback((data: JurusanData) => {
    setSelectedJurusan(data);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedJurusan(null);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------- Title entrance: staggered fade-in & slide-up ---------- */
      const titleTargets = titleWrapRef.current
        ? titleWrapRef.current.querySelectorAll("[data-title-line]")
        : [];

      gsap.fromTo(
        titleTargets,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: titleWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* ---------- Cards entrance: staggered reveal ---------- */
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="jurusan"
      className="relative overflow-hidden bg-[#F8FAFC] py-24 sm:py-32"
    >
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#E30613]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#800000]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* ---------------- Header / Editorial Title ---------------- */}
        <div ref={titleWrapRef} className="mb-16 max-w-3xl sm:mb-24">
          <div
            data-title-line
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E30613]/20 bg-[#E30613]/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E30613]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#990000]">
              Program Keahlian
            </span>
          </div>

          <h2 className="font-black uppercase leading-[0.95] tracking-tight text-slate-900">
            <span
              data-title-line
              className="block text-[13vw] sm:text-6xl lg:text-7xl"
            >
              Explore Our
            </span>
            <span
              data-title-line
              className="block text-transparent text-[13vw] sm:text-6xl lg:text-7xl"
              style={{
                WebkitTextStroke: "1.5px #E30613",
                backgroundImage:
                  "linear-gradient(90deg, #E30613 0%, #800000 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                opacity: 0.92,
              }}
            >
              Majors
            </span>
          </h2>

          <p
            data-title-line
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Empat program keahlian unggulan yang dirancang untuk membentuk
            lulusan siap kerja, siap industri, dan siap berkompetisi di era
            digital.
          </p>
        </div>

        {/* ---------------- Cards Grid (asimetris/offset) ---------------- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {JURUSAN_DATA.map((jurusan, index) => (
            <JurusanCard
              key={jurusan.id}
              data={jurusan}
              index={index}
              cardRef={(el) => setCardRef(el, index)}
              onDetail={handleOpenDetail}
            />
          ))}
        </div>
      </div>

      {/* ---------------- Detail Modal ---------------- */}
      <JurusanDetailModal data={selectedJurusan} onClose={handleCloseDetail} />
    </section>
  );
};

export default Jurusan;
