// src/pages/adminDashboard/tabs/components/BannerUpload.tsx
import React from 'react';
import { MediaType } from '../../../../interfaces/AdData';
import { Upload, Image, Video } from 'lucide-react';

interface BannerUploadProps {
  bannerFile: File | null;
  previewUrl: string | null;
  mediaType: MediaType;
  uploading: boolean;
  isEditing: boolean;
  onFileChange: (file: File | null) => void;
  onPreviewUrlChange: (url: string | null) => void;
  onMediaTypeChange: (type: MediaType) => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({
  bannerFile,
  previewUrl,
  mediaType,
  uploading,
  isEditing,
  onFileChange,
  onPreviewUrlChange,
  onMediaTypeChange
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload an image or video file.');
        return;
      }
      
      onFileChange(file);
      onPreviewUrlChange(URL.createObjectURL(file));
      
      // Auto-detect media type
      if (file.type.startsWith('image/')) {
        onMediaTypeChange(MediaType.IMAGE);
      } else if (file.type.startsWith('video/')) {
        onMediaTypeChange(MediaType.VIDEO);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Banner {!isEditing && '*'}
        </label>
        <div className={`border-2 ${bannerFile || previewUrl ? 'border-solid border-gray-300' : 'border-dashed border-gray-300'} rounded-lg p-6 text-center hover:border-primary-500 transition-colors ${uploading ? 'opacity-50' : ''}`}>
          {previewUrl ? (
            <div className="space-y-4">
              {mediaType === MediaType.IMAGE ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              )}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onFileChange(null);
                    onPreviewUrlChange(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  disabled={uploading}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className={uploading ? 'opacity-50' : ''}>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WEBP, MP4, WEBM up to 5MB
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="banner-upload"
                accept="image/*,video/*"
                disabled={uploading}
              />
              <label
                htmlFor="banner-upload"
                className={`mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Choose File
              </label>
            </div>
          )}
        </div>
        {isEditing && previewUrl && (
          <p className="text-xs text-gray-500 mt-1">
            Current banner will be kept unless you upload a new one
          </p>
        )}
      </div>
      
      {/* Media Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMediaTypeChange(MediaType.IMAGE)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${uploading ? 'opacity-50 cursor-not-allowed' : ''} ${
              mediaType === MediaType.IMAGE
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            disabled={uploading}
          >
            <Image size={16} />
            Image
          </button>
          <button
            type="button"
            onClick={() => onMediaTypeChange(MediaType.VIDEO)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${uploading ? 'opacity-50 cursor-not-allowed' : ''} ${
              mediaType === MediaType.VIDEO
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            disabled={uploading}
          >
            <Video size={16} />
            Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerUpload;