export type MitraStatus = 'Aktif' | 'Mitra Utama';

export interface Mitra {
  id: string;
  name: string;
  category: string;
  location: string;
  address: string;
  description: string;
  logoKey?: string;
  status: MitraStatus;
  industry: string;
  partnership: string[];
  relatedMajors: string[];
}

export const MITRA_DATA: Mitra[] = [
  {
    id: 'telkom-akses-area-medan',
    name: 'Telkom Akses Area Medan',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra industri bidang infrastruktur telekomunikasi dan jaringan sebagai bagian dari ekosistem pembelajaran berbasis industri.',
    logoKey: 'telkom-akses-area-medan',
    status: 'Mitra Utama',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
      'Uji Kompetensi / Sertifikasi',
      'Penyerapan Lulusan',
    ],
    relatedMajors: ['TKJ'],
  },
  {
    id: 'rackh-lintas-asia',
    name: 'PT. RackH Lintas Asia',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi pada bidang teknologi jaringan, infrastruktur, dan kebutuhan kompetensi digital.',
    logoKey: 'rackh-lintas-asia',
    status: 'Aktif',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['TKJ', 'RPL'],
  },
  {
    id: 'putra-mulia-telekomunikasi',
    name: 'PT. Putra Mulia Telekomunikasi (PMT)',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi yang bergerak pada lingkungan kerja telekomunikasi dan mendukung pengenalan kompetensi industri.',
    logoKey: 'putra-mulia-telekomunikasi',
    status: 'Aktif',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['TKJ'],
  },
  {
    id: 'mandiri-daya-utama-nusantara',
    name: 'PT. Mandiri Daya Utama Nusantara (MANDAU)',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi untuk pengembangan wawasan siswa terhadap kebutuhan kompetensi dunia industri.',
    logoKey: 'mandiri-daya-utama-nusantara',
    status: 'Aktif',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['TKJ'],
  },
  {
    id: 'biosron',
    name: 'PT. Biosron',
    category: 'Software & IT',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi pada ekosistem teknologi informasi dan pengembangan kompetensi digital.',
    logoKey: 'biosron',
    status: 'Aktif',
    industry: 'Software & IT',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['RPL'],
  },
  {
    id: 'fiber-networks-indonesia',
    name: 'Fiber Networks Indonesia',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi pada bidang jaringan dan infrastruktur teknologi komunikasi.',
    logoKey: 'fiber-networks-indonesia',
    status: 'Aktif',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['TKJ'],
  },
  {
    id: 'neora-infrastructure',
    name: 'Neora Infrastructure',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi dalam lingkungan infrastruktur teknologi dan jaringan.',
    logoKey: 'neora-infrastructure',
    status: 'Aktif',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
    ],
    relatedMajors: ['TKJ'],
  },
  {
    id: 'inter-medialink-solusi',
    name: 'PT. Inter Medialink Solusi (IMS)',
    category: 'Software & IT',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi pada bidang solusi teknologi informasi dan pengembangan kompetensi digital.',
    logoKey: 'inter-medialink-solusi',
    status: 'Aktif',
    industry: 'Software & IT',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['RPL'],
  },
  {
    id: 'cipta-karya-technology',
    name: 'PT. Cipta Karya Technology',
    category: 'Software & IT',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi yang mendukung pengenalan lingkungan kerja teknologi dan kebutuhan kompetensi digital.',
    logoKey: 'cipta-karya-technology',
    status: 'Aktif',
    industry: 'Software & IT',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['RPL'],
  },
  {
    id: 'sae-akademi',
    name: 'SAE Akademi',
    category: 'Pendidikan & Lembaga',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra pendidikan dan pengembangan kompetensi dengan fokus pada pembelajaran dan lingkungan industri kreatif.',
    logoKey: 'sae-akademi',
    status: 'Aktif',
    industry: 'Pendidikan & Lembaga',
    partnership: [
      'Guru Tamu Industri',
      'Uji Kompetensi / Sertifikasi',
    ],
    relatedMajors: ['DKV'],
  },
  {
    id: 'rsup-haji-adam-malik',
    name: 'RSUP Haji Adam Malik',
    category: 'Pendidikan & Lembaga',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra institusi yang menjadi bagian dari jaringan hubungan kelembagaan dan pengembangan pengalaman kerja siswa.',
    logoKey: 'rsup-haji-adam-malik',
    status: 'Aktif',
    industry: 'Pendidikan & Lembaga',
    partnership: [
      'Tempat PKL / Magang',
    ],
    relatedMajors: ['TKJ', 'RPL'],
  },
  {
    id: 'mikrotik-academy',
    name: 'Mikrotik Academy',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra pembelajaran yang berkaitan dengan pengembangan kompetensi jaringan dan teknologi informasi.',
    logoKey: 'mikrotik-academy',
    status: 'Mitra Utama',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Guru Tamu Industri',
      'Uji Kompetensi / Sertifikasi',
    ],
    relatedMajors: ['TKJ', 'RPL'],
  },
  {
    id: 'metromatika-teknologi-rekayasa',
    name: 'PT. Metromatika Teknologi Rekayasa',
    category: 'Software & IT',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi pada bidang teknologi dan rekayasa yang mendukung pengenalan kebutuhan kompetensi industri.',
    logoKey: 'metromatika-teknologi-rekayasa',
    status: 'Aktif',
    industry: 'Software & IT',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['RPL'],
  },
  {
    id: 'meatech-college-malaysia',
    name: 'Meatech College Malaysia',
    category: 'Pendidikan & Lembaga',
    location: 'Malaysia',
    address: 'Malaysia',
    description:
      'Mitra pendidikan untuk memperluas wawasan dan jejaring pembelajaran pada lingkungan pendidikan dan teknologi.',
    logoKey: 'meatech-college-malaysia',
    status: 'Mitra Utama',
    industry: 'Pendidikan & Lembaga',
    partnership: [
      'Guru Tamu Industri',
      'Pengembangan Kompetensi',
    ],
    relatedMajors: ['RPL', 'TKJ'],
  },
  {
    id: 'mandike-aplikanusa',
    name: 'Mandike Aplikanusa',
    category: 'Software & IT',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi dalam bidang teknologi informasi dan pengembangan kompetensi digital.',
    logoKey: 'mandike-aplikanusa',
    status: 'Aktif',
    industry: 'Software & IT',
    partnership: [
      'Tempat PKL / Magang',
    ],
    relatedMajors: ['RPL'],
  },
  {
    id: 'kompas-tv-medan',
    name: 'Kompas TV Medan',
    category: 'Media & Kreatif',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi pada bidang media, produksi konten, dan lingkungan kerja kreatif.',
    logoKey: 'kompas-tv-medan',
    status: 'Mitra Utama',
    industry: 'Media & Kreatif',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['DKV'],
  },
  {
    id: 'art-media-production',
    name: 'Art Media Production',
    category: 'Media & Kreatif',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi yang mendukung pengenalan proses produksi media dan kebutuhan industri kreatif.',
    logoKey: 'art-media-production',
    status: 'Aktif',
    industry: 'Media & Kreatif',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['DKV'],
  },
  {
    id: 'dwi-murni',
    name: 'CV. Dwi Murni',
    category: 'Media & Kreatif',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi yang mendukung pengalaman pembelajaran dan pengenalan lingkungan kerja.',
    logoKey: 'dwi-murni',
    status: 'Aktif',
    industry: 'Media & Kreatif',
    partnership: [
      'Tempat PKL / Magang',
    ],
    relatedMajors: ['DKV'],
  },
  {
    id: 'medianusa-permana',
    name: 'PT. Medianusa Permana (Permananet)',
    category: 'Telekomunikasi & Jaringan',
    location: 'Medan, Sumatera Utara',
    address: 'Medan, Sumatera Utara',
    description:
      'Mitra demonstrasi dalam bidang jaringan dan layanan teknologi informasi.',
    logoKey: 'medianusa-permana',
    status: 'Mitra Utama',
    industry: 'Telekomunikasi & Jaringan',
    partnership: [
      'Tempat PKL / Magang',
      'Guru Tamu Industri',
    ],
    relatedMajors: ['TKJ', 'RPL'],
  },
];