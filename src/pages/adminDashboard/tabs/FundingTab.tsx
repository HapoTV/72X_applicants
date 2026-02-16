// src/pages/adminDashboard/tabs/FundingTab.tsx
import { useState, useEffect } from 'react';
import { fundingService } from '../../../services/FundingService';
import { useAuth } from '../../../context/AuthContext';
import type { AdminFundingItem, FundingFormData } from '../../../interfaces/FundingData';
import { IndustryOptions, TypeOptions, DEFAULT_INDUSTRY, DEFAULT_TYPE } from '../../../interfaces/FundingData';

export default function FundingTab() {
    const { user } = useAuth();
    const [fundingItems, setFundingItems] = useState<AdminFundingItem[]>([]);
    const [showAddFunding, setShowAddFunding] = useState(false);
    const [editFundingId, setEditFundingId] = useState<string | null>(null);
    const [newFunding, setNewFunding] = useState<FundingFormData>({ 
        title: '', 
        provider: '', 
        deadline: '',
        description: '',
        eligibilityCriteria: '',
        fundingAmount: '',
        contactInfo: '',
        applicationUrl: '',
        industry: DEFAULT_INDUSTRY,
        type: DEFAULT_TYPE
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const adminEmail = user?.email || '';

    useEffect(() => {
        fetchFundingOpportunities();
    }, []);

    const fetchFundingOpportunities = async () => {
        try {
            setLoading(true);
            setError(null);
            const funding = await fundingService.getAllFunding();
            setFundingItems(funding);
        } catch (err) {
            setError('Failed to load funding opportunities');
            console.error('Error fetching funding opportunities:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateFunding = async () => {
        // Validate form data
        const validationError = fundingService.validateFundingForm(newFunding);
        if (validationError) {
            alert(validationError);
            return;
        }

        if (!adminEmail) {
            setError('Admin email not found');
            return;
        }
        
        try {
            setError(null);
            
            if (editFundingId) {
                await fundingService.updateFunding(editFundingId, newFunding, adminEmail);
            } else {
                await fundingService.createFunding(newFunding, adminEmail);
            }
            
            await fetchFundingOpportunities(); // Refresh the list
            resetForm();
        } catch (err) {
            setError('Failed to save funding opportunity');
            console.error('Error saving funding opportunity:', err);
        }
    };

    const handleDeleteFunding = async (fundingId: string) => {
        if (window.confirm('Are you sure you want to delete this funding opportunity?')) {
            try {
                setError(null);
                await fundingService.deleteFunding(fundingId);
                await fetchFundingOpportunities(); // Refresh the list
            } catch (err) {
                setError('Failed to delete funding opportunity');
                console.error('Error deleting funding opportunity:', err);
            }
        }
    };

    const handleEditFunding = (funding: AdminFundingItem) => {
        setEditFundingId(funding.id);
        setNewFunding(fundingService.transformToFormData(funding));
        setShowAddFunding(true);
    };

    const resetForm = () => {
        setShowAddFunding(false);
        setEditFundingId(null);
        setNewFunding({ 
            title: '', 
            provider: '', 
            deadline: '',
            description: '',
            eligibilityCriteria: '',
            fundingAmount: '',
            contactInfo: '',
            applicationUrl: '',
            industry: DEFAULT_INDUSTRY,
            type: DEFAULT_TYPE
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Funding Opportunities</h1>
                <button 
                    onClick={() => setShowAddFunding(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    Add Funding
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROVIDER</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INDUSTRY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEADLINE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-600">
                                        Loading funding opportunities...
                                    </td>
                                </tr>
                            ) : fundingItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No funding opportunities yet
                                    </td>
                                </tr>
                            ) : (
                                fundingItems.map(funding => (
                                    <tr key={funding.id}>
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-gray-900">{funding.title}</div>
                                            {funding.description && (
                                                <div className="text-sm text-gray-500 mt-1 line-clamp-2">{funding.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{funding.provider}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {funding.industry ? (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {funding.industry}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {funding.type ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    {funding.type}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{funding.fundingAmount || '—'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{funding.deadline || '—'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {funding.contactInfo ? (
                                                <a href={`mailto:${funding.contactInfo}`} className="text-blue-600 hover:text-blue-800">
                                                    {funding.contactInfo}
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            {funding.applicationUrl && (
                                                <a 
                                                    href={funding.applicationUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                                >
                                                    View
                                                </a>
                                            )}
                                            <button 
                                                className="text-green-600 hover:text-green-800 mr-4"
                                                onClick={() => handleEditFunding(funding)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDeleteFunding(funding.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Funding Modal */}
            {showAddFunding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editFundingId ? 'Edit Funding Opportunity' : 'Add Funding Opportunity'}
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Title *</label>
                                    <input 
                                        value={newFunding.title} 
                                        onChange={e => setNewFunding({...newFunding, title: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Provider *</label>
                                    <input 
                                        value={newFunding.provider} 
                                        onChange={e => setNewFunding({...newFunding, provider: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Industry</label>
                                    <select 
                                        value={newFunding.industry} 
                                        onChange={e => setNewFunding({...newFunding, industry: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        {IndustryOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Type</label>
                                    <select 
                                        value={newFunding.type} 
                                        onChange={e => setNewFunding({...newFunding, type: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        {TypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Funding Amount</label>
                                    <input 
                                        value={newFunding.fundingAmount} 
                                        onChange={e => setNewFunding({...newFunding, fundingAmount: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        placeholder="e.g., R50,000 - R100,000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Deadline</label>
                                    <input 
                                        type="date" 
                                        value={newFunding.deadline} 
                                        onChange={e => setNewFunding({...newFunding, deadline: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Contact Information</label>
                                    <input 
                                        value={newFunding.contactInfo} 
                                        onChange={e => setNewFunding({...newFunding, contactInfo: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        placeholder="email@provider.co.za"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Application URL</label>
                                    <input 
                                        value={newFunding.applicationUrl} 
                                        onChange={e => setNewFunding({...newFunding, applicationUrl: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Description</label>
                                <textarea 
                                    value={newFunding.description} 
                                    onChange={e => setNewFunding({...newFunding, description: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    rows={3}
                                    placeholder="Brief description of the funding opportunity..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Eligibility Criteria</label>
                                <textarea 
                                    value={newFunding.eligibilityCriteria} 
                                    onChange={e => setNewFunding({...newFunding, eligibilityCriteria: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    rows={3}
                                    placeholder="List the eligibility requirements..."
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button 
                                    onClick={resetForm}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddOrUpdateFunding}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                                >
                                    {editFundingId ? 'Save Changes' : 'Add Funding'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}