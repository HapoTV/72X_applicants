// src/pages/adminDashboard/tabs/AdTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { adService } from '../../../services/AdService';
import { AdStatus, AdTargetingType, MediaType } from '../../../interfaces/AdData';
import type { AdDTO } from '../../../interfaces/AdData';
import { Plus } from 'lucide-react';

// Import components
import AdForm from './components/AdForm';
import AdsList from './components/AdsList';
import StatsSummary from './components/StatsSummary';
import HelpSection from './components/HelpSection';
import Messages from './components/Messages';

const AdTab: React.FC = () => {
  // State management
  const [ads, setAds] = useState<AdDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<AdDTO | null>(null);
  
  // Filter and pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AdStatus | 'ALL'>('ALL');
  const [targetingFilter, setTargetingFilter] = useState<AdTargetingType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalAds, setTotalAds] = useState<number>(0);

  // Fetch ads
  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adService.getUserAds(currentPage - 1, itemsPerPage);
      
      // Ensure all ads have required fields with default values
      const safeAds = (response.content || []).map((ad: any) => ({
        ...ad,
        totalClicks: ad.totalClicks || 0,
        totalImpressions: ad.totalImpressions || 0,
        totalInteractions: ad.totalInteractions || 0,
        budget: ad.budget || 0,
        priority: ad.priority || 1,
        isActive: ad.isActive !== undefined ? ad.isActive : true,
        status: ad.status || AdStatus.DRAFT,
        targetingType: ad.targetingType || AdTargetingType.ALL_USERS,
        mediaType: ad.mediaType || MediaType.IMAGE,
        bannerUrl: ad.bannerUrl || '',
        clickUrl: ad.clickUrl || '',
        title: ad.title || 'Untitled Ad',
        description: ad.description || '',
        createdById: ad.createdById || '',
        createdAt: ad.createdAt || new Date().toISOString()
      }));
      
      setAds(safeAds);
      setTotalAds(response.totalElements || 0);
    } catch (error: any) {
      console.error('Error fetching ads:', error);
      setError(error.message || 'Failed to load ads. Please try again.');
      setAds([]);
      setTotalAds(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Handle edit ad
  const handleEdit = (ad: AdDTO) => {
    setEditingAd(ad);
    setShowForm(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete ad
  const handleDelete = async (adId: string) => {
    if (!window.confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adService.deleteAd(adId);
      setSuccess('Ad deleted successfully!');
      fetchAds();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error deleting ad:', error);
      setError(error.message || 'Failed to delete ad. Please try again.');
    }
  };

  // Update ad status
  const handleStatusChange = async (adId: string, status: AdStatus) => {
    try {
      await adService.updateAdStatus(adId, status);
      setSuccess(`Ad ${status.toLowerCase()} successfully!`);
      fetchAds();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error updating ad status:', error);
      setError(error.message || 'Failed to update ad status. Please try again.');
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingAd(null);
    setShowForm(false);
    setError(null);
  };

  // Filter ads
  const filteredAds = ads.filter(ad => {
    const matchesSearch = searchTerm === '' || 
      (ad.title && ad.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || ad.status === statusFilter;
    const matchesTargeting = targetingFilter === 'ALL' || ad.targetingType === targetingFilter;
    
    return matchesSearch && matchesStatus && matchesTargeting;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ad Management</h2>
          <p className="text-gray-600">Create, manage, and track your advertisements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Create New Ad'}
        </button>
      </div>

      {/* Messages */}
      <Messages success={success} error={error} />

      {/* Ad Form */}
      {showForm && (
        <AdForm
          editingAd={editingAd}
          onSuccess={() => {
            setSuccess(editingAd ? 'Ad updated successfully!' : 'Ad created successfully!');
            resetForm();
            fetchAds();
            setTimeout(() => setSuccess(null), 3000);
          }}
          onError={setError}
          onCancel={resetForm}
        />
      )}

      {/* Ads List */}
      <AdsList
        ads={ads}
        filteredAds={filteredAds}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        targetingFilter={targetingFilter}
        setTargetingFilter={setTargetingFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalAds={totalAds}
        onRefresh={fetchAds}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        showForm={showForm}
        setShowForm={setShowForm}
      />

      {/* Stats Summary */}
      <StatsSummary ads={ads} />

      {/* Help Section */}
      <HelpSection />
    </div>
  );
};

export default AdTab;