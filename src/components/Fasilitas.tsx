import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

// Daftarkan plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface FasilitasData {
  id: number;
  title: string;
  category: string;
  image: string;
  gridClass: string; // Untuk membuat layout grid asimetris (Awwwards Style)
}

// Data 21 Fasilitas
const fasilitasData: FasilitasData[] = [
  {
    id: 1,
    title: "Lab Rekayasa Perangkat Lunak",
    category: "Laboratorium",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Studio DKV & Animasi",
    category: "Studio",
    image:
      "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Lab Jaringan (TKJ)",
    category: "Laboratorium",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Dapur Praktik Kuliner",
    category: "Praktikum",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-1",
  },
  {
    id: 5,
    title: "Perpustakaan Digital",
    category: "Fasilitas Umum",
    image:
      "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: 6,
    title: "Lapangan Basket Interaktif",
    category: "Olahraga",
    image:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-1",
  },
  {
    id: 7,
    title: "Masjid Raya Sekolah",
    category: "Ibadah",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 8,
    title: "Aula Serbaguna (Hall)",
    category: "Fasilitas Umum",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    id: 9,
    title: "Kantin Sehat & Bersih",
    category: "Fasilitas Umum",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 10,
    title: "Ruang Podcast & Broadcasting",
    category: "Studio",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 11,
    title: "Lab Bahasa Internasional",
    category: "Laboratorium",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 12,
    title: "Klinik Kesehatan (UKS)",
    category: "Kesehatan",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 13,
    title: "Area Parkir Cerdas",
    category: "Infrastruktur",
    image:
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-1",
  },
  {
    id: 14,
    title: "Ruang Guru Eksekutif",
    category: "Fasilitas Staf",
    image:
      "https://images.unsplash.com/photo-1577415124269-b9140d52d924?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 15,
    title: "Ruang Bimbingan Konseling",
    category: "Layanan",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 16,
    title: "Taman Literasi & Ekologi",
    category: "Area Terbuka",
    image:
      "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    id: 17,
    title: "Lapangan Futsal Standar",
    category: "Olahraga",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 18,
    title: "Studio Fotografi",
    category: "Studio",
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 19,
    title: "Ruang Rapat Interaktif",
    category: "Fasilitas Staf",
    image:
      "https://images.unsplash.com/photo-1503423571797-2d2bb372094a?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 20,
    title: "Lobi Utama Utama",
    category: "Fasilitas Umum",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: 21,
    title: "Coworking Space Siswa",
    category: "Infrastruktur",
    image:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=800&auto=format&fit=crop",
    gridClass: "md:col-span-2 md:row-span-1",
  },
];

const Fasilitas: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animasi Header (Fade In & Slide Up)
      gsap.fromTo(
        ".header-text",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        },
      );

      // 2. Animasi Grid (Staggered Reveal)
      const cards = gsap.utils.toArray<HTMLElement>(".fasilitas-card");

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // Animasi akan tertrigger saat kartu masuk 85% layar
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // 3. Animasi Parallax ringan pada background gambar saat di scroll
      cards.forEach((card) => {
        const img = card.querySelector("img");
        if (img) {
          gsap.to(img, {
            yPercent: 15, // Gambar bergeser ke bawah seiring scroll
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    // Cleanup untuk mencegah memory leak
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="Fasilitas"
      ref={sectionRef}
      className="relative w-full bg-slate-50 py-24 lg:py-32 overflow-hidden"
    >
      {/* Pattern Latar Belakang (Opsional untuk estetika) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#E30613 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* HEADER SECTION - Editorial Style */}
        <div
          ref={headerRef}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-3xl overflow-hidden">
            <h4 className="header-text text-[#E30613] font-bold tracking-widest uppercase text-sm md:text-base mb-4 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#E30613]"></span> Infrastruktur
            </h4>
            <h2 className="header-text text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter">
              FASILITAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-[#990000]">
                SEKOLAH KAMI
              </span>
            </h2>
          </div>
          <div className="header-text max-w-sm overflow-hidden">
            <p className="text-slate-600 text-lg leading-relaxed">
              Mendukung terciptanya ekosistem belajar yang inovatif, kreatif,
              dan berstandar industri demi mencetak generasi unggul.
            </p>
          </div>
        </div>

        {/* GRID SECTION - Bento / Asymmetric Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]"
        >
          {fasilitasData.map((fasilitas) => (
            <div
              key={fasilitas.id}
              className={`fasilitas-card group relative rounded-2xl overflow-hidden cursor-pointer ${fasilitas.gridClass}`}
            >
              {/* Gambar Background (Dengan wrapper untuk parallax GSAP & transform Hover) */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={fasilitas.image}
                  alt={fasilitas.title}
                  className="w-full h-[120%] object-cover -top-[10%] relative transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>

              {/* Overlay Gradient (Dark Mode Contrast) */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              {/* Konten Kartu */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Badge Kategori */}
                <div className="flex justify-end">
                  <span className="px-4 py-1.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30 transform translate-y-[-10px] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {fasilitas.category}
                  </span>
                </div>

                {/* Judul & Icon (Awwwards Style Reveal) */}
                <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 pr-10">
                    {fasilitas.title}
                  </h3>

                  {/* Garis Aksen & Tombol Arrow */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="h-[1px] w-0 bg-[#E30613] transition-all duration-700 ease-out group-hover:w-12" />
                    <div className="w-10 h-10 rounded-full bg-[#E30613] text-white flex items-center justify-center opacity-0 -translate-x-4 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-x-0">
                      <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fasilitas;
