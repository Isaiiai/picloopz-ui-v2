import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { Category } from '../features/category/categoryTypes';

interface MobileFilterProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  clearFilters: () => void;
  categoryId?: string;
  categories: Array<Pick<Category, 'id' | 'name' > & Partial<Category>>;
  onCategoryChange: (categoryId: string) => void;
}

const MobileFilter: FC<MobileFilterProps> = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  priceRange,
  setPriceRange,
  clearFilters,
  categories,
  categoryId,
  onCategoryChange,
}) => {
  const toggleTab = (tab: string) => setActiveTab(activeTab === tab ? null : tab);

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
                      {type === 'categories' &&
                        categories.map((cat) => (
                          <div key={cat.id} className="flex items-center">
                            <input
                              type="radio"
                              name="mobile-category"
                              id={`mobile-category-${cat.id}`}
                              checked={categoryId === cat.id}
                              onChange={() => onCategoryChange(cat.id)}
                              className="w-4 h-4 text-terracotta-600 border-gray-300"
                            />
                            <label htmlFor={`mobile-category-${cat.id}`} className="ml-2 text-sm text-gray-700">
                              {cat.name}
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
                              onChange={(e) =>
                                setPriceRange([
                                  Math.max(0, parseInt(e.target.value) || 0),
                                  priceRange[1],
                                ])
                              }
                              className="w-full p-2 border border-cream-200 rounded text-sm"
                              placeholder="Min"
                            />
                            <input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  Math.max(priceRange[0], parseInt(e.target.value) || 0),
                                ])
                              }
                              className="w-full p-2 border border-cream-200 rounded text-sm"
                              placeholder="Max"
                            />
                          </div>
                        </>
                      )}

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
