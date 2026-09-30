// src/data/prestasi.ts

export type PrestasiCategory =
  | "Teknologi"
  | "Akademik"
  | "Olahraga"
  | "Seni"
  | "Lainnya";

export type PrestasiLevel =
  | "Kota"
  | "Provinsi"
  | "Nasional"
  | "Internasional";

export type Prestasi = {
  id: string;
  title: string;
  recipient: string;
  organizer: string;
  date: string;
  year: number;
  category: PrestasiCategory;
  level: PrestasiLevel;
  image: string;
  description: string;
  story: string;
  awards: string[];
};

/* =========================================================
   DYNAMIC IMAGE IMPORT
========================================================= */

const prestasiImages = import.meta.glob<{ default: string }>(
  "../assets/prestasi/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
  },
);

/* =========================================================
   IMAGE RESOLVER
========================================================= */

export const getPrestasiImage = (fileName: string): string => {
  const entry = Object.entries(prestasiImages).find(([path]) =>
    path.endsWith(`/${fileName}`),
  );

  return entry?.[1]?.default ?? "";
};

/* =========================================================
   HELPERS
========================================================= */

const getCategory = (title: string): PrestasiCategory => {
  const value = title.toLowerCase();

  if (
    value.includes("web desain") ||
    value.includes("prompt ai") ||
    value.includes("cisco") ||
    value.includes("skkni") ||
    value.includes("bnsp") ||
    value.includes("saintech") ||
    value.includes("bebras")
  ) {
    return "Teknologi";
  }

  if (
    value.includes("olimpiade") ||
    value.includes("sains") ||
    value.includes("matematika") ||
    value.includes("fisika") ||
    value.includes("biologi") ||
    value.includes("bahasa arab") ||
    value.includes("bahasa inggris") ||
    value.includes("smart education") ||
    value.includes("public speaking") ||
    value.includes("speech") ||
    value.includes("snbt") ||
    value.includes("snbp") ||
    value.includes("akademik") ||
    value.includes("ptn")
  ) {
    return "Akademik";
  }

  if (
    value.includes("lari") ||
    value.includes("panjat tebing") ||
    value.includes("taekwondo") ||
    value.includes("futsal") ||
    value.includes("pon xxi") ||
    value.includes("olahraga")
  ) {
    return "Olahraga";
  }

  if (
    value.includes("fls3n") ||
    value.includes("story telling") ||
    value.includes("digital art") ||
    value.includes("seni") ||
    value.includes("pesona")
  ) {
    return "Seni";
  }

  return "Lainnya";
};

const getLevel = (title: string): PrestasiLevel => {
  const value = title.toLowerCase();

  if (
    value.includes("malaysia") ||
    value.includes("international") ||
    value.includes("internasional")
  ) {
    return "Internasional";
  }

  if (
    value.includes("nasional") ||
    value.includes("se-indonesia") ||
    value.includes("pon xxi") ||
    value.includes("snbt") ||
    value.includes("snbp")
  ) {
    return "Nasional";
  }

  if (value.includes("provinsi")) {
    return "Provinsi";
  }

  return "Kota";
};

const getYear = (title: string): number => {
  const match = title.match(/\b20\d{2}\b/);

  return match ? Number(match[0]) : 0;
};

const getRecipient = (title: string): string => {
  const value = title.toLowerCase();

  if (value.includes("m. zaidan pratama")) {
    return "M. Zaidan Pratama";
  }

  if (value.includes("fathin naufal murtadho")) {
    return "Fathin Naufal Murtadho";
  }

  if (value.includes("nadya maretha")) {
    return "Nadya Maretha";
  }

  if (value.includes("kaneisha aqueni")) {
    return "Kaneisha Aqueni";
  }

  if (value.includes("kaneisha")) {
    return "Kaneisha";
  }

  if (value.includes("telsa")) {
    return "Telsa";
  }

  if (value.includes("25 siswai")) {
    return "25 siswa/i SMK Telkom Medan";
  }

  if (value.includes("14 siswai")) {
    return "14 siswa/i SMK Telkom Medan";
  }

  if (value.includes("5 siswa")) {
    return "5 siswa SMK Telkom Medan";
  }

  if (value.includes("siswa/i")) {
    return "Siswa/i SMK Telkom Medan";
  }

  if (value.includes("siswa ")) {
    return "Siswa SMK Telkom Medan";
  }

  if (value.includes("tim futsal")) {
    return "Tim Futsal SMK Telkom Medan";
  }

  if (value.includes("tim")) {
    return "Tim siswa SMK Telkom Medan";
  }

  if (value.includes("duo")) {
    return "Dua siswa SMK Telkom Medan";
  }

  return "Siswa/i SMK Telkom Medan";
};

const getOrganizer = (title: string): string => {
  const value = title.toLowerCase();

  if (value.includes("piala walikota")) {
    return "Penyelenggara Piala Walikota";
  }

  if (value.includes("koni championship")) {
    return "KONI Championship";
  }

  if (value.includes("medan independent school")) {
    return "Medan Independent School";
  }

  if (value.includes("diponegoro student competition")) {
    return "Diponegoro Student Competition";
  }

  if (value.includes("malaysia technology expo")) {
    return "Malaysia Technology Expo";
  }

  if (value.includes("cisco networking academy")) {
    return "Cisco Networking Academy";
  }

  if (value.includes("smart education competition")) {
    return "Smart Education Competition";
  }

  if (value.includes("caltex riau")) {
    return "SNC Caltex Riau";
  }

  if (value.includes("pon xxi")) {
    return "PON XXI Aceh-Sumut";
  }

  if (value.includes("bebras")) {
    return "Bebras Indonesia Challenge";
  }

  return "Informasi penyelenggara belum dicantumkan";
};

const getDateLabel = (year: number): string => {
  if (!year) {
    return "Tanggal belum dicantumkan";
  }

  return `Tahun ${year}`;
};

const buildDescription = (
  title: string,
  category: PrestasiCategory,
  level: PrestasiLevel,
): string => {
  return `${title} merupakan bagian dari dokumentasi pencapaian siswa SMK Telkom Medan pada bidang ${category.toLowerCase()}. Arsip ini mencatat capaian yang ditampilkan pada tingkat ${level.toLowerCase()} berdasarkan informasi yang tersedia pada materi prestasi.`;
};

const buildStory = (
  title: string,
  category: PrestasiCategory,
  level: PrestasiLevel,
): string => {
  return [
    `Dokumentasi "${title}" menjadi bagian dari perjalanan prestasi siswa SMK Telkom Medan.`,
    `Pencapaian ini berkaitan dengan bidang ${category.toLowerCase()} dan tercatat pada skala ${level.toLowerCase()}. Informasi detail mengenai tahapan kompetisi, tanggal pelaksanaan, maupun proses pembinaan tidak dicantumkan pada nama asset sehingga halaman ini tidak menambahkan klaim faktual yang tidak tersedia.`,
    "Nilai utama dari arsip prestasi ini adalah dokumentasi proses belajar, pengalaman berkompetisi, keberanian menunjukkan kemampuan, serta kesempatan siswa untuk mengembangkan kompetensi di luar kegiatan pembelajaran reguler.",
  ].join(' ');
};

const buildAwards = (
  title: string,
  category: PrestasiCategory,
): string[] => {
  const awards: string[] = [];

  const value = title.toLowerCase();

  if (value.includes("medali")) {
    awards.push("Medali sebagaimana tercantum pada dokumentasi");
  }

  if (value.includes("juara")) {
    awards.push("Pengakuan juara sebagaimana tercantum pada dokumentasi");
  }

  if (
    value.includes("sertifikat") ||
    value.includes("skkni") ||
    value.includes("bnsp")
  ) {
    awards.push("Sertifikasi atau sertifikat sebagaimana tercantum pada dokumentasi");
  }

  if (value.includes("beasiswa")) {
    awards.push("Dokumentasi beasiswa prestasi");
  }

  if (value.includes("duta")) {
    awards.push("Pengalaman dan pengakuan sebagai duta");
  }

  if (awards.length === 0) {
    awards.push("Dokumentasi pencapaian siswa");
  }

  awards.push(`Pengembangan kompetensi bidang ${category}`);
  awards.push("Pengalaman mengikuti kegiatan atau kompetisi");

  return [...new Set(awards)];
};

/* =========================================================
   RAW DATA
   ========================================================= */

type PrestasiSource = {
  id: string;
  title: string;
  image: string;
};

const PRESTASI_SOURCE: PrestasiSource[] = [
  {
    id: "prestasi-01",
    title: "Juara 2 Lomba Lari 5.000 Meter Kota Medan",
    image: "Juara 2 Lomba Lari 5.000 Meter Kota Medan.jpg",
  },
  {
    id: "prestasi-02",
    title: "Raih Juara 1 O2SN Panjat Tebing Putra",
    image: "Raih Juara 1 O2SN Panjat Tebing Putra.jpg",
  },
  {
    id: "prestasi-03",
    title: "Juara Olimpiade Nasional Saintech 2.0",
    image: "Juara Olimpiade Nasional Saintech 2.0.jpg",
  },
  {
    id: "prestasi-04",
    title: "Selamat atas 25 Siswai Lolos SNBT 2026",
    image: "Selamat atas 25 Siswai Lolos SNBT 2026.jpg",
  },
  {
    id: "prestasi-05",
    title: "Kembali Buktikan Kualitas di LKS Provinsi",
    image: "Kembali Buktikan Kualitas di LKS Provinsi.jpg",
  },
  {
    id: "prestasi-06",
    title: "Raih Prestasi di Ajang FLS3N",
    image: "Raih Prestasi di Ajang FLS3N.webp",
  },
  {
    id: "prestasi-07",
    title: "Raih Prestasi sebagai Duta Pesona Indonesia Batch 7",
    image: "Raih Prestasi sebagai Duta Pesona Indonesia Batch 7.jpg",
  },
  {
    id: "prestasi-08",
    title: "Juara 2 Olimpiade Nasional Saintech 2.0",
    image: "Juara 2 Olimpiade Nasional Saintech 2.0.jpg",
  },
  {
    id: "prestasi-09",
    title: "Borong Kejuaraan LKS SMK Tingkat Cabdis 1",
    image: "Borong Kejuaraan LKS SMK Tingkat Cabdis 1.webp",
  },
  {
    id: "prestasi-10",
    title: "Raih Silver Medal di Malaysia Technology Expo 2026",
    image: "Raih Silver Medal di Malaysia Technology Expo 2026.webp",
  },
  {
    id: "prestasi-11",
    title: "Dua Medali Emas di Ajang Nasional",
    image: "Dua Medali Emas di Ajang Nasional.webp",
  },
  {
    id: "prestasi-12",
    title: "14 Siswai SMK Telkom Medan Lulus SNBP 2026",
    image: "14 Siswai SMK Telkom Medan Lulus SNBP 2026.jpg",
  },
  {
    id: "prestasi-13",
    title: "Raih Juara Harapan 2 Public Speaking Competition",
    image: "Raih Juara Harapan 2 Public Speaking Competition.jpg",
  },
  {
    id: "prestasi-14",
    title: "TOP 2 Penyumbang Prestasi SMK se-Indonesia",
    image: "TOP 2 Penyumbang Prestasi SMK se-Indonesia.jpg",
  },
  {
    id: "prestasi-15",
    title: "Raih Prestasi di Bebras Indonesia Challenge 2025",
    image: "Raih Prestasi di Bebras Indonesia Challenge 2025.jpg",
  },
  {
    id: "prestasi-16",
    title: "M. Zaidan Pratama Duta Pelajar Anti Narkoba 2026",
    image: "M. Zaidan Pratama Duta Pelajar Anti Narkoba 2026.jpg",
  },
  {
    id: "prestasi-17",
    title: "Fathin Naufal Murtadho Raih Duta Inspiratif DPAN 2026",
    image: "Fathin Naufal Murtadho Raih Duta Inspiratif DPAN 2026.jpg",
  },
  {
    id: "prestasi-18",
    title: "DPAN Medan 2026 Nadya Maretha",
    image: "DPAN Medan 2026 Nadya Maretha.jpg",
  },
  {
    id: "prestasi-19",
    title: "Juara 2 Taekwondo Kejuaraan Piala Walikota",
    image: "Juara 2 Taekwondo Kejuaraan Piala Walikota.jpg",
  },
  {
    id: "prestasi-20",
    title: "Level Up with Cisco Networking Academy",
    image: "Level up with Cisco Networking Academy.jpg",
  },
  {
    id: "prestasi-21",
    title: "Juara 2 - Web Desain",
    image: "Juara 2 - Web Desain.jpg",
  },
  {
    id: "prestasi-22",
    title: "Juara 1 - Prompt AI",
    image: "Juara 1 - Prompt AI.jpg",
  },
  {
    id: "prestasi-23",
    title: "Juara 1 - Story Telling",
    image: "Juara 1 - Story Telling.jpg",
  },
  {
    id: "prestasi-24",
    title: "Duo High Score Alert!",
    image: "Duo High Score Alert!.jpg",
  },
  {
    id: "prestasi-25",
    title: "Selamat kepada Penerima Sertifikat SKKNI",
    image: "Selamat kepada penerima Sertifikat SKKNI.jpg",
  },
  {
    id: "prestasi-26",
    title: "Juara 1 Taekwondo KONI Championship",
    image: "Juara 1 Taekwondo KONI Championship.jpg",
  },
  {
    id: "prestasi-27",
    title: "Agustus Penuh Prestasi",
    image: "Agustus Penuh Prestasi.jpg",
  },
  {
    id: "prestasi-28",
    title: "Pembagian Beasiswa Prestasi",
    image: "Pembagian Beasiswa Prestasi.jpg",
  },
  {
    id: "prestasi-29",
    title: "Siswa SMK Telkom 1 Medan Raih Sertifikat BNSP dari Telkom DigiUP",
    image: "Siswa SMK Telkom 1 Medan Raih Sertifikat BNSP dari Telkom DigiUP.jpg",
  },
  {
    id: "prestasi-30",
    title: "5 Siswa SMK Telkom 1 Medan Raih Juara LKS Provinsi dan Lolos ke Tingkat Nasional",
    image:
      "5 Siswa SMK Telkom 1 Medan Raih Juara LKS Provinsi dan Lolos ke Tingkat Nasional.webp",
  },
  {
    id: "prestasi-31",
    title: "Top 3 dan Penghargaan sebagai Most Insightful Speaker",
    image: "Top 3 dan penghargaan sebagai Most Insightful Speaker.jpg",
  },
  {
    id: "prestasi-32",
    title: "SMK Telkom 1 Medan Borong Juara di Ajang LKS Tingkat Kota Medan",
    image:
      "SMK Telkom 1 Medan Borong Juara di Ajang LKS Tingkat Kota Medan.jpg",
  },
  {
    id: "prestasi-33",
    title: "Siswa SMK Telkom 1 Medan Raih Dua Medali Emas di Olimpiade Akademik Nasional",
    image:
      "Siswa SMK Telkom 1 Medan Raih Dua Medali Emas di Olimpiade Akademik Nasional.jpg",
  },
  {
    id: "prestasi-34",
    title: "Siswa SMK Telkom 1 Medan Lolos SNBT dan Masuk Top PTN Indonesia",
    image:
      "Siswa SMK Telkom 1 Medan Lolos SNBT dan Masuk Top PTN Indonesia.jpg",
  },
  {
    id: "prestasi-35",
    title: "Siswa SMK Telkom 1 Medan Diterima Bekerja di PT Quantum Nusatama",
    image:
      "Siswa SMK Telkom 1 Medan Diterima Bekerja di PT Quantum Nusatama.jpg",
  },
  {
    id: "prestasi-36",
    title: "Medali Perunggu Smart Education Competition Bidang Bahasa Inggris SMA",
    image:
      "Medali Perunggu  Smart Education Competition Bidang Bahasa Inggris SMA.jpg",
  },
  {
    id: "prestasi-37",
    title: "Medali Emas Smart Education Competition Tingkat Nasional Bidang Matematika SMA 16 Medan",
    image:
      "Medali Emas  Smart Education Competition tingkat nasional Bidang Matematika SMA 16 mei.jpg",
  },
  {
    id: "prestasi-38",
    title: "Peraih Medali Emas Nasional Taekwondo",
    image: "Peraih Medali Emas Nasional Taekwondo.jpg",
  },
  {
    id: "prestasi-39",
    title: "Siswa/i SMK Telkom 1 Medan Lulus SNBP Tahun 2025",
    image: "Siswai SMK Telkom 1 Medan Lulus SNBP Tahun 2025.jpg",
  },
  {
    id: "prestasi-40",
    title: "Medali Emas di Kejuaraan Sains Nasional 2025",
    image: "Medali Emas di Kejuaraan Sains Nasional 2025.jpg",
  },
  {
    id: "prestasi-41",
    title: "Medali Emas di Diponegoro Student Competition 2025",
    image: "Medali Emas di Diponegoro Student Competition 2025.jpg",
  },
  {
    id: "prestasi-42",
    title: "Medali Emas Olimpiade Nasional Sains dan Bahasa",
    image: "Medai Emas Olimpiade Nasional Sains dan Bahasa.jpg",
  },
  {
    id: "prestasi-43",
    title: "Peraih Medali Emas Bidang Fisika SMK",
    image: "Peraih Medali Emas Bidang FisikaSMK.jpg",
  },
  {
    id: "prestasi-44",
    title: "Sangga Pramuka Meraih Piala Pangkalan Terbaik Sangga",
    image: "Sangga Pramuka Meraih Piala Pangkalan TerbaikSangga .png",
  },
  {
    id: "prestasi-45",
    title: "Peraih Medali Emas Bidang Matematika Kaneisha Aqueni",
    image: "Peraih Medali Emas Bidang Matematika Kaneisha Aqueni.jpg",
  },
  {
    id: "prestasi-46",
    title: "Tim Futsal Juara 2 Medan Independent School Tim",
    image: "Tim Futsal Juara 2 Medan Independent School Tim.jpg",
  },
  {
    id: "prestasi-47",
    title: "Peraih Medali Emas Bidang Biologi Kaneisha",
    image: "Peraih Medali Emas Bidang Biologi Kaneisha.jpg",
  },
  {
    id: "prestasi-48",
    title: "Peraih Medali Emas Bidang Biologi Siswi",
    image: "Peraih Medali Emas Bidang Biologi Siswi.jpg",
  },
  {
    id: "prestasi-49",
    title: "Telsa Ikut Serta PON XXI Aceh-Sumut",
    image: "Telsa Ikut Serta PON XXI Aceh-Sumut.jpg",
  },
  {
    id: "prestasi-50",
    title: "Juara 3 Lomba SNC Caltex Riau",
    image: "Juara 3 Lomba SNC Caltex Riau.jpg",
  },
  {
    id: "prestasi-51",
    title: "Peraih Medali Emas Bidang Bahasa Arab",
    image: "Peraih Medali Emas Bidang Bahasa Arab.jpg",
  },
];

/* =========================================================
   FINAL DATASET
========================================================= */

export const PRESTASI_DATA: Prestasi[] = PRESTASI_SOURCE.map(
  (source) => {
    const category = getCategory(source.title);
    const level = getLevel(source.title);
    const year = getYear(source.title);

    return {
      id: source.id,
      title: source.title,
      recipient: getRecipient(source.title),
      organizer: getOrganizer(source.title),
      date: getDateLabel(year),
      year,
      category,
      level,
      image: getPrestasiImage(source.image),
      description: buildDescription(
        source.title,
        category,
        level,
      ),
      story: buildStory(
        source.title,
        category,
        level,
      ),
      awards: buildAwards(source.title, category),
    };
  },
);

/* =========================================================
   DATA VALIDATION
========================================================= */

if (import.meta.env.DEV) {
  const uniqueImages = new Set(
    PRESTASI_SOURCE.map((item) => item.image),
  );

  if (PRESTASI_DATA.length !== 51) {
    console.error(
      `[Prestasi] Expected 51 items, found ${PRESTASI_DATA.length}.`,
    );
  }

  if (uniqueImages.size !== 51) {
    console.error(
      `[Prestasi] Expected 51 unique assets, found ${uniqueImages.size}.`,
    );
  }

  const missingImages = PRESTASI_DATA.filter(
    (item) => !item.image,
  );

  if (missingImages.length > 0) {
    console.warn(
      "[Prestasi] Asset tidak ditemukan:",
      missingImages.map((item) => item.title),
    );
  }
}