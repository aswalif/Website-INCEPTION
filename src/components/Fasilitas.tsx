import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// anime.js v4 → npm i animejs
import { animate, stagger } from "animejs";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/*  Path gambar (image) TIDAK diubah sama sekali dari file asli.       */
/* ------------------------------------------------------------------ */

type Size = "normal" | "wide" | "featured";

interface FasilitasData {
  id: number;
  title: string;
  category: string;
  image: string;
  size: Size;
}

const fasilitasData: FasilitasData[] = [
  {
    id: 1,
    title: "Milenial Class",
    category: "Laboratorium",
    image: "/fasilitas/Milenialclass.webp",
    size: "featured",
  },
  {
    id: 2,
    title: "Studio DKV & Podcast",
    category: "Studio",
    image: "/fasilitas/Dkvstudio.webp",
    size: "normal",
  },
  {
    id: 3,
    title: "Lab Jaringan (TKJ)",
    category: "Laboratorium",
    image: "/fasilitas/Labtkj.webp",
    size: "normal",
  },
  {
    id: 4,
    title: "Dapur Praktik Kuliner",
    category: "Praktikum",
    image: "/fasilitas/dapurkuliner.webp",
    size: "wide",
  },
  {
    id: 5,
    title: "Perpustakaan Digital",
    category: "Fasilitas Umum",
    image: "/fasilitas/perpustakaan.webp",
    size: "normal",
  },
  {
    id: 7,
    title: "Masjid Raya Sekolah",
    category: "Layanan",
    image: "/fasilitas/masjid.webp",
    size: "normal",
  },
  {
    id: 8,
    title: "Lapangan Basket",
    category: "Olahraga",
    image: "/public/fasilitas/basket1.webp",
    size: "featured",
  },
  {
    id: 9,
    title: "Kantin Sehat & Bersih",
    category: "Fasilitas Umum",
    image: "/fasilitas/kantin.webp",
    size: "normal",
  },
  {
    id: 10,
    title: "Teaching Factory TKJ",
    category: "Teaching Factory",
    image: "/fasilitas/tefatkj.webp",
    size: "normal",
  },
  {
    id: 11,
    title: "Teaching Factory RPL & DKV",
    category: "Teaching Factory",
    image: "/fasilitas/tefarpldv.webp",
    size: "normal",
  },
  {
    id: 12,
    title: "UKS Sekolah",
    category: "Layanan",
    image: "/fasilitas/uks.webp",
    size: "normal",
  },
  {
    id: 13,
    title: "Asrama",
    category: "Infrastruktur",
    image: "/fasilitas/asrama.webp",
    size: "wide",
  },
  {
    id: 14,
    title: "Ruang Musik",
    category: "Studio",
    image: "/fasilitas/mustel.webp",
    size: "normal",
  },
  {
    id: 15,
    title: "Ruang Kelas 1",
    category: "Ruang Belajar",
    image: "/fasilitas/ruang1.webp",
    size: "wide",
  },
  {
    id: 16,
    title: "Lapangan Futsal",
    category: "Olahraga",
    image: "/public/fasilitas/FUTSAL1.webp",
    size: "featured",
  },
  {
    id: 17,
    title: "Ruang Kelas 2",
    category: "Ruang Belajar",
    image: "/fasilitas/ruang2.webp",
    size: "normal",
  },
  {
    id: 18,
    title: "Area Parkir Mobil",
    category: "Infrastruktur",
    image: "/fasilitas/parkirmobil.webp",
    size: "normal",
  },
  {
    id: 19,
    title: "Area Parkir Motor",
    category: "Infrastruktur",
    image: "/fasilitas/Areamotor.webp",
    size: "normal",
  },
  {
    id: 20,
    title: "Lobi Utama",
    category: "Fasilitas Umum",
    image: "/public/fasilitas/ppdb.webp",
    size: "normal",
  },
];

const ALL = "Semua";

/* Ukuran kartu. Di layar kecil semua kartu 1 kolom; kartu besar baru
   melebar di sm ke atas, dan menjadi 2x2 hanya di lg ke atas. */
const sizeClass: Record<Size, string> = {
  normal: "",
  wide: "sm:col-span-2",
  featured: "sm:col-span-2 lg:row-span-2",
};

/* ------------------------------------------------------------------ */
/*  ANIMASI (anime.js)                                                 */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Sembunyikan elemen, lalu munculkan dengan anime.js saat masuk layar.
 * Elemen yang masuk bersamaan di-stagger. Mengembalikan fungsi cleanup.
 */
function revealOnView(
  els: HTMLElement[],
  { distance = 32, step = 70 }: { distance?: number; step?: number } = {},
): () => void {
  if (els.length === 0 || prefersReducedMotion()) return () => {};

  els.forEach((el) => (el.style.opacity = "0"));
  const anims: Array<ReturnType<typeof animate>> = [];

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement);
      if (visible.length === 0) return;
      visible.forEach((el) => io.unobserve(el));
      anims.push(
        animate(visible, {
          opacity: [0, 1],
          translateY: [distance, 0],
          duration: 900,
          delay: stagger(step),
          ease: "outExpo",
        }),
      );
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
  );
  els.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    anims.forEach((a) => a.revert());
    els.forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
    });
  };
}

/* ------------------------------------------------------------------ */
/*  ICONS (inline SVG, tanpa dependensi tambahan)                      */
/* ------------------------------------------------------------------ */

const Icon: React.FC<{ d: string; className?: string }> = ({
  d,
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICON_EXPAND = "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7";
const ICON_CLOSE = "M18 6 6 18M6 6l12 12";
const ICON_PREV = "m15 18-6-6 6-6";
const ICON_NEXT = "m9 18 6-6-6-6";
const ICON_IMAGE =
  "M21 15l-5-5L5 21M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm5.5 3.5h.01";

/* ------------------------------------------------------------------ */
/*  KARTU                                                              */
/* ------------------------------------------------------------------ */

interface CardProps {
  item: FasilitasData;
  onOpen: () => void;
}

const FasilitasCard: React.FC<CardProps> = ({ item, onOpen }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Gambar yang sudah ada di cache bisa selesai sebelum onLoad terpasang.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Lihat foto ${item.title}`}
      className={`fas-card group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 text-left shadow-sm ring-1 ring-slate-900/5 transition-shadow duration-500 hover:shadow-xl hover:shadow-red-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50`}
    >
      {/* Skeleton saat gambar dimuat */}
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-300" />
      )}

      {/* Fallback bila gambar gagal dimuat (src tidak diubah) */}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
          <Icon d={ICON_IMAGE} className="w-10 h-10" />
          <span className="text-xs">Foto belum tersedia</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Gradasi supaya teks selalu terbaca di foto terang maupun gelap */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

      {/* Tombol perbesar (selalu terlihat di layar sentuh, muncul saat hover di desktop) */}
      <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md backdrop-blur transition duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
        <Icon d={ICON_EXPAND} className="w-4 h-4" />
      </span>

      {/* Teks */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="mb-1 text-xs font-medium text-white/70 sm:text-sm">
          {item.category}
        </p>
        <h3
          className={`font-bold leading-tight text-white ${
            item.size === "featured"
              ? "text-xl sm:text-2xl lg:text-3xl"
              : "text-lg sm:text-xl"
          }`}
        >
          {item.title}
        </h3>
        <span className="mt-3 block h-[3px] w-8 rounded-full bg-[#E30613] transition-all duration-500 ease-out group-hover:w-16" />
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  LIGHTBOX                                                           */
/* ------------------------------------------------------------------ */

interface LightboxProps {
  items: FasilitasData[];
  index: number;
  onClose: () => void;
  onChange: (next: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  items,
  index,
  onClose,
  onChange,
}) => {
  const touchX = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dirRef = useRef<1 | -1>(1);
  const total = items.length;
  const item = items[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      dirRef.current = dir;
      onChange((index + dir + total) % total);
    },
    [index, total, onChange],
  );

  // Latar lightbox: fade-in saat dibuka
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion()) return;
    el.style.opacity = "0";
    const a = animate(el, { opacity: [0, 1], duration: 250, ease: "outQuad" });
    return () => {
      a.revert();
    };
  }, []);

  // Foto: masuk dari arah geser setiap kali berganti
  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el || prefersReducedMotion()) return;
    el.style.opacity = "0";
    const a = animate(el, {
      opacity: [0, 1],
      translateX: [dirRef.current * 40, 0],
      scale: [0.97, 1],
      duration: 450,
      ease: "outCubic",
    });
    return () => {
      a.revert();
    };
  }, [item?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);

    // Kunci scroll halaman selama lightbox terbuka
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* Bar atas */}
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="truncate text-xs text-white/60 sm:text-sm">
            {item.category}
          </p>
          <h3 className="truncate text-base font-bold text-white sm:text-xl">
            {item.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm tabular-nums text-white/60">
            {index + 1} / {total}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#E30613] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Icon d={ICON_CLOSE} />
          </button>
        </div>
      </div>

      {/* Gambar */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16">
        <img
          key={item.id}
          ref={imgRef}
          src={item.image}
          alt={item.title}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-[#E30613] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
            >
              <Icon d={ICON_PREV} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-[#E30613] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
            >
              <Icon d={ICON_NEXT} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  SECTION UTAMA                                                      */
/* ------------------------------------------------------------------ */

const Fasilitas: React.FC = () => {
  const [active, setActive] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Kategori + jumlahnya, urutan mengikuti kemunculan di data
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    fasilitasData.forEach((f) =>
      counts.set(f.category, (counts.get(f.category) ?? 0) + 1),
    );
    return [
      { name: ALL, count: fasilitasData.length },
      ...Array.from(counts, ([name, count]) => ({ name, count })),
    ];
  }, []);

  const visible = useMemo(
    () =>
      active === ALL
        ? fasilitasData
        : fasilitasData.filter((f) => f.category === active),
    [active],
  );

  const closeLightbox = useCallback(() => setOpenIndex(null), []);

  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Header: muncul berurutan saat section masuk layar (sekali saja)
  useLayoutEffect(() => {
    if (!headRef.current) return;
    return revealOnView(Array.from(headRef.current.children) as HTMLElement[], {
      distance: 40,
      step: 120,
    });
  }, []);

  // Kartu: muncul saat masuk layar; diulang setiap filter diganti
  useLayoutEffect(() => {
    if (!gridRef.current) return;
    return revealOnView(
      Array.from(gridRef.current.querySelectorAll<HTMLElement>(".fas-item")),
      { distance: 32, step: 60 },
    );
  }, [active]);

  const selectCategory = (name: string) => {
    setActive(name);
    setOpenIndex(null);
  };

  return (
    <section
      id="fasilitas"
      className="relative w-full overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-28"
    >
      {/* Pola titik latar */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#E30613 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Cahaya merah lembut di pojok */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#E30613]/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div
          ref={headRef}
          className="mb-10 flex flex-col gap-6 sm:mb-14 lg:mb-16 lg:flex-row lg:items-end lg:justify-between"
        >
          <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
            Fasilitas yang
            <br />
            <span className="text-[#E30613]">mendukung belajarmu</span>
          </h2>

          <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            Dari laboratorium berstandar industri sampai lapangan olahraga,
            semua disiapkan agar siswa nyaman belajar, berkarya, dan berkembang.
          </p>

          <dl className="flex gap-8 lg:hidden">
            <div>
              <dt className="text-sm text-slate-500">Fasilitas</dt>
              <dd className="text-3xl font-extrabold text-slate-900">
                {fasilitasData.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Kategori</dt>
              <dd className="text-3xl font-extrabold text-slate-900">
                {categories.length - 1}
              </dd>
            </div>
          </dl>
        </div>

        {/* FILTER KATEGORI: bisa digeser di HP, membungkus di layar lebar */}
        <div
          role="tablist"
          aria-label="Filter kategori fasilitas"
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const isActive = c.name === active;
            return (
              <button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectCategory(c.name)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 ${
                  isActive
                    ? "border-[#E30613] bg-[#E30613] text-white shadow-md shadow-red-600/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {c.name}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* GRID: 1 kolom (HP) → 2 (sm) → 3 (lg) → 4 (xl). "dense" menutup lubang
            saat kartu besar dan filter berubah. */}
        <div
          key={active}
          ref={gridRef}
          className="grid auto-rows-[240px] grid-cols-1 gap-4 sm:auto-rows-[260px] sm:grid-cols-2 sm:gap-5 lg:auto-rows-[280px] lg:grid-cols-3 lg:grid-flow-dense xl:grid-cols-4 xl:gap-6"
        >
          {visible.map((item, i) => (
            <div
              key={item.id}
              className={`fas-item min-h-0 ${sizeClass[item.size]}`}
            >
              <FasilitasCard item={item} onOpen={() => setOpenIndex(i)} />
            </div>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox
          items={visible}
          index={openIndex}
          onClose={closeLightbox}
          onChange={setOpenIndex}
        />
      )}
    </section>
  );
};

export default Fasilitas;
