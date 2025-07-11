import { useState, useEffect } from 'react';
import { Star, Verified, MoreHorizontal, ThumbsUp, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useReview } from '../../features/review/useReview';
import { useAuth } from '../../features/auth/authHooks';
import { toast } from 'react-hot-toast';

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
  onImageClick?: (index: number) => void;
  onEdit?: (review: Review) => void;
  showReviewForm: (v :boolean) => void;
  onReviewDeleted?: () => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onImageClick, onEdit, showReviewForm, onReviewDeleted }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeReview, removeReviewImmediately } = useReview();
  const { user } = useAuth();
  const isCurrentUserReview = user?.id === review.userId;

  // Debug logging
  console.log('ReviewItem Debug:', {
    reviewUserId: review.userId,
    currentUserId: user?.id,
    isCurrentUserReview,
    reviewId: review.id
  });

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteConfirm) {
        setShowDeleteConfirm(false);
      }
    };

    if (showDeleteConfirm) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDeleteConfirm]);

  // Handle click outside to close options menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showOptions && !(e.target as Element).closest('.options-menu')) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptions]);

  const handleDelete = async () => {
    console.log('=== REVIEW ITEM DELETE START ===');
    console.log('Review to delete:', review);
    console.log('Review ID:', review.id);
    
    if (!review.id) {
      console.log('No review ID found, returning');
      return;
    }
    
    setIsDeleting(true);
    
    // Immediately remove from UI for instant feedback
    console.log('Immediately removing review from UI');
    removeReviewImmediately(review.id);
    
    try {
      console.log('Calling removeReview with ID:', review.id);
      
      // Add timeout to prevent hanging
      const deletePromise = removeReview(review.id);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Delete timeout')), 10000)
      );
      
      await Promise.race([deletePromise, timeoutPromise]);
      console.log('removeReview completed successfully');
      
      toast.success('Review deleted successfully');
      console.log('Calling onReviewDeleted callback');
      onReviewDeleted?.();
      console.log('onReviewDeleted callback completed');
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
      
      // If backend deletion failed, reload reviews to restore the deleted review
      console.log('Backend deletion failed, reloading reviews to restore state');
      onReviewDeleted?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`border border-cream-200 rounded-xl p-6 relative ${isCurrentUserReview ? 'bg-blue-50 border-blue-200' : ''}`}>
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
                {isCurrentUserReview && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    Your Review
                  </span>
                )}
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
            <div className="relative options-menu">
              <button 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
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
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Review
                    </button>
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
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
                className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-cream-200 shadow-sm"
                onClick={() => onImageClick?.(index)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Delete Review</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewItem;