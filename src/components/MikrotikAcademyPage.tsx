import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Network,
  Router,
  ShieldCheck,
  Wifi,
  X,
  ZoomIn,
  Cable,
  Flame,
} from 'lucide-react'

/* ───────────── Gambar sertifikat (auto-import Vite) ───────────── */
const images = import.meta.glob<{ default: string }>('../assets/mikrotik/*.jpg', { eager: true })

const imageByFile: Record<string, string> = Object.fromEntries(
  Object.entries(images).map(([path, mod]) => [path.split('/').pop() as string, mod.default]),
)

interface Certificate {
  name: string
  track: 'MTCNA' | 'MTCRE'
  number: string
  date: string
  file: string
}

const CERTIFICATES: Certificate[] = [
  { name: 'Khairunnisa Alwita', track: 'MTCNA', number: '2311NA6854', date: '02 Nov 2023', file: 'Serfikat-MTCNA-Khairunnisa-Alwita-1.jpg' },
  { name: 'Muhammad Sobri Ali Wardana', track: 'MTCNA', number: '1912NA5422', date: '12 Des 2019', file: 'Serfikat-MTCNA-Sobri.jpg' },
  { name: 'Ikhwan El Akmal Pakpahan', track: 'MTCNA', number: '2302NA4988', date: '23 Feb 2023', file: 'Sertifikat-MTCNA-kemal-1.jpg' },
  { name: 'Ikhwan El Akmal Pakpahan', track: 'MTCRE', number: '2302RE5200', date: '24 Feb 2023', file: 'sertifikat-MTCRE-kemal-1.jpg' },
]

/* ───────────── Keunggulan ───────────── */
const PILLARS = [
  {
    icon: BadgeCheck,
    title: 'Ujian MTCNA gratis',
    desc: 'Siswa TKJ mengikuti ujian sertifikasi MTCNA tanpa biaya tambahan, langsung di sekolah.',
    span: 'md:col-span-2',
  },
  {
    icon: BookOpenCheck,
    title: 'Kurikulum resmi terintegrasi',
    desc: 'Materi resmi MikroTik berjalan seiring kurikulum jurusan, bukan kelas tambahan terpisah.',
    span: '',
  },
  {
    icon: Router,
    title: 'Lab RouterBoard real device',
    desc: 'Praktik memakai perangkat RouterBoard asli, dari konfigurasi dasar sampai skenario jaringan penuh.',
    span: '',
  },
  {
    icon: Award,
    title: 'Sertifikat diakui industri',
    desc: 'Gelar MTCNA dan MTCRE dikenal perusahaan jaringan dan ISP di Indonesia maupun luar negeri.',
    span: 'md:col-span-2',
  },
]

/* ───────────── Silabus MTCNA ───────────── */
const MODULES = [
  {
    icon: Cpu,
    title: 'RouterOS Basics',
    summary: 'Mengenal RouterOS, mengakses perangkat, dan menyusun konfigurasi dasar.',
    topics: ['Winbox, WebFig, dan terminal', 'Konfigurasi default dan reset', 'Alamat IP, ARP, dan DHCP', 'Backup, restore, dan Netinstall', 'Manajemen paket dan pengguna'],
  },
  {
    icon: Network,
    title: 'Bridging & Routing',
    summary: 'Menghubungkan segmen jaringan dan mengarahkan lalu lintas antar-subnet.',
    topics: ['Bridge dan port', 'Static routing', 'Gateway dan routing table', 'Dasar VLAN pada bridge'],
  },
  {
    icon: Wifi,
    title: 'Network Wireless',
    summary: 'Membangun dan mengamankan jaringan nirkabel dengan perangkat MikroTik.',
    topics: ['Standar 802.11 dan frekuensi', 'Mode Access Point dan Station', 'Wireless security dan access list', 'Troubleshooting sinyal'],
  },
  {
    icon: ShieldCheck,
    title: 'Firewall & QoS',
    summary: 'Mengamankan jaringan dan mengatur pembagian bandwidth.',
    topics: ['Filter rule dan connection tracking', 'NAT: srcnat dan dstnat', 'Address list', 'Simple queue dan limit bandwidth'],
  },
  {
    icon: Cable,
    title: 'Tunnels & MikroTik Tools',
    summary: 'Menghubungkan lokasi berbeda dan memantau kondisi jaringan.',
    topics: ['PPP, PPPoE, dan PPTP', 'Ping, traceroute, dan torch', 'Bandwidth test', 'Graphing dan monitoring'],
  },
]

/* ───────────── Komponen utama ───────────── */
export default function MikrotikAcademyPage() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [activeModule, setActiveModule] = useState(0)

  const certs = useMemo(
    () => CERTIFICATES.map((c) => ({ ...c, src: imageByFile[c.file] as string | undefined })),
    [],
  )

  const closeBox = useCallback(() => setLightbox(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + certs.length) % certs.length)),
    [certs.length],
  )

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBox()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox, closeBox, step])

  const current = lightbox !== null ? certs[lightbox] : null
  const mod = MODULES[activeModule]

  return (
    <main className="mk-page bg-white text-[var(--ink)]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .mk-page { --red:#E31E24; --ink:#1B1416; font-family:'Plus Jakarta Sans','Manrope',system-ui,sans-serif; }
        .mk-serif { font-family:'Instrument Serif','Playfair Display',Georgia,serif; font-weight:400; letter-spacing:-0.02em; }
        .mk-grid-bg { background-image:linear-gradient(to right,rgba(27,20,22,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(27,20,22,.06) 1px,transparent 1px); background-size:44px 44px; }
        @keyframes mk-pulse-line { to { stroke-dashoffset:-24; } }
        .mk-link { stroke-dasharray:6 6; animation:mk-pulse-line 1.4s linear infinite; }
        @media (prefers-reduced-motion:reduce){ .mk-link{ animation:none; } }
      `}</style>

      {/* ═════ HERO ═════ */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="mk-grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-12 lg:pb-28">
          <div className="lg:col-span-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[var(--red)] hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--red)]"
            >
              <ArrowLeft size={16} /> Kembali ke Beranda
            </Link>
          </div>

          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--red)]/30 bg-white px-4 py-1.5 text-[11px] font-bold tracking-wider text-[var(--red)]">
              <span className="h-2 w-2 rounded-full bg-[var(--red)]" />
              OFFICIAL MIKROTIK ACADEMY PARTNER • CERTIFIED CENTER
            </span>

            <h1 className="mk-serif mt-7 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              MikroTik Academy — Pusat Sertifikasi Networking Internasional
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              SMK Telkom Medan memegang lisensi resmi dari MikroTik SIA (Latvia) untuk menyelenggarakan ujian
              sertifikasi MTCNA bagi siswanya. Siswa belajar, berlatih, dan diuji di sekolah sendiri, lalu lulus
              dengan sertifikat yang berlaku secara internasional.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#sertifikat"
                className="rounded-full bg-[var(--red)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--red)]"
              >
                Lihat sertifikat instruktur
              </a>
              <a
                href="#silabus"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--red)]"
              >
                Pelajari silabus MTCNA
              </a>
            </div>
          </div>

          {/* Topologi jaringan: elemen khas dunia networking */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
              <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label="Diagram topologi jaringan MikroTik: router pusat terhubung ke tiga perangkat">
                <g stroke="#1B1416" strokeOpacity=".35" strokeWidth="2" fill="none">
                  <path className="mk-link" d="M200 140 L80 50" />
                  <path className="mk-link" d="M200 140 L330 70" />
                  <path className="mk-link" d="M200 140 L90 240" />
                  <path className="mk-link" d="M200 140 L320 235" />
                </g>
                {[[80, 50], [330, 70], [90, 240], [320, 235]].map(([x, y], i) => (
                  <g key={i}>
                    <rect x={x - 26} y={y - 18} width="52" height="36" rx="8" fill="#f8fafc" stroke="#1B1416" strokeOpacity=".25" />
                    <circle cx={x - 12} cy={y} r="3" fill="#E31E24" />
                    <circle cx={x} cy={y} r="3" fill="#1B1416" fillOpacity=".4" />
                    <circle cx={x + 12} cy={y} r="3" fill="#1B1416" fillOpacity=".4" />
                  </g>
                ))}
                <rect x="160" y="108" width="80" height="64" rx="14" fill="#E31E24" />
                <text x="200" y="146" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800">RouterOS</text>
              </svg>
              <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-sm">
                <div>
                  <dt className="text-slate-500">Penerbit lisensi</dt>
                  <dd className="font-bold">MikroTik SIA, Latvia</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Sertifikasi siswa</dt>
                  <dd className="font-bold">MTCNA</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ SERTIFIKAT INSTRUKTUR ═════ */}
      <section id="sertifikat" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="mk-serif text-4xl sm:text-5xl">Instruktur kami bersertifikat resmi MikroTik</h2>
            <p className="mt-4 text-slate-600">
              Setiap instruktur memegang sertifikat dengan nomor yang bisa diverifikasi di situs MikroTik. Klik
              sertifikat untuk memperbesar.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certs.map((c, i) => (
              <li key={c.number} className="flex">
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left transition hover:border-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--red)]"
                  aria-label={`Perbesar sertifikat ${c.track} ${c.name}`}
                >
                  <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-white">
                    {c.src ? (
                      <img
                        src={c.src}
                        alt={`Sertifikat ${c.track} atas nama ${c.name}`}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
                        Letakkan <code className="mx-1 rounded bg-slate-100 px-1">{c.file}</code> di src/assets/mikrotik/
                      </div>
                    )}
                    <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ZoomIn size={16} />
                    </span>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-3 border-t border-slate-200 bg-white p-4">
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        No. {c.number} · {c.date}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        c.track === 'MTCRE' ? 'bg-[var(--red)] text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {c.track}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════ KEUNGGULAN ═════ */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="mk-serif max-w-2xl text-4xl sm:text-5xl">Yang siswa dapatkan di MikroTik Academy</h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              const featured = i === 0
              return (
                <article
                  key={p.title}
                  className={`group relative overflow-hidden rounded-3xl border p-7 transition-colors duration-300 ${p.span} ${
                    featured
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                      : 'border-slate-200 bg-white hover:border-[var(--red)]'
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      featured ? 'bg-[var(--red)] text-white' : 'bg-red-50 text-[var(--red)] group-hover:bg-[var(--red)] group-hover:text-white'
                    } transition-colors`}
                  >
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold">{p.title}</h3>
                  <p className={`mt-2 max-w-md text-sm leading-relaxed ${featured ? 'text-slate-300' : 'text-slate-600'}`}>
                    {p.desc}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═════ SILABUS ═════ */}
      <section id="silabus" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="mk-serif text-4xl sm:text-5xl">Silabus MTCNA dalam lima modul</h2>
            <p className="mt-4 text-slate-600">Pilih modul untuk melihat topik yang dipelajari.</p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div role="tablist" aria-label="Modul MTCNA" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0">
              {MODULES.map((m, i) => {
                const Icon = m.icon
                const active = i === activeModule
                return (
                  <button
                    key={m.title}
                    role="tab"
                    id={`tab-${i}`}
                    aria-selected={active}
                    aria-controls="module-panel"
                    onClick={() => setActiveModule(i)}
                    className={`flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--red)] lg:text-base ${
                      active
                        ? 'border-[var(--red)] bg-[var(--red)] text-white shadow-lg shadow-red-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <Icon size={20} />
                    {m.title}
                  </button>
                )
              })}
            </div>

            <div
              id="module-panel"
              role="tabpanel"
              aria-labelledby={`tab-${activeModule}`}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-10 lg:col-span-7"
            >
              <h3 className="mk-serif text-3xl sm:text-4xl">{mod.title}</h3>
              <p className="mt-3 text-slate-600">{mod.summary}</p>
              <ul className="mt-7 space-y-3">
                {mod.topics.map((t) => (
                  <li key={t} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold ring-1 ring-slate-200">
                    <Flame size={16} className="mt-0.5 shrink-0 text-[var(--red)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ CTA ═════ */}
      <section className="bg-slate-50 px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--red)] px-7 py-14 text-white sm:px-14 sm:py-20">
          <Router size={320} strokeWidth={1} className="pointer-events-none absolute -bottom-16 -right-12 text-white/10" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="mk-serif text-4xl leading-tight sm:text-5xl">
              Mulai kariermu di jaringan dari bangku SMK
            </h2>
            <p className="mt-5 text-base text-white/90 sm:text-lg">
              Daftar di jurusan Teknik Komputer dan Jaringan (TKJ) dan lulus dengan sertifikat MikroTik di tanganmu.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/ppdb"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[var(--red)] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Daftar PPDB sekarang
              </Link>
              <Link
                to="/"
                className="rounded-full border border-white/60 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ LIGHTBOX ═════ */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Sertifikat ${current.track} ${current.name}`}
          className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 p-4 sm:p-8"
          onClick={closeBox}
        >
          <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="font-bold">
                {current.name} <span className="ml-2 rounded-full bg-[var(--red)] px-2.5 py-0.5 text-xs">{current.track}</span>
              </p>
              <p className="text-sm text-slate-300">
                No. {current.number} · {current.date}
              </p>
            </div>
            <button
              type="button"
              onClick={closeBox}
              autoFocus
              aria-label="Tutup"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Sertifikat sebelumnya"
              className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft size={24} />
            </button>
            {current.src && (
              <img
                src={current.src}
                alt={`Sertifikat ${current.track} atas nama ${current.name}`}
                className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-2xl"
              />
            )}
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Sertifikat berikutnya"
              className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            {(lightbox as number) + 1} dari {certs.length} · gunakan tombol panah atau Esc
          </p>
        </div>
      )}
    </main>
  )
}