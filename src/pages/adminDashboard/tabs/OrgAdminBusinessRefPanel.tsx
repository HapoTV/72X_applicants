// src/pages/adminDashboard/tabs/OrgAdminBusinessRefPanel.tsx
import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, RefreshCw, Save, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import OrganisationService, { type OrganisationDTO } from '../../../services/OrganisationService';

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
      const updated = await OrganisationService.updateBusinessReference(
        org.organisationId,
        newRef.trim()
      );
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <KeyRound className="w-6 h-6 mr-2 text-primary-600" />
          Business Reference
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your organisation's business reference. Only admins can see this.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {/* Org info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Organisation</p>
            <p className="text-lg font-semibold text-gray-900">{org.name}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            org.subscriptionType === 'PREMIUM'
              ? 'bg-amber-100 text-amber-700'
              : org.subscriptionType === 'ESSENTIAL'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {org.subscriptionType}
          </span>
        </div>

        {/* Current reference */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Current Business Reference</p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm">
              {showRef ? org.businessReference : '••••••••••••'}
            </div>
            <button
              onClick={() => setShowRef(!showRef)}
              className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              title={showRef ? 'Hide' : 'Reveal'}
            >
              {showRef ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={fetchOrg}
              className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {org.userCount} employee{org.userCount !== 1 ? 's' : ''} currently using this reference
          </p>
        </div>

        {/* Change reference */}
        {!editing ? (
          <button
            onClick={() => {
              setEditing(true);
              setNewRef('');
              setError('');
              setSuccess('');
            }}
            className="w-full py-2 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 text-sm font-medium"
          >
            Change Business Reference
          </button>
        ) : (
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">New Business Reference</p>
            <input
              type="text"
              value={newRef}
              onChange={e => setNewRef(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter new reference..."
              autoFocus
            />
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
              ⚠️ Changing this will silently update all employee accounts. The old reference will no longer work for new signups.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setNewRef('');
                  setError('');
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !newRef.trim()}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgAdminBusinessRefPanel;
