import React from 'react';

interface NewLearningData {
    title: string;
    type: 'ARTICLE' | 'VIDEO' | 'DOCUMENT';
    resourceUrl: string;
    description: string;
    file?: File;
    targetOrganisation?: string;
    isPublic?: boolean;
    showAllOrganisations?: boolean;
}

interface LearningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    uploading: boolean;
    uploadProgress: number;
    newLearning: NewLearningData;
    onNewLearningChange: (updates: Partial<NewLearningData>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sectionTitle: string;
    isSuperAdmin: boolean;
    organisations: string[];
    getFileSize: (bytes: number) => string;
}

export const LearningModal: React.FC<LearningModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    uploading,
    uploadProgress,
    newLearning,
    onNewLearningChange,
    onFileChange,
    sectionTitle,
    isSuperAdmin,
    organisations,
    getFileSize
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add Content to {sectionTitle}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input 
                            value={newLearning.title} 
                            onChange={e => onNewLearningChange({ title: e.target.value })} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter title"
                            disabled={uploading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select 
                            value={newLearning.type} 
                            onChange={e => onNewLearningChange({ 
                                type: e.target.value as 'ARTICLE' | 'VIDEO' | 'DOCUMENT', 
                                file: undefined
                            })} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={uploading}
                        >
                            <option value="ARTICLE">Article</option>
                            <option value="VIDEO">Video</option>
                            <option value="DOCUMENT">Document</option>
                        </select>
                    </div>
                    
                    {/* Organisation targeting for super admin */}
                    {isSuperAdmin && (
                        <div className="space-y-3 border-t border-gray-200 pt-3">
                            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                            
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showAllOrganisations"
                                    checked={newLearning.showAllOrganisations}
                                    onChange={(e) => onNewLearningChange({
                                        showAllOrganisations: e.target.checked,
                                        targetOrganisation: e.target.checked ? '' : newLearning.targetOrganisation,
                                        isPublic: e.target.checked ? true : false
                                    })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    disabled={uploading}
                                />
                                <label htmlFor="showAllOrganisations" className="text-sm text-gray-700">
                                    Make this material public (visible to all organisations)
                                </label>
                            </div>

                            {!newLearning.showAllOrganisations && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Specific Organisation
                                    </label>
                                    <select
                                        value={newLearning.targetOrganisation || ''}
                                        onChange={(e) => onNewLearningChange({
                                            targetOrganisation: e.target.value,
                                            isPublic: false
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        disabled={uploading}
                                    >
                                        <option value="">Select an organisation (optional)</option>
                                        {organisations.map(org => (
                                            <option key={org} value={org}>{org}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave empty to make it visible only to your organisation
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* File Upload Section - Always show since we removed Resource URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                            <input 
                                type="file" 
                                onChange={onFileChange}
                                className="w-full"
                                accept={newLearning.type === 'VIDEO' ? '.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv' : '.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx'}
                                disabled={uploading}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Max size: {newLearning.type === 'VIDEO' ? '500MB' : '50MB'}
                            </p>
                        </div>
                        {newLearning.file && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-xs text-green-800 truncate" title={newLearning.file.name}>
                                    <strong>Selected:</strong> {newLearning.file.name} ({getFileSize(newLearning.file.size)})
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            value={newLearning.description} 
                            onChange={e => onNewLearningChange({ description: e.target.value })} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={3}
                            placeholder="Brief description of the learning material..."
                            disabled={uploading}
                        />
                    </div>

                    {/* Upload Progress */}
                    {uploading && uploadProgress > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                                    style={{width: `${uploadProgress}%`}}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onSubmit}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                            disabled={uploading}
                        >
                            {uploading ? `Uploading (${uploadProgress}%)...` : 'Add Material'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};