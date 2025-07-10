import { FC } from 'react';
import { motion } from 'framer-motion';
import { Loader, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  currentCategoryName?: string;
  viewMode?: string;
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
  currentCategoryName,
  viewMode,
}) => {
  const handleSortChange = (value: string) => {
    const [sort, sortOrder] = value.split('-');
    setSortParams({ sort, sortOrder });
    fetchProducts(1);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            pagination.page === i
              ? 'text-terracotta-600 bg-terracotta-50 border-terracotta-300'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
        >
          {pagination.totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    );

    return pages;
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
            {pagination.total}{' '}
            {pagination.total === 1 ? 'product' : 'products'}
          </p>
          <div className="relative w-full sm:w-auto hidden md:block">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ArrowUpDown size={16} className="text-gray-400" />
            </div>
            <select
              className="w-full sm:w-auto appearance-none bg-cream-50 border border-cream-200 rounded-lg py-3 sm:py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-base sm:text-sm"
              value={`${sortParams.sort}-${sortParams.sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="createdAt-desc">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
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

            {/* Traditional Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8">
                <nav className="flex items-center space-x-1">
                  {renderPaginationControls()}
                </nav>
              </div>
            )}

            {/* Infinite Scroll Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader size={30} className="text-terracotta-500 animate-spin mb-2" />
                <p className="text-gray-600 text-sm">Loading more products...</p>
              </div>
            )}

            {/* End of Collection Message */}
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
