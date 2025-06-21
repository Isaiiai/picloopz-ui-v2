import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-playfair font-semibold text-terracotta-700 mb-4">Picloopz</h3>
            <p className="text-gray-600 mb-4">
              Handcrafted art and decor that tells your story through beautiful personalized pieces.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-500 hover:text-peach-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-gray-500 hover:text-peach-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-500 hover:text-peach-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" className="text-gray-500 hover:text-peach-500 transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-peach-500 transition-colors">Home</Link></li>
              <li><Link to="/category/all" className="text-gray-600 hover:text-peach-500 transition-colors">Shop</Link></li>
              <li><Link to="/gallery" className="text-gray-600 hover:text-peach-500 transition-colors">Gallery</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-peach-500 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-purple-600 transition-colors">FAQs</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-purple-600 transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-purple-600 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 text-peach-500 mt-1" />
                <span className="text-gray-600">support@picloopz.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 text-peach-500 mt-1" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Picloopz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
