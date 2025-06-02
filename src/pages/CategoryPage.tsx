import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, X, ChevronDown, ArrowUpDown, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { mockCategories, mockProducts } from '../data/mockData';

interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  category: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  trending: boolean;
  materials: string;
  dimensions: string;
  processingTime: string;
  shipping: string;
  variants: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }>;
}

interface FilterState {
  variants: string[];
  materials: string[];
  categories: string[];
}

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    variants: [],
    materials: [],
    categories: categoryId !== 'all' ? [categoryId || ''] : []
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const PRODUCTS_PER_PAGE = 8;
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);
  
  // Find the category
  const category = mockCategories.find(cat => cat.id === categoryId) || 
    { id: 'all', name: 'All Products', imageUrl: '' };
  
  // Filter products based on category and filters
  useEffect(() => {
    let filtered = [...mockProducts] as Product[];
    
    // Filter by selected categories
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.categories.includes(product.categoryId)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => {
      const lowestPrice = Math.min(...product.variants.map(v => v.price));
      return lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];
    });
    
    // Filter by selected variant types
    if (selectedFilters.variants.length > 0) {
      filtered = filtered.filter(product => 
        product.variants.some(variant => 
          selectedFilters.variants.includes(variant.name)
        )
      );
    }
    
    // Filter by materials
    if (selectedFilters.materials.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.materials.includes(product.materials)
      );
    }
    
    setFilteredProducts(filtered);
    setPage(1);
    setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
    setHasMore(filtered.length > PRODUCTS_PER_PAGE);
  }, [categoryId, priceRange, selectedFilters]);
  
  const loadMoreProducts = () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const newProducts = filteredProducts.slice(startIndex, endIndex);
      
      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(endIndex < filteredProducts.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };
  
  // Toggle a filter value
  const toggleFilter = (type: keyof FilterState, value: string) => {
    setSelectedFilters(prev => {
      const current = [...prev[type]];
      if (current.includes(value)) {
        return {
          ...prev,
          [type]: current.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [type]: [...current, value]
        };
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedFilters({
      variants: [],
      materials: [],
      categories: categoryId !== 'all' ? [categoryId || ''] : []
    });
  };
  
  // Get unique values for filter options
  const getUniqueVariantTypes = () => {
    const variants = new Set<string>();
    mockProducts.forEach(product => {
      product.variants.forEach(variant => {
        variants.add(variant.name);
      });
    });
    return Array.from(variants);
  };
  
  const getUniqueMaterials = () => {
    const materials = new Set<string>();
    mockProducts.forEach(product => {
      materials.add(product.materials);
    });
    return Array.from(materials);
  };

  // Toggle filter tab (for mobile accordion)
  const toggleFilterTab = (tab: string) => {
    if (activeFilterTab === tab) {
      setActiveFilterTab(null);
    } else {
      setActiveFilterTab(tab);
    }
  };

  return (
    <div className="bg-cream-50 min-h-screen">
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-terracotta-600 transition-colors">Home</Link>
        <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700 font-medium">{category.name}</span>
      </div>
      
      {/* Category Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-56 md:h-72 rounded-2xl overflow-hidden mb-10 shadow-lg"
        >
        <img 
          src={category.imageUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1920&auto=format&fit=crop'} 
          alt={category.name} 
          className="w-full h-full object-cover"
        />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
            <div className="px-8 md:px-12">
              <span className="inline-block px-3 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full mb-3">
                Collection
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-playfair mb-2">{category.name}</h1>
              <p className="text-white/90 max-w-md">Discover our handcrafted collection designed to transform your moments into memories</p>
            </div>
          </div>
        </motion.div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-72 flex-shrink-0"
          >
            <div className="bg-white border border-cream-200 rounded-xl p-6 shadow-md sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
              <button 
                onClick={clearFilters} 
                  className="text-sm text-terracotta-600 hover:text-terracotta-800 transition-colors"
              >
                Clear all
              </button>
            </div>
              
              {/* Categories Filter */}
              <div className="mb-6 border-b border-cream-200 pb-6">
                <h4 className="font-medium mb-3 text-gray-700">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {mockCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center">
                      <input 
                        type="checkbox"
                        id={`category-${cat.id}`}
                        checked={selectedFilters.categories.includes(cat.id)}
                        onChange={() => toggleFilter('categories', cat.id)}
                        className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                      />
                      <label htmlFor={`category-${cat.id}`} className="ml-2 text-sm text-gray-700">
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
            </div>
            
            {/* Price Range */}
              <div className="mb-6 border-b border-cream-200 pb-6">
                <h4 className="font-medium mb-3 text-gray-700">Price Range</h4>
                <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-terracotta-500"
                />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input 
                        type="number" 
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                        className="w-full p-2 border border-cream-200 rounded text-sm"
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="number" 
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], parseInt(e.target.value) || 0)])}
                        className="w-full p-2 border border-cream-200 rounded text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
              </div>
            </div>
            
            {/* Variant Filter */}
              <div className="mb-6 border-b border-cream-200 pb-6">
                <h4 className="font-medium mb-3 text-gray-700">Variants</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {getUniqueVariantTypes().map((variant, index) => (
                  <div key={index} className="flex items-center">
                    <input 
                      type="checkbox"
                      id={`variant-${index}`}
                      checked={selectedFilters.variants.includes(variant)}
                      onChange={() => toggleFilter('variants', variant)}
                        className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                    />
                    <label htmlFor={`variant-${index}`} className="ml-2 text-sm text-gray-700">
                      {variant}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Materials Filter */}
            <div className="mb-4">
                <h4 className="font-medium mb-3 text-gray-700">Materials</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {getUniqueMaterials().map((material, index) => (
                  <div key={index} className="flex items-center">
                    <input 
                      type="checkbox"
                      id={`material-${index}`}
                      checked={selectedFilters.materials.includes(material)}
                      onChange={() => toggleFilter('materials', material)}
                        className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                    />
                    <label htmlFor={`material-${index}`} className="ml-2 text-sm text-gray-700">
                      {material}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </motion.div>
        
        {/* Mobile Filter Button */}
          <div className="md:hidden mb-6">
          <button 
            onClick={() => setIsFilterOpen(true)}
              className="w-full py-3 px-4 bg-white rounded-xl flex items-center justify-center gap-2 text-gray-700 shadow-md"
          >
            <Filter size={18} />
            Filter Products
          </button>
        </div>
        
          {/* Mobile Filter Bottom Sheet */}
          <AnimatePresence>
        {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 md:hidden flex items-end"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsFilterOpen(false);
                }}
              >
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="w-full bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
                >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>
                  
                  <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
              
              <div className="mb-6">
                <button 
                  onClick={clearFilters} 
                      className="w-full py-2 border border-terracotta-200 text-terracotta-600 rounded-lg hover:bg-terracotta-50 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
              
                  {/* Mobile Accordion Filters */}
                  <div className="divide-y divide-cream-200">
                    {/* Categories Accordion */}
                    <div className="py-3">
                      <button 
                        className="flex justify-between items-center w-full py-2 text-left font-medium"
                        onClick={() => toggleFilterTab('categories')}
                      >
                        <span>Categories</span>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform ${activeFilterTab === 'categories' ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeFilterTab === 'categories' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pb-1 space-y-2">
                              {mockCategories.map((cat) => (
                                <div key={cat.id} className="flex items-center">
                                  <input 
                                    type="checkbox"
                                    id={`mobile-category-${cat.id}`}
                                    checked={selectedFilters.categories.includes(cat.id)}
                                    onChange={() => toggleFilter('categories', cat.id)}
                                    className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                                  />
                                  <label htmlFor={`mobile-category-${cat.id}`} className="ml-2 text-sm text-gray-700">
                                    {cat.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Price Range Accordion */}
                    <div className="py-3">
                      <button 
                        className="flex justify-between items-center w-full py-2 text-left font-medium"
                        onClick={() => toggleFilterTab('price')}
                      >
                        <span>Price Range</span>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform ${activeFilterTab === 'price' ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeFilterTab === 'price' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pb-1 space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full accent-terracotta-500"
                              />
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <input 
                                    type="number" 
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                                    className="w-full p-2 border border-cream-200 rounded text-sm"
                                    placeholder="Min"
                                  />
                                </div>
                                <div className="flex-1">
                                  <input 
                                    type="number" 
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], parseInt(e.target.value) || 0)])}
                                    className="w-full p-2 border border-cream-200 rounded text-sm"
                                    placeholder="Max"
                  />
                </div>
              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
              
                    {/* Variants Accordion */}
                    <div className="py-3">
                      <button 
                        className="flex justify-between items-center w-full py-2 text-left font-medium"
                        onClick={() => toggleFilterTab('variants')}
                      >
                        <span>Variants</span>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform ${activeFilterTab === 'variants' ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeFilterTab === 'variants' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pb-1 space-y-2">
                  {getUniqueVariantTypes().map((variant, index) => (
                    <div key={index} className="flex items-center">
                      <input 
                        type="checkbox"
                        id={`mobile-variant-${index}`}
                        checked={selectedFilters.variants.includes(variant)}
                        onChange={() => toggleFilter('variants', variant)}
                                    className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                      />
                      <label htmlFor={`mobile-variant-${index}`} className="ml-2 text-sm text-gray-700">
                        {variant}
                      </label>
                    </div>
                  ))}
                </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
              </div>
              
                    {/* Materials Accordion */}
                    <div className="py-3">
                      <button 
                        className="flex justify-between items-center w-full py-2 text-left font-medium"
                        onClick={() => toggleFilterTab('materials')}
                      >
                        <span>Materials</span>
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform ${activeFilterTab === 'materials' ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeFilterTab === 'materials' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pb-1 space-y-2">
                  {getUniqueMaterials().map((material, index) => (
                    <div key={index} className="flex items-center">
                      <input 
                        type="checkbox"
                        id={`mobile-material-${index}`}
                        checked={selectedFilters.materials.includes(material)}
                        onChange={() => toggleFilter('materials', material)}
                                    className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                      />
                      <label htmlFor={`mobile-material-${index}`} className="ml-2 text-sm text-gray-700">
                        {material}
                      </label>
                    </div>
                  ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                </div>
              </div>
              
                  <div className="pt-6 sticky bottom-0 bg-white mt-4">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                      className="w-full py-3 bg-terracotta-600 text-white rounded-xl font-medium shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
                </motion.div>
              </motion.div>
        )}
          </AnimatePresence>
        
        {/* Product Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-800">{displayedProducts.length}</span> of {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
                <div className="relative w-full sm:w-auto">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ArrowUpDown size={16} className="text-gray-400" />
                  </div>
                  <select className="w-full sm:w-auto appearance-none bg-cream-50 border border-cream-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
                </div>
          </div>
          
          {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {displayedProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        ref={idx === displayedProducts.length - 1 ? lastProductElementRef : null}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.5) }}
                        whileHover={{ y: -5 }}
                        className="h-full"
                      >
                        <ProductCard product={product} />
                      </motion.div>
              ))}
            </div>
                  
                  {isLoading && (
                    <div className="flex justify-center items-center py-8">
                      <div className="flex flex-col items-center">
                        <Loader size={30} className="text-terracotta-500 animate-spin mb-2" />
                        <p className="text-gray-600 text-sm">Loading more products...</p>
                      </div>
                    </div>
                  )}
                  
                  {!isLoading && !hasMore && displayedProducts.length > 0 && (
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
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your filters or browse all products in our collection</p>
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
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
