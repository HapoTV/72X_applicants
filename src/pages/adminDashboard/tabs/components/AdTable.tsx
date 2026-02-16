// src/pages/adminDashboard/tabs/components/AdTable.tsx
import React from 'react';
import { AdStatus, MediaType } from '../../../../interfaces/AdData';
import type { AdDTO } from '../../../../interfaces/AdData';
import { Edit, Trash2, Eye, EyeOff, BarChart3, Image } from 'lucide-react';

interface AdTableProps {
  ads: AdDTO[];
  onEdit: (ad: AdDTO) => void;
  onDelete: (adId: string) => void;
  onStatusChange: (adId: string, status: AdStatus) => void;
}

const AdTable: React.FC<AdTableProps> = ({ ads, onEdit, onDelete, onStatusChange }) => {
  // Helper functions
  const formatTargetingType = (type: string) => {
    switch (type) {
      case 'ALL_USERS': return 'All Users';
      case 'SPECIFIC_INDUSTRY': return 'Specific Industry';
      case 'BUSINESS_REFERENCE': return 'Business Reference';
      case 'USER_ROLE': return 'User Role';
      case 'USER_PACKAGE': return 'User Package';
      default: return type;
    }
  };

  const getStatusColor = (status: AdStatus) => {
    switch (status) {
      case AdStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case AdStatus.PAUSED: return 'bg-yellow-100 text-yellow-800';
      case AdStatus.EXPIRED: return 'bg-red-100 text-red-800';
      case AdStatus.DRAFT: return 'bg-gray-100 text-gray-800';
      case AdStatus.ARCHIVED: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (!impressions || impressions === 0) return 0;
    return (clicks / impressions) * 100;
  };

  const formatCurrency = (amount: number | undefined) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(safeAmount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Targeting
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ads.map((ad) => {
            const totalClicks = ad.totalClicks || 0;
            const totalImpressions = ad.totalImpressions || 0;
            const ctr = calculateCTR(totalClicks, totalImpressions);
            
            return (
              <tr key={ad.adId} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {ad.bannerUrl ? (
                        <img
                          src={ad.bannerUrl}
                          alt={ad.title || 'Ad banner'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const placeholderSvg =
                              '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">' +
                              '<rect width="100%" height="100%" fill="#E5E7EB"/>' +
                              '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280" font-family="Arial, Helvetica, sans-serif" font-size="14">Ad Image</text>' +
                              '</svg>';
                            (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg)}`;
                            (e.target as HTMLImageElement).className = 'w-full h-full object-cover bg-gray-100';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Image className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{ad.title || 'Untitled Ad'}</h4>
                      {ad.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{ad.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {ad.mediaType === MediaType.IMAGE ? 'Image' : 'Video'}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                      {ad.status ? ad.status.charAt(0) + ad.status.slice(1).toLowerCase() : 'Unknown'}
                    </span>
                    <div className="flex gap-1">
                      {ad.status === AdStatus.ACTIVE ? (
                        <button
                          onClick={() => onStatusChange(ad.adId, AdStatus.PAUSED)}
                          className="text-xs text-yellow-600 hover:text-yellow-800"
                          title="Pause ad"
                        >
                          <EyeOff size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onStatusChange(ad.adId, AdStatus.ACTIVE)}
                          className="text-xs text-green-600 hover:text-green-800"
                          title="Activate ad"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-900">
                      {formatTargetingType(ad.targetingType)}
                    </span>
                    {ad.targetValue && (
                      <p className="text-xs text-gray-500 truncate max-w-[150px]" title={ad.targetValue}>
                        {ad.targetValue}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {totalClicks.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">clicks</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {totalImpressions.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">impressions</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <BarChart3 className="inline mr-1" size={12} />
                      CTR: {ctr.toFixed(2)}%
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(ad.budget)}
                    </div>
                    {ad.costPerClick && (
                      <div className="text-xs text-gray-500">
                        CPC: {formatCurrency(ad.costPerClick)}
                      </div>
                    )}
                    {ad.costPerImpression && (
                      <div className="text-xs text-gray-500">
                        CPM: {formatCurrency((ad.costPerImpression || 0) * 1000)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(ad)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit ad"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(ad.adId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete ad"
                    >
                      <Trash2 size={16} />
                    </button>
                    <a
                      href={ad.clickUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Preview ad"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdTable;