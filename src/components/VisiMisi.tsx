import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Font (disamakan dengan Navbar & Hero agar tipografi konsisten)      */
/* ------------------------------------------------------------------ */

const BODY_FONT_ID = 'app-plus-jakarta-sans-font';
const BODY_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
const BODY_FONT_STACK = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const HEADING_FONT_ID = 'hero-headline-font';
const HEADING_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&display=swap';
const HEADING_FONT_STACK = "'Fraunces', Georgia, 'Times New Roman', serif";

/* ------------------------------------------------------------------ */
/* Dummy data                                                          */
/* ------------------------------------------------------------------ */

const VISI =
  'Mewujudkan lembaga pendidikan kejuruan teknologi informasi yang unggul, inovatif, dan berkarakter, guna menghasilkan lulusan yang kompeten dan berdaya saing di tingkat nasional maupun internasional.';

const MISI: string[] = [
  'Menyelenggarakan pendidikan kejuruan berbasis teknologi informasi yang berkualitas dan relevan dengan kebutuhan dunia usaha, dunia industri, dan dunia kerja (DUDIKA).',
  'Mengembangkan kompetensi peserta didik melalui pembelajaran berbasis proyek nyata, praktik kerja lapangan, dan sertifikasi kompetensi.',
  'Membentuk karakter disiplin, jujur, mandiri, dan bertanggung jawab pada seluruh warga sekolah.',
  'Menjalin kemitraan strategis dengan perguruan tinggi, industri, dan lembaga sertifikasi untuk memperluas peluang karier lulusan.',
  'Mendorong budaya inovasi, kreativitas, dan pemanfaatan teknologi terkini dalam setiap proses pembelajaran.',
];

/* ------------------------------------------------------------------ */
/* Animasi scroll-in                                                   */
/* ------------------------------------------------------------------ */

// Kelas dasar untuk elemen yang di-animasikan: mulai tersembunyi & sedikit
// bergeser, lalu "muncul" ketika section terlihat di viewport.
const REVEAL_BASE =
  'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none';

function reveal(visible: boolean, hidden: string) {
  return `${REVEAL_BASE} ${visible ? 'opacity-100 translate-x-0 translate-y-0' : hidden}`;
}

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function QuoteMark() {
  return (
    <span
      aria-hidden="true"
      className="block text-6xl font-black leading-none text-red-500/60 sm:text-7xl"
      style={{ fontFamily: HEADING_FONT_STACK }}
    >
      &ldquo;
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* VisiMisi                                                             */
/* ------------------------------------------------------------------ */

export default function VisiMisi() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Muat font Plus Jakarta Sans (body) & Fraunces (judul) — cek dulu agar tidak dobel
  // jika sudah dimuat oleh Navbar/Hero.
  useEffect(() => {
    if (!document.getElementById(BODY_FONT_ID)) {
      const link = document.createElement('link');
      link.id = BODY_FONT_ID;
      link.rel = 'stylesheet';
      link.href = BODY_FONT_HREF;
      document.head.appendChild(link);
    }
    if (!document.getElementById(HEADING_FONT_ID)) {
      const link = document.createElement('link');
      link.id = HEADING_FONT_ID;
      link.rel = 'stylesheet';
      link.href = HEADING_FONT_HREF;
      document.head.appendChild(link);
    }
  }, []);

  // Trigger animasi sekali saat section mulai masuk viewport ketika di-scroll.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visi-misi"
      className="relative overflow-hidden bg-white px-6 py-20 sm:py-28"
      style={{ fontFamily: BODY_FONT_STACK }}
    >
      {/* Elemen dekoratif kaca yang lembut (konsisten dengan Hero) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-red-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-slate-200/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`mx-auto max-w-2xl text-center ${reveal(isVisible, 'opacity-0 translate-y-8')}`}
        >
          <span className="mx-auto mb-4 block h-1 w-14 rounded-full bg-gradient-to-r from-red-500 to-red-400" />
          <h2
            className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl"
            style={{ fontFamily: HEADING_FONT_STACK }}
          >
            Visi &amp; Misi
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Arah dan komitmen kami dalam membentuk generasi unggul di bidang
            teknologi informasi — dilandasi karakter, kompetensi, dan
            kesiapan menghadapi dunia kerja.
          </p>
        </div>

        {/* Grid Visi & Misi */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Card Visi */}
          <div
            style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl ring-1 ring-inset ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-100 sm:p-10 ${reveal(
              isVisible,
              'opacity-0 -translate-x-6',
            )}`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/5 blur-2xl transition-colors duration-300 group-hover:bg-red-500/10"
            />
            <div className="relative">
              <QuoteMark />
              <h3
                className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl"
                style={{ fontFamily: HEADING_FONT_STACK }}
              >
                Visi
              </h3>
              <p className="mt-4 text-lg italic leading-relaxed text-slate-700 sm:text-xl">
                &ldquo;{VISI}&rdquo;
              </p>
            </div>
            <div className="relative mt-8 h-px w-full bg-gradient-to-r from-red-500/40 via-red-500/10 to-transparent" />
          </div>

          {/* Card Misi */}
          <div
            style={{ transitionDelay: isVisible ? '250ms' : '0ms' }}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl ring-1 ring-inset ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-100 sm:p-10 ${reveal(
              isVisible,
              'opacity-0 translate-x-6',
            )}`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-red-500/5 blur-2xl transition-colors duration-300 group-hover:bg-red-500/10"
            />
            <h3
              className="relative text-xl font-bold text-slate-900 sm:text-2xl"
              style={{ fontFamily: HEADING_FONT_STACK }}
            >
              Misi
            </h3>

            <ol className="relative mt-6 flex flex-col gap-5">
              {MISI.map((item, index) => (
                <li
                  key={item}
                  style={{
                    transitionDelay: isVisible ? `${350 + index * 100}ms` : '0ms',
                  }}
                  className={`flex items-start gap-4 ${reveal(isVisible, 'opacity-0 translate-y-4')}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-sm font-bold text-red-600 backdrop-blur-md transition-colors duration-300 group-hover:border-red-500/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}