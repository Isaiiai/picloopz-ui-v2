import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import { mockTestimonials, mockAdvertisements } from '../data/mockData';
import { fetchCategories } from '../features/category/categoryThunks';
import { selectCategories } from '../features/category/categorySelectors';
import { useSelector } from 'react-redux';

import {
  getTopSellingProducts,
  getTrendingProducts,
} from '../features/product/productThunks';
import {
  selectTopSellingProducts,
  selectTrendingProducts,
} from '../features/product/productSelectors';
import { useBanner } from '../features/banner/useBanner';
import { useAppDispatch } from '../utils/hooks';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);
  const topSellingProducts = useSelector(selectTopSellingProducts);
  const trendingProducts = useSelector(selectTrendingProducts);

  const {banners} = useBanner();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(
            fetchCategories({
              limit: 10,
              sort: 'displayOrder',
              sortOrder: 'asc',
            })
          ),
          dispatch(getTopSellingProducts(10)),
          dispatch(getTrendingProducts(10)),
        ]);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockAdvertisements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockAdvertisements.length) % mockAdvertisements.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="relative min-h-screen pb-12 pt-24 md:pt-28 bg-gradient-to-br from-amber-50 via-cream-100 to-terracotta-50 overflow-x-hidden">
      {/* Animated 3D shapes/accent background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-32 h-32 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-terracotta-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-20 h-20 rounded-full bg-gradient-to-tr from-terracotta-200 to-amber-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-56 h-20 bg-gradient-to-br from-amber-100 via-cream-100 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>
      {/* Video Modal - Updated for proper Instagram sizing */}
      <AnimatePresence>
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setVideoUrl(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-10 transition-colors"
                onClick={() => setVideoUrl(null)}
              >
                <X size={20} />
              </button>
              
              {/* Different container styles based on content type */}
              {videoUrl.includes('instagram') ? (
                <div className="w-full h-full flex justify-center items-center bg-black overflow-auto max-h-[90vh]">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    style={{ maxHeight: '90vh', minHeight: '600px' }}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    title="Video player"
                  ></iframe>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 to-cream-200 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/pattern-bg.png')] opacity-5"></div>
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl relative z-10">
          <div className="py-16 md:py-24 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 lg:pr-8 mb-12 lg:mb-0 z-10"
            >
              <span className="inline-block px-4 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-6">
                Handcrafted with Love
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-playfair mb-6">
                <span className="relative">
                  Artisan Crafted
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-terracotta-200 opacity-70" viewBox="0 0 358 12" fill="currentColor">
                    <path d="M6 9C25 4.5 65.5 4 88 4.5C110.5 5 123 7.5 142 7.5C161 7.5 179 6.5 198 6.5C217 6.5 236.5 7.5 256 8C275.5 8.5 294.5 10 313.5 11C332.5 12 351.5 10.5 370.5 11C389.5 11.5 394 12 400 12" strokeWidth="3" stroke="currentColor" strokeLinecap="round"/>
                  </svg>
                </span>{" "}
                <span className="block mt-2">Memories & Decor</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-xl">
                Transform your cherished moments into stunning handcrafted art pieces. 
                Each creation tells your unique story with warmth and elegance that elevates any space.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/category/all" 
                    className="px-8 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                  >
                    Explore Collection <ArrowRight size={16} className="ml-2" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/about" 
                    className="px-8 py-3 border-2 border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50 font-medium rounded-lg transition-colors flex items-center"
                  >
                    Our Story
                  </Link>
                </motion.div>
              </div>
              <div className="flex items-center mt-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/women/${20 + i}.jpg`} 
                        alt="Customer" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Over 2,000 happy customers</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-terracotta-100 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-terracotta-200 rounded-full opacity-60"></div>
                <div className="relative z-10 bg-white p-3 rounded-xl shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1620783770629-122b7f187703?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                    alt="Handcrafted framed memories" 
                    className="w-full h-64 md:h-80 lg:h-[400px] object-cover rounded-lg"
                  />
                  <div className="absolute -bottom-6 -right-6 p-2 bg-white rounded-lg shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1567016526105-22da7c13161a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
                      alt="Detail shot" 
                      className="w-28 h-28 object-cover rounded"
                    />
                  </div>
                  <div className="absolute -top-6 -left-6 p-2 bg-white rounded-lg shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1594610352113-ad218529cfb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
                      alt="Detail shot" 
                      className="w-24 h-24 object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }}></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-1 right-10 w-[100px] h-[100px] bg-cream-100 rounded-full -translate-y-1/6 translate-x-1/3 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[200px] bg-terracotta-50 rounded-full translate-y-1/6 -translate-x-1/3 opacity-60"></div>
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl relative z-10">
          <div className="flex flex-col items-center mb-12">
            <span className="text-terracotta-500 text-sm font-medium tracking-wider uppercase mb-2">Explore Our</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-center font-playfair relative inline-block">
              Browse Categories
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-terracotta-300 rounded-full"></div>
            </h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
          <CategorySlider categories={categories} />
          </motion.div>
        </div>
      </section>

      {/* Advertisement Slider */}
      <section className="py-12 bg-cream-50 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-24 bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-full h-24 bg-white"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)' }}
      ></div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative h-80 sm:h-[600px] rounded-2xl overflow-hidden shadow-xl"
        >
          {banners.map((ad, index) => {
            const isActive = index === currentSlide;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-transparent flex items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : -20,
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-white p-8 md:p-12 max-w-xl"
                  >
                    <span className="px-3 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full inline-block mb-4">
                      Featured
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">{ad.title}</h3>
                    <p className="text-white/90 mb-6 text-lg">{ad.type}</p>
                    <Link
                      to={ad.targetUrl}
                      className="inline-flex items-center bg-white text-terracotta-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-terracotta-50 transition-colors shadow-md group"
                    >
                      Go
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-4 flex items-center">
                <button
                  onClick={prevSlide}
                  className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  onClick={nextSlide}
                  className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}

          {/* Dot Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-16' : 'bg-white/40 w-12'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>


      {/* Top Selling Products */}
      <section className="py-12 md:py-20 bg-cream-50 mt-16 md:mt-0">
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800">Top Selling Products</h2>
            <p className="text-md text-gray-600 mt-2">Loved by our customers, crafted for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {topSellingProducts?.slice(0, 10).map((product) => (
              <div key={product.id} className="h-full p-1 sm:p-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-800">Trending Now</h2>
            <p className="text-md text-gray-600 mt-2">Discover the latest designs everyone is talking about.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts?.slice(0, 10).map((product) => (
              <div key={product.id} className="h-full p-1 sm:p-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-cream-50 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-40 bg-[radial-gradient(50% 50% at 50% 0%, rgba(236, 201, 186, 0.2) 0%, rgba(255, 255, 255, 0) 100%)"></div>
        <div className="absolute -left-24 top-1/3 w-48 h-48 rounded-full border border-terracotta-200 opacity-30"></div>
        <div className="absolute -right-32 bottom-1/4 w-64 h-64 rounded-full border-2 border-terracotta-100 opacity-40"></div>
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium mb-4">
              Artisan Excellence
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              Our Refined Creation Process
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From your treasured memories to exquisite finished artwork, each piece undergoes a meticulous process 
              ensuring the highest quality and your complete satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-terracotta-200 to-transparent"></div>
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-terracotta-200 animate-pulse opacity-50"></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto relative z-10 border border-terracotta-100 shadow-md">
                  <span className="text-terracotta-600 text-xl font-playfair font-semibold">01</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-playfair">Place Your Order</h3>
              <p className="text-gray-600">Select your preferred design and upload your treasured photos</p>
            </div>
            {/* Step 2 */}
            <div className="text-center relative">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-terracotta-200 animate-pulse opacity-50" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto relative z-10 border border-terracotta-100 shadow-md">
                  <span className="text-terracotta-600 text-xl font-playfair font-semibold">02</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-playfair">Artisan Design</h3>
              <p className="text-gray-600">Our skilled artisans carefully craft your personalized design</p>
            </div>
            {/* Step 3 */}
            <div className="text-center relative">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-terracotta-200 animate-pulse opacity-50" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto relative z-10 border border-terracotta-100 shadow-md">
                  <span className="text-terracotta-600 text-xl font-playfair font-semibold">03</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-playfair">Preview & Approve</h3>
              <p className="text-gray-600">Review your design preview and request any desired changes</p>
            </div>
            {/* Step 4 */}
            <div className="text-center relative">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-terracotta-200 animate-pulse opacity-50" style={{ animationDelay: '0.6s' }}></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto relative z-10 border border-terracotta-100 shadow-md">
                  <span className="text-terracotta-600 text-xl font-playfair font-semibold">04</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-playfair">Handcrafted Creation</h3>
              <p className="text-gray-600">Upon approval, we meticulously produce your final artwork</p>
            </div>
            {/* Step 5 */}
            <div className="text-center relative">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-terracotta-200 animate-pulse opacity-50" style={{ animationDelay: '0.8s' }}></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto relative z-10 border border-terracotta-100 shadow-md">
                  <span className="text-terracotta-600 text-xl font-playfair font-semibold">05</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-playfair">Elegant Delivery</h3>
              <p className="text-gray-600">Receive your beautifully packaged custom creation</p>
            </div>
          </div>
          <div className="mt-24 max-w-5xl mx-auto bg-gradient-to-br from-cream-50 via-white to-terracotta-100 rounded-2xl p-12 shadow-xl border border-terracotta-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-terracotta-200 to-amber-200 rounded-full -translate-y-1/3 translate-x-1/3 opacity-50 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-100 to-terracotta-300 rounded-full translate-y-1/3 -translate-x-1/3 opacity-40 blur-lg"></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "url('/src/assets/approval-bg.svg') repeat", opacity: 0.05 }}></div>
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="md:w-2/5 relative flex justify-center items-center">
                <div className="relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                    alt="Custom approval process" 
                    className="w-[90%] h-auto rounded-xl shadow-lg relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <span className="inline-block px-5 py-1.5 bg-terracotta-100 text-terracotta-800 rounded-full text-sm font-medium mb-5 tracking-wide uppercase">
                  The Picloopz Promise
                </span>
                <h3 className="text-3xl md:text-4xl font-playfair font-extrabold mb-6 text-gray-900 relative inline-flex items-center gap-4">
                  <svg className="w-10 h-10 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4m0 0L3 9m9-5l9 5"/>
                  </svg>
                  Your Satisfaction, Our Priority
                  <span className="ml-3 px-3 py-1 bg-amber-200 text-amber-800 rounded-full font-semibold text-xs tracking-wide">NEW</span>
                  <div className="absolute -bottom-4 left-0 w-2/3 h-1.5 bg-gradient-to-r from-terracotta-400 to-amber-400 rounded-full"></div>
                </h3>
                <blockquote className="italic text-terracotta-800 text-lg mb-6 flex items-center gap-3 font-medium">
                  <svg className="w-7 h-7 text-terracotta-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.17 6A5.001 5.001 0 002 11c0 2.21 1.79 4 4 4h1v3a1 1 0 001 1h2a1 1 0 001-1v-3c0-2.21-1.79-4-4-4H7.17A3.001 3.001 0 017.17 6zM17.17 6A5.001 5.001 0 0012 11c0 2.21 1.79 4 4 4h1v3a1 1 0 001 1h2a1 1 0 001-1v-3c0-2.21-1.79-4-4-4h-.83A3.001 3.001 0 0117.17 6z"/>
                  </svg>
                  "We don't just create art, we create happiness. Your smile is our masterpiece."
                </blockquote>
                <p className="text-gray-800 mb-8 text-lg leading-relaxed">
                  We believe in perfection and your complete satisfaction. That's why we've implemented a unique 
                  <span className="text-terracotta-800 font-semibold"> pre-delivery approval process</span> where you'll 
                  review every detail before final production.
                </p>
                <motion.ul 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.2 } }
                  }}
                  className="bg-cream-50 p-8 rounded-xl shadow-lg border border-cream-200 mb-8 space-y-5"
                >
                  {[
                    "Preview your design before production begins",
                    "Request unlimited revisions until you're completely satisfied",
                    "Only after your approval do we create your final piece"
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -30 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
                      }}
                      className="flex items-start gap-4"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-terracotta-200 rounded-full flex items-center justify-center mt-1 shadow-md">
                        <svg className="w-5 h-5 text-terracotta-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/>
                        </svg>
                      </span>
                      <span className="text-gray-800 text-base">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <Link 
                  to="/how-it-works" 
                  className="inline-flex items-center px-10 py-3.5 bg-gradient-to-r from-terracotta-600 to-amber-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-terracotta-700 transition-all duration-300 group"
                >
                  Discover Our Excellence
                  <ArrowRight size={18} className="ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase - Next-level animated, professional design */}
      <section className="relative py-32 px-2 md:px-0 overflow-visible">
        {/* Animated gradient background with floating SVGs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-full h-full bg-gradient-to-br from-amber-100 via-terracotta-100 to-amber-200 animate-gradient-move opacity-90"></div>
          {/* Floating SVG shapes */}
          <svg className="absolute top-10 left-10 w-32 h-32 opacity-30 animate-float-slow" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#fbbf24" /></svg>
          <svg className="absolute bottom-10 right-20 w-24 h-24 opacity-20 animate-float-medium" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="#eab308" /></svg>
          <svg className="absolute top-1/2 left-1/3 w-20 h-20 opacity-20 animate-float-fast" viewBox="0 0 100 100"><polygon points="50,0 100,100 0,100" fill="#f87171" /></svg>
          {/* Sparkles/particles */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(18)].map((_,i)=>(<span key={i} className={`absolute w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-sparkle sparkle-${i}`} />))}
          </div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Glassmorphism panel */}
          <div className="backdrop-blur-2xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-8 md:p-16 relative overflow-visible">
            {/* Animated Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-5 py-2 bg-terracotta-200/60 text-terracotta-700 rounded-full text-base font-semibold mb-4 animate-fade-in">Inspiration Gallery</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-playfair mb-4 relative inline-block animate-slide-in">
                Our Creative Portfolio
                <svg className="absolute left-1/2 -translate-x-1/2 bottom-[-18px] w-40 h-6" viewBox="0 0 160 24" fill="none"><path d="M10 20 Q80 0 150 20" stroke="#f87171" strokeWidth="4" strokeLinecap="round" fill="none"><animate attributeName="stroke-dashoffset" from="160" to="0" dur="1.2s" fill="freeze" /></path></svg>
              </h2>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto animate-fade-in">Explore our stunning collection of custom designs, client creations, and artistic inspirations across various styles and formats.</p>
            </div>
            {/* Masonry grid with framer-motion staggered animation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 overflow-hidden">
              {[
                {src: "https://img.youtube.com/vi/9Ri3aggGkFY/maxresdefault.jpg", alt: "Family portrait", label: "Family Portrait Collection", url: "https://www.youtube.com/embed/9Ri3aggGkFY?autoplay=1"},
                {src: "https://res.cloudinary.com/dr6n03ecb/image/upload/v1750050407/WhatsApp_Image_2025-06-16_at_10.27.11_1c808b88_owjkng.jpg", alt: "Elegant Framing", label: "Elegant Framing", url: "https://www.instagram.com/reel/DK69g8IyZRk/embed?autoplay=1"},
                {src: "https://res.cloudinary.com/dr6n03ecb/image/upload/v1750050407/WhatsApp_Image_2025-06-16_at_10.27.11_1c808b88_owjkng.jpg", alt: "Creation Process", label: "Creation Process", url: "https://www.instagram.com/reel/DK69g8IyZRk/embed?autoplay=1"},
                {src: "https://res.cloudinary.com/dr6n03ecb/image/upload/v1750050683/WhatsApp_Image_2025-06-16_at_10.41.05_5818210c_u0ny4b.jpg", alt: "Watercolor Art", label: "Watercolor Art", url: "https://www.instagram.com/reel/DK69g8IyZRk/embed?autoplay=1"},
                {src: "https://res.cloudinary.com/dr6n03ecb/image/upload/v1750050407/WhatsApp_Image_2025-06-16_at_10.27.11_1c808b88_owjkng.jpg", alt: "Client Showcase", label: "Client Showcase", url: "https://www.instagram.com/reel/DK69g8IyZRk/embed?autoplay=1"},
                {src: "https://img.youtube.com/vi/9Ri3aggGkFY/maxresdefault.jpg", alt: "Home Decor Inspiration", label: "Home Decor Inspiration", url: "https://www.youtube.com/embed/9Ri3aggGkFY?autoplay=1"}
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 60, scale: 0.92, rotate: -2 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18, delay: idx * 0.13 }}
                  viewport={{ once: true }}
                  className="relative group rounded-3xl overflow-hidden shadow-xl bg-white/80 aspect-video cursor-pointer hover:scale-[1.07] hover:shadow-3xl hover:z-30 transition-all duration-500 border-2 border-transparent hover:border-gradient-to-r hover:from-amber-400 hover:to-terracotta-500"
                  tabIndex={0}
                  aria-label={item.label}
                  onClick={() => setVideoUrl(item.url)}
                  onKeyDown={e => { if (e.key === 'Enter') setVideoUrl(item.url); }}
                  style={{ perspective: '1200px' }}
                  onMouseMove={e => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    el.style.transform = `rotateY(${(x/rect.width-0.5)*10}deg) rotateX(${-(y/rect.height-0.5)*10}deg) scale(1.07)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-85 group-hover:scale-105"
                  />
                  {/* Animated overlay and play button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                      className="bg-white/40 backdrop-blur-lg rounded-full flex items-center justify-center shadow-2xl border-4 border-gradient-to-r from-amber-400 to-terracotta-500 group-hover:scale-110 group-hover:shadow-amber-400/40 transition-transform duration-500 w-1/4 h-1/4 max-w-[60px] max-h-[60px] min-w-[40px] min-h-[40px]"
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2, ease: 'easeInOut' }}
                        className="bg-terracotta-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse w-full h-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2/3 h-2/3" style={{ marginLeft: '2px' }}>
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  </div>
                  {/* Animated label */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.6, type: 'spring', stiffness: 120 }}
                    className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/70 to-transparent"
                  >
                    <span className="text-white font-bold text-xl drop-shadow-lg tracking-wide animate-typewriter">{item.label}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-16 animate-fade-in">
              <Link 
                to="/gallery" 
                className="inline-flex items-center px-10 py-4 border-2 border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 rounded-xl transition-colors group font-bold shadow-lg hover:shadow-amber-200/40 text-lg tracking-wide"
              >
                View Full Gallery
                <ArrowRight size={20} className="ml-3 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream-50" ref={testimonialRef}>
        <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 font-playfair">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.userAvatar} 
                    alt={testimonial.userName} 
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-cream-200"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.userName}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-terracotta-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
                {testimonial.productImage && (
                  <img 
                    src={testimonial.productImage} 
                    alt="Customer product" 
                    className="mt-4 w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              to="/testimonials" 
              className="inline-block px-6 py-3 border border-terracotta-400 text-terracotta-600 rounded hover:bg-terracotta-50 transition-colors"
            >
              See More Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;