import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbBannerProps {
  currentCategory: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

const BreadcrumbBanner: FC<BreadcrumbBannerProps> = ({ currentCategory }) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-terracotta-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700 font-medium">{currentCategory?.name}</span>
      </div>

      {/* Category Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-56 md:h-72 rounded-2xl overflow-hidden mb-10 shadow-lg"
      >
        <img
          src={
            currentCategory?.imageUrl ||
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1920&auto=format&fit=crop'
          }
          alt={currentCategory?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
          <div className="px-8 md:px-12">
            <span className="inline-block px-3 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full mb-3">
              Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-playfair mb-2">
              {currentCategory?.name}
            </h1>
            <p className="text-white/90 max-w-md">
              Discover our handcrafted collection designed to transform your moments into memories
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BreadcrumbBanner;
