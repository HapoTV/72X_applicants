import React from 'react';
import { Building2 } from 'lucide-react';
import { PROFILE_TABS } from './profileHelpers';
import { useProfile } from './useProfile';
import ProfileForm from './ProfileForm';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import ChangePasswordModal from './ChangePasswordModal';

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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
