import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  // Logic Animasi Typing Placeholder
  const [placeholder, setPlaceholder] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const texts = [
      'Cari RPL...',
      'Cari TJKT...',
      'Cari DKV...',
      'Cari profil sekolah...',
      'Cari informasi LMS...'
    ];

    const currentFullText = texts[textIndex];

    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentFullText.length) {
        setPlaceholder(currentFullText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder(currentFullText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else if (!isDeleting && charIndex === currentFullText.length) {
        setTimeout(() => setIsDeleting(true), 1500); // Tahan sebentar setelah selesai ngetik
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex]);

  // Deteksi scroll untuk efek glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchItems = [
    { title: 'Pengembangan Perangkat Lunak & Gim (PPLG)', link: '#jurusan' },
    { title: 'Teknik Jaringan Komputer & Telekomunikasi (TJKT)', link: '#jurusan' },
    { title: 'Desain Komunikasi Visual (DKV)', link: '#jurusan' },
    { title: 'Profil & Sejarah Sekolah', link: '#profil' },
    { title: 'Visi & Misi SMK Telkom', link: '#profil' },
  ];

  const filteredItems = searchQuery.trim() === '' 
    ? [] 
    : searchItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#b91c1c]/90 backdrop-blur-md shadow-2xl py-2.5' 
        : 'bg-[#b91c1c] py-3.5 shadow-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Brand & Logo Badge */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-white text-[#b91c1c] rounded-lg font-black flex items-center justify-center text-base shadow-md border-2 border-red-200 group-hover:scale-105 group-hover:rotate-3 transition-transform">
            ST
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-wider leading-none text-white group-hover:text-red-100 transition-colors">SMK TELKOM</span>
            <span className="text-[10px] text-red-200 tracking-widest font-medium uppercase mt-0.5">Medan Portal</span>
          </div>
        </a>

        {/* Live Search Bar Interaktif dengan Animated Placeholder */}
        <div className="hidden md:block relative group">
          <div className="flex items-center bg-red-800/60 border border-red-500/40 rounded-full px-3.5 py-1.5 w-64 focus-within:w-80 focus-within:bg-white focus-within:text-gray-800 transition-all duration-300 shadow-inner">
            <span className="text-red-200 group-focus-within:text-gray-500 mr-2 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none placeholder-red-200 group-focus-within:placeholder-gray-400 font-medium text-white group-focus-within:text-gray-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="text-xs text-red-200 group-focus-within:text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Result Dropdown */}
          {filteredItems.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Hasil Pencarian
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {filteredItems.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.link} 
                      onClick={() => setSearchQuery('')}
                      className="block px-4 py-2.5 text-xs font-semibold hover:bg-red-50 hover:text-[#b91c1c] transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Menu Navigasi Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <ul className="flex gap-1 text-xs font-bold items-center bg-red-900/40 p-1 rounded-full border border-red-700/50">
            <li>
              <a 
                href="#hero" 
                onClick={() => setActiveTab('hero')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 inline-block ${
                  activeTab === 'hero' 
                    ? 'bg-white text-[#b91c1c] shadow-md' 
                    : 'text-white hover:text-red-100'
                }`}
              >
                Beranda
              </a>
            </li>
            <li>
              <a 
                href="#profil" 
                onClick={() => setActiveTab('profil')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 inline-block ${
                  activeTab === 'profil' 
                    ? 'bg-white text-[#b91c1c] shadow-md' 
                    : 'text-white hover:text-red-100'
                }`}
              >
                Profil
              </a>
            </li>
            <li>
              <a 
                href="#jurusan" 
                onClick={() => setActiveTab('jurusan')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 inline-block ${
                  activeTab === 'jurusan' 
                    ? 'bg-white text-[#b91c1c] shadow-md' 
                    : 'text-white hover:text-red-100'
                }`}
              >
                Jurusan
              </a>
            </li>
          </ul>

          {/* Interactive Badge Indicator */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 bg-red-900/60 border border-red-700/50 px-3 py-1.5 rounded-full text-[11px] font-semibold text-red-100 cursor-pointer hover:bg-red-900/90 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Portal Aktif
            </div>
            
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-48 bg-slate-900 text-white text-[11px] p-3 rounded-xl shadow-2xl border border-slate-800 z-50">
              <p className="font-bold text-emerald-400 mb-1">● Server LMS Online</p>
              <p className="text-slate-400">Sistem portal SMK Telkom Medan berjalan optimal.</p>
            </div>
          </div>
        </div>

        {/* Hamburger Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-red-800/80 border border-red-600/50 focus:outline-none"
        >
          <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`h-0.5 w-5 bg-white rounded-full my-1 transition-all duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Floating Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 mx-4 p-4 bg-red-950/95 backdrop-blur-xl border border-red-700/60 rounded-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center bg-red-900/60 border border-red-700/50 rounded-xl px-3 py-2">
            <span className="text-red-300 mr-2 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none text-white placeholder-red-300/70"
            />
          </div>

          <ul className="flex flex-col gap-1 text-sm font-semibold">
            <li>
              <a 
                href="#hero" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white hover:text-[#b91c1c] transition-all"
              >
                <span>🏠</span> Beranda
              </a>
            </li>
            <li>
              <a 
                href="#profil" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 text-red-100 transition-all"
              >
                <span>🏫</span> Profil
              </a>
            </li>
            <li>
              <a 
                href="#jurusan" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 text-red-100 transition-all"
              >
                <span>💻</span> Jurusan
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}