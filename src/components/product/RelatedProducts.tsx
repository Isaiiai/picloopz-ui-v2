import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  rating: number;
  categoryId: string;
  isTrending: boolean;
  variants: {
    imageUrl: string;
    price: number;
  }[];
}

interface RelatedProductsProps {
  relatedProducts: Product[];
  categoryId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProducts, categoryId }) => {
  if (!relatedProducts.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-12"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold font-playfair">You May Also Like</h2>
        <Link
          to={`/category/${categoryId}`}
          className="text-terracotta-600 hover:text-terracotta-700 flex items-center transition-colors group"
        >
          View All
          <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {relatedProducts.map((related, idx) => (
          <motion.div
            key={related.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <Link to={`/product/${related.id}`} className="block">
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={related.variants[0].imageUrl}
                  alt={related.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {related.isTrending && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full">
                    Trending
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-terracotta-600 transition-colors mb-2">
                  {related.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-terracotta-600 font-bold text-lg">
                    ₹{(related.variants[0].price).toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    <Star size={14} className="text-amber-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{related.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default RelatedProducts;

