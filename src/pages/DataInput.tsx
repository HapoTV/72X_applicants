// src/pages/DataInput.tsx
import React, { useState, useEffect } from 'react';
import { Upload, DollarSign, TrendingUp } from 'lucide-react';
import { dataInputService } from '../services/DataInputService';
import UpgradePage from '../components/UpgradePage';

type PackageType = 'startup' | 'essential' | 'premium';

const DataInput: React.FC = () => {
  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;
  const hasAccess = userPackage === 'essential' || userPackage === 'premium';

  if (!hasAccess) {
    return (
      <UpgradePage
        featureName="Data Input"
        featureIcon={Upload}
        packageType="essential"
        description="Input and manage your business data to track performance metrics and generate insights."
        benefits={[
          "Financial data entry and tracking",
          "Customer data management",
          "Sales and revenue input tools",
          "Automated data validation",
          "Historical data storage",
          "Export data for analysis"
        ]}
      />
    );
  }

  const [activeTab, setActiveTab] = useState('financial');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    revenue: '',
    expenses: '',
    customers: '',
    newCustomers: '',
    retentionRate: '',
    avgCustomerValue: '',
    period: 'monthly',
    date: new Date().toISOString().split('T')[0],
  });

  const tabs = [
    { id: 'financial', name: 'Financial Data', icon: DollarSign },
    { id: 'customers', name: 'Customer Data', icon: TrendingUp },
    { id: 'upload', name: 'File Upload', icon: Upload },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const userId = dataInputService.getCurrentUserId();
      
      if (activeTab === 'financial') {
        // Validate and save financial data
        const validation = await dataInputService.validateFinancialData({
          revenue: parseFloat(formData.revenue),
          expenses: parseFloat(formData.expenses),
          period: formData.period
        });
        
        if (!validation.isValid) {
          setErrorMessage(validation.errors[0]?.message || 'Invalid financial data');
          setIsLoading(false);
          return;
        }

        const financialData = dataInputService.transformToFinancialData(formData, userId);
        const result = await dataInputService.saveFinancialData(financialData);
        
        if (result.success) {
          setSuccessMessage('Financial data saved successfully! Analytics will be updated.');
          // Reset form
          setFormData(prev => ({
            ...prev,
            revenue: '',
            expenses: ''
          }));
        } else {
          setErrorMessage(result.message || 'Failed to save financial data');
        }

      } else if (activeTab === 'customers') {
        // Validate and save customer data
        const validation = await dataInputService.validateCustomerData({
          totalCustomers: parseInt(formData.customers),
          newCustomers: parseInt(formData.newCustomers),
          retentionRate: parseFloat(formData.retentionRate),
          avgCustomerValue: parseFloat(formData.avgCustomerValue)
        });
        
        if (!validation.isValid) {
          setErrorMessage(validation.errors[0]?.message || 'Invalid customer data');
          setIsLoading(false);
          return;
        }

        const customerData = dataInputService.transformToCustomerData(formData, userId);
        const result = await dataInputService.saveCustomerData(customerData);
        
        if (result.success) {
          setSuccessMessage('Customer data saved successfully! Analytics will be updated.');
          // Reset form
          setFormData(prev => ({
            ...prev,
            customers: '',
            newCustomers: '',
            retentionRate: '',
            avgCustomerValue: ''
          }));
        } else {
          setErrorMessage(result.message || 'Failed to save customer data');
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage('An error occurred while saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Input</h1>
        <p className="text-gray-600">Upload your business data for AI analysis and insights</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <i className="bx bxs-check-circle text-green-600 text-xl"></i>
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <i className="bx bxs-error-circle text-red-600 text-xl"></i>
            <span className="text-red-800">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'financial' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenue (R)
                  </label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
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
                    onChange={(e) => handleInputChange('expenses', e.target.value)}
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
                    onChange={(e) => handleInputChange('period', e.target.value)}
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
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="bx bxs-info-circle text-blue-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-blue-900">Data Privacy</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your financial data is encrypted and stored securely. It's only used to generate personalized insights and recommendations.
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
                    <i className="bx bx-loader-alt bx-spin text-lg"></i>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-save text-lg"></i>
                    <span>Save Financial Data</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'customers' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Customers
                  </label>
                  <input
                    type="number"
                    value={formData.customers}
                    onChange={(e) => handleInputChange('customers', e.target.value)}
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
                    onChange={(e) => handleInputChange('newCustomers', e.target.value)}
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
                    onChange={(e) => handleInputChange('retentionRate', e.target.value)}
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
                    onChange={(e) => handleInputChange('avgCustomerValue', e.target.value)}
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
                    <i className="bx bx-loader-alt bx-spin text-lg"></i>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-save text-lg"></i>
                    <span>Save Customer Data</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Financial Documents</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Choose Files
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: CSV, Excel, PDF (Max 10MB)
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Supported File Types:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Financial statements (PDF, Excel)</li>
                  <li>• Bank statements (CSV, PDF)</li>
                  <li>• Sales reports (CSV, Excel)</li>
                  <li>• Customer data (CSV, Excel)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInput;