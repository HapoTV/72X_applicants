// src/pages/adminDashboard/tabs/components/CreateOrganisationModal.tsx
import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import OrganisationService, { type CreateOrganisationRequest } from '../../../../services/OrganisationService';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const SUBSCRIPTION_OPTIONS = [
  { value: 'START_UP', label: 'Start-Up — R99/month' },
  { value: 'ESSENTIAL', label: 'Essential — R299/month' },
  { value: 'PREMIUM', label: 'Premium — R999/month' },
];

const CreateOrganisationModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState<CreateOrganisationRequest>({
    name: '',
    businessReference: '',
    subscriptionType: 'START_UP',
    adminFullName: '',
    adminEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: keyof typeof form, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await OrganisationService.createOrganisation(form);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data || err.message || 'Failed to create organisation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Create Organisation</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Organisation Details</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. Standard Bank"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Reference *</label>
              <input
                type="text"
                value={form.businessReference}
                onChange={e => update('businessReference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. SB-2024-REF"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Employees will use this to sign up. Keep it confidential.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription *</label>
              <select
                value={form.subscriptionType}
                onChange={e => update('subscriptionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                required
              >
                {SUBSCRIPTION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Account</p>
            <p className="text-xs text-gray-500">The admin will receive an email invite to set their own password.</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Full Name *</label>
              <input
                type="text"
                value={form.adminFullName}
                onChange={e => update('adminFullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email *</label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={e => update('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="admin@organisation.com"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Organisation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganisationModal;
