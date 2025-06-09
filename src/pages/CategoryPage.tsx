import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { Filter } from 'lucide-react';
import { useDebounceEffect } from '../utils/useDebounceEffect';

type ViewMode = 'all' | 'category' | 'trending' | 'top-selling';

const DEFAULT_PRICE_RANGE: [number, number] = [0, 200];
const VARIANT_OPTIONS = ['Small', 'Medium', 'Large', 'One Size'];
const MATERIAL_OPTIONS = ['Ceramic', 'Wood', 'Glass', 'Metal', 'Stone'];

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

  const sortParams = useState({ sort: 'createdAt', sortOrder: 'desc' })[0];

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

    return () => dispatch(clearCategoryProducts());
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
        dispatch(getTrendingProducts());
        break;
      case 'top-selling':
        dispatch(getTopSellingProducts());
        break;
      case 'category':
        dispatch(getProductsByCategory({ categoryId: selectedFilters.categoryId, params }));
        break;
      default:
        dispatch(getProducts(params));
    }
  }, [buildSearchParams, viewMode, selectedFilters.categoryId, dispatch]);

  useDebounceEffect(() => fetchProducts(1), [priceRange, selectedFilters, sortParams, viewMode], 400);

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
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbBanner currentCategory={combinedCategoryInfo} categories={categories} />

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
            categories={displayCategories}
            onCategoryChange={handleCategoryChange}
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
            setSortParams={() => {}}
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
