import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
  MapPin,
  Shield,
  Info,
  Headset,
  User2,
  LayoutGrid
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const shopAddress = `Picloopz Color Lab and Customized Gifts, SML Complex, Ground Floor, Income Tax Office Opposite, Arunachalam Chettyar Street, Karaikudi - 630001`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Picloopz+Color+Lab+and+Customized+Gifts,+SML+complex+ground+floor,+Income+tax+office+opposite,+arunachalam+chettyar+Street,+Karaikudi+630001`;

  return (
    <footer className="bg-gray-50 pt-10 pb-6 border-t border-gray-200 text-sm text-gray-700">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-6 mb-6 items-start">


          {/* Brand */}
          <div className="space-y-2">
            <h3 className="text-xl font-playfair font-semibold text-terracotta-700">Picloopz</h3>
            <p className="text-gray-600">
              <span className="font-semibold text-terracotta-700">Crafting Memories, One Gift at a Time.</span><br />
              Personalized gifts for every occasion.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://www.instagram.com/pic_loopz" target="_blank" className="text-gray-500 hover:text-terracotta-600" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="https://www.facebook.com/share/1CA7A3aeFo/" target="_blank" className="text-gray-500 hover:text-terracotta-600" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="https://twitter.com" target="_blank" className="text-gray-500 hover:text-terracotta-600" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="https://youtube.com/@picloopz" target="_blank" className="text-gray-500 hover:text-terracotta-600" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <MapPin size={16} className="text-terracotta-600" /> Location
            </h3>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terracotta-600"
            >
              {shopAddress}
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <LayoutGrid size={16} className="text-terracotta-600" /> Quick Links
            </h3>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-terracotta-600">Home</Link></li>
              <li><Link to="/category/all" className="hover:text-terracotta-600">Shop</Link></li>
              <li><Link to="/gallery" className="hover:text-terracotta-600">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-terracotta-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta-600">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <Shield size={16} className="text-terracotta-600" /> Legal
            </h3>
            <ul className="space-y-1">
              <li><Link to="/terms" className="hover:text-terracotta-600">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-terracotta-600">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <Headset size={16} className="text-terracotta-600" /> Support
            </h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-2"><Mail size={16} className="text-terracotta-600" /> picloopz@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-terracotta-600" /> +91 63696 31356</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <User2 size={16} className="text-terracotta-600" /> Customer Service
            </h3>
            <ul className="space-y-1">
              <li><Link to="/contact" className="hover:text-terracotta-600">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-terracotta-600">FAQs</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center text-gray-500">
          &copy; {currentYear} Picloopz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
