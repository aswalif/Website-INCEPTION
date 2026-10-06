// src/pages/galeri/GaleriDetail.tsx
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Images, Maximize2, X } from 'lucide-react';
import { FONT_CSS, getAlbumBySlug } from './galeriData';

export default function GaleriDetail() {
  const { slug } = useParams<{ slug: string }>();
  const album = getAlbumBySlug(slug);
  const photos = album?.photos ?? [];

  const [active, setActive] = useState<number | null>(null);
  const isOpen = active !== null;

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );

  // Reset saat pindah album
  useEffect(() => {
    setActive(null);
    window.scrollTo({ top: 0 });
  }, [slug]);

  // Keyboard + kunci scroll saat lightbox terbuka
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, next, prev]);

  // Preload foto sebelum/sesudah agar navigasi terasa instan
  useEffect(() => {
    if (active === null || photos.length < 2) return;
    [photos[(active + 1) % photos.length], photos[(active - 1 + photos.length) % photos.length]].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [active, photos]);

  // ===== Album tidak ditemukan =====
  if (!album) {
    return (
      <main className="font-body flex min-h-screen items-center justify-center bg-[#F8F8F6] px-5 text-[#1B1416]">
        <style>{FONT_CSS}</style>
        <div className="max-w-md text-center">
          <h1 className="font-display text-6xl uppercase">Album tidak ditemukan</h1>
          <p className="mt-4 text-neutral-600">
            Alamat album yang kamu buka tidak tersedia. Kembali ke galeri untuk memilih album lain.
          </p>
          <Link
            to="/#galeri"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E31E24] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c4181d]"
          >
            <ArrowLeft size={16} aria-hidden /> Kembali ke Galeri
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="font-body min-h-screen bg-[#F8F8F6] text-[#1B1416]">
      <style>{FONT_CSS}</style>

      {/* ===== HEADER DETAIL ===== */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 md:pb-14 md:pt-14">
          <Link
            to="/#galeri"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#E31E24] hover:text-[#E31E24]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" aria-hidden />
            Kembali ke Galeri
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#E31E24] px-3.5 py-1 text-xs font-semibold text-white">{album.tag}</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
              <Images size={15} aria-hidden />
              {photos.length} foto
            </span>
          </div>

          <h1 className="font-display mt-4 text-[clamp(2.75rem,9vw,7rem)] uppercase leading-[0.92] tracking-tight">
            {album.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">{album.description}</p>
        </div>
      </header>

      {/* ===== GRID FOTO (masonry) ===== */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14" aria-label={`Foto album ${album.title}`}>
        {photos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
            Belum ada foto di album ini.
          </p>
        ) : (
          <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {photos.map((src, i) => (
              <li key={src} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative block w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31E24]"
                  aria-label={`Perbesar foto ${i + 1} dari ${photos.length}`}
                >
                  <img
                    src={src}
                    alt={`${album.title} - foto ${i + 1}`}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/35 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="rounded-full bg-white p-2 text-[#1B1416]">
                      <Maximize2 size={16} aria-hidden />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ===== LIGHTBOX ===== */}
      {isOpen && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau foto ${active + 1} dari ${photos.length}`}
          className="fixed inset-0 z-50 flex flex-col bg-[#1B1416]/95 backdrop-blur-sm"
          onClick={close}
        >
          {/* Bar atas */}
          <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0">
              <p className="font-heading truncate text-sm font-semibold">{album.title}</p>
              <p className="text-xs text-white/60">
                {active + 1} / {photos.length}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-[#E31E24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Tutup pratinjau"
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          {/* Foto */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
            <img
              key={photos[active]}
              src={photos[active]}
              alt={`${album.title} - foto ${active + 1}`}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-[#E31E24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:left-5"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft size={24} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-[#E31E24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-5"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight size={24} aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}