// GaleriSection.tsx — preview galeri di halaman utama
// Letakkan satu folder dengan galeriData.ts, atau sesuaikan path import di bawah.
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Images } from "lucide-react";
import { ALBUMS, FONT_CSS, type Album } from "./galeriData";

/** Gambar cover dengan fallback aman (tanpa loop onError / placeholder eksternal) */
function Cover({ album }: { album: Album }) {
  const [failed, setFailed] = useState(false);

  if (!album.cover || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-400"
        aria-hidden
      >
        <Images size={36} />
      </div>
    );
  }

  return (
    <img
      src={album.cover}
      alt={`Cover album ${album.title}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
    />
  );
}

/** Seluruh kartu adalah satu <Link>, jadi area klik tidak bisa meleset */
function AlbumCard({
  album,
  featured = false,
}: {
  album: Album;
  featured?: boolean;
}) {
  return (
    <Link
      to={`/galeri/${album.slug}`}
      aria-label={`Selengkapnya: album ${album.title}, ${album.photos.length} foto`}
      className={[
        "group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E31E24]",
        featured
          ? "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto"
          : "aspect-square",
      ].join(" ")}
    >
      <Cover album={album} />

      {/* Gradasi supaya teks tetap terbaca */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-5">
        <span className="w-fit rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#1B1416] shadow-sm sm:text-xs">
          {album.tag}
        </span>

        <div className="flex items-end justify-between gap-3 text-white">
          <div className="min-w-0">
            <h3
              className={`font-heading font-bold leading-tight ${
                featured
                  ? "text-2xl sm:text-4xl"
                  : "line-clamp-2 text-sm sm:text-lg"
              }`}
            >
              {album.title}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/75 sm:text-sm">
              <Images size={14} aria-hidden />
              {album.photos.length} foto
            </p>
          </div>

          {/* Tombol: ikon saja di layar kecil, ikon + teks di sm ke atas */}
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white p-2.5 text-xs font-semibold text-[#1B1416] transition-colors duration-300 group-hover:bg-[#E31E24] group-hover:text-white sm:px-4 sm:py-2.5">
            <span className="hidden sm:inline">Selengkapnya</span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GaleriSection() {
  const totalFoto = ALBUMS.reduce((sum, a) => sum + a.photos.length, 0);
  const [featured, ...others] = ALBUMS;

  return (
    <section
      id="galeri"
      className="font-body w-full bg-[#F8F8F6] px-4 py-16 text-[#1B1416] sm:px-8 sm:py-24 lg:px-14"
    >
      <style>{FONT_CSS}</style>

      <div className="mx-auto max-w-7xl">
        {/* ===== Header ===== */}
        <div className="mb-10 flex flex-col gap-8 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display mt-5 text-[clamp(3rem,9vw,6.5rem)] uppercase leading-[0.9] tracking-tight">
              Galeri <span className="text-[#E31E24]">Sekolah</span>
            </h2>
          </div>

          <div className="md:max-w-sm">
            <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
              Momen kegiatan SMK Telkom Medan, dari pameran karya sampai
              kunjungan industri. Pilih album untuk melihat semua fotonya.
            </p>
          </div>
        </div>

        {/* ===== Grid: 1 album unggulan besar + 7 album + tile total ===== */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <AlbumCard album={featured} featured />

          {others.map((album) => (
            <AlbumCard key={album.slug} album={album} />
          ))}

          {/* Tile info total dokumentasi (tidak diklik) */}
          <div className="flex aspect-square flex-col justify-between rounded-2xl bg-[#E31E24] p-4 text-white sm:p-5">
            <span className="text-xs text-white/80 sm:text-sm">
              Total dokumentasi
            </span>
            <span>
              <span className="font-display block text-5xl leading-none sm:text-7xl">
                {totalFoto}
              </span>
              <span className="mt-2 block text-xs text-white/90 sm:text-sm">
                foto dari {ALBUMS.length} album
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
