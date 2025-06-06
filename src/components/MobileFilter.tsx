import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface MobileFilterProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedFilters: {
    variants: string[];
    materials: string[];
    categories: string[];
  };
  toggleFilter: (type: 'variants' | 'materials', value: string) => void;
  clearFilters: () => void;
  variantOptions: string[];
  materialOptions: string[];
  categoryId?: string;
  navigate: (url: string) => void;
}

const MobileFilter: FC<MobileFilterProps> = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  priceRange,
  setPriceRange,
  selectedFilters,
  toggleFilter,
  clearFilters,
  variantOptions,
  materialOptions,
  categoryId,
  navigate
}) => {
  const toggleTab = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 md:hidden flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 mb-4 border border-terracotta-200 text-terracotta-600 rounded-lg hover:bg-terracotta-50 transition-colors"
            >
              Clear all filters
            </button>

            {[
              { label: 'Categories', type: 'categories' },
              { label: 'Price Range', type: 'price' },
              { label: 'Variants', type: 'variants' },
              { label: 'Materials', type: 'materials' },
            ].map(({ label, type }) => (
              <div key={type} className="py-3">
                <button
                  className="flex justify-between items-center w-full py-2 text-left font-medium"
                  onClick={() => toggleTab(type)}
                >
                  <span>{label}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${activeTab === type ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {activeTab === type && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-3 space-y-2"
                    >
                      {type === 'categories' && ['all', 'furniture'].map((cat) => (
                        <div key={cat} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-category-${cat}`}
                            checked={selectedFilters.categories.includes(cat)}
                            onChange={() => {
                              navigate(`/category/${cat}`);
                              setIsOpen(false);
                            }}
                            className="w-4 h-4 text-terracotta-600 rounded border-gray-300"
                          />
                          <label htmlFor={`mobile-category-${cat}`} className="ml-2 text-sm text-gray-700 capitalize">
                            {cat === 'all' ? 'All Products' : cat}
                          </label>
                        </div>
                      ))}

                      {type === 'price' && (
                        <>
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
                            <input
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                              className="w-full p-2 border border-cream-200 rounded text-sm"
                              placeholder="Min"
                            />
                            <input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], parseInt(e.target.value) || 0)])}
                              className="w-full p-2 border border-cream-200 rounded text-sm"
                              placeholder="Max"
                            />
                          </div>
                        </>
                      )}

                      {type === 'variants' && variantOptions.map((variant) => (
                        <div key={variant} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-variant-${variant}`}
                            checked={selectedFilters.variants.includes(variant)}
                            onChange={() => toggleFilter('variants', variant)}
                            className="w-4 h-4 text-terracotta-600 rounded border-gray-300"
                          />
                          <label htmlFor={`mobile-variant-${variant}`} className="ml-2 text-sm text-gray-700">
                            {variant}
                          </label>
                        </div>
                      ))}

                      {type === 'materials' && materialOptions.map((material) => (
                        <div key={material} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-material-${material}`}
                            checked={selectedFilters.materials.includes(material)}
                            onChange={() => toggleFilter('materials', material)}
                            className="w-4 h-4 text-terracotta-600 rounded border-gray-300"
                          />
                          <label htmlFor={`mobile-material-${material}`} className="ml-2 text-sm text-gray-700">
                            {material}
                          </label>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="pt-6 sticky bottom-0 bg-white mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-terracotta-600 text-white rounded-xl font-medium shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilter;
