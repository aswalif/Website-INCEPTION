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
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Resmi SMK Telkom Medan + Border Radius (Melengkung) */}
        <a href="#hero" className="flex items-center gap-2 group">
          <img 
            src="/logo-telkom.png" 
            alt="SMK Telkom Medan" 
            className="h-10 sm:h-12 w-auto object-contain rounded-xl p-1 bg-white/10 border border-white/20 transition-transform group-hover:scale-105"
          />
        </a>

        {/* Navigation Menu Desktop (Tanpa Tombol SPMB) */}
        <div className="hidden lg:flex items-center gap-6 text-white text-sm font-semibold">
          <a href="#hero" className="hover:text-red-500 transition-colors">Beranda</a>

          {/* Dropdown Tentang */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('tentang')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors py-2">
              Tentang ▾
            </button>
            {activeDropdown === 'tentang' && (
              <div className="absolute top-full left-0 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 flex flex-col text-xs font-medium">
                <a href="#profil" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">Profil Sekolah</a>
                <a href="#visi-misi" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">Visi dan Misi</a>
                <a href="#struktur" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">Struktur Organisasi</a>
                <a href="#akreditasi" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">Akreditasi</a>
                <a href="#fasilitas" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">Fasilitas</a>
              </div>
            )}
          </div>

          {/* Dropdown Program */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('program')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors py-2">
              Program ▾
            </button>
            {activeDropdown === 'program' && (
              <div className="absolute top-full left-0 w-52 bg-white text-gray-800 rounded-xl shadow-2xl py-2 flex flex-col text-xs font-medium">
                <a href="#pplg" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">PPLG & Game Dev</a>
                <a href="#tjkt" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">TJKT & Network</a>
                <a href="#dkv" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">DKV & Animation</a>
              </div>
            )}
          </div>

          <a href="#alumni" className="hover:text-red-500 transition-colors">Alumni</a>
          <a href="#kontak" className="hover:text-red-500 transition-colors">Kontak</a>

          {/* Dropdown Perpustakaan Elektronik */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('perpus')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors py-2">
              Perpustakaan Elektronik ▾
            </button>
            {activeDropdown === 'perpus' && (
              <div className="absolute top-full left-0 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 flex flex-col text-xs font-medium">
                <a href="#ebook" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">E-Book Erlangga</a>
                <a href="#slims" className="px-4 py-2 hover:bg-red-50 hover:text-red-600">SLIMS Library</a>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}