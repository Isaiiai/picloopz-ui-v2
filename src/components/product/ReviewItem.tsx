import { useState } from 'react';
import { Star, Verified, MoreHorizontal, ThumbsUp, Edit, Trash2 } from 'lucide-react';
import { useReview } from '../../features/review/useReview';
import { useAuth } from '../../features/auth/authHooks';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
  images: string[];
}

interface ReviewItemProps {
  review: Review;
  onImageClick?: (imageUrl: string, index: number) => void;
  onEdit?: (review: Review) => void;
  showReviewForm: (v :boolean) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onImageClick, onEdit, showReviewForm }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { removeReview } = useReview();
  const { user } = useAuth();
  const isCurrentUserReview = user?.id === review.userId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await removeReview(review.id);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  return (
    <div className="border border-cream-200 rounded-xl p-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img
            src={ 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0RbsfE-CTPvyX3hnl_iCv2iQ0KE2RvXcS8w&s'}
            alt={review.userName}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <div className="flex items-center">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {(user?.id === review.userId)?<p className='pl-1'>(You)</p>:null}
              {review.isApproved && <Verified size={16} className="text-blue-500 ml-2" />}
            </div>
            <div className="flex items-center mt-1">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {isCurrentUserReview && (
          <div className="relative">
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowOptions((prev) => !prev)}
              aria-label="Review options"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      showReviewForm(true);
                      setShowOptions(false);
                      onEdit?.(review);

                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Review
                  </button>
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      handleDelete();
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Images */}
      {review.images?.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onImageClick?.(image, index)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-cream-100">
        <button className="flex items-center text-gray-500 hover:text-terracotta-600 transition-colors">
          <ThumbsUp size={16} className="mr-2" />
          Helpful
        </button>
        {review.isApproved && (
          <span className="text-xs text-gray-400">Verified Purchase</span>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;