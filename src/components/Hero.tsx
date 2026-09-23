import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Pendaftaran
    {
      type: 'pendaftaran',
      image: '/hero-bg.jpg',
      title: 'Daftar Sekarang!!',
      subtitle: 'jadilah bagian dari',
      highlight: 'Generasi Masa Depan!',
      badge: 'SEKOLAH INFORMATIKA NYATA & Pusat Keunggulan 🏅',
      buttonText: 'Bergabunglah dengan Kami',
      link: 'https://ppdb.smktelkom1medan.sch.id',
    },
    // Slide 2: Selamat Datang
    {
      type: 'welcome',
      image: '/gedung-baru.jpg',
      welcomeText: 'Selamat Datang di',
      title: 'Website SMK Telkom Medan',
      badge: 'SMK Pusat Keunggulan 🏅 Sekolah berbasis IT ter-baik di Sumatera Utara dengan Akreditasi "A"',
      buttonText: 'Mulai',
      link: '#profil',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section id="hero" className="relative w-screen h-screen min-h-screen overflow-hidden select-none bg-black">
      
      {/* Carousel Gambar Background dengan Animasi Pergerakan (Zoom & Scale Effect) */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt={`Slide ${index + 1}`} 
            className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
              index === currentSlide ? 'scale-110 translate-y-2' : 'scale-100 translate-y-0'
            }`}
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      {/* Slide 1: Tampilan Pendaftaran */}
      {slides[currentSlide].type === 'pendaftaran' && (
        <div className="relative z-20 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center items-end text-right pt-16">
          <div className="max-w-2xl text-white space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              {slides[currentSlide].title} <br />
              <span className="text-gray-200 font-semibold text-2xl sm:text-4xl">
                {slides[currentSlide].subtitle}
              </span> <br />
              <span className="text-red-500 font-black text-3xl sm:text-6xl drop-shadow-md">
                {slides[currentSlide].highlight}
              </span>
            </h1>

            <p className="text-sm sm:text-base font-bold text-gray-200 pt-2">
              {slides[currentSlide].badge}
            </p>

            <div className="pt-3 flex justify-end">
              <a 
                href={slides[currentSlide].link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#b91c1c] hover:bg-red-700 text-white font-bold text-sm px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105"
              >
                {slides[currentSlide].buttonText}
              </a>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 text-white">
              <span className="text-xs font-bold">Ikuti kami:</span>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#b91c1c] flex items-center justify-center text-xs transition-all">f</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#b91c1c] flex items-center justify-center text-xs transition-all">📷</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#white/20] hover:bg-[#b91c1c] flex items-center justify-center text-xs transition-all">🎵</a>
            </div>
          </div>
        </div>
      )}

      {/* Slide 2: Tampilan Ucapan Selamat Datang */}
      {slides[currentSlide].type === 'welcome' && (
        <div className="relative z-20 max-w-4xl mx-auto h-full px-6 flex flex-col justify-center items-center text-center pt-16">
          <div className="text-white space-y-4">
            <span className="bg-red-600 text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
              {slides[currentSlide].welcomeText}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight drop-shadow-lg">
              {slides[currentSlide].title}
            </h1>

            <p className="text-sm sm:text-base font-medium text-gray-200 max-w-2xl mx-auto">
              {slides[currentSlide].badge}
            </p>

            <div className="pt-4">
              <a 
                href={slides[currentSlide].link} 
                className="inline-block bg-[#b91c1c] hover:bg-red-700 text-white font-bold text-sm px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105"
              >
                {slides[currentSlide].buttonText}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Navigasi Panah (Bawah Kiri) */}
      <div className="absolute bottom-10 left-10 z-30 flex items-center gap-3">
        <button 
          onClick={prevSlide} 
          className="w-12 h-12 rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-bold shadow-lg hover:bg-red-700 transition-all active:scale-95 cursor-pointer"
        >
          ←
        </button>
        <button 
          onClick={nextSlide} 
          className="w-12 h-12 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 flex items-center justify-center font-bold shadow-lg hover:bg-white/40 transition-all active:scale-95 cursor-pointer"
        >
          →
        </button>
      </div>

    </section>
  );
}