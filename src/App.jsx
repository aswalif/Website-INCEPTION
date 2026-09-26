import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profil from './components/Profil';
import Jurusan from './components/Jurusan';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import VisiMisi from './components/VisiMisi';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col justify-between">
      <div>
        {/* Bagian Utama */}
        <Navbar />
        <Hero />
        <Profil />
        <VisiMisi /> 
        <Jurusan />
        <Chatbot />
      </div>
      <Footer />
    </div>
  );
}

export default App;