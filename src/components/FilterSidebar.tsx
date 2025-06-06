import { FC } from 'react';

interface FilterSidebarProps {
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

const FilterSidebar: FC<FilterSidebarProps> = ({
  priceRange,
  setPriceRange,
  selectedFilters,
  toggleFilter,
  clearFilters,
  variantOptions,
  materialOptions,
  categoryId,
  navigate,
}) => {
  return (
    <div className="hidden md:block w-72 flex-shrink-0">
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

        {/* Categories */}
        <div className="mb-6 border-b border-cream-200 pb-6">
          <h4 className="font-medium mb-3 text-gray-700">Categories</h4>
          <div className="space-y-2">
            {['all', 'furniture'].map((cat) => (
              <div key={cat} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${cat}`}
                  checked={selectedFilters.categories.includes(cat)}
                  onChange={() => {
                    navigate(`/category/${cat}`);
                  }}
                  className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                />
                <label htmlFor={`category-${cat}`} className="ml-2 text-sm text-gray-700 capitalize">
                  {cat === 'all' ? 'All Products' : cat}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
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
          </div>
        </div>

        {/* Variants */}
        <div className="mb-6 border-b border-cream-200 pb-6">
          <h4 className="font-medium mb-3 text-gray-700">Variants</h4>
          <div className="space-y-2">
            {variantOptions.map((variant) => (
              <div key={variant} className="flex items-center">
                <input
                  type="checkbox"
                  id={`variant-${variant}`}
                  checked={selectedFilters.variants.includes(variant)}
                  onChange={() => toggleFilter('variants', variant)}
                  className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                />
                <label htmlFor={`variant-${variant}`} className="ml-2 text-sm text-gray-700">
                  {variant}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700">Materials</h4>
          <div className="space-y-2">
            {materialOptions.map((material) => (
              <div key={material} className="flex items-center">
                <input
                  type="checkbox"
                  id={`material-${material}`}
                  checked={selectedFilters.materials.includes(material)}
                  onChange={() => toggleFilter('materials', material)}
                  className="w-4 h-4 text-terracotta-600 rounded border-gray-300 focus:ring-terracotta-500"
                />
                <label htmlFor={`material-${material}`} className="ml-2 text-sm text-gray-700">
                  {material}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
