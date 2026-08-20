// src/pages/adminDashboard/tabs/FundingTab.tsx
import { useState, useEffect } from 'react';
import { fundingService } from '../../../services/FundingService';
import { useAuth } from '../../../context/AuthContext';
import type { AdminFundingItem, FundingFormData } from '../../../interfaces/FundingData';
import { DEFAULT_INDUSTRY, DEFAULT_TYPE } from '../../../interfaces/FundingData';
import { FundingManagementHeader } from './components/FundingManagementHeader';
import { FundingTable } from './components/FundingTable';
import { FundingFormModal } from './components/FundingFormModal';

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
        type: DEFAULT_TYPE,
        organisation: '', // New field
        isPublic: false   // New field
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const adminEmail = user?.email || '';
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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
            type: DEFAULT_TYPE,
            organisation: '',
            isPublic: false
        });
    };

    return (
        <div className="w-full">
            <FundingManagementHeader onAddFunding={() => setShowAddFunding(true)} />

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}
            
            <FundingTable
                fundingItems={fundingItems}
                loading={loading}
                onEdit={handleEditFunding}
                onDelete={handleDeleteFunding}
            />

            {showAddFunding && (
                <FundingFormModal
                    funding={newFunding}
                    isEditing={Boolean(editFundingId)}
                    isSuperAdmin={isSuperAdmin}
                    onFundingChange={setNewFunding}
                    onCancel={resetForm}
                    onSubmit={handleAddOrUpdateFunding}
                />
            )}
        </div>
    );
}