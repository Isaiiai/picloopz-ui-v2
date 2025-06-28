import { useState } from 'react';
import { Star, Camera, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useUpload } from '../../features/upload/useUpload';
import toast from 'react-hot-toast';

export type ReviewInput = {
  rating: number;
  comment: string;
  images: string[];
};

type ReviewProductCardProps = {
  productId: string;
  productName: string;
  onChange: (productId: string, data: Partial<ReviewInput>) => void;
  value: ReviewInput;
  disabled?: boolean;
};

export const ReviewProductCard = ({
  productId,
  productName,
  onChange,
  value,
  disabled = false,
}: ReviewProductCardProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { loading, uploadMultiple, reviewImageUpload } = useUpload();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 4,
    disabled: disabled || loading.reviewUploadLoading,
    onDrop: (acceptedFiles) => {
      if (value.images.length + acceptedFiles.length > 4) {
        toast.error('You can upload a maximum of 4 images.');
        return;
      }
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const handleUploadImages = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      setUploadProgress(0);
      await uploadMultiple({
        formData,
        purpose: 'review',
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(progress);
        },
      });

      const urls = reviewImageUpload?.uploads.map((upload) => upload.url) || [];
      onChange(productId, { images: [...value.images, ...urls] });
      setFiles([]);
      setUploadProgress(0);
      toast.success('Images uploaded!');
    } catch {
      toast.error('Upload failed');
      setUploadProgress(0);
    }
  };

  const removeImage = (index: number) => {
    onChange(productId, {
      images: value.images.filter((_, i) => i !== index),
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`border rounded-2xl p-5 shadow-sm mb-6 transition-all ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'bg-white'
      }`}
    >
      <h4 className="text-xl font-semibold text-gray-800 mb-3">{productName}</h4>

      {/* Star Rating */}
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !disabled && onChange(productId, { rating: star })}
            disabled={disabled}
            aria-label={`Rate ${star} star`}
          >
            <Star
              size={24}
              className={`transition-colors ${
                star <= value.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Comment Input */}
      <textarea
        disabled={disabled}
        placeholder="Write your honest review (min 10 characters)..."
        value={value.comment}
        rows={3}
        onChange={(e) => onChange(productId, { comment: e.target.value })}
        className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-2 disabled:opacity-60"
      />

      {value.comment.length > 0 && value.comment.length < 10 && (
        <p className="text-sm text-red-500 mb-3">Review must be at least 10 characters.</p>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
        } mb-3`}
      >
        <input {...getInputProps()} />
        <Camera className="mx-auto text-gray-400 mb-1" size={28} />
        <p className="text-sm text-gray-600">Click or drag images (max 4)</p>
        {files.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>
        )}
      </div>

      {/* Upload Button & Progress */}
      {files.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleUploadImages}
            disabled={loading.reviewUploadLoading || disabled}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading.reviewUploadLoading ? 'Uploading...' : 'Upload Images'}
          </button>

          {loading.reviewUploadLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Local Preview Images */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div key={idx} className="relative group w-20 h-20 rounded overflow-hidden shadow-sm">
                <img
                  src={previewUrl}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {value.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {value.images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img}
                alt={`uploaded-${idx}`}
                className="w-full h-20 object-cover rounded shadow"
              />
              {!disabled && (
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
