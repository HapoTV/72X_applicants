import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

export interface FormData {
  revenue: string;
  expenses: string;
  customers: string;
  newCustomers: string;
  retentionRate: string;
  avgCustomerValue: string;
  period: string;
  date: string;
}

interface ManualDataEntryFormProps {
  activeTab: 'financial' | 'customers';
  formData: FormData;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ManualDataEntryForm: React.FC<ManualDataEntryFormProps> = ({
  activeTab,
  formData,
  isLoading,
  onInputChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {activeTab === 'financial' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue (R)
              </label>
              <input
                type="number"
                value={formData.revenue}
                onChange={(e) => onInputChange('revenue', e.target.value)}
                placeholder="Enter monthly revenue"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expenses (R)
              </label>
              <input
                type="number"
                value={formData.expenses}
                onChange={(e) => onInputChange('expenses', e.target.value)}
                placeholder="Enter monthly expenses"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) => onInputChange('period', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => onInputChange('date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Tip: Upload Documents</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You can also upload financial documents (PDF, Excel, CSV) on the Upload tab. 
                  Our AI will automatically extract the data for you!
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              isLoading 
                ? 'bg-primary-400 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Save Financial Data</span>
              </>
            )}
          </button>
        </>
      )}

      {activeTab === 'customers' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Customers
              </label>
              <input
                type="number"
                value={formData.customers}
                onChange={(e) => onInputChange('customers', e.target.value)}
                placeholder="Enter total customer count"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Customers (This Period)
              </label>
              <input
                type="number"
                value={formData.newCustomers}
                onChange={(e) => onInputChange('newCustomers', e.target.value)}
                placeholder="Enter new customer count"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Retention Rate (%)
              </label>
              <input
                type="number"
                value={formData.retentionRate}
                onChange={(e) => onInputChange('retentionRate', e.target.value)}
                placeholder="Enter retention rate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Customer Value (R)
              </label>
              <input
                type="number"
                value={formData.avgCustomerValue}
                onChange={(e) => onInputChange('avgCustomerValue', e.target.value)}
                placeholder="Enter average customer value"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              isLoading 
                ? 'bg-primary-400 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Save Customer Data</span>
              </>
            )}
          </button>
        </>
      )}
    </form>
  );
};

export default ManualDataEntryForm;
