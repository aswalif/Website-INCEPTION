// src/components/galeriData.ts
// Aset ada di:
//   public/galeri/logo/  -> cover album
//   public/galeri/foto/  -> foto album
// File di public/ dilayani dari root ("/galeri/..."), tanpa import.meta.glob.

export interface Album {
  slug: string;
  title: string;
  tag: string;
  description: string;
  /** Cover utama (kandidat pertama) */
  cover: string;
  /** Daftar kandidat cover (beda ekstensi + foto pertama sebagai cadangan terakhir) */
  coverCandidates: string[];
  photos: string[];
}

interface AlbumConfig {
  slug: string;
  title: string;
  tag: string;
  description: string;
  /** Nama file cover di public/galeri/logo/ (ekstensi boleh salah, akan dicoba ekstensi lain) */
  coverFile: string;
  /** Awalan nama file foto, mis. "Pameran-" untuk Pameran-(1).webp */
  prefix: string;
  /** Jumlah foto dalam album */
  count: number;
  /** true jika nama file tanpa kurung, mis. iht-1.webp */
  plain?: boolean;
  /** Ekstensi foto, default "webp" */
  ext?: string;
}

const ALBUM_CONFIG: AlbumConfig[] = [
  {
    slug: 'pameran-karya-siswa',
    title: 'Pameran Karya Siswa',
    tag: 'Pameran',
    description:
      'Hasil karya siswa dari berbagai jurusan yang dipamerkan kepada warga sekolah dan tamu undangan.',
    coverFile: 'Pameran-karya-siswa.jpg',
    prefix: 'Pameran-',
    count: 12,
  },
  {
    slug: 'omni-sains',
    title: 'OMNI Sains Indonesia',
    tag: 'Kompetisi',
    description:
      'Dokumentasi pelaksanaan Olimpiade OMNI Sains Indonesia bersama peserta dari berbagai sekolah.',
    coverFile: 'OMNI-Sains.jpg',
    prefix: 'OMNI-',
    count: 44,
  },
  {
    slug: 'jambore-aino-2025',
    title: 'Jambore AINO 2025',
    tag: 'Kegiatan',
    description:
      'Kegiatan jambore bersama AINO 2025: kebersamaan, tantangan lapangan, dan pengalaman baru.',
    coverFile: 'jambore-aino-2025.jpg',
    prefix: 'jambore-',
    count: 36,
  },
  {
    slug: 'pagelaran-kebudayaan',
    title: 'Pagelaran Kebudayaan',
    tag: 'Budaya',
    description:
      'Pagelaran kebudayaan kelas X yang menampilkan tari, busana, dan tradisi daerah.',
    coverFile: 'pagelaran-kelas-x.jpg',
    prefix: 'pagelaran-',
    count: 20,
  },
  {
    slug: 'hut-pgri-79',
    title: 'HUT PGRI Ke-79',
    tag: 'Peringatan',
    description:
      'Peringatan Hari Ulang Tahun PGRI ke-79 bersama bapak dan ibu guru.',
    coverFile: 'hut-pgri-79.png',
    prefix: 'pgri-',
    count: 29,
  },
  {
    slug: 'in-house-training-2024',
    title: 'In House Training 2024',
    tag: 'Pelatihan',
    description:
      'Pelatihan internal tenaga pendidik untuk meningkatkan kualitas pembelajaran.',
    coverFile: 'iht-2024.png',
    prefix: 'iht-',
    count: 5,
    plain: true,
  },
  {
    slug: 'sertijab-osis-2024-2025',
    title: 'Pengurus OSIS 2024-2025',
    tag: 'Organisasi',
    description:
      'Serah terima jabatan dan pelantikan pengurus OSIS periode 2024-2025.',
    coverFile: 'sertijab-osis-2425.jpg',
    prefix: 'sertijab-',
    count: 32,
  },
  {
    slug: 'kunjungan-prakerin',
    title: 'Kunjungan Prakerin',
    tag: 'Industri',
    description:
      'Kunjungan guru ke tempat praktik kerja industri untuk memantau siswa prakerin.',
    coverFile: 'kunjungan-prakerin.png',
    prefix: 'prakerin-',
    count: 11,
  },
];

const COVER_EXTS = ['webp', 'jpg', 'jpeg', 'png', 'JPG', 'PNG'];

/** Kandidat URL cover: file persis dari config dulu, lalu ekstensi lain */
const coverCandidates = (file: string): string[] => {
  const base = file.replace(/\.[^.]+$/, '');
  const list = [file, ...COVER_EXTS.map((e) => `${base}.${e}`)];
  return [...new Set(list)].map((f) => encodeURI(`/galeri/logo/${f}`));
};

const photoUrls = (
  prefix: string,
  count: number,
  plain = false,
  ext = 'webp'
): string[] =>
  Array.from({ length: count }, (_, i) =>
    encodeURI(`/galeri/foto/${prefix}${plain ? i + 1 : `(${i + 1})`}.${ext}`)
  );

export const ALBUMS: Album[] = ALBUM_CONFIG.map(
  ({ coverFile, prefix, count, plain, ext, ...rest }) => {
    const photos = photoUrls(prefix, count, plain, ext);
    const candidates = [...coverCandidates(coverFile), photos[0]].filter(Boolean);
    return {
      ...rest,
      cover: candidates[0],
      coverCandidates: candidates,
      photos,
    };
  }
);

export const getAlbumBySlug = (slug?: string): Album | undefined =>
  ALBUMS.find((a) => a.slug === slug);

/** Font heading & body (Google Fonts) */
export const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
.font-heading{font-family:'Space Grotesk','Anton',system-ui,sans-serif}
.font-display{font-family:'Anton','Space Grotesk',Impact,sans-serif}
.font-body{font-family:'Inter','Plus Jakarta Sans',system-ui,sans-serif}
`;