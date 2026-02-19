import React from 'react';
import { Building2, Globe } from 'lucide-react';

interface LearningItem {
    id: string;
    title: string;
    type: 'ARTICLE' | 'VIDEO' | 'DOCUMENT';
    category: string;
    resourceUrl?: string;
    fileName?: string;
    fileSize?: string;
    updated?: string;
    createdBy: string;
    createdByOrganisation?: string;
    targetOrganisation?: string;
    isPublic?: boolean;
    description?: string;
}

interface LearningTableProps {
    items: LearningItem[];
    loading: boolean;
    sectionTitle: string;
    userOrganisation?: string | null;
    isSuperAdmin: boolean;
    onDelete: (id: string, title: string) => void;
}

// Helper function to truncate filename
const truncateFileName = (fileName: string, maxLength: number = 30): string => {
    if (!fileName || fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop() || '';
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
    
    if (nameWithoutExt.length <= maxLength - 3 - extension.length) return fileName;
    
    const start = nameWithoutExt.slice(0, 15);
    const end = nameWithoutExt.slice(-10);
    return `${start}...${end}.${extension}`;
};

// Helper function to truncate URL
const truncateUrl = (url: string, maxLength: number = 40): string => {
    if (!url || url.length <= maxLength) return url;
    
    // Remove protocol for display
    let displayUrl = url.replace(/^https?:\/\//, '');
    
    if (displayUrl.length <= maxLength) return displayUrl;
    
    const start = displayUrl.slice(0, 20);
    const end = displayUrl.slice(-15);
    return `${start}...${end}`;
};

const getVisibilityBadge = (item: LearningItem) => {
    if (item.isPublic) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[100px]">Public</span>
            </span>
        );
    } else if (item.targetOrganisation) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[120px]" title={item.targetOrganisation}>
                    {item.targetOrganisation}
                </span>
            </span>
        );
    } else if (item.createdByOrganisation) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[120px]" title={item.createdByOrganisation}>
                    {item.createdByOrganisation}
                </span>
            </span>
        );
    }
    return null;
};

const getTypeBadgeClass = (type: string): string => {
    switch (type) {
        case 'VIDEO':
            return 'bg-red-100 text-red-800';
        case 'DOCUMENT':
            return 'bg-purple-100 text-purple-800';
        case 'ARTICLE':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-green-100 text-green-800';
    }
};

export const LearningTable: React.FC<LearningTableProps> = ({ 
    items, 
    loading, 
    onDelete 
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-[25%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                            <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                            <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VISIBILITY</th>
                            <th className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FILE / RESOURCE</th>
                            {/* <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th> */}
                            <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPDATED</th>
                            <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">⏳</div>
                                        <p className="text-sm text-gray-600">Loading learning materials...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">📚</div>
                                        <p className="text-sm text-gray-600">No content yet in this category</p>
                                        <p className="text-xs text-gray-500 mt-1">Add your first learning material using the button above</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[250px]" title={item.title}>
                                            {item.title}
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[250px]" title={item.description}>
                                                {item.description.substring(0, 50)}...
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(item.type)}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getVisibilityBadge(item)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 truncate max-w-[300px]" title={item.resourceUrl || item.fileName}>
                                            {item.resourceUrl ? (
                                                <a 
                                                    href={item.resourceUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                >
                                                    <span className="truncate">
                                                        {item.fileName 
                                                            ? truncateFileName(item.fileName)
                                                            : truncateUrl(item.resourceUrl)
                                                        }
                                                    </span>
                                                    <span className="flex-shrink-0">↗</span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No resource</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{item.fileSize || '—'}</div>
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{item.updated || '—'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                            onClick={() => onDelete(item.id, item.title)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};