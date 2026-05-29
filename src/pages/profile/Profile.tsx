import React from 'react';
import { Building2 } from 'lucide-react';
import { PROFILE_TABS } from './profileHelpers';
import { useProfile } from './useProfile';
import ProfileForm from './ProfileForm';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import ChangePasswordModal from './ChangePasswordModal';
import ProfileSkeleton from '../../components/ProfileSkeleton';

const Profile: React.FC = () => {
  const {
    userOrganisation, loading,
    activeTab, setActiveTab,
    isEditing, setIsEditing,
    saving, profileData, handleInputChange, handleSave,
    profileImageUrl,
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
  } = useProfile();

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and business information</p>
        </div>
        {userOrganisation && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {userOrganisation}
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <nav className="flex space-x-2 overflow-x-auto">
          {PROFILE_TABS.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === id ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {activeTab === 'profile' && (
          <ProfileForm
            profileData={profileData}
            profileImageUrl={profileImageUrl}
            isEditing={isEditing}
            saving={saving}
            uploadingPicture={uploadingPicture}
            uploadInputRef={uploadInputRef}
            onInputChange={handleInputChange}
            onEditToggle={() => (isEditing ? handleSave() : setIsEditing(true))}
            onUploadClick={handleUploadPictureClick}
            onUploadChange={handleUploadPictureChange}
            onRemovePicture={handleRemovePicture}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationsTab
            preferences={notificationPreferences}
            saving={notificationSaving}
            onChange={setNotificationPreferences}
            onSave={handleSaveNotificationPreferences}
          />
        )}
        {activeTab === 'security' && (
          <SecurityTab
            downloadingData={downloadingData}
            deletingAccount={deletingAccount}
            onChangePassword={() => setShowPasswordModal(true)}
            onDownloadData={handleDownloadUserData}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          passwordData={passwordData}
          showPasswords={showPasswords}
          passwordError={passwordError}
          changingPassword={changingPassword}
          requirements={passwordRequirements}
          onPasswordDataChange={setPasswordData}
          onNewPasswordChange={handleNewPasswordChange}
          onToggleVisibility={(field) => setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))}
          onSubmit={handlePasswordChange}
          onClose={closePasswordModal}
        />
      )}
    </div>
  );
};

export default Profile;
