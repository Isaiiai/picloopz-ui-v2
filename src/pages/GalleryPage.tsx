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
    productType: 'frame',
    isLiked: false
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
    productType: 'canvas',
    isLiked: false
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
    productType: 'mug',
    isLiked: false
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
    productType: 'blanket',
    isLiked: false
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
    productType: 'wall-art',
    isLiked: false
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
    productType: 'magnet',
    isLiked: false
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
    productType: 'frame',
    isLiked: false
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
    productType: 'wall-art',
    isLiked: false
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
  const [items, setItems] = useState(galleryItems);
  
  // Filter items based on category and search query
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.productType === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Handle like functionality
  const handleLike = (itemId: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      )
    );
  };

  // Handle share functionality
  const handleShare = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this amazing creation: ${item.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `${window.location.href}?item=${item.id}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Desktop spacer for fixed header */}
      <div className="hidden md:block h-[80px]"></div>
      
      {/* Mobile spacer for fixed header */}
      <div className="md:hidden h-[64px]"></div>
      
      {/* Fixed Mobile Search and Actions Bar */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          {/* Enhanced Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="🔍 Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-0 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-terracotta-300 focus:outline-none text-base shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              <Filter size={16} />
              Filter
            </button>
            
            <Link
              to="/gallery/submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl hover:from-terracotta-700 hover:to-terracotta-800 transition-all shadow-sm hover:shadow-md text-sm font-medium text-center"
            >
              ✨ Submit
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Mobile Header Section */}
        <div className="md:hidden mb-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold font-playfair text-gray-900 mb-2">Community Gallery</h1>
            <p className="text-gray-600 text-sm">Discover amazing creations from our community</p>
          </div>
        </div>

        {/* Desktop Header Section */}
        <div className="hidden md:block">
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
        </div>
        
        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-base">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeCategory === category.id 
                          ? 'bg-terracotta-100 text-terracotta-800 border-2 border-terracotta-300' 
                          : 'text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 mt-8">
            {filteredItems.map(item => (
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-sm w-full mx-auto">
                {/* Enhanced Image Container */}
                <div className="aspect-[4/3] sm:aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl"
                    >
                      <Heart size={16} className={item.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
                    </button>
                    <button 
                      onClick={() => handleShare(item)}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl"
                    >
                      <Share2 size={16} className="text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-terracotta-700 rounded-full text-xs font-medium shadow-lg">
                      {item.productType}
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900 line-clamp-2">{item.title}</h3>
                  
                  {/* Author Section */}
                  <div className="flex items-center mb-3">
                    <div className="relative">
                      <img 
                        src={item.authorAvatar} 
                        alt={item.author} 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.author}</p>
                      <p className="text-xs text-gray-500">Creator</p>
                    </div>
                  </div>
                  
                  {/* Stats Section */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart size={14} className="mr-1 text-red-500" />
                        <span className="font-medium">{item.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={14} className="mr-1 text-blue-500" />
                        <span className="font-medium">{item.comments}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.floor(Math.random() * 30) + 1}d ago
                    </div>
                  </div>
                  
                  {/* Enhanced Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gradient-to-r from-cream-100 to-cream-200 text-terracotta-700 rounded-full text-xs font-medium border border-cream-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">No results found</h3>
            <p className="text-gray-600 mb-8 text-base max-w-md mx-auto">Try adjusting your search or filter criteria to discover amazing creations</p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
