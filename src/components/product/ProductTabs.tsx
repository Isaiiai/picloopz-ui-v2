import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import ReviewFormModal from './ReviewFormModal';
import ReviewItem from './ReviewItem';
import { Review } from '../../features/review/reviewTypes';

interface ProductTabsProps {
  product: any;
  reviews: any[];
  total: number;
  averageRating: number;
  newReview: {
    rating: number;
    comment: string;
    images: string[];
  };
  setNewReview: (state: any) => void;
  files: File[];
  setFiles: (f: File[]) => void;
  handleSubmitReview: () => Promise<void>;
  handleUploadReviewImages: () => Promise<void>;
  uploadLoading: boolean;
  reviewLoading: boolean;
  onEditReview: (review: any) => void;
  onImageClick: (imageUrl: string, index: number) => void;
  editingReview: Review
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  reviews,
  total,
  averageRating,
  newReview,
  setNewReview,
  files,
  setFiles,
  handleSubmitReview,
  handleUploadReviewImages,
  uploadLoading,
  reviewLoading,
  onEditReview,
  onImageClick,
  editingReview
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg mb-16">
      {/* Tab Buttons */}
      <div className="border-b border-cream-200">
        <div className="flex space-x-0 overflow-x-auto">
          {[
            { id: 'description', label: 'Description' },
            { id: 'details', label: 'Details' },
            { id: 'reviews', label: `Reviews (${total})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-terracotta-600 text-terracotta-600 bg-terracotta-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-cream-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard title="Premium Quality" desc="Crafted with the finest materials for lasting beauty" />
              <FeatureCard title="Custom Made" desc="Personalized just for you with your special moments" />
              <FeatureCard title="Fast Delivery" desc="Quick processing and reliable shipping" />
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Product Specifications</h3>
              <dl className="space-y-3">
                <SpecRow label="Materials" value={product.materials} />
                <SpecRow label="Dimensions" value={product.dimensions} />
                <SpecRow label="Processing Time" value={product.processingTime} />
                <SpecRow label="Shipping" value={product.shippingInfo} />
              </dl>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Care Instructions</h3>
              <ul className="space-y-2 text-gray-600">
                {product.careInstructions?.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-terracotta-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Customer Reviews</h3>
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2">based on {total} reviews</span>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition-colors font-medium"
              >
                Write a Review
              </button>
            </div>

            {/* Review Form Modal */}
            <ReviewFormModal
              isOpen={showReviewForm}
              onClose={() => {
                setShowReviewForm(false);
                setNewReview({ rating: 5, comment: '', images: [] });
              }}
              onSubmit={handleSubmitReview}
              files={files}
              setFiles={setFiles}
              handleUploadReviewImages={handleUploadReviewImages}
              uploadLoading={uploadLoading}
              isSubmitting={reviewLoading}
              initialReview={newReview}
              setReview={setNewReview}
              isEditOn={editingReview}
            />

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewItem 
                    key={review.id} 
                    review={review} 
                    onImageClick={onImageClick}
                    onEdit={onEditReview}
                    showReviewForm={setShowReviewForm}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this product!</p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition-colors font-medium"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-cream-100">
    <dt className="font-medium text-gray-700">{label}:</dt>
    <dd className="text-gray-600">{value}</dd>
  </div>
);

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-cream-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default ProductTabs;