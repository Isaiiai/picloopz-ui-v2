import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Star, Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { useUpload } from '../../features/upload/useUpload';
import { AxiosProgressEvent } from 'axios';

export type ReviewInput = {
  rating: number;
  comment: string;
  images: string[];
};

interface Props {
  productId: string;
  productName: string;
  value: ReviewInput;
  onChange: (productId: string, data: Partial<ReviewInput>) => void;
  disabled?: boolean;
}

// Define a type for files with preview
type FileWithPreview = File & {
  preview: string;
};

export const ReviewProductCard = ({
  productId,
  productName,
  value,
  onChange,
  disabled = false,
}: Props) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [progress, setProgress] = useState(0);

  const { loading, uploadMultiple, reviewImageUpload } = useUpload();
  const uploading = loading?.reviewUploadLoading || false;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (value.images.length + acceptedFiles.length > 4) {
      toast.error('Maximum of 4 images allowed.');
      return;
    }
    setFiles(prev => [
      ...prev,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  }, [value.images.length]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 4 - value.images.length,
    disabled: disabled || uploading,
    onDrop,
  });

  useEffect(() => {
    // Clean up object URLs
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      setProgress(0);
      await uploadMultiple({
        formData,
        purpose: 'review',
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      const urls = reviewImageUpload?.uploads?.map(upload => upload.url) || [];
      onChange(productId, { images: [...value.images, ...urls] });
      setFiles([]);
      toast.success('Images uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setProgress(0);
    }
  };

  const removeImage = (idx: number) => {
    onChange(productId, { images: value.images.filter((_, i) => i !== idx) });
  };

  return (
    <div
      className={`border rounded-2xl p-5 shadow-sm mb-6 transition ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'bg-white'
      }`}
    >
      <h4 className="text-xl font-semibold mb-3">{productName}</h4>

      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(productId, { rating: star })}
            aria-label={`Rate ${star}`}
            disabled={disabled}
          >
            <Star
              size={24}
              className={
                star <= value.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }
            />
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        placeholder="Write your honest review (min 10 chars)…"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        disabled={disabled}
        value={value.comment}
        onChange={e => onChange(productId, { comment: e.target.value })}
      />
      {value.comment && value.comment.length < 10 && (
        <p className="text-sm text-red-500 mb-3">Min 10 characters.</p>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 text-center mb-3 ${
          disabled || uploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />
        <Camera className="mx-auto text-gray-400 mb-1" size={28} />
        <p className="text-sm">
          {uploading ? 'Uploading…' : 'Click or drag images (max 4)'}
        </p>
        {files.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? `Uploading… ${progress}%` : 'Upload Images'}
          </button>
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {(value.images.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {value.images.map((url, idx) => (
            <div key={`uploaded-${idx}`} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-20 object-cover rounded shadow"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {files.map((file, idx) => (
            <div key={`preview-${idx}`} className="relative">
              <img
                src={file.preview}
                alt={`Preview ${idx + 1}`}
                className="w-full h-20 object-cover rounded shadow opacity-70"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};