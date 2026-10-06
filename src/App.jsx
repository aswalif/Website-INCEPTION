import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VisiMisi from "./components/VisiMisi";
import AkreditasiSection from "./components/AkreditasiSection";
import Alumni from "./components/Alumni";
const Chatbot = lazy(() => import("./components/Chatbot"));
import Footer from "./components/Footer";

// Import Scroll Helper
import ScrollToHashElement from "./components/ScrollToHashElement";

// Lazy Loading Komponen Landing Page
import Profil from "./components/Profil";
const Jurusan = lazy(() => import("./components/Jurusan"));
const Fasilitas = lazy(() => import("./components/Fasilitas"));
const GaleriSection = lazy(() => import("./components/GaleriSection")); // <-- TAMBAHKAN INI

// Lazy Loading Halaman Multi-Page
const PrestasiPage = lazy(() => import("./components/PrestasiPage"));
const PrestasiDetail = lazy(() => import("./components/PrestasiDetail"));
const HubinPage = lazy(() => import("./components/HubinPage"));
const HubinDetail = lazy(() => import("./components/HubinDetail"));
const CiscoAcademyPage = lazy(() => import("./components/CiscoAcademyPage"));
const MikrotikAcademyPage = lazy(
  () => import("./components/MikrotikAcademyPage"),
);
const ProfilGuruPage = lazy(() => import("./components/ProfilGuruPage"));
const StrukturOrganisasiPage = lazy(
  () => import("./components/StrukturOrganisasiPage"),
);
const GaleriDetail = lazy(() => import("./components/GaleriDetail"));

// Komponen Landing Page Utama (Tampilkan GaleriSection di sini)
const Home = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <Profil />
      </Suspense>
      <AkreditasiSection />
      <VisiMisi />
      <Suspense fallback={null}>
        <Jurusan />
      </Suspense>
      <Suspense fallback={null}>
        <Fasilitas />
      </Suspense>
      {/* SEKSI PREVIEW GALERI DI LANDING PAGE UTAMA */}
      <Suspense fallback={null}>
        <GaleriSection />
      </Suspense>
      <Alumni />
    </>
  );
};

// Ekspor App Utama
export default function App() {
  return (
    <Router>
      <ScrollToHashElement />
      <div className="min-h-screen bg-white text-slate-800 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/galeri"
            element={
              <Suspense
                fallback={<div className="min-h-screen bg-[#F8F8F6]" />}
              ></Suspense>
            }
          />
          <Route
            path="/galeri/:slug"
            element={
              <Suspense
                fallback={<div className="min-h-screen bg-[#F8F8F6]" />}
              >
                <GaleriDetail />
              </Suspense>
            }
          />
          <Route
            path="/struktur-organisasi"
            element={
              <Suspense
                fallback={<div className="min-h-screen bg-[#F8F8F6]" />}
              >
                <StrukturOrganisasiPage />
              </Suspense>
            }
          />
          <Route
            path="/prestasi"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <PrestasiPage />
              </Suspense>
            }
          />
          <Route
            path="/prestasi/:id"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <PrestasiDetail />
              </Suspense>
            }
          />
          <Route
            path="/kemitraan"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <HubinPage />
              </Suspense>
            }
          />
          <Route
            path="/kemitraan/:id"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <HubinDetail />
              </Suspense>
            }
          />
          <Route
            path="/cisco-academy"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <CiscoAcademyPage />
              </Suspense>
            }
          />
          <Route
            path="/mikrotik-academy"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <MikrotikAcademyPage />
              </Suspense>
            }
          />
          <Route
            path="/profil-guru"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <ProfilGuruPage />
              </Suspense>
            }
          />
        </Routes>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}
