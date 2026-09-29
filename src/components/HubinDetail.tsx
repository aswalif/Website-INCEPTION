import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  MapPin,
  Users,
} from 'lucide-react';

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

const partnershipIcons = [
  BriefcaseBusiness,
  GraduationCap,
  BadgeCheck,
  Users,
];

export default function HubinDetail() {
  const { id } = useParams<{ id: string }>();

  const mitra = MITRA_DATA.find((item) => item.id === id);

  if (!mitra) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5 text-slate-950">
        <div className="w-full max-w-xl border border-slate-200 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-slate-50">
            <Building2
              size={28}
              strokeWidth={1.5}
              className="text-slate-400"
            />
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
            404 / HUBIN
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Mitra Tidak Ditemukan
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
            Data perusahaan yang kamu cari tidak tersedia atau URL yang
            digunakan tidak sesuai.
          </p>

          <Link
            to="/kemitraan"
            className="mt-8 inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Kembali ke Daftar Mitra
          </Link>
        </div>
      </main>
    );
  }

  const logo = getLogo(mitra.logoKey);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 lg:px-12 lg:pb-28 lg:pt-28">
        {/* BACK NAVIGATION */}
        <Link
          to="/kemitraan"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-slate-500 transition-colors hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Kembali ke Daftar Mitra
        </Link>

        {/* HEADER */}
        <header className="mt-12 border-t border-slate-200 pt-8 lg:mt-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                Hubungan Industri / {mitra.category}
              </p>

              <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                {mitra.name}
              </h1>
            </div>

            <div className="flex items-center gap-3 lg:pb-2">
              <span className="h-2 w-2 bg-slate-950" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                {mitra.status}
              </span>
            </div>
          </div>
        </header>

        {/* MAIN DETAIL */}
        <div className="mt-12 grid gap-12 border-t border-slate-200 pt-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          {/* LEFT COLUMN */}
          <aside>
            <div className="flex min-h-[220px] items-center justify-center border border-slate-200 bg-slate-50 p-8">
              {logo ? (
                <img
                  src={logo}
                  alt={`Logo ${mitra.name}`}
                  className="max-h-36 max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Building2 size={44} strokeWidth={1.2} />
                  <span className="text-center text-xs font-semibold uppercase tracking-[0.12em]">
                    {mitra.name}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-slate-200">
              <div className="border-b border-slate-200 py-5">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Status
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-1.5 w-1.5 bg-slate-950" />
                  {mitra.status}
                </div>
              </div>

              <div className="border-b border-slate-200 py-5">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Industri
                </p>

                <p className="text-sm font-medium leading-6">
                  {mitra.industry}
                </p>
              </div>

              <div className="py-5">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Lokasi
                </p>

                <div className="flex gap-2 text-sm leading-6 text-slate-600">
                  <MapPin
                    size={16}
                    strokeWidth={1.7}
                    className="mt-1 shrink-0 text-slate-400"
                  />

                  <span>{mitra.address}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN */}
          <div>
            {/* PROFILE */}
            <section>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                01 / Profile
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Tentang Perusahaan
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
                {mitra.description}
              </p>

              <div className="mt-8 border-l-2 border-slate-950 pl-5">
                <p className="text-sm leading-7 text-slate-500">
                  Informasi pada halaman ini merupakan data demonstrasi
                  hubungan industri untuk kebutuhan website SMK Telkom Medan.
                </p>
              </div>
            </section>

            {/* PARTNERSHIP */}
            <section className="mt-16 border-t border-slate-200 pt-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                02 / Partnership
              </p>

              <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Bentuk Kerja Sama
                </h2>

                <span className="font-mono text-xs text-slate-400">
                  {String(mitra.partnership.length).padStart(2, '0')} PROGRAM
                </span>
              </div>

              <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                {mitra.partnership.map((partnership, index) => {
                  const Icon =
                    partnershipIcons[index % partnershipIcons.length];

                  return (
                    <div
                      key={partnership}
                      className="group flex items-center gap-5 py-5 transition-colors hover:bg-slate-50"
                    >
                      <span className="font-mono text-xs text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white">
                        <Icon
                          size={18}
                          strokeWidth={1.6}
                          className="text-slate-600"
                        />
                      </div>

                      <span className="flex-1 text-sm font-medium sm:text-base">
                        {partnership}
                      </span>

                      <ArrowRight
                        size={17}
                        strokeWidth={1.6}
                        className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-950"
                      />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* RELATED MAJORS */}
            <section className="mt-16 border-t border-slate-200 pt-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                03 / Academic Relevance
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Jurusan Terkait
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Kompetensi siswa yang memiliki keterkaitan dengan lingkungan
                kerja dan bentuk kemitraan perusahaan.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {mitra.relatedMajors.map((major) => (
                  <span
                    key={major}
                    className="border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </section>

            {/* LOCATION */}
            <section className="mt-16 border-t border-slate-200 pt-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                04 / Location
              </p>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    strokeWidth={1.6}
                    className="mt-0.5 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-semibold">{mitra.location}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {mitra.address}
                    </p>
                  </div>
                </div>

                <Link
                  to="/kemitraan"
                  className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-colors hover:text-slate-950"
                >
                  Semua Mitra
                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}