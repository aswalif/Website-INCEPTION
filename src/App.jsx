import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Profil from "./components/Profil";
import Jurusan from "./components/Jurusan";
import VisiMisi from "./components/VisiMisi";
import StrukturOrganisasi from "./components/StrukturOrganisasi";
import AkreditasiSection from "./components/AkreditasiSection";
import Fasilitas from "./components/Fasilitas";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

// Import Halaman Prestasi & Hubin/Kemitraan
import PrestasiPage from "./components/PrestasiPage";
import PrestasiDetail from "./components/PrestasiDetail";
import HubinPage from "./components/HubinPage";
import HubinDetail from "./components/HubinDetail";

// Import Scroll Helper
import ScrollToHashElement from "./components/ScrollToHashElement";

// 1. Kumpulkan Komponen Landing Page Utama ke Komponen Home
const Home = () => {
  return (
    <>
      <Hero />
      <Profil />
      <VisiMisi />
      <Jurusan />
      <StrukturOrganisasi />
      <AkreditasiSection />
      <Fasilitas />
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
          <Route path="/prestasi" element={<PrestasiPage />} />
          <Route path="/prestasi/:id" element={<PrestasiDetail />} />
          <Route path="/kemitraan" element={<HubinPage />} />
          <Route path="/kemitraan/:id" element={<HubinDetail />} />
        </Routes>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}