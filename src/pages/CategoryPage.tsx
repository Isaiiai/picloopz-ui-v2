import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import MobileFilter from '../components/MobileFilter';
import ErrorDisplay from '../components/ErrorDisplay';
import BreadcrumbBanner from '../components/BreadcrumbBanner';
import {
  selectProducts,
  selectCategoryProducts,
  selectProductLoading,
  selectProductError,
  selectProductPagination,
  selectCategoryInfo,
} from '../features/product/productSelectors';

import {
  getProducts,
  getProductsByCategory,
} from '../features/product/productThunks';

import { clearCategoryProducts } from '../features/product/productSlice';
import type { AppDispatch } from '../store/store';
import { Filter } from 'lucide-react';

const DEFAULT_PRICE_RANGE: [number, number] = [0, 200];
const VARIANT_OPTIONS = ['Small', 'Medium', 'Large', 'One Size'];
const MATERIAL_OPTIONS = ['Ceramic', 'Wood', 'Glass', 'Metal', 'Stone'];

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const allProducts = useSelector(selectProducts);
  const categoryProducts = useSelector(selectCategoryProducts);
  const categoryInfo = useSelector(selectCategoryInfo);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const pagination = useSelector(selectProductPagination);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [selectedFilters, setSelectedFilters] = useState({
    variants: [],
    materials: [],
    categories: categoryId !== 'all' ? [categoryId || ''] : [],
  });
  const [sortParams, setSortParams] = useState({ sort: 'createdAt', sortOrder: 'desc' });

  const displayedProducts = categoryId === 'all' ? allProducts : categoryProducts;
  const currentCategory = categoryId === 'all'
    ? { id: 'all', name: 'All Products', imageUrl: '' }
    : categoryInfo;

  const buildSearchParams = useCallback((page: number = 1) => {
    const params: Record<string, any> = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortParams.sort,
      sortOrder: sortParams.sortOrder,
      limit: 20,
      page,
    };

    if (selectedFilters.variants.length > 0) {
      params.tags = selectedFilters.variants;
    }

    if (selectedFilters.materials.length > 0) {
      params.search = selectedFilters.materials.join(' ');
    }

    return params;
  }, [priceRange, selectedFilters, sortParams]);

  const fetchProducts = useCallback((page: number = 1) => {
    const params = buildSearchParams(page);
    if (categoryId === 'all') {
      dispatch(getProducts(params));
    } else {
      dispatch(getProductsByCategory({ categoryId, params }));
    }
  }, [buildSearchParams, categoryId, dispatch]);

  useEffect(() => {
    fetchProducts(1);
    return () => {
      if (categoryId !== 'all') dispatch(clearCategoryProducts());
    };
  }, [categoryId]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchProducts(1), 400);
    return () => clearTimeout(debounce);
  }, [priceRange, selectedFilters, sortParams]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.totalPages) {
        fetchProducts(pagination.page + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, pagination, fetchProducts]);

  const toggleFilter = (type: 'variants' | 'materials', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedFilters({ variants: [], materials: [], categories: categoryId !== 'all' ? [categoryId || ''] : [] });
  };

  if (error) return <ErrorDisplay error={error} onRetry={() => navigate(0)} />;

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbBanner currentCategory={currentCategory} />

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            variantOptions={VARIANT_OPTIONS}
            materialOptions={MATERIAL_OPTIONS}
            categoryId={categoryId}
            navigate={navigate}
          />

          <div className="md:hidden mb-6">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="w-full py-3 px-4 bg-white rounded-xl flex items-center justify-center gap-2 text-gray-700 shadow-md"
            >
              <Filter size={18} /> Filter Products
            </button>
          </div>

          <MobileFilter
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            activeTab={activeFilterTab}
            setActiveTab={setActiveFilterTab}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            variantOptions={VARIANT_OPTIONS}
            materialOptions={MATERIAL_OPTIONS}
            categoryId={categoryId}
            navigate={navigate}
          />

          <ProductGrid
            products={displayedProducts}
            lastProductRef={lastProductRef}
            loading={loading}
            pagination={pagination}
            clearFilters={clearFilters}
            sortParams={sortParams}
            setSortParams={setSortParams}
            fetchProducts={fetchProducts}
            buildSearchParams={buildSearchParams}
            categoryId={categoryId}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
