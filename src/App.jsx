import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
const Profil = lazy(() => import("./components/Profil"));
import VisiMisi from "./components/VisiMisi";
import StrukturOrganisasi from "./components/StrukturOrganisasi";
import AkreditasiSection from "./components/AkreditasiSection";
const Fasilitas = lazy(() => import("./components/Fasilitas"));
import Alumni from "./components/Alumni";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

// Import Halaman Prestasi & Hubin/Kemitraan
const PrestasiPage = lazy(() => import("./components/PrestasiPage"));
const PrestasiDetail = lazy(() => import("./components/PrestasiDetail"));
const HubinPage = lazy(() => import("./components/HubinPage"));
const HubinDetail = lazy(() => import("./components/HubinDetail"));

// Import Halaman Cisco Networking Academy
// Ubah path dari ./pages/ ke ./components/
const CiscoAcademyPage = lazy(() => import("./components/CiscoAcademyPage"));

// Import Scroll Helper
import ScrollToHashElement from "./components/ScrollToHashElement";

const Jurusan = lazy(() => import("./components/Jurusan"));

// 1. Kumpulkan Komponen Landing Page Utama ke Komponen Home
const Home = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <Profil />
      </Suspense>
      <VisiMisi />
      <Suspense fallback={null}>
        <Jurusan />
      </Suspense>
      <StrukturOrganisasi />
      <AkreditasiSection />
      <Suspense fallback={null}>
        <Fasilitas />
      </Suspense>
      <Alumni />
    </>
  );
};

// 2. Ekspor App Utama
export default function App() {
  return (
    <Router>
      <ScrollToHashElement />
      <div className="min-h-screen bg-white text-slate-800 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}