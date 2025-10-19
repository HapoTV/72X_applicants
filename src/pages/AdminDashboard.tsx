import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Activity, Settings, LogOut, Shield, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const adminStats = [
        {
            title: 'Total Users',
            value: '12,847',
            change: '+8.2%',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Businesses',
            value: '8,234',
            change: '+12.5%',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Monthly Revenue',
            value: 'R2.4M',
            change: '+15.3%',
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Platform Activity',
            value: '94.2%',
            change: '+2.1%',
            icon: Activity,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    const recentUsers = [
        { name: 'Sipho Mthembu', email: 'sipho@example.com', location: 'Soweto', joined: '2 hours ago', status: 'Active' },
        { name: 'Nomsa Dlamini', email: 'nomsa@example.com', location: 'Alexandra', joined: '4 hours ago', status: 'Active' },
        { name: 'Thabo Molefe', email: 'thabo@example.com', location: 'Khayelitsha', joined: '6 hours ago', status: 'Pending' },
        { name: 'Maria Santos', email: 'maria@example.com', location: 'Mitchells Plain', joined: '1 day ago', status: 'Active' },
    ];

    const tabs = [
        { id: 'overview', name: 'Overview', icon: BarChart3 },
        { id: 'users', name: 'Users', icon: Users },
        { id: 'settings', name: 'Settings', icon: Settings }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-6 h-6 text-primary-500" />
                                <span className="text-xl font-bold text-gray-900">BizBoost Admin</span>
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Development Mode
              </span>
                        </div>

                        <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, Admin
              </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Admin Sidebar */}
                <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
                    <div className="p-4">
                        <ul className="space-y-2">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-primary-50 text-primary-700'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                                <p className="text-gray-600">Monitor and manage the SeventyTwoX platform</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {adminStats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                                </div>
                                                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                            <p className="text-gray-600 text-sm">{stat.title}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Recent Users */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent User Registrations</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recentUsers.map((user, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                                                        <p className="text-sm text-gray-600">{user.email}</p>
                                                        <p className="text-sm text-gray-500">{user.location}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                                                    <p className="text-sm text-gray-500 mt-1">{user.joined}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
                                <p className="text-gray-600">Manage platform users and their activities</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <p className="text-gray-600">User management features will be implemented here.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Settings</h1>
                                <p className="text-gray-600">Configure platform settings and preferences</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <p className="text-gray-600">Platform settings will be implemented here.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;