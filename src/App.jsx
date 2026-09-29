import StrukturOrganisasi from "./components/StrukturOrganisasi";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Profil from "./components/Profil";
import Jurusan from "./components/Jurusan";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import VisiMisi from "./components/VisiMisi";
import Fasilitas from "./components/Fasilitas";
import AkreditasiSection from "./components/AkreditasiSection";
import Alumni from "./components/Alumni";

// Kita bungkus komponen-komponen halaman utama ke dalam satu variabel Home
const Home = () => {
  return (
    <>
      <Hero />
      <Profil />
      <VisiMisi />
      <StrukturOrganisasi />
      <Jurusan />
      <AkreditasiSection />
      <Fasilitas />
      <Chatbot />
      <Alumni />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col justify-between">
        <div>
          {/* Navbar selalu tampil di atas untuk semua halaman */}
          <Navbar />

          {/* Routes mengatur komponen mana yang tampil berdasarkan URL */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fasilitas" element={<Fasilitas />} />
          </Routes>
        </div>

        {/* Footer selalu tampil di bawah untuk semua halaman */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
