import type { FundingFormData } from '../../../../interfaces/FundingData';
import { IndustryOptions, TypeOptions } from '../../../../interfaces/FundingData';

interface FundingFormModalProps {
  funding: FundingFormData;
  isEditing: boolean;
  isSuperAdmin: boolean;
  onFundingChange: (funding: FundingFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function FundingFormModal({ funding, isEditing, isSuperAdmin, onFundingChange, onCancel, onSubmit }: FundingFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Funding Opportunity' : 'Add Funding Opportunity'}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Title *</label>
              <input
                value={funding.title}
                onChange={(e) => onFundingChange({ ...funding, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Provider *</label>
              <input
                value={funding.provider}
                onChange={(e) => onFundingChange({ ...funding, provider: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Industry</label>
              <select
                value={funding.industry}
                onChange={(e) => onFundingChange({ ...funding, industry: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {IndustryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Type</label>
              <select
                value={funding.type}
                onChange={(e) => onFundingChange({ ...funding, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {TypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Target Organisation</label>
                <input
                  value={funding.organisation || ''}
                  onChange={(e) => onFundingChange({ ...funding, organisation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 72X, TechCorp (leave empty for all)"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to make visible to all organisations</p>
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={funding.isPublic || false}
                    onChange={(e) => onFundingChange({ ...funding, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Make this funding public (visible to all)</span>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Funding Amount</label>
              <input
                value={funding.fundingAmount}
                onChange={(e) => onFundingChange({ ...funding, fundingAmount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., R50,000 - R100,000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={funding.deadline}
                onChange={(e) => onFundingChange({ ...funding, deadline: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Contact Information</label>
              <input
                value={funding.contactInfo}
                onChange={(e) => onFundingChange({ ...funding, contactInfo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="email@provider.co.za"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Application URL</label>
              <input
                value={funding.applicationUrl}
                onChange={(e) => onFundingChange({ ...funding, applicationUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              value={funding.description}
              onChange={(e) => onFundingChange({ ...funding, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Brief description of the funding opportunity..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Eligibility Criteria</label>
            <textarea
              value={funding.eligibilityCriteria}
              onChange={(e) => onFundingChange({ ...funding, eligibilityCriteria: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="List the eligibility requirements..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={onSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
              {isEditing ? 'Save Changes' : 'Add Funding'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
