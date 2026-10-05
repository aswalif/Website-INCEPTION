import { useEffect } from "react";
import { Link } from "react-router-dom";
import StrukturOrganisasi from "./StrukturOrganisasi";

export default function StrukturOrganisasiPage() {
  // Otomatis scroll ke paling atas saat halaman dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 bg-[#F8F8F6] min-h-screen">
      {/* Breadcrumb / Tombol Kembali */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8 lg:px-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 transition-all hover:border-red-600 hover:text-red-600 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Komponen Utama Struktur Organisasi */}
      <StrukturOrganisasi />
    </div>
  );
}