import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VisiMisi from "./components/VisiMisi";
import StrukturOrganisasi from "./components/StrukturOrganisasi";
import AkreditasiSection from "./components/AkreditasiSection";
import Alumni from "./components/Alumni";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

// Import Scroll Helper
import ScrollToHashElement from "./components/ScrollToHashElement";

// Lazy Loading Komponen Landing Page
const Profil = lazy(() => import("./components/Profil"));
const Jurusan = lazy(() => import("./components/Jurusan"));
const Fasilitas = lazy(() => import("./components/Fasilitas"));

// Lazy Loading Halaman Multi-Page
const PrestasiPage = lazy(() => import("./components/PrestasiPage"));
const PrestasiDetail = lazy(() => import("./components/PrestasiDetail"));
const HubinPage = lazy(() => import("./components/HubinPage"));
const HubinDetail = lazy(() => import("./components/HubinDetail"));
const CiscoAcademyPage = lazy(() => import("./components/CiscoAcademyPage"));
const MikrotikAcademyPage = lazy(() => import("./components/MikrotikAcademyPage"));
const ProfilGuruPage = lazy(() => import("./components/ProfilGuruPage"));

// Komponen Landing Page Utama
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
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}