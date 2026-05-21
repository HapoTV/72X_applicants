import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { dataInputService } from '../services/DataInputService';
import { validateFile } from './dataInputHelpers';
import FileUploadCard from './components/FileUploadCard';
import ManualDataEntryForm from './components/ManualDataEntryForm';
import type { FormData } from './components/ManualDataEntryForm';

const DataInput: React.FC = () => {
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
  
  const [formData, setFormData] = useState<FormData>({
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
    { id: 'upload', name: 'File Upload', icon: DollarSign },
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
      const validation = validateFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid file');
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
          period: formData.period as 'monthly' | 'quarterly' | 'yearly'
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
          {(activeTab === 'financial' || activeTab === 'customers') && (
            <ManualDataEntryForm
              activeTab={activeTab}
              formData={formData}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          )}

          {activeTab === 'upload' && (
            <FileUploadCard
              uploadedFiles={uploadedFiles}
              uploadingFiles={uploadingFiles}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              onRemoveFile={removeFile}
              onUploadFile={uploadFile}
              onUploadAllFiles={uploadAllFiles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInput;