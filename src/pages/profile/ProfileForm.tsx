import React from 'react';
import { Edit, Save } from 'lucide-react';
import type { UserFormData } from '../../interfaces/UserData';
import { INDUSTRIES, EMPLOYEE_SIZES, calculateYearsInBusiness } from './profileHelpers';
import ProfileAvatar from './ProfileAvatar';

interface ProfileFormProps {
  profileData: UserFormData;
  profileImageUrl: string;
  isEditing: boolean;
  saving: boolean;
  uploadingPicture: boolean;
  uploadInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (field: string, value: string) => void;
  onEditToggle: () => void;
  onUploadClick: () => void;
  onUploadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePicture: () => void;
}

const fieldClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50';

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData, profileImageUrl, isEditing, saving,
  uploadingPicture, uploadInputRef,
  onInputChange, onEditToggle, onUploadClick, onUploadChange, onRemovePicture,
}) => {
  const yearsInBusiness = calculateYearsInBusiness(profileData.founded);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        <button
          onClick={onEditToggle}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isEditing ? (
            <Save className="w-4 h-4" />
          ) : (
            <Edit className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      <ProfileAvatar
        profileImageUrl={profileImageUrl}
        fullName={profileData.fullName}
        companyName={profileData.companyName}
        organisation={profileData.organisation}
        isEditing={isEditing}
        uploadingPicture={uploadingPicture}
        uploadInputRef={uploadInputRef}
        onUploadClick={onUploadClick}
        onUploadChange={onUploadChange}
        onRemove={onRemovePicture}
      />

      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                { label: 'Full Name', field: 'fullName' as const, type: 'text' },
                { label: 'Email Address', field: 'email' as const, type: 'email' },
                { label: 'Phone Number', field: 'mobileNumber' as const, type: 'tel' },
                { label: 'Location', field: 'location' as const, type: 'text' },
              ] as const
            ).map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type={type}
                  value={profileData[field]}
                  onChange={(e) => onInputChange(field, e.target.value)}
                  disabled={!isEditing}
                  className={fieldClass}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Referenced By</label>
              <input
                type="text"
                value={profileData.organisation ?? ''}
                disabled
                placeholder="Your organisation"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Business Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">My Company Name</label>
              <input
                type="text"
                value={profileData.companyName}
                onChange={(e) => onInputChange('companyName', e.target.value)}
                disabled={!isEditing}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={profileData.industry}
                onChange={(e) => onInputChange('industry', e.target.value)}
                disabled={!isEditing}
                className={fieldClass}
              >
                <option value="">Select Industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
              <input
                type="text"
                value={yearsInBusiness ? `${yearsInBusiness} years` : ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Founded</label>
              <input
                type="text"
                value={profileData.founded}
                onChange={(e) => onInputChange('founded', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. 2021"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select
                value={profileData.employees}
                onChange={(e) => onInputChange('employees', e.target.value)}
                disabled={!isEditing}
                className={fieldClass}
              >
                <option value="">Select Size</option>
                {EMPLOYEE_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
