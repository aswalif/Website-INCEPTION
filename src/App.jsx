import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profil from './components/Profil';
import Jurusan from './components/Jurusan';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col justify-between">
      <div>
        {/* Bagian Utama */}
        <Navbar />
        <Hero />
        <Profil />
        <Jurusan />
      </div>

      {/* Chatbot & Penutup */}
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;