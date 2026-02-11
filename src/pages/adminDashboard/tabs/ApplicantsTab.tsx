import { useState, useEffect } from 'react';
import { applicationService } from '../../../services/ApplicantService';

import type { Application as ApiApplication, ApplicationStatus } from '../../../interfaces/ApplicantData';

interface Application {
    id: string;
    referenceNumber: string;
    businessName: string;
    businessOwner: string;
    package: string;
    submitted: string;
    actions: string;
    status: 'Pending' | 'Active' | 'Inactive';
    userEmail: string;
}

export default function ApplicantsTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const stats = [
        { 
            title: 'Total Applicants', 
            value: applications.length.toString(), 
            icon: '📄',
            color: 'blue'
        },
        { 
            title: 'Active', 
            value: applications.filter(app => app.status === 'Active').length.toString(), 
            icon: '✅',
            color: 'green'
        },
        { 
            title: 'Pending', 
            value: applications.filter(app => app.status === 'Pending').length.toString(), 
            icon: '⏳',
            color: 'yellow'
        },
        { 
            title: 'Inactive', 
            value: applications.filter(app => app.status === 'Inactive').length.toString(), 
            icon: '❌',
            color: 'red'
        },
    ];

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const apiApplications = await applicationService.getAllApplications();
            // Transform API response to match frontend interface
            const transformedApplications: Application[] = apiApplications.map((app: ApiApplication) => ({
                id: app.applicationId,
                referenceNumber: app.applicationNumber,
                businessName: app.userFullName || 'N/A',
                businessOwner: app.userFullName || 'N/A',
                package: 'startup',
                submitted: new Date(app.submittedAt).toLocaleDateString(),
                actions: 'view',
                status: mapStatus(app.status),
                userEmail: app.userEmail
            }));
            setApplications(transformedApplications);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const mapStatus = (apiStatus: string): 'Pending' | 'Active' | 'Inactive' => {
        switch (apiStatus?.toUpperCase()) {
            case 'APPROVED':
            case 'ACTIVE':
                return 'Active';
            case 'REJECTED':
            case 'INACTIVE':
                return 'Inactive';
            default:
                return 'Pending';
        }
    };

    const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus, reviewNotes?: string) => {
        try {
            await applicationService.updateApplicationStatus(
                applicationId,
                status,
                reviewNotes || `Status updated to ${status}`
            );
            fetchApplications(); // Refresh the list
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Error updating application status. Please try again.');
        }
    };

    const filteredApplications = applications.filter((app: Application) => {
        const searchable = [app.referenceNumber, app.businessName, app.businessOwner, app.package, app.userEmail]
            .filter(Boolean) as string[];
        const matchesSearch = searchTerm === '' || searchable.some(value => 
            value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="mb-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Applications Overview</h1>
                    <p className="text-gray-600 mb-4">Track and manage all business applications</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                <div className={`p-2 rounded-lg ${stat.title === 'Active' ? 'bg-green-50' : stat.title === 'Inactive' ? 'bg-red-50' : stat.title === 'Pending' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                                    <span className="text-xl">{stat.icon}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                                placeholder="Search by name, email, business name, or reference..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-40">
                            <select
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REFERENCE NUMBER</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUSINESS NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OWNER</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PACKAGE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBMITTED</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">⏳</div>
                                            <p className="mt-1 text-sm text-gray-500">Loading applications...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{app.referenceNumber}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.businessName}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.businessOwner}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.userEmail}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.package}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'Active' ? 'bg-green-100 text-green-800' : app.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.submitted}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                onClick={() => updateApplicationStatus(app.id, 'APPROVED', 'Application approved by admin')}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => updateApplicationStatus(app.id, 'REJECTED', 'Application rejected by admin')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">📄</div>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                                            <p className="mt-1 text-sm text-gray-500">{searchTerm || statusFilter !== 'All' ? 'No applications match your search criteria.' : 'Get started by approving new applications.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}