import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserCheck,
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Award,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  FOTO GURU — auto-import semua PNG di src/assets/guru/              */
/*  Nama file mengikuti slug nama (lihat slugify), contoh:             */
/*  "Dede Kurniawan, S.Pd." -> dede-kurniawan.png                      */
/* ------------------------------------------------------------------ */
const guruImages = import.meta.glob<{ default: string }>(
  '../assets/guru/*.png',
  { eager: true }
);

const photoMap: Record<string, string> = Object.entries(guruImages).reduce(
  (acc, [path, mod]) => {
    const file = path.split('/').pop();
    if (file) acc[file.toLowerCase()] = mod.default;
    return acc;
  },
  {} as Record<string, string>
);

const fallbackAvatar = (label: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    label
  )}&size=600&background=1B1416&color=ffffff&bold=true&format=png`;

export const getGuruPhoto = (filename: string, fallbackName = 'Guru'): string =>
  photoMap[filename.toLowerCase()] ?? fallbackAvatar(fallbackName);

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
type Kategori = 'it' | 'sosial' | 'agama' | 'staf';
type Filter = 'semua' | Kategori;

interface Guru {
  id: number;
  nama: string;
  jabatan: string;
  kategori: Kategori;
  foto: string;
}

// Nama tanpa gelar -> slug nama file. "Dra. Rislime Ritonga" -> rislime-ritonga.png
const slugify = (nama: string) =>
  nama
    .split(',')[0]
    .replace(/^(Drs?\.|Dra\.)\s*/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const RAW: [string, string, Kategori][] = [
  ['Dede Kurniawan, S.Pd.', 'Guru Matematika', 'it'],
  ['Elsa Ramadhani, M.Pd.', 'Guru Matematika', 'it'],
  ['M Yusuf Lubis, M.Psi.', 'Guru Bimbingan Konseling', 'agama'],
  ['Lima Maharamah, S.Pd.', 'Guru Bahasa Indonesia', 'sosial'],
  ['Nabila Azhara, S.Si.', 'Guru Fisika', 'it'],
  ['Ridho Zovavic, ST.', 'Guru Teknik Jaringan', 'it'],
  ['Desi Nur Indah Sari, S.Kom.', 'Guru Rekayasa Perangkat Lunak', 'it'],
  ['Rici Indriani, S.Kom.', 'Guru Rekayasa Perangkat Lunak', 'it'],
  ['Ardi Syahputra S, S.Kom.', 'Guru Teknik Komputer & Jaringan', 'it'],
  ['Tengku Innayah Balqis, S.Si.', 'Guru Kimia', 'it'],
  ['Suheriana, S.Pd.', 'Guru Bahasa Inggris', 'sosial'],
  ['Irawati Bangun, S.Pd., M.Si.', 'Guru Biologi', 'it'],
  ['Tirodiyah Harahap, S.Ag.', 'Guru Pendidikan Agama Islam', 'agama'],
  ['Indi Putri Siregar, S.Sn.', 'Guru Seni Budaya', 'sosial'],
  ['Rosmawati, S.Pd.', 'Guru PPKn', 'sosial'],
  ['Putri Carlina Pratiwi, S.Pd.', 'Guru Bahasa Inggris', 'sosial'],
  ['Rinaldy A Gultom, S.Pd.', 'Guru PJOK', 'sosial'],
  ['Dwita Febrina, S.Si.', 'Guru Matematika', 'it'],
  ['Ezra Kiki Yolanda, S.Pd.', 'Guru Pendidikan Agama Kristen', 'agama'],
  ['Dra. Rislime Ritonga', 'Guru Pendidikan Agama Islam', 'agama'],
  ['Sarianto Parhusip, M.Th.', 'Guru Pendidikan Agama Kristen', 'agama'],
  ['Rahmi Lubis, S.Pd.', 'Guru Bahasa Indonesia', 'sosial'],
  ['Cindy Anggrayni, M.Kom.', 'Guru Basis Data', 'it'],
  ['Khairunnisa Alwita, S.Kom.', 'Guru Pemrograman Web', 'it'],
  ['Suvina Selian, ST.', 'Guru Desain Grafis', 'it'],
  ['Ikhwan El Akmal, M.Kom.', 'Instruktur Cybersecurity', 'it'],
  ['Johansyah Nasution, ST.', 'Instruktur Jaringan Cisco', 'it'],
  ['Haris M Nasution, S.Kom.', 'Guru Pemrograman Dasar', 'it'],
  ['Sri Kahdijah, SE.', 'Staf Keuangan', 'staf'],
  ['Demiana Simanullang, A.Md.', 'Staf Tata Usaha', 'staf'],
  ['Fadilansyah Nasution, M.Kom.', 'Instruktur Cisco Academy', 'it'],
  ['Rizky Noerza Tricahyani, ST.', 'Guru Multimedia', 'it'],
  ['Juli Dami', 'Staf Umum & Kesiswaan', 'staf'],
  ['Dian Lestari Sani, S.Sos.', 'Guru Sejarah', 'sosial'],
  ['Ari Wibowo, S.Si.', 'Guru Fisika', 'it'],
  ['Hafizah Z, S.Pd.', 'Guru Bahasa Inggris', 'sosial'],
  ['Nurman, SE.', 'Guru Kewirausahaan', 'sosial'],
  ['Susano', 'Staf Sarana & Prasarana', 'staf'],
  ['Ajeng Dewi K, A.Md.', 'Staf Administrasi', 'staf'],
  ['Putri Gustina Sari, S.ST.', 'Staf Humas & Hubin', 'staf'],
  ['Rahmad Saleh Lubis, ST.', 'Guru Elektronika Dasar', 'it'],
  ['Erick Fitra W, ST.', 'Instruktur Jaringan', 'it'],
  ['Indah Arpita, ST.', 'Guru Sistem Komputer', 'it'],
  ['Muhammad Sobri Ali Wardana, S.Kom.', 'Staf Laboratorium IT', 'staf'],
  ['Maimun Hasibuan, S.Pd.', 'Guru PJOK', 'sosial'],
  ['Juli Puji L, S.Pd.', 'Guru Bahasa Indonesia', 'sosial'],
  ['Ichwan, ST.', 'Staf Teknisi', 'staf'],
  ['Irwansyah Rudi M, S.Si.', 'Guru Matematika', 'it'],
  ['Eka S Harahap, S.Kom.', 'Operator Sekolah', 'staf'],
  ['Drs. M Yusuf, S.Kom.', 'Wakil Kepala Sekolah', 'staf'],
];

export const GURU_DATA: Guru[] = RAW.map(([nama, jabatan, kategori], i) => ({
  id: i + 1,
  nama,
  jabatan,
  kategori,
  foto: `${slugify(nama)}.png`,
}));

const TABS: { key: Filter; label: string }[] = [
  { key: 'semua', label: 'Semua Pendidik' },
  { key: 'it', label: 'Sains & Teknologi (IT)' },
  { key: 'sosial', label: 'Bahasa & Sosial' },
  { key: 'agama', label: 'Keagamaan & Karakter' },
  { key: 'staf', label: 'Manajemen & Staf' },
];

const KATEGORI_LABEL: Record<Kategori, string> = {
  it: 'Sains & IT',
  sosial: 'Bahasa & Sosial',
  agama: 'Karakter',
  staf: 'Manajemen',
};

const STATS = [
  { icon: UserCheck, value: '50+', label: 'Guru & Staf' },
  { icon: GraduationCap, value: '80%+', label: 'Bergelar S1 / S2 / M.Kom' },
  { icon: Award, value: '100%', label: 'Tersertifikasi Kompetensi' },
  { icon: BookOpen, value: '15+', label: 'Instruktur Industri Resmi' },
];

/* ------------------------------------------------------------------ */
/*  KOMPONEN                                                           */
/* ------------------------------------------------------------------ */
export default function ProfilGuruPage() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Filter>('semua');

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { semua: GURU_DATA.length, it: 0, sosial: 0, agama: 0, staf: 0 };
    GURU_DATA.forEach((g) => (c[g.kategori] += 1));
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GURU_DATA.filter(
      (g) =>
        (tab === 'semua' || g.kategori === tab) &&
        (!q || g.nama.toLowerCase().includes(q) || g.jabatan.toLowerCase().includes(q))
    );
  }, [query, tab]);

  return (
    <div
      className="pg-root min-h-screen bg-slate-50 text-slate-800"
      style={{ ['--red' as string]: '#E31E24', ['--ink' as string]: '#1B1416' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pg-root { font-family: 'Plus Jakarta Sans', 'Manrope', system-ui, sans-serif; }
        .pg-display { font-family: 'Instrument Serif', 'Playfair Display', Georgia, serif; letter-spacing: -0.02em; line-height: 0.98; }
        .pg-root :focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .pg-root * { transition: none !important; animation: none !important; } }
      `}</style>

      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden bg-white border-b border-slate-200">
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-[0.07]"
          style={{ background: 'var(--red)' }}
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-8 pb-14 md:pb-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          <div className="mt-10 md:mt-14 max-w-5xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[var(--red)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)]" />
              TENAGA PENDIDIK & KEPENDIDIKAN • SMK TELKOM MEDAN
            </span>

            <h1 className="pg-display mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--ink)] uppercase">
              Pendidik profesional &amp; dedikasi{' '}
              <em className="not-italic text-[var(--red)]">tanpa batas</em>
            </h1>

            <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-600">
              Di balik setiap lulusan siap kerja ada guru dan staf yang mengajar, membimbing, dan
              menjaga sekolah tetap berjalan. Kenali mereka di sini.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <Icon size={20} className="text-[var(--red)]" />
                <dd className="pg-display mt-3 text-4xl md:text-5xl text-[var(--ink)]">{value}</dd>
                <dt className="mt-1 text-sm font-medium text-slate-600">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ============ SEARCH + FILTER ============ */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, gelar, atau mata pelajaran"
              aria-label="Cari guru"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[var(--red)] focus:bg-white focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-[var(--red)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 sm:pb-0"
          >
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-[var(--red)] bg-[var(--red)] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {t.label}
                  <span className={`ml-2 text-xs ${active ? 'text-red-100' : 'text-slate-400'}`}>
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ GRID ============ */}
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
        <p className="mb-6 text-sm text-slate-500" aria-live="polite">
          Menampilkan <strong className="text-slate-900">{filtered.length}</strong> dari{' '}
          {GURU_DATA.length} pendidik dan staf
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <Search size={28} className="mx-auto text-slate-300" />
            <h2 className="pg-display mt-4 text-3xl text-[var(--ink)]">Tidak ada hasil</h2>
            <p className="mt-2 text-sm text-slate-600">
              Coba kata kunci lain atau pilih kategori “Semua Pendidik”.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setTab('semua');
              }}
              className="mt-6 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--red)] transition-colors"
            >
              Reset pencarian
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((g) => (
              <li key={g.id}>
                <article className="group h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={getGuruPhoto(g.foto, g.nama.split(',')[0])}
                      alt={`Foto ${g.nama}`}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const fb = fallbackAvatar(g.nama.split(',')[0]);
                        if (img.src !== fb) img.src = fb;
                      }}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-snug text-[var(--ink)]">
                    {g.nama}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{g.jabatan}</p>

                  <span className="mt-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[var(--red)]">
                    {KATEGORI_LABEL[g.kategori]}
                  </span>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}