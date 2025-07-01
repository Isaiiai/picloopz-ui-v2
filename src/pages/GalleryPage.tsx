import { useEffect, useState } from 'react';
import { X, Filter, AlertTriangle } from 'lucide-react';
import { useGallery } from '../features/gallery/useGallery';

const GalleryPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const filteredItems = reels.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      item.description?.toLowerCase().includes(searchLower) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower));

    const matchesTag = !selectedTag || item.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const uniqueTags = [...new Set(reels.flatMap((r) => r.tags || []))];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold font-playfair">Gallery</h1>
          <p className="text-gray-600 text-sm">Explore our creations</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-300 outline-none text-sm"
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
            className="md:hidden px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-sm"
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            !selectedTag
              ? 'bg-terracotta-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-terracotta-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow max-w-xs w-full mx-auto"
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

                <div className="p-4">
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
  );
};

export default GalleryPage;
