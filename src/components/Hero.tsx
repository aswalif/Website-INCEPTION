export default function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-b from-red-50 to-white py-20 px-6 text-center border-b border-gray-100">
      <div className="max-w-3xl mx-auto">
        <span className="bg-red-100 text-[#b91c1c] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          The Real Informatics School
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4 mb-6 leading-tight">
          SMK Telkom 1 Medan
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
          Wadah pendidikan kejuruan berbasis TIK unggulan. Menyiapkan generasi digital yang berkarakter, inovatif, dan siap bersaing secara global.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#jurusan" className="bg-[#b91c1c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition shadow-md">
            Lihat Jurusan
          </a>
          <a href="#profil" className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Tentang Kami
          </a>
        </div>
      </div>
    </section>
  );
}