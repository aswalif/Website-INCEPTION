import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  photo: string; // ID foto Unsplash. Ganti dengan foto alumni asli.
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Yudial Hukama",
    role: "Branch Supervisor Biznet",
    quote:
      "Sebuah kebanggaan menjadi alumni SMK Telkom Medan. Ilmu-ilmu yang didapatkan dari para guru terbaik dan berpengalaman dapat langsung diaplikasikan pada dunia profesional!",
    photo: "photo-1534528741775-53994a69daeb",
  },
  {
    id: 2,
    name: "Rio Purba",
    role: "Designpreneur",
    quote:
      "SMK Telkom Medan menjadi fondasi kuat bagi saya untuk menjadi seorang designpreneur. Ilmu yang saya dapatkan di sini sangat relevan dengan dunia kerja, terutama dalam bidang desain. Terima kasih SMK Telkom Medan!",
    photo: "photo-1507003211169-0a1dd7228f2d",
  },
  {
    id: 3,
    name: "Ibnu Alwindra",
    role: "Huawei",
    quote:
      "Terima kasih untuk guru-guru SMK Telkom Medan yang sangat friendly, yang mau mengajari saya detail tentang dunia telekomunikasi. Pesan untuk adik-adik: selalu semangat bersekolah di SMK Telkom Medan karena itu penting!",
    photo: "photo-1500648767791-00dcc994a43e",
  },
  {
    id: 4,
    name: "Raihan Asrawi",
    role: "Basarnas",
    quote:
      "Saya merasa senang dan banyak ilmu yang saya dapatkan dari bersosial ke guru, lingkungan sekolah, dan banyak pengalaman yang saya dapatkan selama bersekolah di SMK Telkom Medan!",
    photo: "photo-1492562080023-ab3db95bfbce",
  },
  {
    id: 5,
    name: "Muhanisya Putri",
    role: "PT. McDermott Indonesia",
    quote:
      "Merupakan kebanggaan bisa bersekolah di SMK Telkom Medan, sekolah unggulan yang memiliki guru-guru yang kompeten di bidangnya dan selalu memberikan yang terbaik bagi para siswanya!",
    photo: "photo-1573496359142-b8d87734a5a2",
  },
];

const COMPANIES = ["Biznet", "Huawei", "Basarnas", "PT. McDermott Indonesia"];

const STATEMENT =
  "Dari Biznet hingga Huawei, dari Basarnas hingga McDermott. Alumni SMK Telkom Medan membawa bekal dari ruang kelas langsung ke dunia profesional.";

const img = (id: string, w: number, ratio = 1.25) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}&h=${Math.round(w * ratio)}`;

/* ------------------------------------------------------------------ */
/*  Styles (warna tema ada di variabel CSS paling atas)                */
/* ------------------------------------------------------------------ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600&display=swap');

.alumni{
  --red:#E31E24;      /* merah Telkom */
  --ink:#1B1416;      /* gelap hangat, dasar seksi gelap */
  --al-pad:clamp(1.25rem,6vw,6rem);
  font-family:'Manrope',system-ui,sans-serif;
}
.al-display{font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-weight:400}
.al-outline{-webkit-text-stroke:1.5px var(--ink);color:transparent}
.al-track{scrollbar-width:none}
.al-track::-webkit-scrollbar{display:none}
.al-focus:focus-visible{outline:2px solid #fff;outline-offset:4px}

@keyframes al-marq{to{transform:translateX(-50%)}}
.al-marq{animation:al-marq 32s linear infinite}

@keyframes al-line{
  0%{transform:scaleY(0);transform-origin:top}
  50%{transform:scaleY(1);transform-origin:top}
  51%{transform-origin:bottom}
  100%{transform:scaleY(0);transform-origin:bottom}
}
.al-scrollline{animation:al-line 2.2s cubic-bezier(.7,0,.2,1) infinite}

@keyframes al-swap{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.al-swap{animation:al-swap .8s cubic-bezier(.2,.7,.1,1) both}

@media (prefers-reduced-motion: reduce){
  .al-marq,.al-scrollline,.al-swap{animation:none}
  .al-rise{transform:none!important;transition:none!important}
  .al-clip{clip-path:none!important;transition:none!important}
}
`;

/* ------------------------------------------------------------------ */
/*  Hooks & helpers                                                    */
/* ------------------------------------------------------------------ */
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true begitu elemen masuk viewport (sekali saja) */
const useInView = <T extends HTMLElement>(threshold = 0.25) => {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
};

/** progres 0..1 saat elemen melewati viewport */
const useScrollProgress = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (prefersReduced()) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
      setP(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return [ref, p] as const;
};

/** baris teks yang naik dari balik mask */
const Line: React.FC<{
  show: boolean;
  delay?: number;
  children: React.ReactNode;
}> = ({ show, delay = 0, children }) => (
  <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
    <span
      className="al-rise block"
      style={{
        transform: show ? "translateY(0)" : "translateY(110%)",
        transition: `transform 1.1s cubic-bezier(.2,.7,.1,1) ${delay}ms`,
      }}
    >
      {children}
    </span>
  </span>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const Hero: React.FC = () => {
  const [ref, seen] = useInView<HTMLElement>(0.2);
  const bg = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el || !bg.current) return;
        const r = el.getBoundingClientRect();
        const y = Math.min(Math.max(-r.top, 0), r.height);
        bg.current.style.transform = `translate3d(0,${y * 0.22}px,0) scale(1.12)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return (
    <header
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[var(--ink)] text-white"
    >
      {/* Foto full-bleed dengan duotone merah, dibuka lewat clip-path */}
      <div
        className="al-clip absolute inset-0"
        style={{
          clipPath: seen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path 1.5s cubic-bezier(.7,0,.2,1)",
        }}
      >
        <img
          ref={bg}
          src={img(testimonials[0].photo, 1800, 0.62)}
          alt=""
          className="h-full w-full object-cover grayscale will-change-transform"
          style={{ transform: "scale(1.12)" }}
        />
        <div className="absolute inset-0 bg-[var(--red)] opacity-70 mix-blend-multiply" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--ink) 0%, rgba(27,20,22,.35) 45%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative px-[var(--al-pad)] pb-8 pt-32 md:pb-12">
        <p className="mb-6 flex items-center gap-3 text-sm text-white/85">
          <span className="h-2 w-2 rounded-full bg-white" />
          Alumni SMK Telkom Medan
        </p>

        <h1 className="al-display text-[clamp(2.8rem,10.5vw,10rem)] leading-[0.92] tracking-[-0.02em]">
          <Line show={seen}>Alumni yang</Line>
          <Line show={seen} delay={120}>
            melangkah ke
          </Line>
          <Line show={seen} delay={240}>
            dunia kerja.
          </Line>
        </h1>

        <div className="mt-10 flex items-end justify-between gap-6 border-t border-white/25 pt-5 text-sm text-white/80">
          <p className="max-w-xs">
            Cerita lulusan dari Biznet, Huawei, Basarnas, hingga McDermott
            Indonesia.
          </p>
          <span className="flex items-center gap-3">
            (Gulir)
            <span className="al-scrollline h-10 w-px bg-white/70" />
          </span>
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/*  Pernyataan: kata terisi mengikuti scroll                           */
/* ------------------------------------------------------------------ */
const Statement: React.FC = () => {
  const [ref, p] = useScrollProgress<HTMLParagraphElement>();
  const words = STATEMENT.split(" ");
  return (
    <section className="bg-white px-[var(--al-pad)] pb-16 pt-24 md:pb-24 md:pt-40">
      <p
        ref={ref}
        className="al-display mx-auto max-w-5xl text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.12] text-[var(--ink)]"
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              opacity:
                0.16 +
                0.84 * Math.min(1, Math.max(0, p * (words.length + 3) - i)),
            }}
          >
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Marquee nama institusi                                             */
/* ------------------------------------------------------------------ */
const Marquee: React.FC = () => (
  <div
    className="group overflow-hidden border-y border-black/10 bg-white py-6 md:py-10"
    aria-hidden="true"
  >
    <div className="al-marq flex w-max items-center group-hover:[animation-play-state:paused]">
      {[0, 1].map((k) => (
        <div key={k} className="flex items-center">
          {COMPANIES.map((c) => (
            <React.Fragment key={c}>
              <span className="al-display al-outline whitespace-nowrap px-8 text-[clamp(2.5rem,7vw,6rem)]">
                {c}
              </span>
              <span className="h-3 w-3 rounded-full bg-[var(--red)]" />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Slider testimoni                                                   */
/* ------------------------------------------------------------------ */
const Arrow: React.FC<{
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, onClick, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="al-focus grid h-12 w-12 place-items-center rounded-full border border-white/30 text-white transition hover:border-[var(--red)] hover:bg-[var(--red)] md:h-14 md:w-14"
  >
    {children}
  </button>
);

const Slider: React.FC = () => {
  const n = testimonials.length;
  const track = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const drag = useRef({ on: false, x: 0, left: 0 });
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const padLeft = () =>
    parseFloat(getComputedStyle(track.current as Element).paddingLeft) || 0;

  const go = useCallback((i: number) => {
    const t = track.current;
    const c = t?.children[i] as HTMLElement | undefined;
    if (!t || !c) return;
    lock.current = true;
    setActive(i);
    t.scrollTo({
      left: c.offsetLeft - padLeft(),
      behavior: prefersReduced() ? "auto" : "smooth",
    });
    window.setTimeout(() => (lock.current = false), 700);
  }, []);

  const onScroll = () => {
    const t = track.current;
    if (!t || lock.current) return;
    const pad = padLeft();
    let best = 0;
    let dist = Infinity;
    Array.from(t.children)
      .slice(0, n)
      .forEach((c, i) => {
        const d = Math.abs((c as HTMLElement).offsetLeft - pad - t.scrollLeft);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
    setActive(best);
  };

  const prev = () => go(active === 0 ? n - 1 : active - 1);
  const next = () => go(active === n - 1 ? 0 : active + 1);

  // drag dengan mouse (sentuhan memakai scroll native)
  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { on: true, x: e.clientX, left: track.current.scrollLeft };
    setDragging(true);
    track.current.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current.on || !track.current) return;
    track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const up = () => {
    if (!drag.current.on) return;
    drag.current.on = false;
    setDragging(false);
    go(active);
  };

  const t = testimonials[active];

  return (
    <section className="bg-[var(--ink)] py-20 text-white md:py-32">
      <div className="mb-10 flex items-end justify-between gap-6 px-[var(--al-pad)] md:mb-16">
        <h2 className="al-display max-w-2xl text-[clamp(2.2rem,5.5vw,5rem)] leading-[1.02]">
          Kata mereka tentang SMK Telkom Medan
        </h2>
        <div className="flex shrink-0 gap-3">
          <Arrow label="Alumni sebelumnya" onClick={prev}>
            <FaArrowLeft />
          </Arrow>
          <Arrow label="Alumni berikutnya" onClick={next}>
            <FaArrowRight />
          </Arrow>
        </div>
      </div>

      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimoni alumni"
        tabIndex={0}
        onScroll={onScroll}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
        className={`al-track relative flex gap-4 overflow-x-auto md:gap-6 ${
          dragging
            ? "cursor-grabbing select-none"
            : "cursor-grab snap-x snap-mandatory"
        }`}
        style={{
          paddingLeft: "var(--al-pad)",
          scrollPaddingLeft: "var(--al-pad)",
        }}
      >
        {testimonials.map((item, i) => (
          <article
            key={item.id}
            onClick={() => go(i)}
            className={`relative aspect-[4/5] w-[76vw] shrink-0 snap-start overflow-hidden transition-[transform,opacity] duration-700 ease-out sm:w-[44vw] lg:w-[28vw] xl:w-[26vw] ${
              i === active ? "opacity-100" : "scale-[.96] opacity-50"
            }`}
          >
            <img
              src={img(item.photo, 900)}
              alt={`Foto ${item.name}`}
              draggable={false}
              loading="lazy"
              className={`h-full w-full object-cover transition duration-700 ${
                i === active ? "scale-100 grayscale-0" : "scale-110 grayscale"
              }`}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(27,20,22,.85), transparent 55%)",
              }}
            />
            <div className="absolute bottom-0 p-5 md:p-6">
              <h3 className="al-display text-3xl md:text-4xl">{item.name}</h3>
              <p className="text-sm text-white/75">{item.role}</p>
            </div>
          </article>
        ))}
        {/* ruang akhir agar kartu terakhir bisa rata kiri */}
        <div
          aria-hidden="true"
          className="w-[24vw] shrink-0 sm:w-[56vw] lg:w-[72vw]"
        />
      </div>

      <div className="mt-12 grid gap-8 px-[var(--al-pad)] md:mt-20 md:grid-cols-12">
        <div className="md:col-span-2">
          <p className="al-display text-3xl">
            {String(active + 1).padStart(2, "0")}
            <span className="text-white/40">
              {" "}
              / {String(n).padStart(2, "0")}
            </span>
          </p>
          <div className="mt-4 h-px w-full max-w-[8rem] bg-white/20">
            <div
              className="h-full bg-[var(--red)] transition-all duration-700"
              style={{ width: `${((active + 1) / n) * 100}%` }}
            />
          </div>
        </div>
        <figure
          key={active}
          aria-live="polite"
          className="al-swap md:col-span-10 lg:col-span-9"
        >
          <blockquote className="al-display text-[clamp(1.5rem,3vw,2.6rem)] leading-[1.2]">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-6 text-sm text-white/70">
            <span className="text-white">{t.name}</span> / {t.role}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */
const Cta: React.FC = () => {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  return (
    <section
      ref={ref}
      className="bg-[var(--red)] px-[var(--al-pad)] py-24 text-white md:py-40"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <h2 className="al-display text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.02em]">
          <Line show={seen}>Jadilah alumni</Line>
          <Line show={seen} delay={120}>
            berikutnya.
          </Line>
        </h2>

        <div className="flex max-w-xs flex-col gap-6">
          <p className="text-base text-white/90">
            Daftar lewat website PPDB, atau tanya langsung ke kami melalui
            WhatsApp{" "}
            <a
              href="https://wa.me/628116500153"
              target="_blank"
              rel="noopener noreferrer"
              className="al-focus underline underline-offset-4"
            >
              +62 811-6500-153
            </a>
            .
          </p>
          <a
            href="https://ppdb.telkomschools.sch.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="al-focus group grid h-36 w-36 place-items-center rounded-full bg-white text-[var(--red)] transition duration-500 hover:scale-110 md:h-44 md:w-44"
          >
            <span className="flex flex-col items-center gap-2 font-semibold">
              Daftar PPDB
              <FaArrowRight className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Halaman                                                            */
/* ------------------------------------------------------------------ */
const Alumni: React.FC = () => (
  <div className="alumni" id="alumni">
    <style>{css}</style>
    <Hero />
    <Statement />
    <Marquee />
    <Slider />
    <Cta />
  </div>
);

export default Alumni;
