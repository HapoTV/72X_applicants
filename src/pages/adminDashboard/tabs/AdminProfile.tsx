// src/pages/adminDashboard/tabs/AdminProfile.tsx
import React, { useState, useEffect } from 'react';
import { User, Edit, Save, Bell, Shield, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react';
import { authService } from '../../../services/AuthService';
import { useAuth } from '../../../context/AuthContext';
import type { UserFormData } from '../../../interfaces/UserData';

const AdminProfile: React.FC = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState<UserFormData>({
        fullName: '',
        email: '',
        mobileNumber: '',
        companyName: '',
        industry: '',
        location: '',
        employees: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
    ];

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userData = await authService.getCurrentUser();
            setProfileData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                mobileNumber: userData.mobileNumber || '',
                companyName: userData.companyName || '',
                industry: userData.industry || '',
                location: userData.location || '',
                employees: userData.employees || ''
            });
        } catch (error) {
            console.error('Error fetching admin profile:', error);
            alert('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (!user?.userId) {
                throw new Error('User ID not found');
            }

            const updatedUser = await authService.updateUserProfile(user.userId, profileData);
            
            // Update auth context with new data
            login(updatedUser);
            
            setIsEditing(false);
            console.log('Profile saved:', updatedUser);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const calculateYearsWithPlatform = (): string => {
        if (!user?.createdAt) return '0';
        
        const createdYear = new Date(user.createdAt).getFullYear();
        const currentYear = new Date().getFullYear();
        return (currentYear - createdYear).toString();
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Profile Settings</h1>
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
                            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">
                                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h3>
                                <p className="text-gray-600">Administrator</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Member for {calculateYearsWithPlatform()} years
                                </p>
                                {isEditing && (
                                    <button className="text-primary-600 text-sm hover:text-primary-700 mt-1">
                                        Change Photo
                                    </button>
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

                            {/* Organization Information */}
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Organization Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Organization Name
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profileData.companyName}
                                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
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
                                            Years with Platform
                                        </label>
                                        <input
                                            type="text"
                                            value={`${calculateYearsWithPlatform()} years`}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value="Administrator"
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
                                        { id: 'new-applicants', label: 'New applicant registrations', checked: true },
                                        { id: 'system-alerts', label: 'System alerts and updates', checked: true },
                                        { id: 'funding-updates', label: 'Funding opportunity updates', checked: true },
                                        { id: 'event-reminders', label: 'Event reminders', checked: false },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                defaultChecked={item.checked}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
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
                                        { id: 'weekly-reports', label: 'Weekly activity reports', checked: true },
                                        { id: 'monthly-analytics', label: 'Monthly analytics summary', checked: true },
                                        { id: 'urgent-alerts', label: 'Urgent system alerts', checked: true },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                defaultChecked={item.checked}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                            Save Preferences
                        </button>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Password</h4>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Change Password
                                </button>
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Enable 2FA</p>
                                        <p className="text-sm text-gray-600">Add an extra layer of security to your admin account</p>
                                    </div>
                                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                                        Enable
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Admin Access</h4>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Access Logs</p>
                                                <p className="text-sm text-gray-600">View your recent admin activity</p>
                                            </div>
                                            <span className="text-primary-600">View</span>
                                        </div>
                                    </button>
                                    
                                    <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-red-900">Delete Account</p>
                                                <p className="text-sm text-red-600">Permanently delete your admin account</p>
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
        </div>
    );
};

export default AdminProfile;