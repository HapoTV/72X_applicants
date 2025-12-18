import React, { useState, useEffect, useRef } from 'react';
import { Upload, DollarSign, TrendingUp, FileText, X, CheckCircle, AlertCircle, FileIcon } from 'lucide-react';
import { dataInputService } from '../services/DataInputService';
import UpgradePage from '../components/UpgradePage';

type PackageType = 'startup' | 'essential' | 'premium';

// File type configuration
const FILE_TYPES = {
  pdf: {
    name: 'PDF',
    icon: '📄',
    extensions: ['.pdf'],
    accept: '.pdf'
  },
  excel: {
    name: 'Excel',
    icon: '📊',
    extensions: ['.xlsx', '.xls', '.xlsm'],
    accept: '.xlsx,.xls,.xlsm'
  },
  csv: {
    name: 'CSV',
    icon: '📋',
    extensions: ['.csv'],
    accept: '.csv'
  }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'pending' | 'uploading' | 'success' | 'error'}>({});
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    setSuccessMessage('');
    setErrorMessage('');
  };

  // ==================== FILE UPLOAD HANDLERS ====================

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    
    files.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = Object.values(FILE_TYPES).some(type => 
        type.extensions.includes(fileExtension)
      );
      
      if (!isValidType) {
        setErrorMessage(`File ${file.name} has an unsupported format. Supported formats: PDF, Excel, CSV.`);
        return;
      }
      
      validFiles.push(file);
      setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }));
    });
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      setErrorMessage('');
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadingFiles(prev => {
      const newState = { ...prev };
      delete newState[fileName];
      return newState;
    });
    setUploadProgress(prev => {
      const newState = { ...prev };
      delete newState[fileName];
      return newState;
    });
    setUploadStatus(prev => {
      const newState = { ...prev };
      delete newState[fileName];
      return newState;
    });
  };

  const uploadFile = async (file: File) => {
  const fileName = file.name;
  
  setUploadingFiles(prev => ({ ...prev, [fileName]: true }));
  setUploadStatus(prev => ({ ...prev, [fileName]: 'uploading' }));
  
  // Simulate upload progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 10;
    if (progress > 90) clearInterval(progressInterval);
    setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
  }, 200);
  
  try {
    const metadata = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadDate: new Date().toISOString()
    };
    
    // Use the upload method (without processing first)
    const response = await dataInputService.uploadFinancialDocument(file, metadata);
    
    clearInterval(progressInterval);
    setUploadProgress(prev => ({ ...prev, [fileName]: 100 }));
    
    if (response.success) {
      setUploadStatus(prev => ({ ...prev, [fileName]: 'success' }));
      setSuccessMessage(`File ${file.name} uploaded successfully!`);
      
      // If you want to process the file, call the process endpoint
      if (response.document?.id) {
        // Start processing after successful upload
        setTimeout(async () => {
          try {
            const processResponse = await dataInputService.uploadAndProcessFinancialDocument(file, metadata);
            if (processResponse.success) {
              setSuccessMessage(`File ${file.name} processed successfully!`);
              
              // Try to extract data if available
              const extractedData = processResponse.document?.extractedData;
              if (extractedData) {
                setFormData(prev => ({
                  ...prev,
                  revenue: extractedData.revenue?.toString() || prev.revenue,
                  expenses: extractedData.expenses?.toString() || prev.expenses,
                  customers: extractedData.customers?.toString() || prev.customers,
                  period: extractedData.period || prev.period
                }));
                
                if (extractedData.revenue || extractedData.expenses) {
                  setActiveTab('financial');
                } else if (extractedData.customers) {
                  setActiveTab('customers');
                }
              }
            }
          } catch (error) {
            console.error('Error processing file:', error);
          }
        }, 1000);
      }
    } else {
      setUploadStatus(prev => ({ ...prev, [fileName]: 'error' }));
      setErrorMessage(`Failed to upload ${file.name}: ${response.message}`);
    }
  } catch (error) {
    clearInterval(progressInterval);
    setUploadStatus(prev => ({ ...prev, [fileName]: 'error' }));
    setErrorMessage(`Error uploading ${file.name}`);
    console.error('Upload error:', error);
  } finally {
    setUploadingFiles(prev => ({ ...prev, [fileName]: false }));
  }
};

  const uploadAllFiles = async () => {
    if (uploadedFiles.length === 0) {
      setErrorMessage('No files selected');
      return;
    }
    
    for (const file of uploadedFiles) {
      if (uploadStatus[file.name] !== 'success') {
        await uploadFile(file);
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    
    if (FILE_TYPES.pdf.extensions.includes(extension)) return '📄';
    if (FILE_TYPES.excel.extensions.includes(extension)) return '📊';
    if (FILE_TYPES.csv.extensions.includes(extension)) return '📋';
    return '📁';
  };

  const getFileTypeName = (fileName: string) => {
    const extension = '.' + fileName.split('').pop()?.toLowerCase();
    
    if (FILE_TYPES.pdf.extensions.includes(extension)) return 'PDF';
    if (FILE_TYPES.excel.extensions.includes(extension)) return 'Excel';
    if (FILE_TYPES.csv.extensions.includes(extension)) return 'CSV';
    return 'Document';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // ==================== DATA SUBMISSION HANDLERS ====================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const userId = dataInputService.getCurrentUserId();
      
      if (activeTab === 'financial') {
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
          setFormData(prev => ({
            ...prev,
            revenue: '',
            expenses: ''
          }));
        } else {
          setErrorMessage(result.message || 'Failed to save financial data');
        }

      } else if (activeTab === 'customers') {
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
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
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
            </form>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {dragActive ? 'Drop your files here' : 'Upload Financial Documents'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.xlsm,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, Excel, CSV (Max 10MB)
                </p>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Selected Files ({uploadedFiles.length})
                    </h4>
                    <button
                      type="button"
                      onClick={uploadAllFiles}
                      disabled={Object.values(uploadingFiles).some(v => v)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Upload All Files
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => {
                      const status = uploadStatus[file.name];
                      const progress = uploadProgress[file.name] || 0;
                      const isUploading = uploadingFiles[file.name];
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getFileIcon(file.name)}</span>
                              <div>
                                <p className="font-medium text-gray-900 truncate max-w-xs">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {getFileTypeName(file.name)} • {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {/* Status Indicator */}
                              {status === 'uploading' && (
                                <div className="w-24">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary-500 transition-all duration-300"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1 text-center">
                                    {progress}%
                                  </p>
                                </div>
                              )}
                              
                              {status === 'success' && (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="w-5 h-5 mr-1" />
                                  <span className="text-sm">Uploaded</span>
                                </div>
                              )}
                              
                              {status === 'error' && (
                                <div className="flex items-center text-red-600">
                                  <AlertCircle className="w-5 h-5 mr-1" />
                                  <span className="text-sm">Failed</span>
                                </div>
                              )}
                              
                              <button
                                type="button"
                                onClick={() => !isUploading && removeFile(file.name)}
                                disabled={isUploading}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Upload Button for Individual File */}
                          {status === 'pending' && (
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => uploadFile(file)}
                                className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                              >
                                Upload
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Supported File Types */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Supported File Types:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(FILE_TYPES).map(([key, type]) => (
                    <div key={key} className="bg-white p-3 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{type.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{type.name} Documents</p>
                          <p className="text-xs text-gray-600">
                            {type.extensions.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                  <div className="flex items-start space-x-2">
                    <FileIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Automatic Data Extraction</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Our AI will automatically extract financial data (revenue, expenses, customers) 
                        from your uploaded documents and pre-fill the forms for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recommended Documents:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Financial statements (Balance sheets, Income statements)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Bank statements (CSV exports from your bank)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Sales reports (Monthly/Quarterly sales data)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Customer databases (CSV exports from CRM)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Expense reports (Credit card statements, receipts)
                  </li>
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