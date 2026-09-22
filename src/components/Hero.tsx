import { useState, useEffect } from 'react';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Event listener untuk pergerakan mouse
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Nilai offset posisi dari tengah (-1 sampai 1)
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    // Event listener untuk scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="relative bg-white text-gray-900 pt-36 pb-24 px-6 overflow-hidden min-h-screen flex items-center justify-center border-b border-gray-100 select-none"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

      {/* Red Glow Light - Ikut Gerakan Mouse */}
      <div 
        className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-red-200/50 blur-[130px] rounded-full pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * 40}px), calc(-50% + ${mousePos.y * 40}px))`,
        }}
      ></div>

      {/* Floating Card Left (PPLG) - Mengikuti Mouse & Scroll */}
      <div 
        className="hidden lg:flex absolute left-8 xl:left-12 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-none transition-transform duration-500 ease-out z-20"
        style={{
          transform: `translate(${mousePos.x * -25}px, calc(-50% + ${mousePos.y * -25 - scrollY * 0.15}px))`,
        }}
      >
        <div className="bg-white/90 border border-gray-200/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center gap-3">
          <span className="p-2.5 bg-red-50 text-[#b91c1c] rounded-xl font-mono text-xs font-bold">{"</>"}</span>
          <div>
            <p className="text-xs font-bold text-gray-800">PPLG & Game</p>
            <p className="text-[10px] text-gray-500 font-medium">Software & Web Dev</p>
          </div>
        </div>
      </div>

      {/* Floating Card Right (DKV & TJKT) - Mengikuti Mouse & Scroll */}
      <div 
        className="hidden lg:flex absolute right-8 xl:right-12 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-none transition-transform duration-500 ease-out z-20"
        style={{
          transform: `translate(${mousePos.x * 30}px, calc(-50% + ${mousePos.y * 30 - scrollY * 0.1}px))`,
        }}
      >
        <div className="bg-white/90 border border-gray-200/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center gap-3">
          <span className="p-2.5 bg-red-50 text-[#b91c1c] rounded-xl text-xs">🎨</span>
          <div>
            <p className="text-xs font-bold text-gray-800">DKV & Multimedia</p>
            <p className="text-[10px] text-gray-500 font-medium">3D & Creative Design</p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Animasi Parallax Scroll */}
      <div 
        className="max-w-4xl mx-auto text-center relative z-10 transition-transform duration-100 ease-out my-auto pt-12"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          opacity: Math.max(0, 1 - scrollY / 600),
        }}
      >
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6 text-gray-900">
          Masa Depan Digital <br />
          <span className="bg-gradient-to-r from-[#b91c1c] via-red-600 to-rose-500 bg-clip-text text-transparent">
            Dimulai Dari Sini
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Mencetak talenta muda unggulan di bidang software development, jaringan telekomunikasi, dan desain kreatif berpola pikir global.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a 
            href="#jurusan" 
            className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-[#b91c1c] hover:bg-red-800 transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Jelajahi Jurusan
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          <a 
            href="#profil" 
            className="px-8 py-3.5 rounded-xl font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-all hover:border-gray-300 shadow-sm"
          >
            Profil Sekolah
          </a>
        </div>

        {/* Clean Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-black text-[#b91c1c]">3</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Konsentrasi Keahlian</p>
          </div>
          <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-black text-[#b91c1c]">100%</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Kurikulum Industri TIK</p>
          </div>
          <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-black text-[#b91c1c]">A</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Akreditasi Unggul</p>
          </div>
        </div>

      </div>
    </section>
  );
}