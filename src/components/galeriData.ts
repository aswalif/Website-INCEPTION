// src/pages/galeri/galeriData.ts
// Auto-import semua aset galeri memakai Vite import.meta.glob.
// Folder: src/assets/galeri/logo/  dan  src/assets/galeri/foto/

const logoModules = import.meta.glob<string>(
  '/src/assets/galeri/logo/*.{jpg,jpeg,png,webp,JPG,PNG}',
  { eager: true, import: 'default', query: '?url' }
);

const fotoModules = import.meta.glob<string>(
  '/src/assets/galeri/foto/*.{jpg,jpeg,png,webp,JPG,PNG}',
  { eager: true, import: 'default', query: '?url' }
);

export interface Album {
  slug: string;
  title: string;
  tag: string;
  description: string;
  cover: string;
  photos: string[];
}

interface AlbumConfig {
  slug: string;
  title: string;
  tag: string;
  description: string;
  coverFile: string;
  /** Awalan nama file foto, mis. "Pameran-" untuk Pameran-(1).jpg */
  prefix: string;
  /** Jumlah foto (dipakai jika aset ada di folder public/) */
  count: number;
  /** true jika nama file tanpa kurung, mis. iht-1.jpg */
  plain?: boolean;
}

const ALBUM_CONFIG: AlbumConfig[] = [
  {
    slug: 'pameran-karya-siswa',
    title: 'Pameran Karya Siswa',
    tag: 'Pameran',
    description: 'Hasil karya siswa dari berbagai jurusan yang dipamerkan kepada warga sekolah dan tamu undangan.',
    coverFile: 'Pameran-karya-siswa.jpg',
    prefix: 'Pameran-',
    count: 12,
  },
  {
    slug: 'omni-sains',
    title: 'OMNI Sains Indonesia',
    tag: 'Kompetisi',
    description: 'Dokumentasi pelaksanaan Olimpiade OMNI Sains Indonesia bersama peserta dari berbagai sekolah.',
    coverFile: 'OMNI-Sains.jpg',
    prefix: 'OMNI-',
    count: 44,
  },
  {
    slug: 'jambore-aino-2025',
    title: 'Jambore AINO 2025',
    tag: 'Kegiatan',
    description: 'Kegiatan jambore bersama AINO 2025: kebersamaan, tantangan lapangan, dan pengalaman baru.',
    coverFile: 'jambore-aino-2025.jpg',
    prefix: 'jambore-',
    count: 36,
  },
  {
    slug: 'pagelaran-kebudayaan',
    title: 'Pagelaran Kebudayaan',
    tag: 'Budaya',
    description: 'Pagelaran kebudayaan kelas X yang menampilkan tari, busana, dan tradisi daerah.',
    coverFile: 'pagelaran-kelas-x.jpg',
    prefix: 'pagelaran-',
    count: 20,
  },
  {
    slug: 'hut-pgri-79',
    title: 'HUT PGRI Ke-79',
    tag: 'Peringatan',
    description: 'Peringatan Hari Ulang Tahun PGRI ke-79 bersama bapak dan ibu guru.',
    coverFile: 'hut-pgri-79.png',
    prefix: 'pgri-',
    count: 29,
  },
  {
    slug: 'in-house-training-2024',
    title: 'In House Training 2024',
    tag: 'Pelatihan',
    description: 'Pelatihan internal tenaga pendidik untuk meningkatkan kualitas pembelajaran.',
    coverFile: 'iht-2024.png',
    prefix: 'iht-',
    count: 5,
    plain: true,
  },
  {
    slug: 'sertijab-osis-2024-2025',
    title: 'Pengurus OSIS 2024-2025',
    tag: 'Organisasi',
    description: 'Serah terima jabatan dan pelantikan pengurus OSIS periode 2024-2025.',
    coverFile: 'sertijab-osis-2425.jpg',
    prefix: 'sertijab-',
    count: 32,
  },
  {
    slug: 'kunjungan-prakerin',
    title: 'Kunjungan Prakerin',
    tag: 'Industri',
    description: 'Kunjungan guru ke tempat praktik kerja industri untuk memantau siswa prakerin.',
    coverFile: 'kunjungan-prakerin.png',
    prefix: 'prakerin-',
    count: 11,
  },
];

const fileName = (path: string) => path.split('/').pop() ?? '';

const findCover = (file: string): string => {
  const hit = Object.entries(logoModules).find(
    ([path]) => fileName(path).toLowerCase() === file.toLowerCase()
  );
  // Fallback: aset di folder public/galeri/logo/
  return hit ? hit[1] : encodeURI(`/galeri/logo/${file}`);
};

/** Ambil foto berdasarkan prefix, cocok untuk "prefix(1).jpg" maupun "prefix1.jpg", diurutkan numerik. */
const findPhotos = (prefix: string): string[] => {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^${escaped}\\(?(\\d+)\\)?\\.(jpe?g|png|webp)$`, 'i');

  return Object.entries(fotoModules)
    .map(([path, url]) => {
      const match = fileName(path).match(pattern);
      return match ? { n: Number(match[1]), url } : null;
    })
    .filter((x): x is { n: number; url: string } => x !== null)
    .sort((a, b) => a.n - b.n)
    .map((x) => x.url);
};

/** Fallback: bangun URL dari folder public/galeri/foto/ */
const publicPhotos = (prefix: string, count: number, plain?: boolean): string[] =>
  Array.from({ length: count }, (_, i) =>
    encodeURI(`/galeri/foto/${prefix}${plain ? i + 1 : `(${i + 1})`}.jpg`)
  );

export const ALBUMS: Album[] = ALBUM_CONFIG.map(({ coverFile, prefix, count, plain, ...rest }) => {
  const imported = findPhotos(prefix);
  return {
    ...rest,
    cover: findCover(coverFile),
    // Pakai hasil import (src/assets) jika ada, kalau tidak pakai folder public
    photos: imported.length > 0 ? imported : publicPhotos(prefix, count, plain),
  };
});

export const getAlbumBySlug = (slug?: string): Album | undefined =>
  ALBUMS.find((a) => a.slug === slug);

/** Font heading & body (Google Fonts) */
export const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
.font-heading{font-family:'Space Grotesk','Anton',system-ui,sans-serif}
.font-display{font-family:'Anton','Space Grotesk',Impact,sans-serif}
.font-body{font-family:'Inter','Plus Jakarta Sans',system-ui,sans-serif}
`;