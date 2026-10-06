// src/pages/PrestasiDetail.tsx

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Trophy,
  UserRound,
} from "lucide-react";

import {
  PRESTASI_DATA,
  type Prestasi,
  type PrestasiLevel,
} from "../data/prestasi";

const levelClass: Record<PrestasiLevel, string> = {
  Kota: "bg-white text-neutral-950",
  Provinsi: "bg-blue-500 text-white",
  Nasional: "bg-neutral-950 text-white",
  Internasional: "bg-amber-300 text-neutral-950",
};

export default function PrestasiDetail() {
  const { id } = useParams<{ id: string }>();

  const prestasi = PRESTASI_DATA.find(
    (item) => item.id === id,
  );

  if (!prestasi) {
    return <PrestasiNotFound />;
  }

  const relatedPrestasi = useMemo(
    () =>
      PRESTASI_DATA.filter(
        (item) => item.id !== prestasi.id,
      ).slice(0, 4),
    [prestasi.id],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f4f1] text-neutral-950">
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <section className="px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-[1500px]">
          <Link
            to="/prestasi"
            className="group inline-flex items-center gap-3 text-sm font-black text-neutral-500 transition hover:text-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-950/10"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white transition group-hover:-translate-x-1">
              <ArrowLeft size={17} />
            </span>

            Kembali ke Daftar Prestasi
          </Link>
        </div>
      </section>

      {/* =====================================================
          MAIN DETAIL
      ===================================================== */}

      <section className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            {/* =================================================
                LEFT IMAGE
            ================================================= */}

            <AchievementPoster item={prestasi} />

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div className="lg:pt-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-neutral-950 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.17em] text-white">
                  {prestasi.category}
                </span>

                <span
                  className={`rounded-full px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.17em] ${levelClass[prestasi.level]}`}
                >
                  {prestasi.level}
                </span>
              </div>

              <h1 className="mt-7 max-w-5xl text-[clamp(3rem,6vw,7rem)] font-black leading-[0.86] tracking-[-0.075em]">
                {prestasi.title}
              </h1>

              {/* Metadata */}
              <div className="mt-10 grid gap-5 border-y border-neutral-200 py-7 sm:grid-cols-2">
                <Meta
                  icon={<UserRound size={17} />}
                  label="Peraih"
                  value={prestasi.recipient}
                />

                <Meta
                  icon={<Building2 size={17} />}
                  label="Penyelenggara"
                  value={prestasi.organizer}
                />

                <Meta
                  icon={<CalendarDays size={17} />}
                  label="Tanggal"
                  value={prestasi.date}
                />

                <Meta
                  icon={<BadgeCheck size={17} />}
                  label="Tahun"
                  value={
                    prestasi.year
                      ? String(prestasi.year)
                      : "Belum dicantumkan"
                  }
                />
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <section className="mt-14">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-neutral-950" />

                  <span className="text-[10px] font-black uppercase tracking-[0.22em]">
                    Overview
                  </span>
                </div>

                <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-neutral-600 sm:text-xl sm:leading-9">
                  {prestasi.description}
                </p>
              </section>

              {/* =================================================
                  STORY
              ================================================= */}

              <section className="mt-16">
                <div className="mb-7">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
                    The Story
                  </span>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    Perjalanan Prestasi
                  </h2>
                </div>

                <div className="space-y-6">
                  {prestasi.story
                    .split("\n")
                    .filter(Boolean)
                    .map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-3xl text-base leading-8 text-neutral-600 sm:text-lg sm:leading-9"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </section>

              {/* =================================================
                  AWARDS
              ================================================= */}

              <section className="mt-16">
                <div className="mb-7">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
                    Recognition
                  </span>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    Apresiasi
                  </h2>
                </div>

                <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                  {prestasi.awards.map(
                    (award, index) => (
                      <div
                        key={award}
                        className="group flex items-center gap-4 py-5"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-black text-white">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="flex-1 text-sm font-bold leading-6 text-neutral-700 sm:text-base">
                          {award}
                        </span>

                        <Check
                          size={17}
                          className="text-neutral-300 transition group-hover:text-neutral-950"
                        />
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* CTA */}
              <div className="mt-12 flex flex-wrap gap-3">
                <Link
                  to="/prestasi"
                  className="inline-flex items-center gap-3 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-black text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-950/20"
                >
                  <ArrowLeft size={16} />
                  Kembali
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RELATED
      ===================================================== */}

      <section className="border-t border-neutral-200 bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
                Continue Exploring
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Prestasi Lainnya
              </h2>
            </div>

            <Link
              to="/prestasi"
              className="group inline-flex items-center gap-2 text-sm font-black"
            >
              Lihat Semua
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPrestasi.map((item) => (
              <RelatedCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   POSTER
========================================================= */

function AchievementPoster({
  item,
}: {
  item: Prestasi;
}) {
  const [imageError, setImageError] =
    useState(false);

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <div className="rounded-[2rem] border border-white/80 bg-white/50 p-2 shadow-2xl shadow-neutral-950/[0.08] backdrop-blur-xl sm:p-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-neutral-200">
          {!imageError && item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={`Gambar tidak tersedia untuk ${item.title}`}
              className="flex h-full items-center justify-center bg-neutral-900 p-10 text-center text-white"
            >
              <div>
                <Trophy
                  size={42}
                  className="mx-auto text-white/40"
                />

                <p className="mt-5 text-sm font-bold text-white/70">
                  Achievement Archive
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute left-5 top-5">
            <span
              className={`rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-[0.17em] shadow-xl ${levelClass[item.level]}`}
            >
              {item.level}
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                Achievement
              </p>

              <p className="mt-1 text-xl font-black">
                {item.year || "—"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
              <Trophy size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
        <span>Student Achievement Archive</span>
        <span>
          /{String(item.id).replace("prestasi-", "")}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   META
========================================================= */

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-200">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.17em] text-neutral-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold leading-5 text-neutral-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   RELATED CARD
========================================================= */

function RelatedCard({
  item,
}: {
  item: Prestasi;
}) {
  const [imageError, setImageError] =
    useState(false);

  return (
    <article className="group overflow-hidden rounded-[1.4rem] border border-neutral-200 bg-[#f4f4f1] transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-950/[0.07]">
      <Link
        to={`/prestasi/${item.id}`}
        className="block focus:outline-none focus:ring-4 focus:ring-neutral-950/20"
      >
        <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
          {!imageError && item.image ? (
            <img
              src={item.image}
              alt={item.title}
              onError={() => setImageError(true)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-900">
              <Trophy
                size={30}
                className="text-white/40"
              />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.17em] text-neutral-400">
              {item.category}
            </span>

            <ArrowUpRight
              size={16}
              className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </div>

          <h3 className="mt-3 line-clamp-3 text-lg font-black leading-tight tracking-[-0.025em]">
            {item.title}
          </h3>

          <p className="mt-3 text-xs font-semibold text-neutral-500">
            {item.recipient}
          </p>
        </div>
      </Link>
    </article>
  );
}

/* =========================================================
   NOT FOUND
========================================================= */

function PrestasiNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f1] px-6">
      <section className="max-w-xl text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">
          404 / Achievement
        </span>

        <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
          Prestasi
          <br />
          Tidak Ditemukan.
        </h1>

        <p className="mt-5 leading-7 text-neutral-500">
          Data prestasi yang kamu cari tidak tersedia.
        </p>

        <Link
          to="/prestasi"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-black text-white transition hover:bg-neutral-800"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Prestasi
        </Link>
      </section>
    </main>
  );
}