import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // ✅ Added

const Layout = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.classList.remove('opacity-0');
        chatButton.classList.add('opacity-100');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* ✅ WhatsApp Chat Button */}
      <a
        id="chat-button"
        href="https://wa.me/918438970203" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 hover:bg-green-600 z-50"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  );
};

export default Layout;
