// src/pages/adminDashboard/tabs/components/AdsList.tsx
import React from 'react';
import { AdStatus, AdTargetingType } from '../../../../interfaces/AdData';
import type { AdDTO } from '../../../../interfaces/AdData';
import {RefreshCw, Plus, Image} from 'lucide-react';
import AdTable from './AdTable';
import Filters from './Filters';
import Pagination from './Pagination';

interface AdsListProps {
  ads: AdDTO[];
  filteredAds: AdDTO[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: AdStatus | 'ALL';
  setStatusFilter: (filter: AdStatus | 'ALL') => void;
  targetingFilter: AdTargetingType | 'ALL';
  setTargetingFilter: (filter: AdTargetingType | 'ALL') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalAds: number;
  onRefresh: () => void;
  onEdit: (ad: AdDTO) => void;
  onDelete: (adId: string) => void;
  onStatusChange: (adId: string, status: AdStatus) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const AdsList: React.FC<AdsListProps> = ({
  filteredAds,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  targetingFilter,
  setTargetingFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalAds,
  onRefresh,
  onEdit,
  onDelete,
  onStatusChange,
  showForm,
  setShowForm
}) => {
  const totalPages = Math.ceil(totalAds / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAds.length);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="animate-spin mx-auto text-primary-500" size={32} />
        <p className="mt-2 text-gray-600">Loading ads...</p>
      </div>
    );
  }

  if (filteredAds.length === 0) {
    return (
      <div className="p-12 text-center">
        <Image className="mx-auto text-gray-400" size={48} />
        <h3 className="mt-4 text-lg font-semibold text-gray-700">No ads found</h3>
        <p className="text-gray-500 mt-1">
          {searchTerm || statusFilter !== 'ALL' || targetingFilter !== 'ALL'
            ? 'Try adjusting your filters or search terms'
            : 'Create your first ad to get started'}
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} className="inline mr-2" />
            Create Your First Ad
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Filters */}
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        targetingFilter={targetingFilter}
        setTargetingFilter={setTargetingFilter}
        onRefresh={onRefresh}
        loading={loading}
      />

      {/* Ads Table */}
      <AdTable
        ads={filteredAds.slice(startIndex, endIndex)}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalAds={totalAds}
        filteredAdsLength={filteredAds.length}
        loading={loading}
      />
    </div>
  );
};

export default AdsList;