import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  ASSETS                                                             */
/* ------------------------------------------------------------------ */

// Logo sekolah — sesuaikan path/nama file dengan aset Anda.
import logoSekolah from '../assets/logo-smk-telkom.png';

// Auto-import seluruh logo mitra dari src/assets/mitra/*.png
const mitraModules = import.meta.glob<{ default: string }>('../assets/mitra/*.png', {
  eager: true,
});

type Mitra = { name: string; src: string };

const MITRA: Mitra[] = Object.entries(mitraModules)
  .map(([path, mod]) => {
    const file = path.split('/').pop() ?? '';
    const name = file
      .replace(/\.png$/i, '')
      .replace(/^\d+\./, '')
      .replace(/-preview$/i, '')
      .replace(/[-_]+/g, ' ');
    return { file, name, src: mod.default };
  })
  // urutkan berdasarkan nomor di awal nama file (1., 2., 3., ...)
  .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))
  .map(({ name, src }) => ({ name, src }));

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'Beranda', to: '#hero' },
  { label: 'Profil Sekolah', to: '#profil' },
  { label: 'Jurusan', to: '#jurusan' },
  { label: 'Akademi Cisco', to: '/cisco-academy' },
  { label: 'Akademi MikroTik', to: '/mikrotik-academy' },
  { label: 'Profil Guru', to: '/profil-guru' },
  { label: 'Prestasi', to: '/prestasi' },
  { label: 'Kemitraan', to: '/kemitraan' },
];

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/p/SMK-Telkom-Medan-100063703027473/',
    path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/smktelkommedan01',
    path: 'M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@smktelkom_medan',
    path: 'M16.6 2h-3.1v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.4a6 6 0 1 0 5.1 5.9V8.6a7.5 7.5 0 0 0 4.4 1.4V6.9A4.4 4.4 0 0 1 16.6 2z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@officialmediasmktelkommeda2565',
    path: 'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.76 2 12 2 12s0 3.24.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.4-4.8zM10 15V9l5.2 3L10 15z',
  },
];

const ADDRESS =
  'Jl. Jamin Ginting Km. 11 No. 9C, Kec. Medan Tuntungan, Kota Medan, Sumatera Utara 20137';
const EMAIL = 'smktelkommedan01@gmail.com';
const PHONE_DISPLAY = '08116500153';
const PHONE_WA = '628116500153';
const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=SMK+Telkom+1+Medan';

/* ------------------------------------------------------------------ */
/*  HOOKS                                                              */
/* ------------------------------------------------------------------ */

/** Status operasional real-time (WIB / UTC+7): Senin–Jumat, 07.00–16.00 */
function computeOpen() {
  const wib = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const day = wib.getUTCDay(); // 0 = Minggu
  const minutes = wib.getUTCHours() * 60 + wib.getUTCMinutes();
  const isWeekday = day >= 1 && day <= 5;
  return isWeekday && minutes >= 7 * 60 && minutes < 16 * 60;
}

function useSchoolStatus() {
  const [open, setOpen] = useState(computeOpen);
  useEffect(() => {
    const id = window.setInterval(() => setOpen(computeOpen()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}

/**
 * Infinite marquee berbasis requestAnimationFrame.
 * - Hanya berjalan saat terlihat di layar & tab aktif
 * - Lebar track diukur sekali (ResizeObserver), bukan tiap frame
 * - Konten digandakan COPIES kali
 */
const COPIES = 2;

function useMarquee(speed = 45) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const impulseRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0;
    let last = performance.now();
    let raf = 0;
    let visible = false;
    let setWidth = 0;

    const measure = () => {
      setWidth = track.scrollWidth / COPIES;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!pausedRef.current && !reduceMotion) x -= speed * dt;

      if (impulseRef.current !== 0) {
        let step = impulseRef.current * 0.12;
        if (Math.abs(impulseRef.current) < 0.5) {
          step = impulseRef.current;
          impulseRef.current = 0;
        } else {
          impulseRef.current -= step;
        }
        x += step;
      }

      if (setWidth > 0) {
        while (x <= -setWidth) x += setWidth;
        while (x > 0) x -= setWidth;
      }
      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: '100px' },
    );
    io.observe(track);

    document.addEventListener('visibilitychange', sync);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [speed]);

  const nudge = useCallback((dir: 'prev' | 'next') => {
    impulseRef.current += dir === 'prev' ? 320 : -320;
  }, []);
  const setPaused = useCallback((v: boolean) => {
    pausedRef.current = v;
  }, []);

  return { trackRef, nudge, setPaused };
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-6 flex items-center gap-3 font-display text-2xl text-white">
      <span aria-hidden className="h-px w-6 bg-[var(--red)]" />
      {children}
    </h3>
  );
}

function MitraCard({ mitra, hidden }: { mitra: Mitra; hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-52"
    >
      <img
        src={mitra.src}
        alt={hidden ? '' : `Logo ${mitra.name}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useSchoolStatus();
  const { trackRef, nudge, setPaused } = useMarquee(45);

  // Digandakan agar marquee tidak pernah kosong di layar lebar.
  // Jika logo mitra sedikit (< ±8), naikkan COPIES menjadi 3.
  const loop = useMemo(() => Array.from({ length: COPIES }, () => MITRA).flat(), []);

  const scrollToId = (hash: string) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHash = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToId(hash);
    } else {
      navigate('/');
      window.setTimeout(() => scrollToId(hash), 350);
    }
  };

  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer-root relative overflow-hidden bg-neutral-950 text-slate-300" id="Footer">
      <style>{`
        .footer-root { --ink:#1B1416; --red:#E31E24; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
        .footer-root .font-display { font-family:'Instrument Serif',Georgia,serif; font-weight:400; letter-spacing:-0.01em; }
        @keyframes footer-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-6px) } }
        @keyframes footer-ping { 0% { transform:scale(1); opacity:.7 } 80%,100% { transform:scale(2.4); opacity:0 } }
        .footer-float { animation: footer-float 2.8s ease-in-out infinite; }
        .footer-ping { animation: footer-ping 1.8s cubic-bezier(0,0,.2,1) infinite; }
        @media (prefers-reduced-motion: reduce) { .footer-float, .footer-ping { animation:none } }
      `}</style>

      {/* ============ MITRA INDUSTRI ============ */}
      <section
        id="mitra"
        aria-labelledby="mitra-title"
        className="relative z-10 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2
              id="mitra-title"
              className="font-display text-4xl leading-[1.05] text-[var(--ink)] sm:text-5xl"
            >
              Dipercaya dunia industri,
              <br />
              <span className="italic text-slate-500">dibangun bersama mitra.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Kolaborasi dengan perusahaan, akademi teknologi, dan institusi untuk memastikan
              lulusan siap kerja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => nudge('prev')}
              aria-label="Geser logo mitra ke kiri"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-[var(--ink)] transition-all duration-300 hover:border-[var(--red)] hover:bg-[var(--red)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => nudge('next')}
              aria-label="Geser logo mitra ke kanan"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-[var(--ink)] transition-all duration-300 hover:border-[var(--red)] hover:bg-[var(--red)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {MITRA.length > 0 && (
          <div
            className="relative mt-10 overflow-hidden py-4"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            role="group"
            aria-label="Daftar mitra industri SMK Telkom Medan"
          >
            <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
              {loop.map((m, i) => (
                <MitraCard key={`${m.name}-${i}`} mitra={m} hidden={i >= MITRA.length} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============ MAIN FOOTER GRID ============ */}
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Kolom 1 — Identitas */}
          <div className="lg:col-span-3">
            <img
              src={logoSekolah}
              alt="Logo SMK Telkom Medan"
              decoding="async"
              className="h-20 w-auto"
            />

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-400">
              SMK Pusat Keunggulan &amp; Sekolah Berbasis IT Terbaik di Sumatera Utara dengan
              Akreditasi &lsquo;A&rsquo;.
            </p>

            <ul className="mt-6 flex flex-col items-start gap-2.5">
              <li className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200">
                <ShieldCheck size={14} className="text-[var(--red)]" />
                Yayasan Pendidikan Telkom
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200">
                <Award size={14} className="text-[var(--red)]" />
                ISO 9001 Certified
              </li>
            </ul>
          </div>

          {/* Kolom 2 — Navigasi */}
          <nav aria-label="Navigasi cepat" className="lg:col-span-2">
            <ColumnTitle>Navigasi</ColumnTitle>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map((l) => {
                const cls =
                  'group inline-flex items-center gap-2 text-slate-400 transition-colors duration-300 hover:text-white focus:outline-none focus-visible:text-white';
                const dash = (
                  <span
                    aria-hidden
                    className="h-px w-0 bg-[var(--red)] transition-all duration-300 group-hover:w-4"
                  />
                );
                return (
                  <li key={l.label}>
                    {l.to.startsWith('#') ? (
                      <a href={`/${l.to}`} onClick={(e) => handleHash(e, l.to)} className={cls}>
                        {dash}
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.to} className={cls}>
                        {dash}
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Kolom 3 — Kontak */}
          <div className="lg:col-span-3">
            <ColumnTitle>Kontak</ColumnTitle>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--red)]" />
                <address className="not-italic leading-relaxed text-slate-400">{ADDRESS}.</address>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 break-all text-slate-400 transition-colors duration-300 hover:text-white"
                >
                  <Mail size={18} className="shrink-0 text-[var(--red)]" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${PHONE_WA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 transition-colors duration-300 hover:text-white"
                >
                  <Phone size={18} className="shrink-0 text-[var(--red)]" />
                  {PHONE_DISPLAY} (WhatsApp)
                </a>
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--red)] hover:bg-[var(--red)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 4 — Peta */}
          <div className="sm:col-span-2 lg:col-span-4">
            <ColumnTitle>Lokasi Sekolah</ColumnTitle>
            <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40 lg:h-72">
              <iframe
                title="Peta lokasi SMK Telkom Medan"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7964.56256599221!2d98.62224200000001!3d3.522328!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3031257487ec36b7%3A0xf835dac8905a90db!2sSMK%20Telkom%201%20Medan!5e0!3m2!1sid!2sid!4v1791045359534!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
              />
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-xl bg-[var(--red)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/40 transition-all duration-300 hover:bg-white hover:text-[var(--red)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Navigation size={16} />
                Buka Peta Petunjuk Arah
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-relaxed text-slate-500">
            &copy; 2026 SMK Telkom Medan. All Rights Reserved. Built with Precision for
            Competition.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"
            >
              <span className="relative flex h-2.5 w-2.5">
                {isOpen && (
                  <span className="footer-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isOpen ? 'bg-emerald-400' : 'bg-[var(--red)]'
                  }`}
                />
              </span>
              <Clock size={13} className="text-slate-400" />
              <span>
                Jam Operasional: Senin - Jumat (07.00 - 16.00 WIB)
                <span className={`ml-2 font-semibold ${isOpen ? 'text-emerald-400' : 'text-[var(--red)]'}`}>
                  {isOpen ? 'Sedang Buka' : 'Tutup'}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={backToTop}
              aria-label="Kembali ke atas"
              className="footer-float group flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-5 pr-2 text-sm font-medium text-white transition-colors duration-300 hover:border-[var(--red)] hover:bg-[var(--red)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Kembali ke Atas
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--red)] transition-colors duration-300 group-hover:bg-white group-hover:text-[var(--red)]">
                <ArrowUp size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}