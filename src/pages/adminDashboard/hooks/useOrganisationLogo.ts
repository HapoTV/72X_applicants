import type { ChangeEvent, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { organisationBrandingService } from '../../../services/OrganisationBrandingService';

type UseOrganisationLogoResult = {
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadingPicture: boolean;
  organisationLogoUrl: string;
  handleUploadPictureChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveLogo: () => Promise<void>;
  clearLogo: () => void;
};

export const useOrganisationLogo = (): UseOrganisationLogoResult => {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [organisationLogoUrl, setOrganisationLogoUrl] = useState<string>('');

  useEffect(() => {
    const fetchLogo = async () => {
      if (!localStorage.getItem('authToken')) return;
      try {
        const res = await organisationBrandingService.getMine();
        setOrganisationLogoUrl(res?.logoUrl || '');
      } catch {
        setOrganisationLogoUrl('');
      }
    };

    void fetchLogo();
  }, []);

  const handleUploadPictureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPicture(true);
      const res = await organisationBrandingService.uploadMyLogo(file);
      setOrganisationLogoUrl(res?.logoUrl || '');
      alert('Organisation picture updated successfully!');
    } catch {
      alert('Failed to upload organisation picture');
    } finally {
      setUploadingPicture(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setUploadingPicture(true);
      await organisationBrandingService.removeMyLogo();
      setOrganisationLogoUrl('');
      alert('Organisation logo removed successfully!');
    } catch (error) {
      console.error('Error removing organisation logo:', error);
      alert('Failed to remove organisation logo');
    } finally {
      setUploadingPicture(false);
    }
  };

  return {
    uploadInputRef,
    uploadingPicture,
    organisationLogoUrl,
    handleUploadPictureChange,
    handleRemoveLogo,
    clearLogo: () => setOrganisationLogoUrl(''),
  };
};
