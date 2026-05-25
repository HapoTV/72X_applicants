import React from 'react';
import { Building2 } from 'lucide-react';

interface ProfileAvatarProps {
  profileImageUrl: string;
  fullName: string;
  companyName: string;
  organisation?: string;
  isEditing: boolean;
  uploadingPicture: boolean;
  uploadInputRef: React.RefObject<HTMLInputElement>;
  onUploadClick: () => void;
  onUploadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profileImageUrl, fullName, companyName, organisation,
  isEditing, uploadingPicture, uploadInputRef,
  onUploadClick, onUploadChange, onRemove,
}) => (
  <div className="flex items-center space-x-6 mb-8">
    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center overflow-hidden">
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-2xl font-bold">
          {fullName.split(' ').map((n) => n[0]).join('')}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
      <p className="text-gray-600">{companyName}</p>
      {organisation && (
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <Building2 className="w-4 h-4 mr-1" />
          Organisation: {organisation}
        </p>
      )}
      {isEditing && (
        <>
          <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadChange} />
          <button
            type="button"
            onClick={onUploadClick}
            disabled={uploadingPicture}
            className="text-primary-600 text-sm hover:text-primary-700 mt-1 disabled:opacity-50"
          >
            {uploadingPicture ? 'Uploading...' : 'Upload picture'}
          </button>
          {profileImageUrl && (
            <button
              type="button"
              onClick={onRemove}
              disabled={uploadingPicture}
              className="text-red-600 text-sm hover:text-red-700 mt-1 ml-3 disabled:opacity-50"
            >
              Remove picture
            </button>
          )}
        </>
      )}
    </div>
  </div>
);

export default ProfileAvatar;
