import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Star, Camera, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Review } from '../../features/review/reviewTypes';
import { useUpload } from '../../features/upload/useUpload';
import PageSpinner from '../../components/PageSpinner';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    rating: number;
    comment: string;
    images: string[];
  }) => Promise<void>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleUploadReviewImages: () => Promise<void>;
  isSubmitting: boolean;
  initialReview: {
    rating: number;
    comment: string;
    images: string[];
  };
  setReview: (review: {
    rating: number;
    comment: string;
    images: string[];
  }) => void;
  isEditOn: Review;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  files,
  setFiles,
  handleUploadReviewImages,
  isSubmitting,
  initialReview,
  setReview,
  isEditOn,
}) => {
  const { loading } = useUpload();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      setFiles(prev => {
        const fileMap = new Map(prev.map(f => [f.name + f.size, f]));
        acceptedFiles.forEach(file => {
          fileMap.set(file.name + file.size, file);
        });
        return Array.from(fileMap.values());
      });
    },
  });

  const handleSubmit = async () => {
    if (initialReview.rating === 0 || !initialReview.comment.trim()) {
      toast.error('Please provide a rating and comment before submitting.');
      return;
    }
    
    try {
      await onSubmit(initialReview);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const removeImage = (index: number) => {
    setReview({
      ...initialReview,
      images: initialReview.images.filter((_, i) => i !== index)
    });
  };

  if (loading.reviewUploadLoading) {
    return <PageSpinner />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              {isEditOn? (
                <h3 id="review-modal-title" className="text-2xl font-semibold">
                  Edit your Review
                </h3>
              ): (
                <h3 id="review-modal-title" className="text-2xl font-semibold">
                  Write a Review
                </h3>
              )}
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-red-600"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReview({ ...initialReview, rating: star })}
                    className="p-1"
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <Star
                      size={24}
                      className={star <= initialReview.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={initialReview.comment}
                onChange={(e) => setReview({ ...initialReview, comment: e.target.value })}
                className="w-full p-4 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                rows={4}
                placeholder="Share your experience with this product..."
              />
            </div>

            {/* Image Dropzone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed ${
                  loading.reviewUploadLoading ? 'border-gray-300' : 'border-cream-300'
                } rounded-xl p-6 text-center cursor-pointer hover:border-terracotta-300 transition-colors`}
              >
                <input {...getInputProps()} />
                {loading.reviewUploadLoading ? (
                  <div>Uploading...</div>
                ) : (
                  <>
                    <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600">Drag photos here or click to select</p>
                    {files.length > 0 && (
                      <p className="text-sm text-terracotta-600 mt-2">
                        {files.length} file(s) ready to upload
                      </p>
                    )}
                  </>
                )}
              </div>

              {files.length > 0 && !loading.reviewUploadLoading && (
                <button
                  onClick={handleUploadReviewImages}
                  disabled={loading.reviewUploadLoading}
                  className="mt-3 px-4 py-2 bg-terracotta-100 text-terracotta-700 rounded-lg hover:bg-terracotta-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.reviewUploadLoading ? 'Uploading...' : `Upload ${files.length} Image(s)`}
                </button>
              )}

              {/* Image Preview */}
              {(initialReview.images.length > 0 || files.length > 0) && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {initialReview.images.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={image}
                        alt={`Review ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 border border-cream-300 text-gray-700 rounded-xl hover:bg-cream-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || loading.reviewUploadLoading}
                className="flex-1 py-3 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Review'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewFormModal;