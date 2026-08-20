import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import type { UserFormData } from '../../interfaces/UserData';
import { checkPasswordRequirements, validatePasswordChange, EMPTY_PASSWORD_REQUIREMENTS } from '../../utils/passwordHelpers';
import { syncUserInLocalStorage, getNotificationStorageKey } from '../../utils/userHelpers';
import { buildUserDataCsv, type ProfileTabId } from './profileHelpers';

const EMPTY_PASSWORD = { currentPassword: '', newPassword: '', confirmPassword: '' };
const EMPTY_REQS = EMPTY_PASSWORD_REQUIREMENTS;

export const useProfile = () => {
  const { user, login, userOrganisation } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabId>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const [profileData, setProfileData] = useState<UserFormData>({
    fullName: '', email: '', mobileNumber: '', companyName: '',
    organisation: '', industry: '', location: '', employees: '', founded: '',
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    email: { dailyQuotes: true, aiInsights: true, dataAnalysis: true, weeklyReports: false },
    push: { urgentAlerts: true, goalMilestones: true, newResources: false },
  });
  const [notificationSaving, setNotificationSaving] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState(EMPTY_PASSWORD);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState(EMPTY_REQS);

  const [downloadingData, setDownloadingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const userKey = user?.userId || user?.email || localStorage.getItem('userEmail') || 'anonymous';

  const { data: userData, isLoading: loading } = useQuery({
    queryKey: ['profile', user?.userId ?? user?.email],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 3 * 60 * 1000,
    enabled: !!(user?.userId || user?.email),
  });

  useEffect(() => {
    if (!userData) return;

    // Fallback: derive founded year from yearsInOperation stored during registration
    let founded = userData.founded || '';
    if (!founded) {
      try {
        const reg = JSON.parse(localStorage.getItem('registrationData') || '{}');
        const yearsInOp = reg?.step2?.yearsInOperation;
        if (yearsInOp) {
          const years = Number(yearsInOp);
          if (Number.isFinite(years) && years >= 0)
            founded = String(new Date().getFullYear() - Math.floor(years));
        }
      } catch { /* ignore */ }
    }

    setProfileData({
      fullName: userData.fullName || '', email: userData.email || '',
      mobileNumber: userData.mobileNumber || '', companyName: userData.companyName || '',
      organisation: userData.organisation || '', industry: userData.industry || '',
      location: userData.location || '', employees: userData.employees || '',
      founded,
    });
    setProfileImageUrl(userData.profileImageUrl || '');
    syncUserInLocalStorage(userData);
  }, [userData]);

  useEffect(() => {
    if (activeTab !== 'notifications') return;
    const raw = localStorage.getItem(getNotificationStorageKey(user));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setNotificationPreferences((prev) => ({
          email: { ...prev.email, ...(parsed.email || {}) },
          push: { ...prev.push, ...(parsed.push || {}) },
        }));
      }
    } catch (e) { console.error('Error loading notification preferences:', e); }
  }, [activeTab, user]);

  const handleInputChange = (field: string, value: string) =>
    setProfileData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!user?.userId) throw new Error('User ID not found');
      const updatedUser = await authService.updateUserProfile(profileData);
      login(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally { setSaving(false); }
  };

  const handleSaveNotificationPreferences = async () => {
    try {
      setNotificationSaving(true);
      localStorage.setItem(getNotificationStorageKey(user), JSON.stringify(notificationPreferences));
      alert('Preferences saved successfully!');
    } catch (e) {
      console.error('Error saving notification preferences:', e);
      alert('Failed to save preferences');
    } finally { setNotificationSaving(false); }
  };

  const handleDownloadUserData = async () => {
    try {
      setDownloadingData(true);
      const csv = buildUserDataCsv(profileData as Record<string, string>, userKey);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (profileData.fullName || 'user').replace(/[^a-z0-9-_ ]/gi, '').trim().replace(/\s+/g, '_');
      a.href = url;
      a.download = `72X_${safeName}_data.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error downloading user data:', e);
      alert('Failed to download your data');
    } finally { setDownloadingData(false); }
  };

  const handleDeleteAccount = async () => {
    if (deletingAccount) return;
    if (!window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) return;
    try {
      setDeletingAccount(true);
      await authService.deactivateUser();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(error?.message || 'Failed to delete account');
    } finally { setDeletingAccount(false); }
  };

  const handleNewPasswordChange = (value: string) => {
    setPasswordData((prev) => ({ ...prev, newPassword: value }));
    setPasswordRequirements(checkPasswordRequirements(value));
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    const error = validatePasswordChange(
      passwordData.currentPassword, passwordData.newPassword,
      passwordData.confirmPassword, passwordRequirements
    );
    if (error) { setPasswordError(error); return; }
    try {
      setChangingPassword(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      closePasswordModal();
    } catch (error: any) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password. Please check your current password.');
    } finally { setChangingPassword(false); }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData(EMPTY_PASSWORD);
    setPasswordError(null);
    setShowPasswords({ current: false, new: false, confirm: false });
    setPasswordRequirements(EMPTY_REQS);
  };

  const handleUploadPictureClick = () => uploadInputRef.current?.click();

  const handleUploadPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPicture(true);
      const updatedUser = await authService.updateProfileImage(file);
      login(updatedUser);
      setProfileImageUrl(updatedUser.profileImageUrl || '');
      window.dispatchEvent(new CustomEvent('user-updated'));
      alert('Profile picture updated successfully!');
    } catch (e) {
      console.error('Error uploading profile picture:', e);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const handleRemovePicture = async () => {
    if (!profileImageUrl || !window.confirm('Remove your profile picture?')) return;
    try {
      setUploadingPicture(true);
      const updatedUser = await authService.removeProfileImage();
      login(updatedUser);
      setProfileImageUrl(updatedUser.profileImageUrl || '');
      window.dispatchEvent(new CustomEvent('user-updated'));
      alert('Profile picture removed successfully!');
    } catch (e) {
      console.error('Error removing profile picture:', e);
      alert('Failed to remove profile picture');
    } finally { setUploadingPicture(false); }
  };

  return {
    user, userOrganisation, loading,
    activeTab, setActiveTab,
    isEditing, setIsEditing,
    saving, profileData, handleInputChange, handleSave,
    profileImageUrl, setProfileImageUrl,
    uploadingPicture, uploadInputRef,
    handleUploadPictureClick, handleUploadPictureChange, handleRemovePicture,
    notificationPreferences, setNotificationPreferences,
    notificationSaving, handleSaveNotificationPreferences,
    showPasswordModal, setShowPasswordModal,
    passwordData, setPasswordData,
    showPasswords, setShowPasswords,
    passwordError, changingPassword,
    passwordRequirements,
    handleNewPasswordChange, handlePasswordChange, closePasswordModal,
    downloadingData, handleDownloadUserData,
    deletingAccount, handleDeleteAccount,
  };
};
