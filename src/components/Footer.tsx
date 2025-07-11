import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube, MapPin, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const shopAddress = `Picloopz Color Lab and Customized Gifts, SML Complex, Ground Floor, Income Tax Office Opposite, Arunachalam Chettyar Street, Karaikudi - 630001`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Picloopz+Color+Lab+and+Customized+Gifts,+SML+complex+ground+floor,+Income+tax+office+opposite,+arunachalam+chettyar+Street,+Karaikudi+630001`;

  return (
    <footer className="bg-gray-50 pt-12 pb-6 border-t border-terracotta-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-8 mb-8">
          {/* Company Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-playfair font-semibold text-terracotta-700">Picloopz</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed sm:leading-normal max-w-xs">
              <span className="font-semibold text-terracotta-700">Crafting Memories, One Gift at a Time.</span><br />
              We turn your photos and stories into beautiful, personalized gifts for every occasion. Celebrate life's special moments with a gift that speaks from the heart.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/pic_loopz?igsh=MXQyZTJjN2VvMmI4dw%3D%3D" className="text-gray-500 hover:text-terracotta-600 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/share/1CA7A3aeFo/" className="text-gray-500 hover:text-terracotta-600 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-500 hover:text-terracotta-600 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com/@picloopz?si=LI3M4Pw_FiQZo7PD" className="text-gray-500 hover:text-terracotta-600 transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop Location */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin size={18} className="text-terracotta-600" /> Shop Location
            </h3>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="not-italic text-gray-700 text-sm leading-relaxed hover:text-terracotta-600 transition-colors block font-medium rounded-lg px-2 py-1 hover:bg-terracotta-50 hover:border hover:border-terracotta-200 focus:outline-none focus:ring-2 focus:ring-terracotta-200"
              title="View on Google Maps"
            >
              {shopAddress}
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-terracotta-600 transition-colors">Home</Link></li>
              <li><Link to="/category/all" className="text-gray-600 hover:text-terracotta-600 transition-colors">Shop</Link></li>
              <li><Link to="/gallery" className="text-gray-600 hover:text-terracotta-600 transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-terracotta-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-terracotta-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Shield size={18} className="text-terracotta-600" /> Legal
            </h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-terracotta-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-terracotta-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Support</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 text-terracotta-600 mt-1" />
                <span className="text-gray-700">picloopz@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 text-terracotta-600 mt-1" />
                <span className="text-gray-700">+91 63696 31356</span>
              </li>
            </ul>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-600 hover:text-terracotta-600 transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-terracotta-600 transition-colors">FAQs</Link></li>
              </ul>
            </div>
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
