// File type configuration
export const FILE_TYPES = {
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
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Gets the icon for a file based on its extension
 */
export const getFileIcon = (fileName: string): string => {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  
  if (FILE_TYPES.pdf.extensions.includes(extension as '.pdf')) return '📄';
  if (FILE_TYPES.excel.extensions.includes(extension as '.xlsx' | '.xls' | '.xlsm')) return '📊';
  if (FILE_TYPES.csv.extensions.includes(extension as '.csv')) return '📋';
  return '📁';
};

/**
 * Gets the type name for a file based on its extension
 */
export const getFileTypeName = (fileName: string): string => {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  
  if (FILE_TYPES.pdf.extensions.includes(extension as '.pdf')) return 'PDF';
  if (FILE_TYPES.excel.extensions.includes(extension as '.xlsx' | '.xls' | '.xlsm')) return 'Excel';
  if (FILE_TYPES.csv.extensions.includes(extension as '.csv')) return 'CSV';
  return 'Document';
};

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Validates a file for upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File ${file.name} is too large. Maximum size is 10MB.` };
  }

  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const allExtensions = [
    ...FILE_TYPES.pdf.extensions,
    ...FILE_TYPES.excel.extensions,
    ...FILE_TYPES.csv.extensions
  ];
  const isValidType = allExtensions.includes(fileExtension as any);

  if (!isValidType) {
    return { valid: false, error: `File ${file.name} has an unsupported format. Supported formats: PDF, Excel, CSV.` };
  }

  return { valid: true };
};
