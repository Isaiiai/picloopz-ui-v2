import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const Layout = () => {
  // Show chat button after a delay
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
      
      {/* Chat Support Button */}
      <button 
        id="chat-button"
        className="fixed bottom-6 right-6 bg-terracotta-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 hover:bg-terracotta-600 z-50"
        aria-label="Chat Support"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default Layout;
