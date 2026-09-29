import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHashElement() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const elementId = hash.replace("#", "");

      const performScroll = () => {
        const element = document.getElementById(elementId);
        if (element) {
          // Hitung posisi elemen secara presisi dikurangi offset Navbar (80px)
          const yOffset = -80;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
          return true;
        }
        return false;
      };

      // 1. Eksekusi awal saat komponen dirender
      performScroll();

      // 2. Eksekusi berulang dalam interval pendek untuk mengantisipasi render GSAP
      const timer1 = setTimeout(performScroll, 300);
      const timer2 = setTimeout(performScroll, 700);

      // 3. Eksekusi akhir setelah seluruh gambar & font halaman selesai di-load sempurna
      const handleFullyLoaded = () => {
        performScroll();
      };

      window.addEventListener("load", handleFullyLoaded);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener("load", handleFullyLoaded);
      };
    } else {
      // Jika kembali ke Beranda tanpa hash, reset scroll ke paling atas
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
}