export default function Navbar() {
  return (
    <nav className="bg-[#b91c1c] text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <span className="font-bold text-xl tracking-wide">SMK Telkom</span>
      
      <ul className="flex gap-6 text-sm font-medium items-center">
        <li><a href="#hero" className="hover:text-red-200 transition">Beranda</a></li>
        <li><a href="#profil" className="hover:text-red-200 transition">Profil</a></li>
        <li><a href="#jurusan" className="hover:text-red-200 transition">Jurusan</a></li>
      </ul>
    </nav>
  );
}