import React from 'react';
import { useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileIcon } from 'lucide-react';
import { getFileIcon, getFileTypeName, formatFileSize, FILE_TYPES } from '../dataInputHelpers';

interface FileUploadCardProps {
  uploadedFiles: File[];
  uploadingFiles: { [key: string]: boolean };
  uploadProgress: { [key: string]: number };
  uploadStatus: { [key: string]: 'pending' | 'uploading' | 'success' | 'error' };
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileName: string) => void;
  onUploadFile: (file: File) => void;
  onUploadAllFiles: () => void;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({
  uploadedFiles,
  uploadingFiles,
  uploadProgress,
  uploadStatus,
  dragActive,
  onDrag,
  onDrop,
  onFileInput,
  onRemoveFile,
  onUploadFile,
  onUploadAllFiles
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
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
          onChange={onFileInput}
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
              onClick={onUploadAllFiles}
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
                        onClick={() => !isUploading && onRemoveFile(file.name)}
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
                        onClick={() => onUploadFile(file)}
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
  );
};

export default FileUploadCard;
