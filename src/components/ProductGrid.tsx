import { FC } from 'react';
import { motion } from 'framer-motion';
import { Loader, Filter, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductGridSkeletonLoader from './ProductGridSkeletonLoader';

interface ProductGridProps {
  products: any[];
  lastProductRef: (node: HTMLDivElement | null) => void;
  loading: boolean;
  pagination: { total: number; page: number; totalPages: number };
  clearFilters: () => void;
  sortParams: { sort: string; sortOrder: string };
  setSortParams: (sort: { sort: string; sortOrder: string }) => void;
  fetchProducts: (page?: number) => void;
  buildSearchParams: (page?: number) => any;
  categoryId?: string;
}

const ProductGrid: FC<ProductGridProps> = ({
  products,
  lastProductRef,
  loading,
  pagination,
  clearFilters,
  sortParams,
  setSortParams,
  fetchProducts,
  buildSearchParams,
  categoryId,
}) => {
  const handleSortChange = (value: string) => {
    const [sort, sortOrder] = value.split('-');
    setSortParams({ sort, sortOrder });
    fetchProducts(1);
  };

  if(loading)
    return <ProductGridSkeletonLoader/>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex-1"
    >
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600 text-base sm:text-sm">
            Showing{' '}
            <span className="font-semibold text-gray-800">{products?.length}</span> of{' '}
            {pagination.totalItems}{' '}
            {pagination.totalItems === 1 ? 'product' : 'products'}
          </p>
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ArrowUpDown size={16} className="text-gray-400" />
            </div>
            <select
              className="w-full sm:w-auto appearance-none bg-cream-50 border border-cream-200 rounded-lg py-3 sm:py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-base sm:text-sm"
              value={`${sortParams.sort}-${sortParams.sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="createdAt-desc">Sort by: Featured</option>
              <option value="basePrice-asc">Price: Low to High</option>
              <option value="basePrice-desc">Price: High to Low</option>
              <option value="createdAt-desc">Newest First</option>
            </select>
          </div>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  ref={idx === products.length - 1 ? lastProductRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.5) }}
                  whileHover={{ y: -5 }}
                  className="h-full p-1 sm:p-0"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader size={30} className="text-terracotta-500 animate-spin mb-2" />
                <p className="text-gray-600 text-sm">Loading more products...</p>
              </div>
            )}

            {!loading && pagination.page >= pagination.totalPages && products.length > 0 && (
              <div className="text-center py-10 text-gray-500 border-t border-cream-100 mt-8">
                <p>You've reached the end of the collection</p>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-cream-50 rounded-lg"
          >
            <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your filters or browse all products in our collection
            </p>
            <button
              onClick={clearFilters}
              className="inline-block px-8 py-3 bg-terracotta-600 text-white rounded-lg shadow-md hover:bg-terracotta-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductGrid;
