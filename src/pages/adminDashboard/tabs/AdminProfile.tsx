// src/pages/adminDashboard/tabs/AdminProfile.tsx
import React, { useRef, useState, useEffect } from 'react';
import { User, Edit, Save, Bell, Shield, Trash2, Mail, Phone, MapPin, Building2, Eye, EyeOff, X } from 'lucide-react';
import { authService } from '../../../services/AuthService';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/AuthContext';
import type { UserFormData } from '../../../interfaces/UserData';

const AdminProfile: React.FC = () => {
    const { user, login, isSuperAdmin, userOrganisation } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [notificationSaving, setNotificationSaving] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState({
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
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasNumber: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSpecialChar: false,
    });

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
    ];

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (activeTab !== 'notifications') return;

        const userKey = user?.userId || user?.email || localStorage.getItem('userEmail') || 'anonymous';
        const storageKey = `notificationPreferences:${userKey}`;

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
    }, [activeTab, user?.userId, user?.email]);

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

            try {
                const raw = localStorage.getItem('user');
                const parsed = raw ? JSON.parse(raw) : {};
                const nextUser = { ...parsed, ...userData };
                localStorage.setItem('user', JSON.stringify(nextUser));
                window.dispatchEvent(new CustomEvent('user-updated'));
            } catch (e) {
            }
        } catch (error) {
            console.error('Error fetching admin profile:', error);
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

            try {
                const raw = localStorage.getItem('user');
                const parsed = raw ? JSON.parse(raw) : {};
                const nextUser = { ...parsed, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(nextUser));
                window.dispatchEvent(new CustomEvent('user-updated'));
            } catch (e) {
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotificationPreferences = async () => {
        try {
            setNotificationSaving(true);
            const userKey = user?.userId || user?.email || localStorage.getItem('userEmail') || 'anonymous';
            const storageKey = `notificationPreferences:${userKey}`;
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

    const checkPasswordRequirements = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const handleNewPasswordChange = (value: string) => {
        setPasswordData(prev => ({ ...prev, newPassword: value }));
        checkPasswordRequirements(value);
    };

    const validatePassword = (): boolean => {
        if (!passwordData.currentPassword) {
            setPasswordError('Current password is required');
            return false;
        }

        if (!passwordData.newPassword) {
            setPasswordError('New password is required');
            return false;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return false;
        }

        const requirements = passwordRequirements;
        if (!requirements.hasNumber || !requirements.hasUppercase || !requirements.hasLowercase || !requirements.hasSpecialChar) {
            setPasswordError('Password does not meet all requirements');
            return false;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            setPasswordError('New password must be different from current password');
            return false;
        }

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
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setPasswordError(null);
        setShowPasswords({
            current: false,
            new: false,
            confirm: false,
        });
        setPasswordRequirements({
            minLength: false,
            hasNumber: false,
            hasUppercase: false,
            hasLowercase: false,
            hasSpecialChar: false,
        });
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-gray-100'}`}>
                <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
                    {met ? '✓' : '○'}
                </span>
            </div>
            <span className={`text-sm ${met ? 'text-green-700' : 'text-gray-500'}`}>
                {text}
            </span>
        </div>
    );

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
                } catch (orgError: any) {
                    const response = await axiosClient.get('/users/admin/all');
                    const allUsersData = response.data || [];
                    users = allUsersData.filter((u: any) => u.organisation === userOrganisation);
                }

                users = users.filter((u: any) => u.role !== 'SUPER_ADMIN');
            }

            const escapeCsv = (value: unknown) => {
                if (value === undefined || value === null) return '';
                const str = typeof value === 'string' ? value : JSON.stringify(value);
                const needsQuotes = /[",\n\r]/.test(str);
                const escaped = str.replace(/"/g, '""');
                return needsQuotes ? `"${escaped}"` : escaped;
            };

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
                ...users.map((u) => headers.map((h) => escapeCsv((u as any)[h])).join(',')),
            ];

            const csv = lines.join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const orgSlug = (userOrganisation || 'all')
                .toString()
                .replace(/[^a-z0-9-_ ]/gi, '')
                .trim()
                .replace(/\s+/g, '_');
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

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                                onChange={(e) => handleInputChange('organisation', e.target.value)}
                                                disabled={!isEditing}
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
                                            <option value="">Select Industry</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Education">Education</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Non-Profit">Non-Profit</option>
                                            <option value="Government">Government</option>
                                            <option value="Other">Other</option>
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
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">System Notifications</h4>
                                <div className="space-y-3">
                                    {[
                                        { id: 'new-applicants', label: 'New applicant registrations', checked: notificationPreferences.system.newApplicants },
                                        { id: 'system-alerts', label: 'System alerts and updates', checked: notificationPreferences.system.systemAlerts },
                                        { id: 'funding-updates', label: 'Funding opportunity updates', checked: notificationPreferences.system.fundingUpdates },
                                        { id: 'event-reminders', label: 'Event reminders', checked: notificationPreferences.system.eventReminders },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setNotificationPreferences((prev) => {
                                                        if (item.id === 'new-applicants') {
                                                            return { ...prev, system: { ...prev.system, newApplicants: checked } };
                                                        }
                                                        if (item.id === 'system-alerts') {
                                                            return { ...prev, system: { ...prev.system, systemAlerts: checked } };
                                                        }
                                                        if (item.id === 'funding-updates') {
                                                            return { ...prev, system: { ...prev.system, fundingUpdates: checked } };
                                                        }
                                                        return { ...prev, system: { ...prev.system, eventReminders: checked } };
                                                    });
                                                }}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                            />
                                            <span className="text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h4>
                                <div className="space-y-3">
                                    {[
                                        { id: 'weekly-reports', label: 'Weekly activity reports', checked: notificationPreferences.email.weeklyReports },
                                        { id: 'monthly-analytics', label: 'Monthly analytics summary', checked: notificationPreferences.email.monthlyAnalytics },
                                        { id: 'urgent-alerts', label: 'Urgent system alerts', checked: notificationPreferences.email.urgentAlerts },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setNotificationPreferences((prev) => {
                                                        if (item.id === 'weekly-reports') {
                                                            return { ...prev, email: { ...prev.email, weeklyReports: checked } };
                                                        }
                                                        if (item.id === 'monthly-analytics') {
                                                            return { ...prev, email: { ...prev.email, monthlyAnalytics: checked } };
                                                        }
                                                        return { ...prev, email: { ...prev.email, urgentAlerts: checked } };
                                                    });
                                                }}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                            />
                                            <span className="text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
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

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                            <button
                                type="button"
                                onClick={closePasswordModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {passwordError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-600 text-sm">{passwordError}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Enter current password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => handleNewPasswordChange(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
                                <RequirementItem met={passwordRequirements.minLength} text="At least 8 characters long" />
                                <RequirementItem met={passwordRequirements.hasUppercase} text="One uppercase letter" />
                                <RequirementItem met={passwordRequirements.hasLowercase} text="One lowercase letter" />
                                <RequirementItem met={passwordRequirements.hasNumber} text="One number" />
                                <RequirementItem met={passwordRequirements.hasSpecialChar} text="One special character" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closePasswordModal}
                                disabled={changingPassword}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handlePasswordChange}
                                disabled={changingPassword}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                            >
                                {changingPassword && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                <span>{changingPassword ? 'Changing Password...' : 'Change Password'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;