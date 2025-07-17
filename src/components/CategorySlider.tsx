import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface CategorySliderProps {
  categories: Category[];
}

const CategorySlider = ({ categories }: CategorySliderProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      setMaxScroll(sliderRef.current.scrollWidth - sliderRef.current.clientWidth);
    }
    
    const handleResize = () => {
      if (sliderRef.current) {
        setMaxScroll(sliderRef.current.scrollWidth - sliderRef.current.clientWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount);
      
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {scrollPosition > 0 && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      
      {scrollPosition < maxScroll && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      )}
      
      {/* Categories Scroll Container */}
      <div 
        ref={sliderRef} 
        className="flex overflow-x-auto py-4 hide-scrollbar" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        <div className="flex space-x-6 px-4">
          {categories.map((category, idx) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="flex-shrink-0 w-36 group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                zIndex: hoveredIndex === idx ? 2 : 1,
                transition: 'z-index 0.2s',
              }}
            >
              <div
                className={`rounded-lg overflow-hidden mb-2 aspect-square bg-gray-100 relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  hoveredIndex === idx
                    ? 'scale-110 shadow-2xl border-4 border-peach-400'
                    : hoveredIndex === null
                    ? 'scale-100 shadow-md border border-transparent'
                    : 'scale-95 blur-[1px] opacity-80 shadow border border-transparent'
                }`}
              >
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredIndex === idx ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Animated border effect */}
                {hoveredIndex === idx && (
                  <div className="absolute inset-0 rounded-lg pointer-events-none animate-glow-border"></div>
                )}
              </div>
              <h3 className={`text-center font-medium text-gray-800 transition-colors duration-300 ${
                hoveredIndex === idx ? 'text-peach-500' : ''
              }`}>
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
      
      {/* CSS for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes glow-border {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 183, 94, 0.7), 0 0 0 0 rgba(255, 183, 94, 0.3);
          }
          70% {
            box-shadow: 0 0 16px 8px rgba(255, 183, 94, 0.7), 0 0 32px 16px rgba(255, 183, 94, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 183, 94, 0.7), 0 0 0 0 rgba(255, 183, 94, 0.3);
          }
        }
        .animate-glow-border {
          animation: glow-border 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default CategorySlider;