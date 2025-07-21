import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useGallery } from '../features/gallery/useGallery';
import PageSpinner from '../components/PageSpinner';

const GalleryPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { reels, loading, error, pagination, loadReels } = useGallery();

  useEffect(() => {
    loadReels({ page: currentPage, limit: 8 });
  }, [loadReels, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getInstagramEmbedUrl = (url: string) => {
    try {
      const match = url.match(/instagram\.com\/reel\/([^/?]+)/);
      if (match && match[1]) {
        return `https://www.instagram.com/reel/${match[1]}/embed/?utm_source=ig_embed&cr=1`;
      }
    } catch (e) {
      console.error('Invalid Instagram URL:', url);
    }
    return '';
  };

  const filteredItems = reels.filter((item: any) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      item.description?.toLowerCase().includes(searchLower) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower));

    const matchesTag = !selectedTag || item.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const uniqueTags = [...new Set(reels.flatMap((r: any) => r.tags || []))];

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="relative min-h-screen px-0 sm:px-4 pt-24 sm:pt-24 pb-8 bg-gradient-to-br from-cream-50 via-cream-100 to-terracotta-50 overflow-x-hidden">
      {/* Animated 3D shapes/accent background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-terracotta-200 via-terracotta-100 to-cream-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-200 to-cream-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-cream-100 via-cream-200 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 relative z-10">
          <div>
            <h1 className="text-4xl font-extrabold font-playfair text-gray-900 mb-1 bg-gradient-to-r from-terracotta-500 to-terracotta-600 bg-clip-text text-transparent animate-gradient-move">Gallery</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-500 rounded-full mb-2 animate-fade-in" />
            <p className="text-gray-600 text-base">Explore our creations</p>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow transition-all duration-200 border-2 ${
              !selectedTag
                ? 'bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white border-terracotta-300 scale-105'
                : 'bg-white text-gray-700 border-cream-200 hover:bg-cream-100'
            }`}
          >
            All
          </button>
          {(uniqueTags as string[]).map((tag: string) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow transition-all duration-200 border-2 ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white border-terracotta-300 scale-105'
                  : 'bg-white text-gray-700 border-cream-200 hover:bg-cream-100'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center text-red-600 py-10">
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle size={40} className="mb-2" />
              <p className="text-sm">Something went wrong loading the gallery.</p>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-gray-100 h-[500px] rounded-lg"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
              {filteredItems.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-white/90 border border-cream-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.025] transition-all duration-300 w-full mx-auto backdrop-blur-sm"
                >
                  <div className="aspect-[9/17] bg-gray-100 relative overflow-hidden">
                    <iframe
                      src={getInstagramEmbedUrl(item.instagramUrl)}
                      title={item.description || 'Instagram Reel'}
                      className="w-full h-full border-none overflow-hidden"
                      allow="autoplay; encrypted-media"
                      loading="lazy"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>
                  {/* Details section: hidden on mobile, visible on sm+ */}
                  <div className="hidden sm:block p-4">
                    <h3 className="font-medium text-base line-clamp-2">
                      {item.description || 'Untitled Reel'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags?.map((tag: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-2 py-0.5 rounded text-xs ${
                            selectedTag === tag
                              ? 'bg-terracotta-600 text-white'
                              : 'bg-cream-100 text-terracotta-700 hover:bg-cream-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-full text-sm border ${
                        page === currentPage
                          ? 'bg-terracotta-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No reels found for your filters/search.</p>
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 bg-terracotta-600 text-white rounded-full"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Animated accent keyframes */}
      <style>{`
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite alternate; }
        @keyframes pulse-slow { 0% { opacity: 0.3; } 100% { opacity: 0.6; } }
        .animate-floatY { animation: floatY 8s ease-in-out infinite alternate; }
        .animate-floatX { animation: floatX 10s ease-in-out infinite alternate; }
        @keyframes floatY { 0% { transform: translateY(0); } 100% { transform: translateY(-18px); } }
        @keyframes floatX { 0% { transform: translateX(0); } 100% { transform: translateX(18px); } }
      `}</style>
    </div>
  );
};

export default GalleryPage;