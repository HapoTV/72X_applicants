// src/pages/adminDashboard/tabs/AdminOrganisationManagement.tsx
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import OrganisationService, { type OrganisationDTO } from '../../../services/OrganisationService';
import CreateOrganisationModal from './components/CreateOrganisationModal';
import { AdminOrganisationManagementView } from './components/AdminOrganisationManagementView';

const SUBSCRIPTION_COLORS: Record<string, string> = {
  START_UP: 'bg-blue-100 text-blue-700',
  ESSENTIAL: 'bg-purple-100 text-purple-700',
  PREMIUM: 'bg-amber-100 text-amber-700',
};

const doesOrganisationMatchSearchQuery = (org: OrganisationDTO, searchQuery: string) => {
  return org.name.toLowerCase().includes(searchQuery.toLowerCase());
};

const formatOrganisationCreatedDate = (createdAt: string) => {
  return new Date(createdAt).toLocaleDateString();
};

const getSubscriptionBadgeClassName = (subscriptionType: string) => {
  return SUBSCRIPTION_COLORS[subscriptionType] || 'bg-gray-100 text-gray-700';
};

const getOrganisationTotals = (organisations: OrganisationDTO[]) => {
  const totalUsers = organisations.reduce((s, o) => s + o.userCount, 0);
  const totalAdmins = organisations.reduce((s, o) => s + o.adminCount, 0);
  return { totalUsers, totalAdmins };
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

  const fetchOrganisations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OrganisationService.getAllOrganisations();
      setOrganisations(data);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin || isCocAdmin) fetchOrganisations();
  }, [fetchOrganisations, isSuperAdmin, isCocAdmin]);

  const handleDelete = useCallback(async (org: OrganisationDTO) => {
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
  }, []);

  const handleSaveSub = useCallback(async (org: OrganisationDTO) => {
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
  }, [editingSubValue]);

  const handleStartEditingSubscription = useCallback((org: OrganisationDTO) => {
    setEditingSubId(org.organisationId);
    setEditingSubValue(org.subscriptionType);
  }, []);

  const handleCancelEditingSubscription = useCallback(() => {
    setEditingSubId(null);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  if (!isSuperAdmin && !isCocAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only Super Admins can access organisation management.</p>
      </div>
    );
  }

  const filtered = useMemo(() => {
    return organisations.filter((o) => doesOrganisationMatchSearchQuery(o, searchQuery));
  }, [organisations, searchQuery]);

  const totals = useMemo(() => {
    return getOrganisationTotals(organisations);
  }, [organisations]);

  return (
    <AdminOrganisationManagementView
      isCocAdmin={isCocAdmin}
      showCreateModal={showCreateModal}
      loading={loading}
      searchQuery={searchQuery}
      organisations={organisations}
      filteredOrganisations={filtered}
      totals={totals}
      deletingId={deletingId}
      editingSubId={editingSubId}
      editingSubValue={editingSubValue}
      savingSubId={savingSubId}
      getSubscriptionBadgeClassName={getSubscriptionBadgeClassName}
      formatOrganisationCreatedDate={formatOrganisationCreatedDate}
      onRefresh={fetchOrganisations}
      onOpenCreateModal={handleOpenCreateModal}
      onCloseCreateModal={() => setShowCreateModal(false)}
      onSearchChange={setSearchQuery}
      onStartEditingSubscription={handleStartEditingSubscription}
      onCancelEditingSubscription={handleCancelEditingSubscription}
      onSaveSubscription={handleSaveSub}
      onDelete={handleDelete}
      onCreated={fetchOrganisations}
      onEditingSubscriptionValueChange={setEditingSubValue}
      CreateOrganisationModal={CreateOrganisationModal}
    />
  );
};

export default AdminOrganisationManagement;
