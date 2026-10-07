import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin } from 'lucide-react';

import { MITRA_DATA } from '../data/mitra';

const logoModules = import.meta.glob<{ default: string }>(
  '../assets/mitra/*.{jpg,jpeg,png,webp,svg}',
  {
    eager: true,
  },
);

const getLogo = (logoKey?: string): string | undefined => {
  if (!logoKey) return undefined;

  const normalizedKey = logoKey.toLowerCase().replace(/\s+/g, '-');

  const entry = Object.entries(logoModules).find(([path]) => {
    const filename = path
      .split('/')
      .pop()
      ?.split('.')[0]
      ?.toLowerCase()
      .replace(/\s+/g, '-');

    return filename === normalizedKey;
  });

  return entry?.[1]?.default;
};

const categories = [
  'Semua',
  'Telekomunikasi & Jaringan',
  'Software & IT',
  'Media & Kreatif',
  'Pendidikan & Lembaga',
];

export default function HubinPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredMitra = useMemo(() => {
    if (activeCategory === 'Semua') return MITRA_DATA;

    return MITRA_DATA.filter((mitra) => mitra.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 lg:px-12 lg:pb-28 lg:pt-32">
          <div className="mb-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <span className="h-px w-10 bg-slate-950" />
            <span>Hubungan Industri</span>
            <span className="ml-auto hidden font-mono text-slate-400 sm:block">
              01 / 04
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="mb-5 max-w-xl text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Strategic Industry Partnership
              </p>

              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                Mitra Strategis
                <br />
                <span className="text-slate-400">&amp;</span> Hubungan Industri
              </h1>
            </div>

            <div className="border-l border-slate-300 pl-6 lg:mb-2">
              <p className="text-sm leading-7 text-slate-600">
                SMK Telkom Medan membangun hubungan dengan dunia usaha,
                dunia industri, dan dunia kerja untuk memperkuat pengalaman
                serta kompetensi siswa.
              </p>

              <div className="mt-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-900">
                <span className="h-2 w-2 bg-slate-950" />
                DUDIKA Partnership
              </div>
            </div>
          </div>

          <div className="mt-16 grid border-t border-slate-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['PKL', 'Pengalaman kerja industri'],
              ['Magang', 'Pembelajaran berbasis praktik'],
              ['Sertifikasi', 'Penguatan kompetensi'],
              ['Direct Hiring', 'Jembatan menuju dunia kerja'],
            ].map(([title, description], index) => (
              <div
                key={title}
                className="border-b border-slate-200 py-5 sm:pr-6 lg:border-b-0 lg:border-r lg:py-3 lg:last:border-r-0"
              >
                <div className="mb-3 font-mono text-xs text-slate-400">
                  0{index + 1}
                </div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
              02 / Impact
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ekosistem Kemitraan
            </h2>
          </div>

          <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-500 md:block">
            Data berikut merupakan data demonstrasi untuk kebutuhan tampilan
            halaman HUBIN.
          </p>
        </div>

        <div className="grid border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['50+', 'Perusahaan Mitra'],
            ['100%', 'Penyaluran PKL'],
            ['15+', 'Sertifikasi Internasional'],
            ['85%+', 'Direct Hiring'],
          ].map(([number, label], index) => (
            <div
              key={label}
              className="border-b border-slate-200 py-7 sm:px-5 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0"
            >
              <span className="font-mono text-xs text-slate-400">
                0{index + 1}
              </span>

              <div className="mt-5 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                {number}
              </div>

              <p className="mt-2 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER DIRECTORY */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-10">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
              03 / Directory
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Jaringan Mitra
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Jelajahi perusahaan dan lembaga yang menjadi bagian dari
              jaringan hubungan industri.
            </p>
          </div>

          {/* FILTER */}
          <div className="mb-10 overflow-x-auto border-y border-slate-200">
            <div className="flex min-w-max items-center gap-1 py-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={isActive}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 ${
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'text-slate-500 hover:bg-white hover:text-slate-950'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6 text-xs text-slate-400">
            <span>{filteredMitra.length} mitra ditemukan</span>
          </div>

          {/* COMPANY GRID */}
          {filteredMitra.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredMitra.map((mitra) => {
                const logo = getLogo(mitra.logoKey);

                return (
                  <article
                    key={mitra.id}
                    className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                  >
                    <div className="absolute left-0 top-0 h-1 w-0 bg-slate-950 transition-all duration-300 group-hover:w-full" />

                    <div className="mb-8 flex h-20 items-center justify-between">
                      <div className="flex h-16 w-28 items-center justify-start">
                        {logo ? (
                          <img
                            src={logo}
                            alt={`Logo ${mitra.name}`}
                            loading="lazy"
                            decoding="async"
                            className="max-h-16 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            aria-label={`Logo placeholder ${mitra.name}`}
                            className="flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50"
                          >
                            <Building2
                              size={25}
                              strokeWidth={1.5}
                              className="text-slate-500"
                            />
                          </div>
                        )}
                      </div>

                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        {mitra.status}
                      </span>
                    </div>

                    <div className="flex-1">
                      <span className="inline-flex border border-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {mitra.category}
                      </span>

                      <h3 className="mt-4 text-xl font-semibold leading-tight tracking-tight">
                        {mitra.name}
                      </h3>

                      <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                        <MapPin
                          size={15}
                          strokeWidth={1.7}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{mitra.location}</span>
                      </div>

                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                        {mitra.description}
                      </p>
                    </div>

                    <Link
                      to={`/kemitraan/${mitra.id}`}
                      className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-900 transition-colors hover:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                    >
                      <span>Lihat Detail Kerjasama</span>

                      <ArrowRight
                        size={17}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <Building2
                size={32}
                strokeWidth={1.4}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-5 text-lg font-semibold">
                Mitra tidak ditemukan
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Tidak ada perusahaan pada kategori ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTNOTE */}
      <section className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-400 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <span className="font-mono uppercase tracking-[0.15em]">
            SMK Telkom Medan / HUBIN
          </span>

          <span>
            Hubungan industri untuk pembelajaran yang relevan dengan dunia kerja.
          </span>
        </div>
      </section>
    </main>
  );
}