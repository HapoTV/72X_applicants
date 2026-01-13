// src/pages/adminDashboard/tabs/components/AdForm.tsx
import React, { useState, useEffect } from 'react';
import { AdTargetingType, MediaType } from '../../../../interfaces/AdData';
import type { AdDTO, AdUploadDTO } from '../../../../interfaces/AdData';
import { adService } from '../../../../services/AdService';
import {
  RefreshCw,
} from 'lucide-react';
import BannerUpload from './BannerUpload';
import TargetingOptions from './TargetingOptions';
import BudgetSection from './BudgetSection';
import AdvancedSettings from './AdvancedSettings';

interface AdFormProps {
  editingAd: AdDTO | null;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

interface UserData {
  userId: string;
  fullName: string;
  email: string;
  industry?: string;
  businessReference?: string;
  role: string;
  userPackage: string;
}

const AdForm: React.FC<AdFormProps> = ({
  editingAd,
  onSuccess,
  onError,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<AdUploadDTO>>({
    title: '',
    description: '',
    clickUrl: '',
    mediaType: MediaType.IMAGE,
    targetingType: AdTargetingType.ALL_USERS,
    targetValue: '',
    budget: 100,
    costPerClick: 0.5,
    costPerImpression: 0.01,
    priority: 1,
    maxImpressions: 10000,
    maxClicks: 1000,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Initialize form with editing ad data
  useEffect(() => {
    if (editingAd) {
      setFormData({
        title: editingAd.title || '',
        description: editingAd.description || '',
        clickUrl: editingAd.clickUrl || '',
        mediaType: editingAd.mediaType || MediaType.IMAGE,
        targetingType: editingAd.targetingType || AdTargetingType.ALL_USERS,
        targetValue: editingAd.targetValue || '',
        budget: editingAd.budget || 100,
        costPerClick: editingAd.costPerClick || 0.5,
        costPerImpression: editingAd.costPerImpression || 0.01,
        priority: editingAd.priority || 1,
        maxImpressions: editingAd.maxImpressions || 10000,
        maxClicks: editingAd.maxClicks || 1000,
      });
      setPreviewUrl(editingAd.bannerUrl || null);
    }
  }, [editingAd]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const userId = localStorage.getItem('userId');
        const fullName = localStorage.getItem('fullName') || localStorage.getItem('userFirstName') || 'User';
        const email = localStorage.getItem('userEmail') || '';
        const industry = localStorage.getItem('userIndustry') || '';
        const businessReference = localStorage.getItem('businessReference') || '';
        const role = localStorage.getItem('userRole') || 'USER';
        const userPackage = localStorage.getItem('userPackage') || 'startup';
        
        if (userId) {
          setUserData({
            userId,
            fullName,
            email,
            industry,
            businessReference,
            role,
            userPackage
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'budget' || name === 'costPerClick' || name === 'costPerImpression' || name === 'priority' || name === 'maxImpressions' || name === 'maxClicks') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle targeting type change
  const handleTargetingChange = (type: AdTargetingType) => {
    setFormData(prev => ({ 
      ...prev, 
      targetingType: type,
      targetValue: getDefaultTargetValue(type)
    }));
  };

  // Get default target value based on targeting type
  const getDefaultTargetValue = (type: AdTargetingType): string => {
    if (!userData) return '';
    
    switch (type) {
      case AdTargetingType.SPECIFIC_INDUSTRY:
        return userData.industry || '';
      case AdTargetingType.BUSINESS_REFERENCE:
        return userData.businessReference || '';
      case AdTargetingType.USER_ROLE:
        return userData.role;
      case AdTargetingType.USER_PACKAGE:
        return userData.userPackage;
      default:
        return '';
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.title?.trim()) {
      onError('Title is required');
      return false;
    }
    
    if (!formData.clickUrl?.trim()) {
      onError('Click URL is required');
      return false;
    }
    
    // Validate URL format
    try {
      new URL(formData.clickUrl);
    } catch {
      onError('Please enter a valid URL starting with http:// or https://');
      return false;
    }
    
    if (!bannerFile && !editingAd && !previewUrl) {
      onError('Banner file is required for new ads');
      return false;
    }
    
    if (formData.budget === undefined || formData.budget <= 0) {
      onError('Budget must be greater than 0');
      return false;
    }
    
    if (formData.targetingType !== AdTargetingType.ALL_USERS && !formData.targetValue?.trim()) {
      onError('Target value is required for selected targeting type');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      onError('User ID not found. Please login again.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setUploading(true);
      
      if (editingAd) {
        // Update existing ad
        const updateData: Partial<AdDTO> = {
          title: formData.title!,
          description: formData.description,
          clickUrl: formData.clickUrl!,
          mediaType: formData.mediaType!,
          targetingType: formData.targetingType!,
          targetValue: formData.targetValue,
          budget: formData.budget!,
          costPerClick: formData.costPerClick,
          costPerImpression: formData.costPerImpression,
          priority: formData.priority!,
          maxImpressions: formData.maxImpressions,
          maxClicks: formData.maxClicks,
          status: editingAd.status,
          isActive: editingAd.isActive,
        };
        
        await adService.updateAd(editingAd.adId, updateData);
      } else {
        // Create new ad
        if (!bannerFile) {
          onError('Banner file is required for new ads');
          setUploading(false);
          return;
        }
        
        const uploadData: AdUploadDTO = {
          title: formData.title!,
          description: formData.description,
          bannerFile: bannerFile!,
          clickUrl: formData.clickUrl!,
          mediaType: formData.mediaType!,
          targetingType: formData.targetingType!,
          targetValue: formData.targetValue,
          budget: formData.budget!,
          costPerClick: formData.costPerClick,
          costPerImpression: formData.costPerImpression,
          priority: formData.priority,
          maxImpressions: formData.maxImpressions,
          maxClicks: formData.maxClicks,
        };
        
        await adService.createAd(uploadData);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving ad:', error);
      onError(error.message || 'Failed to save ad. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {editingAd ? 'Edit Ad' : 'Create New Ad'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter ad title"
                required
                disabled={uploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter ad description"
                disabled={uploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Click URL *
              </label>
              <input
                type="url"
                name="clickUrl"
                value={formData.clickUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com"
                required
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must start with http:// or https://
              </p>
            </div>
          </div>
          
          {/* Banner Upload */}
          <BannerUpload
            bannerFile={bannerFile}
            previewUrl={previewUrl}
            mediaType={formData.mediaType || MediaType.IMAGE}
            uploading={uploading}
            onFileChange={setBannerFile}
            onPreviewUrlChange={setPreviewUrl}
            onMediaTypeChange={(type) => setFormData(prev => ({ ...prev, mediaType: type }))}
            isEditing={!!editingAd}
          />
        </div>
        
        {/* Targeting Options */}
        <TargetingOptions
          targetingType={formData.targetingType || AdTargetingType.ALL_USERS}
          targetValue={formData.targetValue || ''}
          userData={userData}
          uploading={uploading}
          onTargetingChange={handleTargetingChange}
          onTargetValueChange={(value) => setFormData(prev => ({ ...prev, targetValue: value }))}
        />
        
        {/* Budget & Pricing */}
        <BudgetSection
          formData={formData}
          uploading={uploading}
          onInputChange={handleInputChange}
        />
        
        {/* Advanced Settings */}
        <AdvancedSettings
          formData={formData}
          uploading={uploading}
          onInputChange={handleInputChange}
        />
        
        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                {editingAd ? 'Updating...' : 'Creating...'}
              </>
            ) : editingAd ? (
              'Update Ad'
            ) : (
              'Create Ad'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdForm;