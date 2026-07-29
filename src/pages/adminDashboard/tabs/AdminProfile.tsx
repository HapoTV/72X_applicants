// src/pages/adminDashboard/tabs/AdminProfile.tsx
import React, { useRef, useState, useEffect } from 'react';
import { User, Edit, Save, Bell, Shield, Trash2, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { authService } from '../../../services/AuthService';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/AuthContext';
import type { User as UserType, UserFormData } from '../../../interfaces/UserData';
import { AdminProfilePasswordModal } from './components/AdminProfilePasswordModal';
import { calculateYearsInBusiness, syncUserInLocalStorage, getNotificationStorageKey } from '../../../utils/userHelpers';
import { checkPasswordRequirements, validatePasswordChange, EMPTY_PASSWORD_REQUIREMENTS } from '../../../utils/passwordHelpers';
import type { PasswordRequirements as SharedPasswordRequirements } from '../../../utils/passwordHelpers';
import ProfileSkeleton from '../../../components/ProfileSkeleton';

type NotificationPreferences = {
    email: {
        weeklyReports: boolean;
        monthlyAnalytics: boolean;
        urgentAlerts: boolean;
    };
    system: {
        newApplicants: boolean;
        systemAlerts: boolean;
        fundingUpdates: boolean;
        eventReminders: boolean;
    };
};

type SystemPreferenceId = 'new-applicants' | 'system-alerts' | 'funding-updates' | 'event-reminders';
type EmailPreferenceId = 'weekly-reports' | 'monthly-analytics' | 'urgent-alerts';

const ADMIN_PROFILE_TABS = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
] as const;

const INDUSTRY_OPTIONS = [
    'Technology',
    'Finance & Banking',
    'Healthcare',
    'Retail & E-commerce',
    'Manufacturing',
    'Construction',
    'Education',
    'Hospitality & Tourism',
    'Transportation & Logistics',
    'Media & Entertainment',
    'Agriculture',
    'Real Estate',
    'Energy & Utilities',
    'Professional Services',
    'Consultancy',
    'Non-profit',
    'Other',
] as const;

const SYSTEM_NOTIFICATION_OPTIONS: Array<{ id: SystemPreferenceId; label: string }> = [
    { id: 'new-applicants', label: 'New applicant registrations' },
    { id: 'system-alerts', label: 'System alerts and updates' },
    { id: 'funding-updates', label: 'Funding opportunity updates' },
    { id: 'event-reminders', label: 'Event reminders' },
];

const EMAIL_NOTIFICATION_OPTIONS: Array<{ id: EmailPreferenceId; label: string }> = [
    { id: 'weekly-reports', label: 'Weekly activity reports' },
    { id: 'monthly-analytics', label: 'Monthly analytics summary' },
    { id: 'urgent-alerts', label: 'Urgent system alerts' },
];

type NotificationOption<T extends string> = {
    id: T;
    label: string;
};

const getNotificationPreferencesStorageKey = getNotificationStorageKey;

type PasswordRequirements = SharedPasswordRequirements;

type PasswordChangeData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type PasswordVisibilityState = {
    current: boolean;
    new: boolean;
    confirm: boolean;
};

const INITIAL_PASSWORD_DATA: PasswordChangeData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

const INITIAL_PASSWORD_VISIBILITY: PasswordVisibilityState = {
    current: false,
    new: false,
    confirm: false,
};



const escapeCsvValue = (value: unknown) => {
    if (value === undefined || value === null) return '';
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    const needsQuotes = /[",\n\r]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
};

const buildOrganisationUsersCsv = (users: any[]) => {
    const headers = [
        'fullName',
        'email',
        'mobileNumber',
        'companyName',
        'organisation',
        'role',
        'status',
        'createdAt',
        'lastLoginAt',
    ];

    const lines = [
        headers.join(','),
        ...users.map((u) => headers.map((h) => escapeCsvValue((u as any)[h])).join(',')),
    ];

    return lines.join('\r\n');
};

const getOrganisationSlug = (userOrganisation: string | null) => {
    return (userOrganisation || 'all')
        .toString()
        .replace(/[^a-z0-9-_ ]/gi, '')
        .trim()
        .replace(/\s+/g, '_');
};

const getSystemPreferenceChecked = (preferences: NotificationPreferences, id: SystemPreferenceId): boolean => {
    if (id === 'new-applicants') return preferences.system.newApplicants;
    if (id === 'system-alerts') return preferences.system.systemAlerts;
    if (id === 'funding-updates') return preferences.system.fundingUpdates;
    return preferences.system.eventReminders;
};

const getEmailPreferenceChecked = (preferences: NotificationPreferences, id: EmailPreferenceId): boolean => {
    if (id === 'weekly-reports') return preferences.email.weeklyReports;
    if (id === 'monthly-analytics') return preferences.email.monthlyAnalytics;
    return preferences.email.urgentAlerts;
};

const updateSystemPreference = (
    preferences: NotificationPreferences,
    id: SystemPreferenceId,
    checked: boolean
): NotificationPreferences => {
    if (id === 'new-applicants') {
        return { ...preferences, system: { ...preferences.system, newApplicants: checked } };
    }
    if (id === 'system-alerts') {
        return { ...preferences, system: { ...preferences.system, systemAlerts: checked } };
    }
    if (id === 'funding-updates') {
        return { ...preferences, system: { ...preferences.system, fundingUpdates: checked } };
    }
    return { ...preferences, system: { ...preferences.system, eventReminders: checked } };
};

const updateEmailPreference = (
    preferences: NotificationPreferences,
    id: EmailPreferenceId,
    checked: boolean
): NotificationPreferences => {
    if (id === 'weekly-reports') {
        return { ...preferences, email: { ...preferences.email, weeklyReports: checked } };
    }
    if (id === 'monthly-analytics') {
        return { ...preferences, email: { ...preferences.email, monthlyAnalytics: checked } };
    }
    return { ...preferences, email: { ...preferences.email, urgentAlerts: checked } };
};

const NotificationCheckboxGroup = <T extends string>({
    options,
    isChecked,
    onChange,
}: {
    options: Array<NotificationOption<T>>;
    isChecked: (id: T) => boolean;
    onChange: (id: T, checked: boolean) => void;
}) => {
    return (
        <div className="space-y-3">
            {options.map((item) => (
                <label key={item.id} className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={isChecked(item.id)}
                        onChange={(e) => onChange(item.id, e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{item.label}</span>
                </label>
            ))}
        </div>
    );
};

const AdminProfile: React.FC = () => {
    const { user, login, isSuperAdmin, userOrganisation } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [notificationSaving, setNotificationSaving] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
        email: {
            weeklyReports: true,
            monthlyAnalytics: true,
            urgentAlerts: true,
        },
        system: {
            newApplicants: true,
            systemAlerts: true,
            fundingUpdates: true,
            eventReminders: false,
        },
    });

    const tabs = ADMIN_PROFILE_TABS;

    const [profileData, setProfileData] = useState<UserFormData>({
        fullName: '',
        email: '',
        mobileNumber: '',

        companyName: '',
        organisation: '', 
        industry: '',
        location: '',
        employees: '',
        founded: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');
    const [uploadingPicture, setUploadingPicture] = useState(false);

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    const [downloadingOrgData, setDownloadingOrgData] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState<PasswordChangeData>(INITIAL_PASSWORD_DATA);
    const [showPasswords, setShowPasswords] = useState<PasswordVisibilityState>(INITIAL_PASSWORD_VISIBILITY);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>(EMPTY_PASSWORD_REQUIREMENTS);

    useEffect(() => {
        void fetchUserProfile();
    }, [user?.userId]);

    useEffect(() => {
        if (activeTab !== 'notifications') return;

        const storageKey = getNotificationPreferencesStorageKey(user);

        const raw = localStorage.getItem(storageKey);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                setNotificationPreferences((prev) => ({
                    email: { ...prev.email, ...(parsed.email || {}) },
                    system: { ...prev.system, ...(parsed.system || {}) },
                }));
            }
        } catch (error) {
            console.error('Error loading notification preferences:', error);
        }
    }, [activeTab, user]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userData = await authService.getCurrentUser();

            setProfileData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                mobileNumber: userData.mobileNumber || '',
                companyName: userData.companyName || '',
                organisation: userData.organisation || '', 
                industry: userData.industry || '',
                location: userData.location || '',
                employees: userData.employees || '',
                founded: userData.founded || ''
            });

            setProfileImageUrl(userData.profileImageUrl || '');
            syncUserInLocalStorage(userData as UserType);
        } catch {
            alert('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (!user?.userId) {
                throw new Error('User ID not found');
            }

            const updatedUser = await authService.updateUserProfile(profileData);
            login(updatedUser);
            setIsEditing(false);
            console.log('Profile saved:', updatedUser);
            alert('Profile updated successfully!');
            syncUserInLocalStorage(updatedUser);
        } catch (err: any) {
            alert(err?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotificationPreferences = async () => {
        try {
            setNotificationSaving(true);
            const storageKey = getNotificationPreferencesStorageKey(user);
            localStorage.setItem(storageKey, JSON.stringify(notificationPreferences));
            alert('Preferences saved successfully!');
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            alert('Failed to save preferences');
        } finally {
            setNotificationSaving(false);
        }
    };

    const handleUploadPictureClick = () => {
        uploadInputRef.current?.click();
    };

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
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture');
        } finally {
            setUploadingPicture(false);
            if (uploadInputRef.current) {
                uploadInputRef.current.value = '';
            }
        }
    };

    const handleRemovePicture = async () => {
        if (!profileImageUrl) return;

        if (!window.confirm('Remove your profile picture?')) {
            return;
        }

        try {
            setUploadingPicture(true);
            const updatedUser = await authService.removeProfileImage();
            login(updatedUser);
            setProfileImageUrl(updatedUser.profileImageUrl || '');
            window.dispatchEvent(new CustomEvent('user-updated'));
            alert('Profile picture removed successfully!');
        } catch (error) {
            console.error('Error removing profile picture:', error);
            alert('Failed to remove profile picture');
        } finally {
            setUploadingPicture(false);
        }
    };

    const handleNewPasswordChange = (value: string) => {
        setPasswordData(prev => ({ ...prev, newPassword: value }));
        setPasswordRequirements(checkPasswordRequirements(value));
    };

    const validatePassword = (): boolean => {
        const error = validatePasswordChange(
            passwordData.currentPassword,
            passwordData.newPassword,
            passwordData.confirmPassword,
            passwordRequirements
        );
        if (error) { setPasswordError(error); return false; }
        return true;
    };

    const handlePasswordChange = async () => {
        setPasswordError(null);

        if (!validatePassword()) {
            return;
        }

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
        } finally {
            setChangingPassword(false);
        }
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData(INITIAL_PASSWORD_DATA);
        setPasswordError(null);
        setShowPasswords(INITIAL_PASSWORD_VISIBILITY);
        setPasswordRequirements(EMPTY_PASSWORD_REQUIREMENTS);
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleDownloadOrganisationUsers = async () => {
        if (downloadingOrgData) return;

        try {
            setDownloadingOrgData(true);

            let users: any[] = [];

            if (isSuperAdmin) {
                const response = await axiosClient.get('/users/admin/all');
                users = response.data || [];
            } else {
                if (!userOrganisation) {
                    alert('Your account has no organisation assigned. Please contact support.');
                    return;
                }

                try {
                    const response = await axiosClient.get(`/users/organisation/${userOrganisation}`);
                    users = response.data || [];
                } catch {
                    const response = await axiosClient.get('/users/admin/all');
                    const allUsersData = response.data || [];
                    users = allUsersData.filter((u: any) => u.organisation === userOrganisation);
                }

                users = users.filter((u: any) => u.role !== 'SUPER_ADMIN');
            }

            const csv = buildOrganisationUsersCsv(users);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const orgSlug = getOrganisationSlug(userOrganisation);
            a.href = url;
            a.download = `72X_${orgSlug}_users.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error downloading organisation users:', error);
            alert(error?.message || 'Failed to download organisation users');
        } finally {
            setDownloadingOrgData(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deletingAccount) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete your admin account? This action is permanent and cannot be undone."
        );
        if (!confirmed) return;

        try {
            setDeletingAccount(true);
            await authService.deactivateUser();
        } catch (error: any) {
            console.error('Error deleting account:', error);
            alert(error?.message || 'Failed to delete account');
        } finally {
            setDeletingAccount(false);
        }
    };

    if (loading) return <ProfileSkeleton />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Profile Settings</h1>
                    {!isSuperAdmin && userOrganisation && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {userOrganisation}
                        </span>
                    )}
                </div>
                <p className="text-gray-600">Manage your admin account and information</p>
            </div>

            {/* Horizontal Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                <nav className="flex space-x-2 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {activeTab === 'profile' && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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

                        {/* Profile Picture */}
                        <div className="flex items-center space-x-6 mb-8">
                            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center overflow-hidden">
                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={() => setProfileImageUrl('')}
                                    />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {profileData.fullName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h3>
                                <p className="text-gray-600">Administrator</p>
                                {isEditing && (
                                    <>
                                        <input
                                            ref={uploadInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleUploadPictureChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUploadPictureClick}
                                            disabled={uploadingPicture}
                                            className="text-primary-600 text-sm hover:text-primary-700 mt-1 disabled:opacity-50"
                                        >
                                            {uploadingPicture ? 'Uploading...' : 'Upload picture'}
                                        </button>
                                        {profileImageUrl && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePicture}
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

                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={profileData.mobileNumber}
                                                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organisation Information */}
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Organisation Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Referenced By
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profileData.organisation}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                                placeholder="Your organisation"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry
                                        </label>
                                        <select
                                            value={profileData.industry}
                                            onChange={(e) => handleInputChange('industry', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        >
                                            <option value="">Select industry</option>
                                            {INDUSTRY_OPTIONS.map((i) => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={isSuperAdmin ? 'Super Administrator' : 'Administrator'}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Business Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Year Established
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.founded}
                                            onChange={(e) => handleInputChange('founded', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Years in Business
                                        </label>
                                        <input
                                            type="text"
                                            value={calculateYearsInBusiness(profileData.founded) ? `${calculateYearsInBusiness(profileData.founded)} years` : ''}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Employees
                                        </label>
                                        <select
                                            value={profileData.employees}
                                            onChange={(e) => handleInputChange('employees', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        >
                                            <option value="">Select Size</option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="10-50">10-50 employees</option>
                                            <option value="50-100">50-100 employees</option>
                                            <option value="100+">100+ employees</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">System Notifications</h4>
                                <NotificationCheckboxGroup
                                    options={SYSTEM_NOTIFICATION_OPTIONS}
                                    isChecked={(id) => getSystemPreferenceChecked(notificationPreferences, id)}
                                    onChange={(id, checked) => {
                                        setNotificationPreferences((prev) => updateSystemPreference(prev, id, checked));
                                    }}
                                />
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h4>
                                <NotificationCheckboxGroup
                                    options={EMAIL_NOTIFICATION_OPTIONS}
                                    isChecked={(id) => getEmailPreferenceChecked(notificationPreferences, id)}
                                    onChange={(id, checked) => {
                                        setNotificationPreferences((prev) => updateEmailPreference(prev, id, checked));
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveNotificationPreferences}
                            disabled={notificationSaving}
                            className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                        >
                            {notificationSaving ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Password</h4>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                >
                                    Change Password
                                </button>
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Two-Factor Authentication is enabled</p>
                                        <p className="text-sm text-gray-600">For security, 2FA is enabled by default for all admin accounts.</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                                        Enabled
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Admin Access</h4>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={handleDownloadOrganisationUsers}
                                        disabled={downloadingOrgData}
                                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Download Organisation Users</p>
                                                <p className="text-sm text-gray-600">Download all users/applicants in your organisation (Excel)</p>
                                            </div>
                                            <span className="text-primary-600">{downloadingOrgData ? 'Preparing…' : 'Download'}</span>
                                        </div>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={deletingAccount}
                                        className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-red-900">Delete Account</p>
                                                <p className="text-sm text-red-600">Permanently delete your admin account (cannot be undone)</p>
                                            </div>
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AdminProfilePasswordModal
                isOpen={showPasswordModal}
                passwordError={passwordError}
                passwordData={passwordData}
                showPasswords={showPasswords}
                passwordRequirements={passwordRequirements}
                changingPassword={changingPassword}
                onClose={closePasswordModal}
                onPasswordDataChange={setPasswordData}
                onNewPasswordChange={handleNewPasswordChange}
                onTogglePasswordVisibility={togglePasswordVisibility}
                onSubmit={handlePasswordChange}
            />
        </div>
    );
};

export default AdminProfile;