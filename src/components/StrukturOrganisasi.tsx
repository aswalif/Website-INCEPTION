import { useEffect, useRef, useState } from "react";
import fotoAga from "../assets/osis/aga.jpg";
import fotoAura from "../assets/osis/aura.jpg";
import fotoChairan from "../assets/osis/chairan.jpg";
import fotoChelsea from "../assets/osis/chelsea.jpg";
import fotoDithia from "../assets/osis/dithia.jpg";
import fotoFathin from "../assets/osis/fathin.jpg";
import fotoGlen from "../assets/osis/glen.jpg";
import fotoHely from "../assets/osis/hely.jpg";
import fotoIbrahim from "../assets/osis/ibrahim.jpg";
import fotoJodi from "../assets/osis/jodi.jpg";
import fotoMaisya from "../assets/osis/maisya.jpg";
import fotoNaurah from "../assets/osis/naurah.jpg";
import fotoRehuel from "../assets/osis/rehuel.jpg";
import fotoSyifa from "../assets/osis/syifa.jpg";
import fotoWinda from "../assets/osis/winda.jpg";
import fotoZaskia from "../assets/osis/zaskia.jpg";
import fotoSosmed from "../assets/osis/sosmed.jpg";
import fotoPemasaran from "../assets/osis/pemasaran.jpg";
import fotoKeagamaan from "../assets/osis/keagamaan.jpg";
import ikonItSupport from "../assets/osis/it_support.jpg";
import ikonEkonomiKreatif from "../assets/osis/eskonomi_kreatif.jpg";
import ikonEkskul from "../assets/osis/eskul.jpg";

interface Anggota {
  nama: string;
  jabatan: string;
  divisi: string;
  kategori: "bph" | "it" | "ekraf" | "ekskul";
  foto?: string;
}

const dataAnggota: Anggota[] = [
  // BPH — Badan Pengurus Harian / Inti OSIS
  {
    nama: "Aga Wahyu Edliansyah",
    jabatan: "Ketua Umum",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoAga,
  },
  {
    nama: "Zaskia Hutauruk",
    jabatan: "Ketua Satu",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoZaskia,
  },
  {
    nama: "Ibrahim Satria Sanama",
    jabatan: "Ketua Dua",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoIbrahim,
  },
  {
    nama: "Maisya Keyzha Andini",
    jabatan: "Sekretaris Umum",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoMaisya,
  },
  {
    nama: "Aura Putri Cahyani",
    jabatan: "Sekretaris Satu",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoAura,
  },
  {
    nama: "Winda Aprilia",
    jabatan: "Bendahara Umum",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoWinda,
  },
  {
    nama: "Chelsea Babyna",
    jabatan: "Bendahara Satu",
    divisi: "BPH / Inti OSIS",
    kategori: "bph",
    foto: fotoChelsea,
  },

  // Divisi IT Support
  {
    nama: "Naurah Mumtaz",
    jabatan: "Kabid IT Support",
    divisi: "Divisi IT Support",
    kategori: "it",
    foto: fotoNaurah,
  },
  {
    nama: "Jodi Jonatan",
    jabatan: "Anggota - WebSite",
    divisi: "Divisi IT Support",
    kategori: "it",
    foto: fotoJodi,
  },
  {
    nama: "Embrena Kairunesya & Rachel Gracia",
    jabatan: "Anggota - Sosmed",
    divisi: "Divisi IT Support",
    kategori: "it",
    foto: fotoSosmed,
  },

  // Divisi Ekonomi Kreatif
  {
    nama: "Hely Riyanti",
    jabatan: "Kabid Ekonomi Kreatif",
    divisi: "Divisi Ekonomi Kreatif",
    kategori: "ekraf",
    foto: fotoHely,
  },
  {
    nama: "Kerenhapukh A. L. Batu",
    jabatan: "Anggota - Pemasaran",
    divisi: "Divisi Ekonomi Kreatif",
    kategori: "ekraf",
    foto: fotoPemasaran,
  },

  // Divisi Ekskul
  {
    nama: "Zidan",
    jabatan: "Kabid Ekskul",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoChairan,
  },
  {
    nama: "Fathin Naufal Murtadho",
    jabatan: "Anggota - Bela Negara",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoFathin,
  },
  {
    nama: "Rifqi Adithia & Mikael Agatha",
    jabatan: "Anggota - Keagamaan",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoKeagamaan,
  },
  {
    nama: "Rehuel Bastanta",
    jabatan: "Anggota - Edukasi",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoRehuel,
  },
  {
    nama: "Dithia Sakip",
    jabatan: "Anggota - Olahraga",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoDithia,
  },
  {
    nama: "Glen Ardiano",
    jabatan: "Anggota - Kesenian",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoGlen,
  },
  {
    nama: "Syifa Queen",
    jabatan: "Anggota - Lingkungan",
    divisi: "Divisi Ekskul",
    kategori: "ekskul",
    foto: fotoSyifa,
  },
];

type FilterKey = "semua" | "bph" | "it" | "ekraf" | "ekskul";

interface FilterOption {
  key: FilterKey;
  label: string;
  ikon?: string;
}

const filterOptions: FilterOption[] = [
  { key: "bph", label: "BPH / Inti" },
  { key: "it", label: "IT Support", ikon: ikonItSupport },
  { key: "ekraf", label: "Ekraf", ikon: ikonEkonomiKreatif },
  { key: "ekskul", label: "Ekskul", ikon: ikonEkskul },
];

const kategoriAksen: Record<
  Anggota["kategori"],
  { dot: string; text: string }
> = {
  bph: { dot: "bg-red-600", text: "text-red-600" },
  it: { dot: "bg-neutral-400", text: "text-neutral-500" },
  ekraf: { dot: "bg-neutral-400", text: "text-neutral-500" },
  ekskul: { dot: "bg-neutral-400", text: "text-neutral-500" },
};

interface SeksiKategori {
  nomor: string;
  kategori: Anggota["kategori"];
  judul: string;
  subjudul: string;
  deskripsi: string;
}

const seksiKategori: SeksiKategori[] = [
  {
    nomor: "01",
    kategori: "bph",
    judul: "BPH",
    subjudul: "Inti OSIS",
    deskripsi:
      "Pengurus harian yang memimpin dan mengoordinasikan seluruh program kerja OSIS.",
  },
  {
    nomor: "02",
    kategori: "it",
    judul: "IT",
    subjudul: "Support",
    deskripsi: "Mengelola website, dokumentasi, dan media sosial resmi OSIS.",
  },
  {
    nomor: "03",
    kategori: "ekraf",
    judul: "Ekonomi",
    subjudul: "Kreatif",
    deskripsi:
      "Bertanggung jawab atas kegiatan usaha, pemasaran, dan pendanaan kreatif OSIS.",
  },
  {
    nomor: "04",
    kategori: "ekskul",
    judul: "Divisi",
    subjudul: "Ekskul",
    deskripsi:
      "Mengoordinasikan bela negara, keagamaan, edukasi, olahraga, kesenian, dan lingkungan.",
  },
];

const TOTAL_SLIDE = seksiKategori.length;
const DURASI_AUTOPLAY = 6000;

function getInisial(nama: string): string {
  const bagian = nama.split(" ").filter(Boolean);
  const huruf = bagian.slice(0, 2).map((kata) => kata[0]?.toUpperCase() ?? "");
  return huruf.join("") || "?";
}

function pecahNama(nama: string): [string, string] {
  const bagian = nama.split(" ").filter(Boolean);
  if (bagian.length <= 1) return [nama, ""];
  const tengah = Math.ceil(bagian.length / 2);
  return [bagian.slice(0, tengah).join(" "), bagian.slice(tengah).join(" ")];
}

function KartuAnggota({
  anggota,
  index,
  nomorUrut,
  unggulan = false,
  lebar = false,
}: {
  anggota: Anggota;
  index: number;
  nomorUrut: number;
  unggulan?: boolean;
  lebar?: boolean;
}) {
  const aksen = kategoriAksen[anggota.kategori];
  const [barisAtas, barisBawah] = pecahNama(anggota.nama);
  const delayKelas = `osis-delay-${index % 6}`;

  return (
    <div
      className={`${delayKelas} osis-fade-up group relative flex flex-col overflow-hidden bg-[#111111] ${
        unggulan
          ? "col-span-2 lg:col-span-2 lg:row-span-2"
          : lebar
            ? "col-span-2 lg:col-span-1"
            : "col-span-1"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden ${
          unggulan
            ? "aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[420px]"
            : lebar
              ? "aspect-[4/3] lg:aspect-[3/4]"
              : "aspect-[3/4]"
        }`}
      >
        {anggota.foto ? (
          <img
            src={anggota.foto}
            alt={`Foto ${anggota.nama}, ${anggota.jabatan}`}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out sm:grayscale-[15%] sm:motion-safe:group-hover:scale-[1.045] sm:motion-safe:group-hover:grayscale-0 ${
              unggulan
                ? "object-[50%_20%] lg:absolute lg:inset-0 lg:object-center"
                : lebar
                  ? "object-[50%_25%] lg:object-center"
                  : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-700 text-lg font-semibold text-neutral-200">
              {getInisial(anggota.nama)}
            </span>
          </div>
        )}

        <span
          className={`pointer-events-none absolute right-3 top-3 font-mono sm:right-4 sm:top-4 text-xs tracking-widest text-white/70 transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-1 ${
            unggulan ? "lg:text-sm" : ""
          }`}
        >
          {String(nomorUrut).padStart(2, "0")}
        </span>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent sm:from-black/85 sm:via-black/10 opacity-70 transition-opacity duration-500 ease-out group-hover:opacity-95" />

        <div
          className={`absolute inset-x-0 bottom-0 sm:p-5 ${unggulan ? "p-4" : "p-3"}`}
        >
          <span
            className={`mb-2 block h-px w-6 bg-red-600 sm:mb-3 transition-all duration-500 ease-out group-hover:w-12 ${
              unggulan ? "w-10" : ""
            }`}
          />
          <h3
            className={`break-words font-semibold uppercase leading-[1.05] tracking-tight text-white ${
              unggulan
                ? "text-3xl sm:text-4xl"
                : lebar
                  ? "text-lg sm:text-xl"
                  : "text-sm min-[400px]:text-base sm:text-xl"
            }`}
          >
            {barisAtas}
            {barisBawah && (
              <>
                <br />
                {barisBawah}
              </>
            )}
          </h3>

          <div className="mt-1.5 max-h-24 overflow-hidden opacity-100 transition-all duration-500 ease-out sm:mt-2 sm:max-h-0 sm:opacity-0 sm:group-hover:mt-3 sm:group-hover:max-h-20 sm:group-hover:opacity-100">
            <p
              className={`font-medium leading-snug text-red-400 ${
                unggulan
                  ? "text-sm sm:text-base"
                  : lebar
                    ? "text-sm"
                    : "text-xs sm:text-sm"
              }`}
            >
              {anggota.jabatan}
            </p>
            <p className="mt-0.5 hidden items-center gap-1.5 text-xs uppercase tracking-wide text-white/60 sm:flex">
              <span className={`h-1 w-1 rounded-full ${aksen.dot}`} />
              {anggota.divisi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-300 px-6 py-20 text-center">
      <span className="text-4xl font-light text-neutral-300">—</span>
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
        Belum ada anggota
      </p>
      <p className="max-w-xs text-xs text-neutral-500">
        Anggota untuk kategori ini belum tersedia atau belum ditambahkan ke data
        struktur organisasi.
      </p>
    </div>
  );
}

function SlideDivisi({
  seksi,
  anggota,
  aktif,
  innerRef,
}: {
  seksi: SeksiKategori;
  anggota: Anggota[];
  aktif: boolean;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  let counter = 0;
  const sisaKartu = seksi.kategori === "bph" ? anggota.length - 1 : anggota.length;

  return (
    <div
      ref={innerRef}
      className="w-full shrink-0 px-1"
      aria-hidden={!aktif}
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-10 sm:gap-5 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <span className="mb-3 block font-mono text-xs tracking-[0.3em] text-red-600">
            {seksi.nomor}
          </span>
          <h3 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-5xl">
            {seksi.judul}
            <br />
            <span className="text-neutral-300">{seksi.subjudul}</span>
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">
            {seksi.deskripsi}
          </p>
        </div>

        <div className="flex items-end justify-start gap-3 lg:col-span-4 lg:flex-col lg:items-end lg:justify-end lg:text-right">
          <span className="text-5xl font-bold leading-none text-neutral-900 sm:text-6xl">
            {String(anggota.length).padStart(2, "0")}
          </span>
          <span className="pb-1.5 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 lg:pb-0">
            Anggota
          </span>
        </div>
      </div>

      {anggota.length === 0 ? (
        <EmptyState />
      ) : (
        /* DIBERSIHKAN: Hapus lg:auto-rows-fr agar grid menyesuaikan tinggi jumlah kartu sebenarnya */
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {anggota.map((item, index) => {
            counter += 1;
            const unggulan = seksi.kategori === "bph" && index === 0;
            const lebar =
              !unggulan &&
              index === anggota.length - 1 &&
              sisaKartu % 2 === 1;
            return (
              <KartuAnggota
                key={`${item.nama}-${item.jabatan}`}
                anggota={item}
                index={index}
                nomorUrut={counter}
                unggulan={unggulan}
                lebar={lebar}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StrukturOrganisasi() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterAktif, setFilterAktif] = useState<FilterKey>(
    seksiKategori[0].kategori,
  );
  const [isHovering, setIsHovering] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchState = useRef({ startX: 0, startY: 0, tracking: false });
  const navRef = useRef<HTMLElement | null>(null);
  const navBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tinggiAktif, setTinggiAktif] = useState<number | null>(null);

  const jumlahAnggota = dataAnggota.length;
  const jumlahDivisi = seksiKategori.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // DIUBAH: Penyesuaian tinggi otomatis (Dynamic Height) berlaku di SEMUA UKURAN LAYAR (Mobile, Tablet & Desktop)
  // Ini memastikan saat divisi hanya berisi 2 anggota, tinggi area carousel langsung menyusut dan menghemat tempat
  useEffect(() => {
    const el = slideRefs.current[activeIndex];
    if (!el) return;
    
    const ukur = () => setTinggiAktif(el.offsetHeight);
    ukur();
    
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    const nav = navRef.current;
    const btn = navBtnRefs.current[activeIndex];
    if (!nav || !btn || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({
      left: btn.offsetLeft - (nav.clientWidth - btn.offsetWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || isHovering) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % TOTAL_SLIDE;
        setFilterAktif(seksiKategori[next].kategori);
        return next;
      });
    }, DURASI_AUTOPLAY);
    return () => window.clearInterval(id);
  }, [reducedMotion, isHovering, resetSignal]);

  function gotoSlide(idx: number) {
    const aman = ((idx % TOTAL_SLIDE) + TOTAL_SLIDE) % TOTAL_SLIDE;
    setActiveIndex(aman);
    setFilterAktif(seksiKategori[aman].kategori);
    setResetSignal((s) => s + 1);
  }

  function pilihFilter(key: FilterKey) {
    if (key === "semua") {
      setFilterAktif("semua");
      setResetSignal((s) => s + 1);
      return;
    }
    const idx = seksiKategori.findIndex((s) => s.kategori === key);
    if (idx !== -1) gotoSlide(idx);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchState.current.startX = e.touches[0].clientX;
    touchState.current.startY = e.touches[0].clientY;
    touchState.current.tracking = true;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchState.current.tracking) return;
    touchState.current.tracking = false;
    const deltaX = e.changedTouches[0].clientX - touchState.current.startX;
    const deltaY = e.changedTouches[0].clientY - touchState.current.startY;
    const AMBANG = 45;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (deltaX <= -AMBANG) {
      gotoSlide(activeIndex + 1);
    } else if (deltaX >= AMBANG) {
      gotoSlide(activeIndex - 1);
    }
  }

  function pindahDariBawah(idx: number) {
    gotoSlide(idx);
    navRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section
      id="struktur-organisasi"
      className="w-full bg-[#F8F8F6] px-4 py-14 sm:px-8 sm:py-28 lg:px-14 transition-all duration-500"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        .osis-editorial { font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .osis-body { font-family: 'Inter', sans-serif; }

        @keyframes osisFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .osis-fade-up { animation: osisFadeUp 0.6s ease-out both; }
        .osis-delay-0 { animation-delay: 0ms; }
        .osis-delay-1 { animation-delay: 70ms; }
        .osis-delay-2 { animation-delay: 140ms; }
        .osis-delay-3 { animation-delay: 210ms; }
        .osis-delay-4 { animation-delay: 280ms; }
        .osis-delay-5 { animation-delay: 350ms; }

        .osis-scroll-x { scrollbar-width: none; -ms-overflow-style: none; }
        .osis-scroll-x::-webkit-scrollbar { display: none; }

        .osis-track {
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .osis-fade-up { animation: none !important; opacity: 1 !important; transform: none !important; }
          .osis-track { transition-duration: 0ms !important; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="osis-body mx-auto max-w-7xl">
        {/* ===== HERO ===== */}
        <header className="osis-fade-up mb-10 border-b border-neutral-200 pb-8 sm:mb-20 sm:pb-14">
          <div className="mb-5 flex items-center gap-3 sm:mb-6">
            <span className="font-mono text-xs tracking-[0.3em] text-red-600">
              01
            </span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              Organisasi Siswa
            </span>
          </div>

          <h1 className="osis-editorial leading-[0.9] tracking-tight text-neutral-900">
            <span className="block text-[clamp(2.25rem,11.5vw,4rem)] font-semibold uppercase sm:text-8xl lg:text-[7.5rem]">
              Struktur
            </span>
            <span className="block text-[clamp(2.25rem,11.5vw,4rem)] font-semibold uppercase sm:text-8xl lg:text-[7.5rem]">
              Organisasi
            </span>
            <span
              className="mt-1 block text-[clamp(2.25rem,11.5vw,4rem)] font-semibold uppercase text-transparent sm:text-8xl lg:text-[7.5rem]"
              style={{ WebkitTextStroke: "1.5px #DC2626" }}
            >
              OSIS
            </span>
          </h1>

          <div className="mt-6 flex flex-col gap-8 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <p className="max-w-sm text-sm leading-relaxed text-neutral-500 sm:text-base">
              Kenali para pengurus OSIS yang menjalankan berbagai kegiatan dan
              program sekolah.
            </p>

            <div className="flex w-full justify-between gap-4 sm:w-auto sm:justify-start sm:gap-12">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                  {jumlahAnggota}+
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 sm:text-[11px] sm:tracking-[0.2em]">
                  Anggota
                </span>
              </div>
              <div className="w-px bg-neutral-200" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                  {String(jumlahDivisi).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 sm:text-[11px] sm:tracking-[0.2em]">
                  Divisi
                </span>
              </div>
              <div className="w-px bg-neutral-200" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                  01
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 sm:text-[11px] sm:tracking-[0.2em]">
                  Periode
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ===== FILTER / NAVIGASI CAROUSEL ===== */}
        <nav
          ref={navRef}
          aria-label="Navigasi divisi"
          className="osis-scroll-x osis-fade-up mb-8 flex scroll-mt-20 gap-6 overflow-x-auto border-b border-neutral-200 pb-4 sm:mb-14 sm:gap-12"
        >
          {filterOptions.map((opsi, i) => {
            const aktif = filterAktif === opsi.key;
            return (
              <button
                key={opsi.key}
                ref={(el) => {
                  navBtnRefs.current[i] = el;
                }}
                type="button"
                aria-current={aktif ? "true" : undefined}
                onClick={() => pilihFilter(opsi.key)}
                className="group relative flex shrink-0 items-center gap-2 whitespace-nowrap pb-2 text-left focus-visible:outline-none"
              >
                <span
                  className={`font-mono text-[11px] tracking-widest transition-colors duration-300 ${
                    aktif ? "text-red-600" : "text-neutral-400"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {opsi.ikon && (
                  <img
                    src={opsi.ikon}
                    alt=""
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full object-cover transition-opacity duration-300 ${
                      aktif
                        ? "opacity-100"
                        : "opacity-40 grayscale group-hover:opacity-70"
                    }`}
                  />
                )}
                <span
                  className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-300 sm:text-base ${
                    aktif
                      ? "text-neutral-900"
                      : "text-neutral-400 group-hover:text-neutral-600"
                  }`}
                >
                  {opsi.label}
                </span>
                <span
                  className={`absolute -bottom-[1px] left-0 h-[2px] bg-red-600 transition-all duration-300 ease-out ${
                    aktif
                      ? "w-full"
                      : "w-0 group-hover:w-full group-hover:bg-neutral-300"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* ===== CAROUSEL ===== */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* DITAMBAHKAN: Animasi perubahan tinggi yang mulus (smooth height transition) */}
          <div
            className="touch-pan-y overflow-hidden transition-[height] duration-500 ease-out"
            style={
              tinggiAktif !== null
                ? {
                    height: tinggiAktif,
                    transition: reducedMotion ? "none" : "height 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }
                : undefined
            }
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="osis-track flex items-start"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
                transitionDuration: reducedMotion ? "0ms" : "700ms",
              }}
            >
              {seksiKategori.map((seksi, idx) => (
                <SlideDivisi
                  key={seksi.kategori}
                  seksi={seksi}
                  anggota={dataAnggota.filter(
                    (a) => a.kategori === seksi.kategori,
                  )}
                  aktif={idx === activeIndex}
                  innerRef={(el) => {
                    slideRefs.current[idx] = el;
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tombol Prev / Next */}
          <button
            type="button"
            onClick={() => gotoSlide(activeIndex - 1)}
            aria-label="Divisi sebelumnya"
            className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 p-2.5 text-neutral-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-200 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:flex lg:-translate-x-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => gotoSlide(activeIndex + 1)}
            aria-label="Divisi berikutnya"
            className="absolute right-0 top-1/2 hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 p-2.5 text-neutral-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-200 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:flex lg:translate-x-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indikator */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-6">
          <span className="font-mono text-xs tracking-widest text-neutral-400">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(TOTAL_SLIDE).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {seksiKategori.map((seksi, idx) => (
              <button
                key={seksi.kategori}
                type="button"
                onClick={() => gotoSlide(idx)}
                aria-label={`Ke divisi ${seksi.judul} ${seksi.subjudul}`}
                aria-current={idx === activeIndex ? "true" : undefined}
                className={`relative h-1.5 rounded-full transition-all duration-300 ease-out before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                  idx === activeIndex
                    ? "w-7 bg-red-600"
                    : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tombol Sebelumnya/Berikutnya — hanya HP */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => pindahDariBawah(activeIndex - 1)}
            className="flex min-h-12 items-center justify-center gap-2 border border-neutral-300 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors active:border-neutral-900 active:bg-neutral-900 active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <span aria-hidden="true">←</span> Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => pindahDariBawah(activeIndex + 1)}
            className="flex min-h-12 items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 px-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors active:border-red-600 active:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Berikutnya <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}