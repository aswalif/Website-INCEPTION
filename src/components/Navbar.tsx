import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';

/* ------------------------------------------------------------------ */
/* Data menu                                                           */
/* ------------------------------------------------------------------ */

interface NavLink {
  label: string;
  href: string;
}

interface SingleEntry extends NavLink {
  type: 'link';
}

interface GroupEntry {
  type: 'group';
  id: string;
  label: string;
  items: NavLink[];
}

type NavEntry = SingleEntry | GroupEntry;

const MENU: NavEntry[] = [
  { type: 'link', label: 'Beranda', href: '#hero' },
  {
    type: 'group',
    id: 'tentang',
    label: 'Tentang',
    items: [
      { label: 'Profil Sekolah', href: '#profil' },
      { label: 'Visi dan Misi', href: '#visi-misi' },
      { label: 'Struktur Organisasi', href: '#struktur' },
      { label: 'Akreditasi', href: '#akreditasi' },
      { label: 'Fasilitas', href: '#fasilitas' },
    ],
  },
  { type: 'link', label: 'Jurusan', href: '#jurusan' },
  { type: 'link', label: 'Alumni', href: '#alumni' },
  { type: 'link', label: 'Kontak', href: '#kontak' },
];

// Menu dengan label panjang memakai indikator yang lebih lebar
const WIDE_LABEL_LENGTH = 12;

// Batas scroll untuk berpindah dari transparan ke solid
const SCROLL_THRESHOLD = 20;

// Semua id section yang dipantau oleh IntersectionObserver (hanya link dalam halaman yang berupa hash "#...")
const SECTION_IDS: string[] = MENU.flatMap((entry) =>
  entry.type === 'link' ? [entry.href] : entry.items.map((item) => item.href),
)
  .filter((href) => href.startsWith('#'))
  .map((href) => href.slice(1));

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400';

// Bayangan teks tipis agar menu tetap terbaca di atas gambar Hero
const TEXT_SHADOW = '[text-shadow:0_1px_10px_rgba(0,0,0,0.5)]';

// Font khas untuk Navbar (dimuat via Google Fonts, sama dengan Hero agar konsisten)
const FONT_ID = 'app-plus-jakarta-sans-font';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
const FONT_STACK = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

/**
 * Warna teks menu level atas.
 * onDark = navbar kaca transparan di atas Hero (teks putih).
 * Selain itu navbar kaca lebih solid (teks abu-abu gelap).
 */
function topLevelTone(onDark: boolean, active: boolean, open: boolean): string {
  if (onDark) {
    return `${open ? 'text-red-300' : 'text-white'} hover:text-red-300 ${TEXT_SHADOW}`;
  }
  return `${active || open ? 'text-red-600' : 'text-slate-700'} hover:text-red-600`;
}

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
        open ? 'rotate-180' : 'rotate-0'
      }`}
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

/**
 * Indikator ┴ merah bercahaya lembut. Hanya muncul saat hover (atau fokus keyboard).
 * - Garis horizontal tumbuh dari titik tengah ke kiri dan kanan.
 * - Garis vertikal tumbuh dari atas ke bawah dan menyentuh garis horizontal.
 *
 * Harus ditempatkan tepat setelah elemen ber-class `peer`, di dalam parent ber-class `group`.
 * Kedua garis berupa sibling langsung agar `peer-focus-visible` bekerja.
 */
function HoverIndicator({
  wide = false,
  onDark,
}: {
  wide?: boolean;
  onDark: boolean;
}) {
  const color = onDark
    ? 'bg-gradient-to-r from-red-300 to-red-400 shadow-[0_0_10px_rgba(252,165,165,0.8)]'
    : 'bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_10px_rgba(220,38,38,0.55)]';

  return (
    <>
      {/* Garis vertikal: bawahnya (-6px) tepat di atas garis horizontal */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-[6px] left-1/2 -ml-px h-2.5 w-0.5 origin-top scale-y-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-y-100 peer-focus-visible:scale-y-100 motion-reduce:transition-none ${color}`}
      />
      {/* Garis horizontal: tebal 2px, dipusatkan terhadap menu */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-2 left-1/2 h-0.5 origin-center scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100 peer-focus-visible:scale-x-100 motion-reduce:transition-none ${color} ${
          wide ? '-ml-14 w-28' : '-ml-7 w-14'
        }`}
      />
    </>
  );
}

interface DesktopGroupProps {
  group: GroupEntry;
  isOpen: boolean;
  onDark: boolean;
  activeHref: string;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onNavigate: () => void;
}

function DesktopGroup({
  group,
  isOpen,
  onDark,
  activeHref,
  onOpen,
  onClose,
  onToggle,
  onNavigate,
}: DesktopGroupProps) {
  const isActive = group.items.some((item) => item.href === activeHref);
  const triggerId = `nav-${group.id}-trigger`;
  const panelId = `nav-${group.id}-panel`;

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      onClose();
    }
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    // detail === 0 berarti diaktifkan lewat keyboard (Enter/Space) -> toggle.
    // Klik mouse: dropdown sudah terbuka karena hover, jadi jangan ditutup lagi.
    if (event.detail === 0) {
      onToggle();
    } else {
      onOpen();
    }
  };

  return (
    <li
      data-nav-owner
      className="group relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={handleBlur}
    >
      <button
        type="button"
        id={triggerId}
        data-nav-trigger
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onOpen();
          }
        }}
        className={`peer inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${FOCUS_RING} ${topLevelTone(
          onDark,
          isActive,
          isOpen,
        )}`}
      >
        {group.label}
        <ChevronIcon open={isOpen} />
      </button>
      <HoverIndicator wide={group.label.length > WIDE_LABEL_LENGTH} onDark={onDark} />

      {/* Wrapper dengan padding-top menjembatani celah agar dropdown tidak tertutup */}
      <div
        className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Panel kaca (glass) selalu terang, apa pun kondisi navbar */}
        <div
          className={`relative rounded-2xl border border-white/60 bg-white/85 py-2 shadow-2xl shadow-slate-900/20 backdrop-blur-2xl ring-1 ring-inset ring-white/40 transition-all duration-200 ease-out motion-reduce:transition-none ${
            isOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm border-l border-t border-white/60 bg-white/85 backdrop-blur-2xl"
          />
          <ul id={panelId} aria-labelledby={triggerId} className="relative flex flex-col">
            {group.items.map((item) => {
              const current = item.href === activeHref;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    className={`mx-2 block rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-red-500/10 hover:text-red-600 focus-visible:bg-red-500/10 focus-visible:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400 ${
                      current ? 'bg-red-500/10 text-red-600' : 'text-slate-700'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

interface MobileGroupProps {
  group: GroupEntry;
  expanded: boolean;
  activeHref: string;
  onToggle: () => void;
  onNavigate: () => void;
}

function MobileGroup({
  group,
  expanded,
  activeHref,
  onToggle,
  onNavigate,
}: MobileGroupProps) {
  const isActive = group.items.some((item) => item.href === activeHref);
  const buttonId = `m-${group.id}-trigger`;
  const panelId = `m-${group.id}-panel`;

  return (
    <li>
      <button
        type="button"
        id={buttonId}
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left text-base font-medium transition-colors duration-200 hover:bg-red-500/10 hover:text-red-600 ${FOCUS_RING} ${
          isActive || expanded ? 'text-red-600' : 'text-slate-700'
        }`}
      >
        {group.label}
        <ChevronIcon open={expanded} />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <ul
            id={panelId}
            aria-labelledby={buttonId}
            className={`ml-6 mt-1 flex flex-col gap-0.5 border-l border-slate-200/70 pl-2 transition-[visibility] duration-300 ${
              expanded ? 'visible' : 'invisible'
            }`}
          >
            {group.items.map((item) => {
              const current = item.href === activeHref;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 hover:text-red-600 ${FOCUS_RING} ${
                      current ? 'text-red-600' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(
    () => typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD,
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeHref, setActiveHref] = useState<string>('#hero');

  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  // Muat font "Plus Jakarta Sans" (dibagi dengan Hero Section agar tipografi konsisten)
  useEffect(() => {
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement('link');
      link.id = FONT_ID;
      link.rel = 'stylesheet';
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }
  }, []);

  // Efek scroll (dibatasi requestAnimationFrame) + tutup dropdown desktop saat scroll
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      setActiveDropdown(null);
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  // Klik di luar navbar dan tombol Escape
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const nav = navRef.current;
      if (nav && event.target instanceof Node && !nav.contains(event.target)) {
        closeAll();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      const focused = document.activeElement;
      if (focused instanceof HTMLElement && navRef.current?.contains(focused)) {
        if (mobilePanelRef.current?.contains(focused)) {
          toggleRef.current?.focus();
        } else {
          focused
            .closest<HTMLElement>('[data-nav-owner]')
            ?.querySelector<HTMLElement>('[data-nav-trigger]')
            ?.focus();
        }
      }
      closeAll();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeAll]);

  // Section aktif via IntersectionObserver
  useEffect(() => {
    const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (targets.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  // Tutup menu mobile otomatis ketika layar melebar ke ukuran desktop
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Navbar lebih solid jika sudah scroll atau menu mobile terbuka
  const solid = scrolled || mobileOpen;
  // Navbar kaca transparan di atas Hero -> teks putih
  const onDark = !solid;

  const toggleMobile = () => {
    setMobileOpen((open) => !open);
    setMobileExpanded(null);
    setActiveDropdown(null);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Navigasi utama"
      style={{ fontFamily: FONT_STACK }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <style>{`
        @keyframes nav-fade-in {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-nav-in { animation: nav-fade-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .animate-nav-in { animation: none; }
        }
      `}</style>

      {/* Bar navigasi mengambang (floating glass bar) */}
      <div
        className={`animate-nav-in mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 transition-all duration-500 ease-out sm:px-5 ${
          solid
            ? 'h-16 border-white/60 bg-white/70 shadow-lg shadow-slate-900/10 backdrop-blur-2xl'
            : 'h-20 border-white/20 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-2xl'
        }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={closeAll}
          aria-label="SMK Telkom Medan, kembali ke beranda"
          className={`group rounded-xl ${FOCUS_RING}`}
        >
          <img
            src="/logo-telkom.png"
            alt="Logo SMK Telkom Medan"
            className={`w-auto rounded-xl object-contain transition-all duration-300 ease-in-out group-hover:scale-105 ${
              solid ? 'h-10' : 'h-12'
            }`}
          />
        </a>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {MENU.map((entry) => {
            if (entry.type === 'group') {
              return (
                <DesktopGroup
                  key={entry.id}
                  group={entry}
                  isOpen={activeDropdown === entry.id}
                  onDark={onDark}
                  activeHref={activeHref}
                  onOpen={() => setActiveDropdown(entry.id)}
                  onClose={() =>
                    setActiveDropdown((current) =>
                      current === entry.id ? null : current,
                    )
                  }
                  onToggle={() =>
                    setActiveDropdown((current) =>
                      current === entry.id ? null : entry.id,
                    )
                  }
                  onNavigate={closeAll}
                />
              );
            }

            const isActive = entry.href === activeHref;
            return (
              <li key={entry.href} className="group relative">
                <a
                  href={entry.href}
                  onClick={closeAll}
                  aria-current={isActive ? 'page' : undefined}
                  className={`peer inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${FOCUS_RING} ${topLevelTone(
                    onDark,
                    isActive,
                    false,
                  )}`}
                >
                  {entry.label}
                </a>
                <HoverIndicator onDark={onDark} />
              </li>
            );
          })}
        </ul>

        {/* Tombol hamburger (mobile) */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobile}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 lg:hidden ${FOCUS_RING} ${
            onDark
              ? 'border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
              : 'border-white/50 bg-white/60 text-slate-800 backdrop-blur-md hover:bg-white/80'
          }`}
        >
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? 'top-[7px] rotate-45' : 'top-0 rotate-0'
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? 'top-[7px] -rotate-45' : 'top-[14px] rotate-0'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menu mobile: kartu kaca mengambang di bawah bar */}
      <div
        id="mobile-menu"
        ref={mobilePanelRef}
        className={`absolute inset-x-3 top-full mt-2 overflow-hidden rounded-2xl transition-all duration-300 ease-out motion-reduce:transition-none sm:inset-x-6 lg:hidden ${
          mobileOpen
            ? 'visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0'
        }`}
      >
        <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-white/60 bg-white/80 px-4 pb-6 pt-3 shadow-xl shadow-slate-900/15 backdrop-blur-2xl ring-1 ring-inset ring-white/40">
          <ul className="flex flex-col gap-1">
            {MENU.map((entry) => {
              if (entry.type === 'group') {
                return (
                  <MobileGroup
                    key={entry.id}
                    group={entry}
                    expanded={mobileExpanded === entry.id}
                    activeHref={activeHref}
                    onToggle={() =>
                      setMobileExpanded((current) =>
                        current === entry.id ? null : entry.id,
                      )
                    }
                    onNavigate={closeAll}
                  />
                );
              }

              const isActive = entry.href === activeHref;
              return (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    onClick={closeAll}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors duration-200 hover:bg-red-500/10 hover:text-red-600 ${FOCUS_RING} ${
                      isActive ? 'text-red-600' : 'text-slate-700'
                    }`}
                  >
                    {entry.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}