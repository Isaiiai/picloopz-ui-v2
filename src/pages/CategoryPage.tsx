import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  selectTrendingProducts,
  selectTopSellingProducts,
} from '../features/product/productSelectors';
import {
  selectCategories,
  selectCurrentCategory,
  selectCategoryLoading,
  selectCategoryError,
} from '../features/category/categorySelectors';
import {
  getProducts,
  getProductsByCategory,
  getTopSellingProducts,
  getTrendingProducts,
} from '../features/product/productThunks';
import { fetchCategories, fetchCategoryById } from '../features/category/categoryThunks';
import { clearCategoryProducts } from '../features/product/productSlice';
import type { AppDispatch } from '../store/store';
import { Filter, ArrowUpDown } from 'lucide-react';
import { useDebounceEffect } from '../utils/useDebounceEffect';

type ViewMode = 'all' | 'category' | 'trending' | 'top-selling';

const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000];

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const allProducts = useSelector(selectProducts);
  const categoryProducts = useSelector(selectCategoryProducts);
  const productCategoryInfo = useSelector(selectCategoryInfo);
  const productLoading = useSelector(selectProductLoading);
  const productError = useSelector(selectProductError);
  const pagination = useSelector(selectProductPagination);
  const categories = useSelector(selectCategories);
  const currentCategory = useSelector(selectCurrentCategory);
  const categoryLoading = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);
  const trendingProducts = useSelector(selectTrendingProducts);
  const topSellingProducts = useSelector(selectTopSellingProducts);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedFilters, setSelectedFilters] = useState({
    variants: [] as string[],
    materials: [] as string[],
    categoryId: '',
  });

  const [sortParams, setSortParams] = useState({ sort: 'createdAt', sortOrder: 'desc' });
  const [searchParams] = useSearchParams();
  const searchQueryFromUrl = searchParams.get('search') || '';

  const displayedProducts = useMemo(() => {
    switch (viewMode) {
      case 'trending': return trendingProducts;
      case 'top-selling': return topSellingProducts;
      case 'category': return categoryProducts;
      default: return allProducts;
    }
  }, [viewMode, trendingProducts, topSellingProducts, categoryProducts, allProducts]);

  const displayCategories = useMemo(() => [
    { id: 'all', name: 'All Products' },
    { id: 'trending', name: 'Trending' },
    { id: 'top-selling', name: 'Top Selling' },
    ...categories,
  ], [categories]);

  const combinedCategoryInfo = useMemo(() => {
    if (categoryId === 'all') return { id: 'all', name: 'All Products', imageUrl: '' };
    if (categoryId === 'trending') return { id: 'trending', name: 'Trending Products', imageUrl: '' };
    if (categoryId === 'top-selling') return { id: 'top-selling', name: 'Top Selling Products', imageUrl: '' };
    return currentCategory || productCategoryInfo;
  }, [categoryId, currentCategory, productCategoryInfo]);

  useEffect(() => {
    dispatch(fetchCategories({ limit: 10, sort: 'displayOrder', sortOrder: 'asc' }));
  }, [dispatch]);

  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      materials: searchQueryFromUrl.trim() ? [searchQueryFromUrl] : [],
    }));
  }, [searchQueryFromUrl]);


  useEffect(() => {
    if (categoryId === 'trending' || categoryId === 'top-selling') {
      setViewMode(categoryId);
    } else if (categoryId && categoryId !== 'all') {
      dispatch(fetchCategoryById(categoryId));
      setViewMode('category');
      setSelectedFilters(prev => ({ ...prev, categoryId }));
    } else {
      setViewMode('all');
      setSelectedFilters(prev => ({ ...prev, categoryId: '' }));
    }

    return () => {
      dispatch(clearCategoryProducts());
    };
  }, [categoryId, dispatch]);


  const buildSearchParams = useCallback((page = 1) => {
    const params: Record<string, any> = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortParams.sort,
      sortOrder: sortParams.sortOrder,
      limit: 20,
      page,
    };

    if (selectedFilters.variants.length) params.tags = selectedFilters.variants;
    if (selectedFilters.materials.length) params.search = selectedFilters.materials.join(' ');
    if (viewMode === 'category') params.categoryId = selectedFilters.categoryId;

    return params;
  }, [priceRange, sortParams, selectedFilters, viewMode]);

  const fetchProducts = useCallback((page = 1) => {
    const params = buildSearchParams(page);

    switch (viewMode) {
      case 'trending':
        dispatch(getTrendingProducts(10));
        break;
      case 'top-selling':
        dispatch(getTopSellingProducts(10));
        break;
      case 'category':
        dispatch(getProductsByCategory({ categoryId: selectedFilters.categoryId, params }));
        break;
      default:
        dispatch(getProducts(params));
    }
  }, [buildSearchParams, viewMode, selectedFilters.categoryId, dispatch]);

  useDebounceEffect(() => fetchProducts(1), [priceRange, selectedFilters, sortParams, viewMode], 400);

  const clearFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedFilters({ variants: [], materials: [], categoryId: '' });
    setViewMode('all');
    navigate('/category/all'); 
  };

  const handleCategoryChange = (catId: string) => {
    navigate(`/category/${catId}`);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (productLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.totalPages) {
        fetchProducts(pagination.page + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [productLoading, pagination, fetchProducts]);

  const loading = productLoading || categoryLoading;
  const error = productError || categoryError;

  if (error) return <ErrorDisplay error={error} onRetry={() => navigate(0)} />;

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Mobile spacer for fixed header, search bar, and sort bar */}
      <div className="md:hidden h-[160px]"></div>
      
      {/* Fixed Sort Bar for Mobile */}
      <div className="md:hidden fixed top-[130px] left-0 right-0  z-20 bg-white">
        <div className="px-4 py-3 ">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ArrowUpDown size={16} className="text-gray-400" />
              </div>
              <select
                className="w-full appearance-none bg-cream-50 border border-cream-200 rounded-lg py-2.5 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-sm"
                value={`${sortParams.sort}-${sortParams.sortOrder}`}
                onChange={(e) => {
                  const [sort, sortOrder] = e.target.value.split('-');
                  setSortParams({ sort, sortOrder });
                  fetchProducts(1);
                }}
              >
                <option value="createdAt-desc">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 text-white rounded-lg text-sm font-medium hover:bg-terracotta-700 transition-colors"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {combinedCategoryInfo && (
          <BreadcrumbBanner currentCategory={combinedCategoryInfo} />
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            clearFilters={clearFilters}
            categoryId={categoryId}
            categories={displayCategories}
            onCategoryChange={handleCategoryChange}
          />

          <MobileFilter
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            activeTab={activeFilterTab}
            setActiveTab={setActiveFilterTab}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            clearFilters={clearFilters}
            categoryId={categoryId}
            categories={displayCategories}
            onCategoryChange={handleCategoryChange}
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
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
