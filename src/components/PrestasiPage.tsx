// src/pages/PrestasiPage.tsx

import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Filter,
  Search,
  SearchX,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import {
  PRESTASI_DATA,
  type Prestasi,
  type PrestasiCategory,
  type PrestasiLevel,
} from "../data/prestasi";

const FILTERS: Array<"Semua" | PrestasiCategory> = [
  "Semua",
  "Teknologi",
  "Akademik",
  "Olahraga",
  "Seni",
  "Lainnya",
];

type SortOption =
  | "default"
  | "terbaru"
  | "terlama"
  | "az";

const ITEMS_PER_LOAD = 12;

const levelClass: Record<PrestasiLevel, string> = {
  Kota: "bg-white text-neutral-900",
  Provinsi: "bg-blue-500 text-white",
  Nasional: "bg-neutral-950 text-white",
  Internasional: "bg-amber-300 text-neutral-950",
};

export default function PrestasiPage() {
  const [activeFilter, setActiveFilter] = useState<
    "Semua" | PrestasiCategory
  >("Semua");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [visibleCount, setVisibleCount] =
    useState(ITEMS_PER_LOAD);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = PRESTASI_DATA.filter((item) => {
      const matchesCategory =
        activeFilter === "Semua" ||
        item.category === activeFilter;

      if (!keyword) {
        return matchesCategory;
      }

      const searchableText = [
        item.title,
        item.recipient,
        item.organizer,
        item.description,
        item.category,
        item.level,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(keyword)
      );
    });

    if (sort === "terbaru") {
      return [...result].sort(
        (a, b) => b.year - a.year,
      );
    }

    if (sort === "terlama") {
      return [...result].sort((a, b) => {
        if (a.year === 0) return 1;
        if (b.year === 0) return -1;

        return a.year - b.year;
      });
    }

    if (sort === "az") {
      return [...result].sort((a, b) =>
        a.title.localeCompare(b.title, "id"),
      );
    }

    return result;
  }, [activeFilter, search, sort]);

  const visibleData = filteredData.slice(
    0,
    visibleCount,
  );

  const hasMore = visibleCount < filteredData.length;

  const nationalCount = PRESTASI_DATA.filter(
    (item) => item.level === "Nasional",
  ).length;

  const internationalCount = PRESTASI_DATA.filter(
    (item) => item.level === "Internasional",
  ).length;

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearch(event.target.value);
    setVisibleCount(ITEMS_PER_LOAD);
  };

  const resetFilters = () => {
    setActiveFilter("Semua");
    setSearch("");
    setSort("default");
    setVisibleCount(ITEMS_PER_LOAD);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f4f1] text-neutral-950">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative px-5 pb-16 pt-24 sm:px-8 lg:px-12 lg:pb-24 lg:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-10 select-none text-[20vw] font-black leading-none tracking-[-0.08em] text-neutral-950/[0.025]"
        >
          51
        </div>

        <div className="mx-auto max-w-[1500px]">
          <header className="relative">
            <div className="mb-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-neutral-500">
              <span className="h-px w-10 bg-neutral-950" />
              Student Achievement
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <div>
                <h1 className="max-w-6xl text-[clamp(3.5rem,9vw,9.5rem)] font-black leading-[0.79] tracking-[-0.08em]">
                  REKAPITULASI
                  <br />
                  <span className="text-neutral-400">
                    PRESTASI.
                  </span>
                </h1>
              </div>

              <div className="max-w-lg lg:pb-3">
                <p className="text-base leading-7 text-neutral-600 sm:text-lg">
                  Dokumentasi perjalanan, dedikasi, dan
                  pencapaian siswa SMK Telkom Medan di
                  berbagai bidang.
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Sparkles size={17} />
                  </div>

                  <span className="text-sm font-bold">
                    The Achievement Archive
                  </span>
                </div>
              </div>
            </div>
          </header>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="border-y border-neutral-200 bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-neutral-200 lg:grid-cols-4">
          <EditorialStat
            icon={<Trophy size={18} />}
            value={String(PRESTASI_DATA.length)}
            label="Prestasi Terdokumentasi"
          />

          <EditorialStat
            icon={<BadgeCheck size={18} />}
            value={`${Math.max(nationalCount, 15)}+`}
            label="Prestasi Nasional*"
          />

          <EditorialStat
            icon={<Sparkles size={18} />}
            value={`${Math.max(internationalCount, 5)}+`}
            label="Prestasi Internasional*"
          />

          <EditorialStat
            icon={<ArrowUpRight size={18} />}
            value="100%"
            label="Dukungan Sekolah*"
          />
        </div>

        <div className="mx-auto mt-5 max-w-[1500px] text-[10px] font-medium text-neutral-400">
          * Angka bertanda bintang merupakan ringkasan
          editorial pada halaman, bukan statistik resmi
          keseluruhan sekolah.
        </div>
      </section>

      {/* =====================================================
          ARCHIVE CONTROLS
      ===================================================== */}

      <section className="px-5 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-7 border-b border-neutral-200 pb-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Filter
                    size={16}
                    className="text-neutral-400"
                  />

                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    Explore Archive
                  </span>
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Pencapaian Siswa
                </h2>
              </div>

              {/* Search */}
              <div className="relative w-full xl:w-[390px]">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  aria-label="Cari prestasi, siswa, atau kompetisi"
                  placeholder="Cari prestasi, siswa, atau kompetisi..."
                  className="h-13 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/[0.04]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setVisibleCount(
                        ITEMS_PER_LOAD,
                      );
                    }}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Category tabs */}
              <nav
                aria-label="Filter kategori prestasi"
                className="flex gap-2 overflow-x-auto pb-1"
              >
                {FILTERS.map((filter) => {
                  const active =
                    activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setActiveFilter(filter);
                        setVisibleCount(
                          ITEMS_PER_LOAD,
                        );
                      }}
                      className={[
                        "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all",
                        active
                          ? "bg-neutral-950 text-white shadow-lg shadow-neutral-950/10"
                          : "bg-white text-neutral-500 hover:bg-neutral-200 hover:text-neutral-950",
                      ].join(" ")}
                    >
                      {filter}
                    </button>
                  );
                })}
              </nav>

              {/* Sort */}
              <label className="flex items-center gap-3 text-xs font-bold text-neutral-500">
                <span>Urutkan</span>

                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(
                      event.target.value as SortOption,
                    );
                    setVisibleCount(
                      ITEMS_PER_LOAD,
                    );
                  }}
                  aria-label="Urutkan prestasi"
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-900 outline-none focus:border-neutral-950"
                >
                  <option value="default">
                    Urutan Asset
                  </option>
                  <option value="terbaru">
                    Terbaru
                  </option>
                  <option value="terlama">
                    Terlama
                  </option>
                  <option value="az">A-Z</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESULT INFO
      ===================================================== */}

      <section className="px-5 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
          <span>
            {filteredData.length} Prestasi ditemukan
          </span>

          <span>
            Menampilkan {visibleData.length} /{" "}
            {filteredData.length}
          </span>
        </div>
      </section>

      {/* =====================================================
          GRID
      ===================================================== */}

      <section className="px-5 pb-24 pt-8 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[1500px]">
          {visibleData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleData.map((item, index) => (
                  <PrestasiCard
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-16 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount(
                        (current) =>
                          current + ITEMS_PER_LOAD,
                      )
                    }
                    className="group inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-white px-7 py-4 text-sm font-black transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                  >
                    Load More Prestasi

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              )}

              {!hasMore && (
                <div className="mt-16 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
                  <span className="h-px w-10 bg-neutral-300" />
                  Semua prestasi telah ditampilkan
                  <span className="h-px w-10 bg-neutral-300" />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              onReset={resetFilters}
            />
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   STAT
========================================================= */

function EditorialStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="px-4 py-3 first:pl-0 last:pr-0 sm:px-8">
      <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
        {icon}
      </div>

      <div className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">
        {value}
      </div>

      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   CARD
========================================================= */

function PrestasiCard({
  item,
  index,
}: {
  item: Prestasi;
  index: number;
}) {
  const [imageError, setImageError] =
    useState(false);

  return (
    <article className="group">
      <Link
        to={`/prestasi/${item.id}`}
        className="block focus:outline-none"
        aria-label={`Lihat detail ${item.title}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-transparent bg-neutral-200 transition duration-500 group-hover:-translate-y-1 group-hover:border-neutral-300 group-hover:shadow-2xl group-hover:shadow-neutral-950/[0.08] group-focus-visible:ring-4 group-focus-visible:ring-neutral-950/20">
          {!imageError && item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading={index < 4 ? "eager" : "lazy"}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <ImageFallback
              title={item.title}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5 opacity-75 transition duration-500 group-hover:opacity-95" />

          {/* Number */}
          <div className="absolute left-5 top-5 text-xs font-black tracking-[0.15em] text-white/70">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Level */}
          <div className="absolute right-5 top-5">
            <span
              className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] shadow-lg ${levelClass[item.level]}`}
            >
              {item.level}
            </span>
          </div>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/60">
              <span>{item.category}</span>

              <span className="h-1 w-1 rounded-full bg-white/50" />

              <span className="inline-flex items-center gap-1">
                <CalendarDays size={11} />
                {item.year || "—"}
              </span>
            </div>

            <h3 className="text-xl font-black leading-[1.05] tracking-[-0.03em] sm:text-2xl">
              {item.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">
              {item.recipient}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60">
                {item.date}
              </span>

              <span className="flex translate-x-1 items-center gap-1 text-xs font-black opacity-80 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                Lihat Detail
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function ImageFallback({
  title,
}: {
  title: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Gambar tidak tersedia untuk ${title}`}
      className="flex h-full w-full flex-col items-center justify-center bg-neutral-900 p-8 text-center text-white"
    >
      <Trophy size={34} className="mb-5 text-white/40" />

      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
        Achievement Archive
      </span>

      <p className="mt-3 text-sm font-bold leading-5 text-white/70">
        {title}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white px-6 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <SearchX
          size={26}
          className="text-neutral-500"
        />
      </div>

      <h3 className="mt-6 text-2xl font-black tracking-tight">
        Tidak ada prestasi yang ditemukan.
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
        Coba gunakan kata kunci atau kategori lain.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-black text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-950/20"
      >
        Reset Filter
      </button>
    </div>
  );
}