// src/pages/adminDashboard/tabs/AdminOrganisationManagement.tsx
import React, { useState, useEffect } from 'react';
import { Building2, Users, Search, Plus, Trash2, Shield, RefreshCw, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import OrganisationService, { type OrganisationDTO } from '../../../services/OrganisationService';
import CreateOrganisationModal from './components/CreateOrganisationModal';

const SUBSCRIPTION_COLORS: Record<string, string> = {
  START_UP: 'bg-blue-100 text-blue-700',
  ESSENTIAL: 'bg-purple-100 text-purple-700',
  PREMIUM: 'bg-amber-100 text-amber-700',
};

const AdminOrganisationManagement: React.FC = () => {
  const { isSuperAdmin, isCocAdmin } = useAuth();
  const [organisations, setOrganisations] = useState<OrganisationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingSubValue, setEditingSubValue] = useState('');
  const [savingSubId, setSavingSubId] = useState<string | null>(null);

  useEffect(() => {
    if (isSuperAdmin || isCocAdmin) fetchOrganisations();
  }, [isSuperAdmin, isCocAdmin]);

  const fetchOrganisations = async () => {
    try {
      setLoading(true);
      const data = await OrganisationService.getAllOrganisations();
      setOrganisations(data);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (org: OrganisationDTO) => {
    if (!window.confirm(`Delete "${org.name}"?\n\nThis will permanently delete the organisation and all ${org.userCount + org.adminCount} associated accounts.`)) return;
    setDeletingId(org.organisationId);
    try {
      await OrganisationService.deleteOrganisation(org.organisationId);
      setOrganisations(prev => prev.filter(o => o.organisationId !== org.organisationId));
    } catch (error: any) {
      alert(error.response?.data || 'Failed to delete organisation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveSub = async (org: OrganisationDTO) => {
    setSavingSubId(org.organisationId);
    try {
      const updated = await OrganisationService.updateSubscription(org.organisationId, editingSubValue);
      setOrganisations(prev => prev.map(o => o.organisationId === org.organisationId ? updated : o));
      setEditingSubId(null);
    } catch (error: any) {
      alert(error.response?.data || 'Failed to update subscription');
    } finally {
      setSavingSubId(null);
    }
  };

  if (!isSuperAdmin && !isCocAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only Super Admins can access organisation management.</p>
      </div>
    );
  }

  const filtered = organisations.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {showCreateModal && <CreateOrganisationModal onClose={() => setShowCreateModal(false)} onCreated={fetchOrganisations} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-primary-600" />
            Organisation Management
          </h1>
          <p className="text-gray-600 mt-1">{isCocAdmin ? 'Manage organisations you have created' : 'Create and manage organisations and their admins'}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={fetchOrganisations} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" /><span>Add Organisation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-gray-600 text-sm">Total Organisations</p><p className="text-2xl font-bold text-gray-900">{organisations.length}</p></div>
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-gray-600 text-sm">Total Users</p><p className="text-2xl font-bold text-gray-900">{organisations.reduce((s, o) => s + o.userCount, 0)}</p></div>
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-gray-600 text-sm">Total Admins</p><p className="text-2xl font-bold text-gray-900">{organisations.reduce((s, o) => s + o.adminCount, 0)}</p></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search organisations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading organisations...</p>
        </div>
      ) : filtered.length > 0 ? (
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
              {filtered.map(org => (
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
                        <select value={editingSubValue} onChange={e => setEditingSubValue(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
                          <option value="START_UP">START_UP</option>
                          <option value="ESSENTIAL">ESSENTIAL</option>
                          <option value="PREMIUM">PREMIUM</option>
                        </select>
                        <button onClick={() => handleSaveSub(org)} disabled={savingSubId === org.organisationId} className="text-green-600 hover:text-green-700 disabled:opacity-50"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingSubId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${SUBSCRIPTION_COLORS[org.subscriptionType] || 'bg-gray-100 text-gray-700'}`}>{org.subscriptionType}</span>
                        <button onClick={() => { setEditingSubId(org.organisationId); setEditingSubValue(org.subscriptionType); }} className="text-gray-300 hover:text-gray-500"><Edit2 className="w-3 h-3" /></button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center"><Users className="w-4 h-4 text-gray-400 mr-2" /><span>{org.userCount}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center"><Shield className="w-4 h-4 text-gray-400 mr-2" /><span>{org.adminCount}</span></div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(org)} disabled={deletingId === org.organisationId} className="text-gray-400 hover:text-red-600 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
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
            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Plus className="w-4 h-4" /><span>Add Organisation</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrganisationManagement;
