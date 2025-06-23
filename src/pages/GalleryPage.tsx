import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Heart, MessageCircle, Share2, X } from 'lucide-react';

// Mock gallery data
const galleryItems = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1574705447210-76ae1ebcc442?q=80&w=600&auto=format&fit=crop',
    title: 'Vintage Family Portrait',
    author: 'Sarah Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    likes: 124,
    comments: 23,
    tags: ['vintage', 'family', 'portrait'],
    productType: 'frame'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1605513524006-063ed6ed31e7?q=80&w=600&auto=format&fit=crop',
    title: 'Mountain Adventure Canvas',
    author: 'Michael Torres',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    likes: 97,
    comments: 15,
    tags: ['nature', 'adventure', 'mountain'],
    productType: 'canvas'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
    title: 'Custom Pet Mug',
    author: 'Emily Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    likes: 156,
    comments: 32,
    tags: ['pet', 'dog', 'custom'],
    productType: 'mug'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    title: 'Anniversary Gift Blanket',
    author: 'James Wilson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    likes: 205,
    comments: 48,
    tags: ['anniversary', 'gift', 'custom'],
    productType: 'blanket'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1554907984-89b1604d35d1?q=80&w=600&auto=format&fit=crop',
    title: 'Modern Art Collection',
    author: 'Lisa Parker',
    authorAvatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    likes: 87,
    comments: 12,
    tags: ['modern', 'art', 'abstract'],
    productType: 'wall-art'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=600&auto=format&fit=crop',
    title: 'Family Vacation Magnets',
    author: 'Robert Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/men/64.jpg',
    likes: 62,
    comments: 8,
    tags: ['family', 'vacation', 'beach'],
    productType: 'magnet'
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=600&auto=format&fit=crop',
    title: 'Wedding Memories Frame',
    author: 'Jennifer Lopez',
    authorAvatar: 'https://randomuser.me/api/portraits/women/37.jpg',
    likes: 183,
    comments: 42,
    tags: ['wedding', 'love', 'memories'],
    productType: 'frame'
  },
  {
    id: 8,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop',
    title: 'Minimalist Wall Art',
    author: 'David Kim',
    authorAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    likes: 134,
    comments: 19,
    tags: ['minimalist', 'modern', 'decor'],
    productType: 'wall-art'
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All' },
  { id: 'frame', name: 'Frames' },
  { id: 'canvas', name: 'Canvas' },
  { id: 'mug', name: 'Mugs' },
  { id: 'blanket', name: 'Blankets' },
  { id: 'wall-art', name: 'Wall Art' },
  { id: 'magnet', name: 'Magnets' }
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter items based on category and search query
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.productType === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair">Community Gallery</h1>
          <p className="text-gray-600 text-sm sm:text-base">Explore creations from our community</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none text-sm sm:text-base"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm"
          >
            <Filter size={16} />
            Filter
          </button>
          
          <Link
            to="/gallery/submit"
            className="px-4 py-2 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 transition-colors whitespace-nowrap text-sm sm:text-base text-center"
          >
            Submit Your Creation
          </Link>
        </div>
      </div>
      
      {/* Category Tabs - Desktop */}
      <div className="hidden md:flex space-x-4 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === category.id 
                ? 'bg-terracotta-100 text-terracotta-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white p-4 sm:p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="font-semibold text-base sm:text-lg">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <h4 className="font-medium mb-2 sm:mb-3">Categories</h4>
              <div className="space-y-1 sm:space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                      activeCategory === category.id 
                        ? 'bg-terracotta-100 text-terracotta-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-2 bg-terracotta-600 text-white rounded-lg mt-2 sm:mt-4 text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow max-w-xs w-full mx-auto">
              <div className="aspect-[4/3] sm:aspect-square bg-gray-100 relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute top-2 right-2 flex space-x-1 sm:top-3 sm:right-3 sm:space-x-2">
                  <button className="bg-white/80 backdrop-blur-sm text-gray-700 p-1 rounded-full hover:bg-white transition-colors">
                    <Heart size={15} />
                  </button>
                  <button className="bg-white/80 backdrop-blur-sm text-gray-700 p-1 rounded-full hover:bg-white transition-colors">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <h3 className="font-medium text-base sm:text-lg">{item.title}</h3>
                
                <div className="flex items-center mt-2">
                  <img 
                    src={item.authorAvatar} 
                    alt={item.author} 
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full mr-2"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{item.author}</span>
                </div>
                
                <div className="flex items-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center mr-3 sm:mr-4">
                    <Heart size={13} className="mr-1" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={13} className="mr-1" />
                    <span>{item.comments}</span>
                  </div>
                </div>
                
                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-0.5 bg-cream-100 text-terracotta-700 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="inline-block px-5 py-2 bg-terracotta-600 text-white rounded-full text-sm sm:text-base"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
