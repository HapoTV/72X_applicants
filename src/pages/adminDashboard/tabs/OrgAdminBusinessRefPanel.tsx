// src/pages/adminDashboard/tabs/OrgAdminBusinessRefPanel.tsx
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import OrganisationService, { type OrganisationDTO } from '../../../services/OrganisationService';
import { OrgAdminBusinessRefPanelView } from './components/OrgAdminBusinessRefPanelView';

const OrgAdminBusinessRefPanel: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [org, setOrg] = useState<OrganisationDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRef, setShowRef] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newRef, setNewRef] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrg();
  }, []);

  const fetchOrg = async () => {
    try {
      setLoading(true);
      const data = await OrganisationService.getMyOrganisation();
      setOrg(data);
    } catch (err) {
      console.error('Error fetching organisation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!org || !newRef.trim()) return;
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const updated = await OrganisationService.updateBusinessReference(org.organisationId, newRef.trim());
      setOrg(updated);
      setEditing(false);
      setNewRef('');
      setShowRef(false);
      setSuccess('Business reference updated. All employee accounts have been updated silently.');
    } catch (err: any) {
      setError(err.response?.data || err.message || 'Failed to update reference');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin || isSuperAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only organisation admins can manage the business reference.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">No organisation found for your account.</p>
      </div>
    );
  }

  return (
    <OrgAdminBusinessRefPanelView
      org={org}
      success={success}
      error={error}
      showRef={showRef}
      editing={editing}
      newRef={newRef}
      saving={saving}
      onToggleShowRef={() => setShowRef(!showRef)}
      onRefresh={fetchOrg}
      onStartEdit={() => {
        setEditing(true);
        setNewRef('');
        setError('');
        setSuccess('');
      }}
      onCancelEdit={() => {
        setEditing(false);
        setNewRef('');
        setError('');
      }}
      onNewRefChange={setNewRef}
      onSave={handleSave}
    />
  );
};

export default OrgAdminBusinessRefPanel;
