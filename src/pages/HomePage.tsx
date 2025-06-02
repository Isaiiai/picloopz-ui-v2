import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import { mockCategories, mockProducts, mockTestimonials, mockAdvertisements } from '../data/mockData';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockAdvertisements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockAdvertisements.length) % mockAdvertisements.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Get top selling products
  const topSellingProducts = mockProducts
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4);

  // Get trending products
  const trendingProducts = mockProducts
    .filter(product => product.trending)
    .slice(0, 4);

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 to-cream-200 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/pattern-bg.png')] opacity-5"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="py-20 md:py-28 lg:py-32 flex flex-col lg:flex-row items-center">
            {/* Left side text content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 z-10"
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
                  to="/how-it-works" 
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
            
            {/* Right side image gallery */}
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
                    className="w-[1500px] h-[400px] object-cover rounded-lg"
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
        
        {/* Subtle diagonal lines decoration */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }}></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-1 right-10 w-[100px] h-[100px] bg-cream-100 rounded-full -translate-y-1/6 translate-x-1/3 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[200px] bg-terracotta-50 rounded-full translate-y-1/6 -translate-x-1/3 opacity-60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
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
          <CategorySlider categories={mockCategories} />
          </motion.div>
        </div>
      </section>

      {/* Advertisement Slider */}
      <section className="py-12 bg-cream-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-24 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)' }}></div>
        
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl"
          >
            {mockAdvertisements.map((ad, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 0.9,
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
                      opacity: index === currentSlide ? 1 : 0,
                      x: index === currentSlide ? 0 : -20 
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-white p-8 md:p-12 max-w-xl"
                  >
                    <span className="px-3 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full inline-block mb-4">
                      Featured
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">{ad.title}</h3>
                    <p className="text-white/90 mb-6 text-lg">{ad.description}</p>
                    <Link
                      to={ad.link}
                      className="inline-flex items-center bg-white text-terracotta-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-terracotta-50 transition-colors shadow-md group"
                    >
                      {ad.cta} 
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            
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
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
              {mockAdvertisements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-12 h-1 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-16' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-terracotta-50 rounded-full -translate-x-1/2 opacity-60 blur-2xl"></div>
        <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-cream-100 rounded-full translate-x-1/2 opacity-70 blur-xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0">
              <span className="text-terracotta-500 text-sm font-medium tracking-wider uppercase block mb-1">Customer Favorites</span>
              <h2 className="text-2xl md:text-3xl font-semibold font-playfair relative inline-block">
                Top Selling
                <div className="absolute -bottom-3 left-0 w-16 h-1 bg-terracotta-300 rounded-full"></div>
              </h2>
            </div>
            <Link 
              to="/category/top-selling" 
              className="text-terracotta-600 hover:text-terracotta-700 flex items-center transition-colors group"
            >
              <span className="mr-1">View All</span> 
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topSellingProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gradient-to-b from-cream-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32" style={{ 
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(236, 201, 186, 0.2) 0%, rgba(255, 255, 255, 0) 100%)' 
        }}></div>
        
        {/* <svg className="absolute top-0 left-0 w-full" height="24" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 24">
          <path d="M0 24H1440V0C1440 0 1082.5 24 720 24C357.5 24 0 0 0 0V24Z" fill="white" />
        </svg> */}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0">
              <span className="text-terracotta-500 text-sm font-medium tracking-wider uppercase block mb-1">Popular Right Now</span>
              <h2 className="text-2xl md:text-3xl font-semibold font-playfair relative inline-block">
                Trending Now
                <div className="absolute -bottom-3 left-0 w-16 h-1 bg-terracotta-300 rounded-full"></div>
              </h2>
            </div>
            <Link 
              to="/category/trending" 
              className="text-terracotta-600 hover:text-terracotta-700 flex items-center transition-colors group"
            >
              <span className="mr-1">View All</span> 
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-cream-50 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-40 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(236,201,186,0.15)_0%,rgba(255,255,255,0)_100%)]"></div>
        
        <div className="absolute -left-24 top-1/3 w-48 h-48 rounded-full border border-terracotta-200 opacity-30"></div>
        <div className="absolute -right-32 bottom-1/4 w-64 h-64 rounded-full border-2 border-terracotta-100 opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
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
            {/* Connection line */}
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
          
          <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-br from-white to-cream-50 rounded-xl p-10 shadow-xl border border-cream-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-terracotta-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-terracotta-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40"></div>
            
            <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
              <div className="md:w-2/5 relative">
                <div className="absolute -top-3 -left-3 w-full h-full bg-terracotta-300 rounded-lg opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                  alt="Custom approval process" 
                  className="w-full h-auto rounded-lg shadow-lg relative z-10"
                />
              </div>
              <div className="md:w-3/5">
                <span className="inline-block px-4 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium mb-4">
                  The Picloopz Promise
                </span>
                <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-6 text-gray-900 relative inline-block">
                  Your Satisfaction, Our Priority
                  <div className="absolute -bottom-3 left-0 w-1/2 h-1 bg-terracotta-300 rounded-full"></div>
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  We believe in perfection and your complete satisfaction. That's why we've implemented a unique 
                  <span className="text-terracotta-700 font-medium"> pre-delivery approval process</span> where you'll 
                  review every detail before final production.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md border border-cream-100 mb-6">
                  <h4 className="font-playfair font-semibold text-lg mb-3">Our Exclusive Approval Promise:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-terracotta-100 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-terracotta-500 rounded-full"></div>
                      </div>
                      <span className="ml-3">Preview your design before production begins</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-terracotta-100 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-terracotta-500 rounded-full"></div>
                      </div>
                      <span className="ml-3">Request unlimited revisions until you're completely satisfied</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-terracotta-100 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-terracotta-500 rounded-full"></div>
                      </div>
                      <span className="ml-3">Only after your approval do we create your final piece</span>
                    </li>
                  </ul>
                </div>
                <Link 
                  to="/how-it-works" 
                  className="inline-flex items-center px-8 py-3 bg-terracotta-500 text-white rounded-lg shadow-md hover:bg-terracotta-600 transition-colors group"
                >
                  Discover Our Excellence
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-cream-50" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-terracotta-50 rounded-full translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute top-1/4 left-0 w-24 h-24 bg-cream-100 rounded-full -translate-x-1/2 opacity-60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium mb-4">
              Inspiration Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              Our Creative Portfolio
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our stunning collection of custom designs, client creations, and artistic inspirations
              across various styles and formats.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* 16:9 landscape item (2-column span) */}
            <div className="col-span-2 relative group">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Family portrait" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Family Portrait Collection</span>
                </div>
              </div>
            </div>
            
            {/* 9:16 portrait item */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-[9/16]">
                <img 
                  src="https://images.unsplash.com/photo-1603251579771-271947028401?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Custom frame" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Elegant Framing</span>
                </div>
              </div>
            </div>
            
            {/* 9:16 portrait item with play button (video/reel) */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-[9/16]">
                <img 
                  src="https://images.unsplash.com/photo-1596825205280-55adf7852f17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Process video" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-terracotta-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ marginLeft: '2px' }}>
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Creation Process</span>
                </div>
              </div>
            </div>
            
            {/* 1:1 square item */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1551854838-212c50b4c184?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Custom artwork" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Watercolor Art</span>
                </div>
              </div>
            </div>
            
            {/* 1:1 square item with play button (video/reel) */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Showcase reel" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-terracotta-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ marginLeft: '2px' }}>
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Client Showcase</span>
                </div>
              </div>
            </div>
            
            {/* 16:9 landscape item (2-column span) with play button (video/reel) */}
            <div className="col-span-2 relative group">
              <div className="relative overflow-hidden rounded-xl shadow-md aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Home decor reel" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-14 h-14 bg-terracotta-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" style={{ marginLeft: '2px' }}>
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Home Decor Inspiration</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/gallery" 
              className="inline-flex items-center px-8 py-3 border-2 border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors group font-medium"
            >
              View Full Gallery
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream-50" ref={testimonialRef}>
        <div className="container mx-auto px-4">
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
