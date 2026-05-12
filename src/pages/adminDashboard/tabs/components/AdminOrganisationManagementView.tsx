import React from 'react';
import { Building2, Users, Search, Plus, Trash2, Shield, RefreshCw, Edit2, Check, X } from 'lucide-react';
import type { OrganisationDTO } from '../../../../services/OrganisationService';

type AdminOrganisationManagementViewProps = {
  isCocAdmin: boolean;
  showCreateModal: boolean;
  loading: boolean;
  searchQuery: string;
  organisations: OrganisationDTO[];
  filteredOrganisations: OrganisationDTO[];
  totals: { totalUsers: number; totalAdmins: number };
  deletingId: string | null;
  editingSubId: string | null;
  editingSubValue: string;
  savingSubId: string | null;
  getSubscriptionBadgeClassName: (subscriptionType: string) => string;
  formatOrganisationCreatedDate: (createdAt: string) => string;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onSearchChange: (value: string) => void;
  onStartEditingSubscription: (org: OrganisationDTO) => void;
  onCancelEditingSubscription: () => void;
  onSaveSubscription: (org: OrganisationDTO) => void;
  onDelete: (org: OrganisationDTO) => void;
  onCreated: () => void;
  onEditingSubscriptionValueChange: (value: string) => void;
  CreateOrganisationModal: React.ComponentType<{ onClose: () => void; onCreated: () => void }>;
};

export function AdminOrganisationManagementView({
  isCocAdmin,
  showCreateModal,
  loading,
  searchQuery,
  organisations,
  filteredOrganisations,
  totals,
  deletingId,
  editingSubId,
  editingSubValue,
  savingSubId,
  getSubscriptionBadgeClassName,
  formatOrganisationCreatedDate,
  onRefresh,
  onOpenCreateModal,
  onCloseCreateModal,
  onSearchChange,
  onStartEditingSubscription,
  onCancelEditingSubscription,
  onSaveSubscription,
  onDelete,
  onCreated,
  onEditingSubscriptionValueChange,
  CreateOrganisationModal,
}: AdminOrganisationManagementViewProps) {
  return (
    <div className="space-y-6">
      {showCreateModal && <CreateOrganisationModal onClose={onCloseCreateModal} onCreated={onCreated} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-primary-600" />
            Organisation Management
          </h1>
          <p className="text-gray-600 mt-1">{isCocAdmin ? 'Manage organisations you have created' : 'Create and manage organisations and their admins'}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={onRefresh} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={onOpenCreateModal} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" /><span>Add Organisation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-gray-600 text-sm">Total Organisations</p><p className="text-2xl font-bold text-gray-900">{organisations.length}</p></div>
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-gray-600 text-sm">Total Users</p><p className="text-2xl font-bold text-gray-900">{totals.totalUsers}</p></div>
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-gray-600 text-sm">Total Admins</p><p className="text-2xl font-bold text-gray-900">{totals.totalAdmins}</p></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search organisations..." value={searchQuery} onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading organisations...</p>
        </div>
      ) : filteredOrganisations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganisations.map(org => (
                <tr key={org.organisationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{org.name}</p>
                        <p className="text-xs text-gray-400 font-mono">Ref: {org.businessReference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingSubId === org.organisationId ? (
                      <div className="flex items-center space-x-2">
                        <select value={editingSubValue} onChange={e => onEditingSubscriptionValueChange(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
                          <option value="START_UP">START_UP</option>
                          <option value="ESSENTIAL">ESSENTIAL</option>
                          <option value="PREMIUM">PREMIUM</option>
                        </select>
                        <button onClick={() => onSaveSubscription(org)} disabled={savingSubId === org.organisationId} className="text-green-600 hover:text-green-700 disabled:opacity-50"><Check className="w-4 h-4" /></button>
                        <button onClick={onCancelEditingSubscription} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionBadgeClassName(org.subscriptionType)}`}>{org.subscriptionType}</span>
                        <button onClick={() => onStartEditingSubscription(org)} className="text-gray-300 hover:text-gray-500"><Edit2 className="w-3 h-3" /></button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center"><Users className="w-4 h-4 text-gray-400 mr-2" /><span>{org.userCount}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center"><Shield className="w-4 h-4 text-gray-400 mr-2" /><span>{org.adminCount}</span></div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatOrganisationCreatedDate(org.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDelete(org)} disabled={deletingId === org.organisationId} className="text-gray-400 hover:text-red-600 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organisations found</h3>
          <p className="text-gray-600 mb-4">{searchQuery ? 'Try a different search term' : 'Start by creating your first organisation'}</p>
          {!searchQuery && (
            <button onClick={onOpenCreateModal} className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Plus className="w-4 h-4" /><span>Add Organisation</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
