import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-md py-3 shadow-xl' 
        : 'bg-black/40 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        
        {/* Logo Resmi SMK Telkom Medan */}
        <a href="#hero" className="flex items-center gap-2 group">
          <img 
            src="/logo-telkom.png" 
            alt="SMK Telkom Medan" 
            className="h-10 sm:h-12 w-auto object-contain rounded-xl p-1 bg-white/10 border border-white/20 transition-transform group-hover:scale-105"
          />
        </a>

        {/* Navigation Menu Desktop */}
        <div className="hidden lg:flex items-center gap-6 text-white text-sm font-semibold">
          
          {/* Beranda */}
          <div className="relative group py-2 flex flex-col items-center">
            <a href="#hero" className="hover:text-red-500 transition-colors">Beranda</a>
            {/* Indikator T Terbalik (┴) dengan Animasi Smooth Melebar dari Tengah */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-[2px] h-1.5 bg-red-600 transition-transform duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"></div>
              <div className="w-12 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-transform duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100"></div>
            </div>
          </div>

          {/* Dropdown Tentang */}
          <div 
            className="relative group py-2 flex flex-col items-center"
            onMouseEnter={() => setActiveDropdown('tentang')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              Tentang ▾
            </button>

            {/* Indikator T Terbalik (┴) dengan Animasi Smooth Melebar dari Tengah */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-[2px] h-1.5 bg-red-600 transition-transform duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"></div>
              <div className="w-14 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-transform duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100"></div>
            </div>

            <div 
              className={`absolute top-full left-0 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 flex flex-col text-xs font-medium transition-all duration-200 ease-out origin-top mt-3 ${
                activeDropdown === 'tentang'
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <a href="#profil" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">Profil Sekolah</a>
              <a href="#visi-misi" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">Visi dan Misi</a>
              <a href="#struktur" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">Struktur Organisasi</a>
              <a href="#akreditasi" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">Akreditasi</a>
              <a href="#fasilitas" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">Fasilitas</a>
            </div>
          </div>

          {/* Dropdown Program */}
          <div 
            className="relative group py-2 flex flex-col items-center"
            onMouseEnter={() => setActiveDropdown('program')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              Program ▾
            </button>

            {/* Indikator T Terbalik (┴) dengan Animasi Smooth Melebar dari Tengah */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-[2px] h-1.5 bg-red-600 transition-transform duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"></div>
              <div className="w-14 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-transform duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100"></div>
            </div>

            <div 
              className={`absolute top-full left-0 w-52 bg-white text-gray-800 rounded-xl shadow-2xl py-2 flex flex-col text-xs font-medium transition-all duration-200 ease-out origin-top mt-3 ${
                activeDropdown === 'program'
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <a href="#pplg" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">PPLG & Game Dev</a>
              <a href="#tjkt" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">TJKT & Network</a>
              <a href="#dkv" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">DKV & Animation</a>
            </div>
          </div>

          {/* Alumni */}
          <div className="relative group py-2 flex flex-col items-center">
            <a href="#alumni" className="hover:text-red-500 transition-colors">Alumni</a>
            {/* Indikator T Terbalik (┴) dengan Animasi Smooth Melebar dari Tengah */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-[2px] h-1.5 bg-red-600 transition-transform duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"></div>
              <div className="w-12 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-transform duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100"></div>
            </div>
          </div>

          {/* Kontak */}
          <div className="relative group py-2 flex flex-col items-center">
            <a href="#kontak" className="hover:text-red-500 transition-colors">Kontak</a>
            {/* Indikator T Terbalik (┴) dengan Animasi Smooth Melebar dari Tengah */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-[2px] h-1.5 bg-red-600 transition-transform duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"></div>
              <div className="w-12 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-transform duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100"></div>
            </div>
          </div>

          {/* Dropdown Perpustakaan Elektronik */}
          <div 
            className="relative group py-2 flex flex-col items-center"
            onMouseEnter={() => setActiveDropdown('perpus')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              Perpustakaan Elektronik ▾
            </button>

            {/* Indikator T Terbalik (┴) dengan Animasi Smooth Melebar dari Tengah */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="w-[2px] h-1.5 bg-red-600 transition-transform duration-300 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"></div>
              <div className="w-24 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-transform duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100"></div>
            </div>

            <div 
              className={`absolute top-full left-0 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 flex flex-col text-xs font-medium transition-all duration-200 ease-out origin-top mt-3 ${
                activeDropdown === 'perpus'
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <a href="#ebook" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">E-Book Erlangga</a>
              <a href="#slims" className="px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors">SLIMS Library</a>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}