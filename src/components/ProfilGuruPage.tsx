import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, X, ChevronLeft, ChevronRight } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  FOTO GURU                                                          */
/*  Nama file = nama lengkap + gelar, contoh "Dede Kurniawan, S.Pd.png"*/
/*  Pencocokan tidak peduli huruf besar, spasi, koma, atau titik.      */
/* ------------------------------------------------------------------ */
const guruImages = import.meta.glob<{ default: string }>(
  '../assets/guru/*.png',
  { eager: true }
);

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.png$/i, '')
    .replace(/[^a-z0-9]/g, '');

const photoMap: Record<string, string> = Object.entries(guruImages).reduce(
  (acc, [path, mod]) => {
    const file = path.split('/').pop();
    if (file) acc[norm(file)] = mod.default;
    return acc;
  },
  {} as Record<string, string>
);

// Ejaan di folder yang beda dari data (kalau file belum di-rename)
const ALIAS: Record<string, string> = {
  julidami: 'julidarni', // file: "Juli Darni.png"
};

const fallbackAvatar = (label: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    label
  )}&size=600&background=1B1416&color=ffffff&bold=true&format=png`;

export const getGuruPhoto = (filenameOrName: string, fallbackName = 'Guru'): string => {
  const key = norm(filenameOrName);
  const exact = photoMap[key] ?? photoMap[ALIAS[key] ?? ''];
  if (exact) return exact;
  // toleran untuk file yang namanya terpotong (mis. "ndi Putri Siregar, S.Sn.png")
  const fuzzy = Object.keys(photoMap).find(
    (k) => k.length >= 8 && (key.endsWith(k) || k.endsWith(key))
  );
  return fuzzy ? photoMap[fuzzy] : fallbackAvatar(fallbackName);
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
type Tipe = 'produktif' | 'non' | 'lain';
type Jurusan = 'RPL' | 'TKJ' | 'TJA' | 'DKV';

interface Guru {
  id: number;
  nama: string; // lengkap dengan gelar
  jabatan: string;
  tipe: Tipe;
  jurusan?: Jurusan;
  foto: string; // nama file foto
}

// Ubah ke true kalau staf & guru lain (yang tidak ada di daftar produktif / non produktif)
// ingin ikut ditampilkan di bagian paling bawah.
const TAMPILKAN_LAINNYA = false;

const JURUSAN: Record<Jurusan, string> = {
  RPL: 'Rekayasa Perangkat Lunak',
  TKJ: 'Teknik Komputer dan Jaringan',
  TJA: 'Teknik Jaringan Akses',
  DKV: 'Desain Komunikasi Visual',
};
const JURUSAN_ORDER: Jurusan[] = ['RPL', 'TKJ', 'TJA', 'DKV'];

// [nama tampil, jabatan, jurusan, (opsional) nama file foto bila beda]
const PRODUKTIF_RAW: [string, string, Jurusan, string?][] = [
  ['Drs. M Yusuf, S.Kom.', 'Guru Produktif TJA', 'TJA'],
  ['Erick Fitra W, S.T.', 'Guru Produktif RPL', 'RPL'],
  ['Ichwan, S.T.', 'Guru Produktif TKJ', 'TKJ'],
  ['Muhammad Sobri Ali Wardana, S.Kom.', 'Guru Produktif TKJ', 'TKJ'],
  ['Ikhwan El Akmal, M.Kom.', 'Guru Produktif TKJ', 'TKJ'],
  ['Johansyah Nasution, S.T.', 'Guru Produktif RPL', 'RPL'],
  ['Suvina Selian, S.T.', 'Guru Produktif TJA', 'TJA'],
  ['Khairunnisa Alwita, S.Kom.', 'Guru Produktif TKJ', 'TKJ'],
  ['Eka S Harahap, S.Kom.', 'Guru Produktif TKJ', 'TKJ'],
  ['Cindy Anggrayni, M.Kom.', 'Guru Produktif RPL', 'RPL'],
  ['Rizky Noeroel Tricahyani, S.T.', 'Guru Produktif DKV', 'DKV'],
  ['Ardi Syahputra S, S.Kom.', 'Guru Produktif RPL', 'RPL'],
  ['Indah Arpita, S.T.', 'Guru Produktif DKV', 'DKV'],
  ['Rici Indriani, S.Kom.', 'Guru Produktif RPL', 'RPL'],
  ['Rahmad Saleh Lubis, S.T.', 'Guru Produktif TKJ', 'TKJ'],
  ['Desi Nur Indah Sari, S.Kom.', 'Guru Produktif RPL', 'RPL'],
  ['Ridho Zovavic, S.T.', 'Guru Produktif TKJ', 'TKJ'],
];

const NON_RAW: [string, string, string?][] = [
  ['Maimun Hasibuan, S.Pd.', 'Guru Bimbingan Konseling'],
  ['Elsa Ramadhana, M.Pd.', 'Guru Mapel Bahasa Inggris', 'Elsa Ramadhani, M.Pd.png'],
  ['Dede Kurniawan, S.Pd.', 'Guru Mapel PJOK'],
  ['Ari Wibowo, S.Si.', 'Guru Mapel Matematika & IPAS'],
  ['Rahmi Lubis, S.Pd.', 'Guru Mapel B.Indonesia'],
  ['Sarianto Parhusip, M.Th.', 'Guru Mapel Agama Kristen'],
  ['Dra. Rislime Ritonga', 'Guru Mapel Agama Kristen'],
  ['Ezra Kiki Yolanda, S.Pd.', 'Guru Mapel Agama Katolik'],
  ['Dwita Febrina, S.Si.', 'Guru Mapel Matematika & IPAS'],
  ['Rinaldy A Gultom, S.Pd.', 'Guru Mapel B.Inggris'],
  ['Putri Carlina Pratiwi, S.Pd.', 'Guru Mapel PKN'],
  ['Rosmawati, S.Pd.', 'Guru Mapel PKN'],
  ['Indi Putri Siregar, S.Sn.', 'Guru Mapel Seni Budaya'],
  ['Tirodiyah Harahap, S.Ag.', 'Guru Mapel Agama Islam'],
  ['Irawati Bangun, S.Pd., M.Si.', 'Guru Mapel B.Indonesia'],
  ['Suheriana, S.Pd.', 'Guru Mapel B.Inggris'],
  ['Tengku Innayah Balqis, S.Si.', 'Guru Mapel IPAS'],
  ['Nabila Azhara, S.Si.', 'Guru Mapel IPAS'],
  ['Lima Maharamah, S.Pd.', 'Guru Mapel Matematika'],
  ['M Yusuf Lubis, M.Psi.', 'Guru Bimbingan Konseling'],
];

// Tidak ada di daftar produktif / non produktif (hanya tampil bila TAMPILKAN_LAINNYA = true)
const LAIN_RAW: [string, string][] = [
  ['Sri Kahdijah, SE.', 'Staf Keuangan'],
  ['Demiana Simanullang, A.Md.', 'Staf Tata Usaha'],
  ['Fadilansyah Nasution, M.Kom.', 'Instruktur Cisco Academy'],
  ['Juli Dami', 'Staf Umum & Kesiswaan'],
  ['Dian Lestari Sani, S.Sos.', 'Guru Sejarah'],
  ['Hafizah Z, S.Pd.', 'Guru Bahasa Inggris'],
  ['Nurman, SE.', 'Guru Kewirausahaan'],
  ['Susano', 'Staf Sarana & Prasarana'],
  ['Ajeng Dewi K, A.Md.', 'Staf Administrasi'],
  ['Putri Gustina Sari, S.ST.', 'Staf Humas & Hubin'],
  ['Juli Puji L, S.Pd.', 'Guru Bahasa Indonesia'],
  ['Irwansyah Rudi M, S.Si.', 'Guru Matematika'],
  ['Haris M Nasution, S.Kom.', 'Guru Pemrograman Dasar'],
];

let _id = 0;
const make = (
  nama: string,
  jabatan: string,
  tipe: Tipe,
  jurusan?: Jurusan,
  foto?: string
): Guru => ({ id: ++_id, nama, jabatan, tipe, jurusan, foto: foto ?? `${nama}.png` });

export const PRODUKTIF: Guru[] = PRODUKTIF_RAW.map(([n, j, jur, f]) =>
  make(n, j, 'produktif', jur, f)
).sort(
  (a, b) => JURUSAN_ORDER.indexOf(a.jurusan!) - JURUSAN_ORDER.indexOf(b.jurusan!)
);
export const NON_PRODUKTIF: Guru[] = NON_RAW.map(([n, j, f]) => make(n, j, 'non', undefined, f));
export const LAINNYA: Guru[] = LAIN_RAW.map(([n, j]) => make(n, j, 'lain'));

export const GURU_DATA: Guru[] = [
  ...PRODUKTIF,
  ...NON_PRODUKTIF,
  ...(TAMPILKAN_LAINNYA ? LAINNYA : []),
];

// "Irawati Bangun, S.Pd., M.Si." -> { name: "Irawati Bangun", title: "S.Pd., M.Si." }
const splitNama = (nama: string) => {
  const i = nama.indexOf(',');
  return i === -1
    ? { name: nama, title: '' }
    : { name: nama.slice(0, i), title: nama.slice(i + 1).trim() };
};

const TONE: Record<Tipe, string> = {
  produktif: '#E31E24',
  non: '#1B1416',
  lain: '#64748b',
};

const TIPE_LABEL = (g: Guru) =>
  g.tipe === 'produktif' ? `Produktif ${g.jurusan}` : g.tipe === 'non' ? 'Non Produktif' : 'Staf';

/* ------------------------------------------------------------------ */
/*  KOMPONEN KECIL                                                     */
/* ------------------------------------------------------------------ */
function Photo({ g, className = '' }: { g: Guru; className?: string }) {
  const { name } = splitNama(g.nama);
  return (
    <img
      src={getGuruPhoto(g.foto, name)}
      alt={`Foto ${g.nama}`}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const img = e.currentTarget;
        const fb = fallbackAvatar(name);
        if (img.src !== fb) img.src = fb;
      }}
      className={className}
    />
  );
}

/** Kartu ID: merah = guru produktif, hitam = guru non produktif. */
function Badge({
  g,
  onOpen,
  big = false,
}: {
  g: Guru;
  onOpen?: () => void;
  big?: boolean;
}) {
  const { name, title } = splitNama(g.nama);
  const Tag = onOpen ? 'button' : 'div';
  const tone = TONE[g.tipe];
  return (
    <Tag
      {...(onOpen ? { onClick: onOpen, type: 'button' as const } : {})}
      style={{ ['--tone' as string]: tone }}
      className={`pg-badge group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-[var(--ink)] bg-white text-left ${onOpen ? 'cursor-pointer' : ''
        }`}
    >
      {/* strip warna + lubang lanyard */}
      <div className="relative flex h-9 items-center bg-[var(--tone)] px-4">
        <span className="absolute left-1/2 h-2.5 w-14 -translate-x-1/2 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,.35)]" />
        <span className="text-[11px] font-bold text-white">{TIPE_LABEL(g)}</span>
      </div>

      <div className={big ? 'p-5' : 'p-3.5'}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
          <Photo g={g} className="pg-photo h-full w-full object-cover object-top" />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${big ? 'px-5 pb-6' : 'px-3.5 pb-4'}`}>
        <h3 className={`pg-display text-[var(--ink)] ${big ? 'text-4xl' : 'text-[26px]'}`}>
          {name}
        </h3>
        {title && <p className="mt-1 text-xs font-bold text-[var(--tone)]">{title}</p>}
        <p className={`mt-2 font-medium text-slate-600 ${big ? 'text-base' : 'text-sm'}`}>
          {g.jabatan}
        </p>
      </div>
    </Tag>
  );
}

function Grid({ list, onOpen }: { list: Guru[]; onOpen: (id: number) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.map((g) => (
        <li key={g.id}>
          <Badge g={g} onOpen={() => onOpen(g.id)} />
        </li>
      ))}
    </ul>
  );
}

function Band({
  id,
  title,
  desc,
  count,
  bg,
}: {
  id: string;
  title: string;
  desc: string;
  count: number;
  bg: string;
}) {
  return (
    <div id={id} className="scroll-mt-0 text-white" style={{ background: bg }}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 py-12 sm:px-8 md:py-16">
        <div>
          <h2 className="pg-display text-5xl md:text-7xl">{title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{desc}</p>
        </div>
        <p
          aria-label={`${count} guru`}
          className="pg-display pg-outline-w shrink-0 text-8xl leading-none md:text-[10rem]"
        >
          {count}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HALAMAN                                                            */
/* ------------------------------------------------------------------ */
export default function ProfilGuruPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const openIndex = GURU_DATA.findIndex((g) => g.id === openId);
  const current = openIndex >= 0 ? GURU_DATA[openIndex] : null;

  const step = useCallback(
    (d: number) => {
      if (openIndex < 0) return;
      setOpenId(GURU_DATA[(openIndex + d + GURU_DATA.length) % GURU_DATA.length].id);
    },
    [openIndex]
  );

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [current, step]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const byJurusan = useMemo(
    () =>
      JURUSAN_ORDER.map((j) => ({
        kode: j,
        list: PRODUKTIF.filter((g) => g.jurusan === j),
      })).filter((x) => x.list.length),
    []
  );

  // 3 kartu hero: hitam (non produktif) di kiri, merah (produktif) di tengah dan kanan
  const heroGuru = useMemo(
    () => [NON_PRODUKTIF[3], PRODUKTIF[0], PRODUKTIF[7]].filter(Boolean),
    []
  );

  const ribbon = useMemo(() => GURU_DATA.slice(0, 40), []);

  return (
    <div
      className="pg-root min-h-screen bg-white text-slate-800"
      style={{ ['--red' as string]: '#E31E24', ['--ink' as string]: '#1B1416' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pg-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .pg-display { font-family: 'Fraunces', Georgia, serif; font-weight: 700; letter-spacing: -0.02em; line-height: 1.02; }
        .pg-root :focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }

        .pg-badge { transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; box-shadow: 0 1px 0 var(--ink); }
        .pg-badge:hover, .pg-badge:focus-visible { transform: translateY(-6px) rotate(-1deg); box-shadow: 8px 10px 0 var(--tone); }
        .pg-photo { transition: transform .6s; }
        .pg-badge:hover .pg-photo, .pg-badge:focus-visible .pg-photo { transform: scale(1.04); }

        .pg-ribbon { display: flex; width: max-content; animation: pg-slide 90s linear infinite; }
        @keyframes pg-slide { to { transform: translateX(-50%); } }
        .pg-outline { -webkit-text-stroke: 1.5px var(--ink); color: transparent; }
        .pg-outline-w { -webkit-text-stroke: 2px rgba(255,255,255,.85); color: transparent; }

        .pg-hang { transform-origin: 50% -40px; animation: pg-swing 2.4s cubic-bezier(.25,.6,.3,1) both; }
        @keyframes pg-swing { 0% { transform: rotate(var(--r0)) } 100% { transform: rotate(var(--r1)) } }

        .pg-modal { animation: pg-pop .28s cubic-bezier(.2,.9,.3,1) both; }
        @keyframes pg-pop { from { opacity: 0; transform: translateY(16px) scale(.97); } }

        @media (prefers-reduced-motion: reduce) {
          .pg-root *, .pg-modal { transition: none !important; animation: none !important; }
          .pg-hang { transform: rotate(var(--r1)); }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden border-b border-[var(--ink)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-20">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[var(--red)] hover:text-[var(--red)]"
            >
              <ArrowLeft size={16} /> Kembali ke Beranda
            </Link>

            <p className="mt-12 text-sm font-semibold text-slate-600">
              Tenaga pendidik SMK Telkom Medan
            </p>
            <h1 className="pg-display mt-4 text-5xl text-[var(--ink)] sm:text-6xl lg:text-7xl">
              Dua jenis guru, <span className="text-[var(--red)]">satu tujuan: lulusan siap kerja.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
              Guru produktif membangun keahlian jurusan. Guru non produktif membentuk dasar
              pengetahuan dan karakter. Ketuk kartu untuk melihat profilnya.
            </p>

            {/* dua pintu masuk sekaligus legenda warna */}
            <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
              <button
                onClick={() => go('produktif')}
                className="rounded-2xl bg-[var(--red)] p-5 text-left text-white transition-transform hover:-translate-y-1"
              >
                <span className="pg-display block text-5xl">{PRODUKTIF.length}</span>
                <span className="mt-1 block text-base font-bold">Guru Produktif</span>
                <span className="mt-1 block text-sm text-white/85">RPL, TKJ, TJA, dan DKV</span>
                <ArrowDown size={18} className="mt-3" />
              </button>
              <button
                onClick={() => go('non-produktif')}
                className="rounded-2xl border-2 border-[var(--ink)] bg-white p-5 text-left text-[var(--ink)] transition-transform hover:-translate-y-1"
              >
                <span className="pg-display block text-5xl">{NON_PRODUKTIF.length}</span>
                <span className="mt-1 block text-base font-bold">Guru Non Produktif</span>
                <span className="mt-1 block text-sm text-slate-600">Mata pelajaran umum dan BK</span>
                <ArrowDown size={18} className="mt-3" />
              </button>
            </div>
          </div>

          {/* kartu menggantung dengan lanyard */}
          <div className="relative mx-auto hidden h-[470px] w-full max-w-[520px] md:block" aria-hidden>
            {heroGuru.map((g, i) => {
              const cfg = [
                { left: '0%', top: 50, r0: '-18deg', r1: '-8deg', z: 1 },
                { left: '30%', top: 0, r0: '10deg', r1: '2deg', z: 3 },
                { left: '60%', top: 60, r0: '20deg', r1: '9deg', z: 2 },
              ][i];
              return (
                <div
                  key={g.id}
                  className="pg-hang absolute w-[190px]"
                  style={{
                    left: cfg.left,
                    top: cfg.top,
                    zIndex: cfg.z,
                    ['--r0' as string]: cfg.r0,
                    ['--r1' as string]: cfg.r1,
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  <span
                    className="absolute -top-16 left-1/2 h-16 w-1.5 -translate-x-1/2"
                    style={{ background: TONE[g.tipe] }}
                  />
                  <div className="h-[290px]">
                    <Badge g={g} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* pita nama: merah = produktif, garis = non produktif */}
        <div className="overflow-hidden border-t border-[var(--ink)] py-3" aria-hidden>
          <div className="pg-ribbon">
            {[...ribbon, ...ribbon].map((g, i) => (
              <span
                key={i}
                className={`pg-display shrink-0 px-6 text-3xl ${g.tipe === 'produktif' ? 'text-[var(--red)]' : 'pg-outline'
                  }`}
              >
                {splitNama(g.nama).name}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ============ GURU PRODUKTIF ============ */}
      <section>
        <Band
          id="produktif"
          title="Guru Produktif"
          desc="Mengajar mata pelajaran kejuruan dan membimbing praktik langsung di empat jurusan."
          count={PRODUKTIF.length}
          bg="var(--red)"
        />
        <div className="mx-auto max-w-7xl space-y-16 px-5 py-12 sm:px-8 md:py-16">
          {byJurusan.map(({ kode, list }) => (
            <div key={kode}>
              <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="rounded-full bg-[var(--red)] px-4 py-1.5 text-sm font-bold text-white">
                  {kode}
                </span>
                <h3 className="pg-display text-2xl text-[var(--ink)] md:text-3xl">{JURUSAN[kode]}</h3>
                <span className="text-sm font-medium text-slate-500">{list.length} guru</span>
                <span className="hidden h-px flex-1 bg-slate-300 sm:block" />
              </div>
              <Grid list={list} onOpen={setOpenId} />
            </div>
          ))}
        </div>
      </section>

      {/* ============ GURU NON PRODUKTIF ============ */}
      <section>
        <Band
          id="non-produktif"
          title="Guru Non Produktif"
          desc="Mengajar mata pelajaran umum, agama, dan bimbingan konseling yang menjadi dasar setiap siswa."
          count={NON_PRODUKTIF.length}
          bg="var(--ink)"
        />
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <Grid list={NON_PRODUKTIF} onOpen={setOpenId} />
        </div>
      </section>

      {/* ============ LAINNYA (opsional) ============ */}
      {TAMPILKAN_LAINNYA && (
        <section className="border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
            <h2 className="pg-display mb-8 text-4xl text-[var(--ink)]">Staf &amp; lainnya</h2>
            <Grid list={LAINNYA} onOpen={setOpenId} />
          </div>
        </section>
      )}

      {/* ============ DETAIL ============ */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Profil ${current.nama}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/70 p-4 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <div className="pg-modal relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <Badge g={current} big />
            <button
              onClick={() => setOpenId(null)}
              aria-label="Tutup"
              className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-white transition-colors hover:bg-[var(--red)]"
            >
              <X size={18} />
            </button>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => step(-1)}
                aria-label="Sebelumnya"
                className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:text-[var(--red)]"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>
              <span className="text-xs font-semibold text-white">
                {openIndex + 1} dari {GURU_DATA.length}
              </span>
              <button
                onClick={() => step(1)}
                aria-label="Berikutnya"
                className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:text-[var(--red)]"
              >
                Berikutnya <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}