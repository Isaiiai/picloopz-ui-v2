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
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="flex-shrink-0 w-36 group"
            >
              <div className="rounded-lg overflow-hidden mb-2 aspect-square bg-gray-100">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-center font-medium text-gray-800 group-hover:text-peach-500 transition-colors">
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
      `}</style>
    </div>
  );
};

export default CategorySlider;
