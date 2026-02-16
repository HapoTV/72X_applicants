// pages/adminDashboard/tabs/EventsTab.tsx (LearningTab)
import { useState, useEffect } from 'react';
import { learningService } from '../../../services/LearningService';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/AuthContext';
import { Crown, Building2, Globe } from 'lucide-react';

interface LearningItem {
    id: string;
    title: string;

    type: 'ARTICLE' | 'VIDEO' | 'DOCUMENT';
    category: string;
    resourceUrl?: string;
    fileName?: string;
    fileSize?: string;
    updated?: string;
    updatedAt?: string;
    createdAt?: string;
    createdBy: string;
    createdByOrganisation?: string; // NEW
    targetOrganisation?: string; // NEW
    isPublic?: boolean; // NEW
    description?: string;
}

type LearningSection = 'business-plan' | 'marketing' | 'finance' | 'operations' | 'leadership' | 'standardbank';

export default function LearningTab() {
    const { isSuperAdmin, userOrganisation } = useAuth();
    const [learningSection, setLearningSection] = useState<LearningSection>('business-plan');
    const [learningData, setLearningData] = useState<Record<LearningSection, LearningItem[]>>({
        'business-plan': [],
        'marketing': [],
        'finance': [],
        'operations': [],
        'leadership': [],
        'standardbank': [],
    });
    const [showAddLearning, setShowAddLearning] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [newLearning, setNewLearning] = useState<{
        title: string;
        type: 'ARTICLE' | 'VIDEO' | 'DOCUMENT';
        category: LearningSection;
        resourceUrl: string;
        description: string;
        file?: File;
        targetOrganisation?: string; // NEW
        isPublic?: boolean; // NEW
        showAllOrganisations?: boolean; // NEW - for super admin to choose
    }>({
        title: '',
        type: 'ARTICLE',
        category: 'business-plan',
        resourceUrl: '',
        description: '',
        file: undefined,
        targetOrganisation: '',
        isPublic: false,
        showAllOrganisations: false
    });
    const [organisations, setOrganisations] = useState<string[]>([]); // NEW
    const [loading, setLoading] = useState(true);

    const sectionTitles: Record<LearningSection, string> = {
        'business-plan': 'Business Planning',
        'marketing': 'Marketing & Sales',
        'finance': 'Financial Management',
        'operations': 'Operations',
        'leadership': 'Leadership',
        'standardbank': 'Standard Bank'
    };

    const normalizeSectionKey = (category: string): LearningSection | null => {
        const normalized = (category || '')
            .trim()
            .toLowerCase()
            .replace(/[_\s]+/g, '-');
        if (normalized === 'business-planning' || normalized === 'businessplanning') return 'business-plan';
        if (normalized === 'marketing-sales' || normalized === 'marketingsales') return 'marketing';
        if (normalized === 'financial-management' || normalized === 'financialmanagement') return 'finance';
        if (normalized === 'standard-bank' || normalized === 'standardbank') return 'standardbank';
        if (normalized === 'operations') return 'operations';
        if (normalized === 'leadership') return 'leadership';
        return null;
    };

    useEffect(() => {
        fetchLearningMaterials();
        if (isSuperAdmin) {
            fetchOrganisations(); // NEW: Fetch all organisations for super admin
        }
    }, [isSuperAdmin]);

    const fetchLearningMaterials = async () => {
        try {
            setLoading(true);
            console.log('Fetching learning materials...');
            const response = await axiosClient.get('/learning-materials');
            const allMaterials = response.data;
            console.log('Fetched materials:', allMaterials);

            const transformedData: Record<LearningSection, LearningItem[]> = {
                'business-plan': [],
                'marketing': [],
                'finance': [],
                'operations': [],
                'leadership': [],
                'standardbank': [],
            };

            allMaterials.forEach((material: any) => {
                const category = normalizeSectionKey(material.category);

                if (category && transformedData[category]) {
                    transformedData[category].push({
                        id: material.materialId || material.id || '',
                        title: material.title || '',
                        type: (material.type as 'ARTICLE' | 'VIDEO' | 'DOCUMENT'),
                        category: material.category || '',
                        resourceUrl: material.resourceUrl || '',
                        fileName: material.fileName || '',
                        fileSize: material.fileSize || '',
                        description: material.description || '',
                        updated: material.updatedAt || material.createdAt || material.updated || new Date().toLocaleDateString(),
                        updatedAt: material.updatedAt,
                        createdAt: material.createdAt,
                        createdBy: material.createdBy || 'admin@72x.co.za',
                        createdByOrganisation: material.createdByOrganisation,
                        targetOrganisation: material.targetOrganisation,
                        isPublic: material.isPublic
                    });
                }
            });

            (Object.keys(transformedData) as LearningSection[]).forEach((section) => {
                transformedData[section].sort((a, b) => {
                    const aDateRaw = a.updatedAt || a.createdAt || a.updated;
                    const bDateRaw = b.updatedAt || b.createdAt || b.updated;

                    const aTime = aDateRaw ? new Date(aDateRaw).getTime() : 0;
                    const bTime = bDateRaw ? new Date(bDateRaw).getTime() : 0;
                    return bTime - aTime;
                });
            });
            
            setLearningData(transformedData);
        } catch (error) {
            console.error('Error fetching learning materials:', error);
            alert('Error loading learning materials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrganisations = async () => {
        try {
            // This would be a real API call to get all organisations
            const response = await axiosClient.get('/admin/organisations');
            setOrganisations(response.data.map((org: any) => org.name));
        } catch (error) {
            console.error('Error fetching organisations:', error);
        }
    };

    const getFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const validateFile = (file: File, type: 'DOCUMENT' | 'VIDEO'): boolean => {
        const maxSizeVideo = 500 * 1024 * 1024; // 500MB
        const maxSizeDocument = 50 * 1024 * 1024; // 50MB
        const maxSize = type === 'VIDEO' ? maxSizeVideo : maxSizeDocument;

        if (file.size > maxSize) {
            alert(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
            return false;
        }

        const videoFormats = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/x-matroska'];
        const documentFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        
        const allowedFormats = type === 'VIDEO' ? videoFormats : documentFormats;

        if (!allowedFormats.includes(file.type)) {
            alert(`Invalid file format. Allowed formats: ${type === 'VIDEO' ? 'MP4, AVI, MOV, WMV, FLV, WebM, MKV' : 'PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX'}`);
            return false;
        }

        return true;
    };

    const handleAddLearning = async () => {
        if (!newLearning.title.trim()) {
            alert('Please enter a title');
            return;
        }
        
        if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && !newLearning.file) {
            alert('Please select a file to upload');
            return;
        }

        // Validate file if uploading
        if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && newLearning.file) {
            if (!validateFile(newLearning.file, newLearning.type)) {
                return;
            }
        }
        
        try {
            setUploading(true);
            setUploadProgress(0);

            const backendCategoryMap: Record<LearningSection, string> = {
                'business-plan': 'BUSINESS_PLANNING',
                'marketing': 'MARKETING_SALES', 
                'finance': 'FINANCIAL_MANAGEMENT',
                'operations': 'OPERATIONS',
                'leadership': 'LEADERSHIP',
                'standardbank': 'STANDARD_BANK'
            };
            
            const backendCategory = backendCategoryMap[learningSection];
            
            console.log('Creating learning material with category:', backendCategory);
            
            if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && newLearning.file) {
                // File upload with FormData
                const formData = new FormData();
                formData.append('title', newLearning.title);
                formData.append('description', newLearning.description);
                formData.append('category', backendCategory);
                formData.append('type', newLearning.type);
                formData.append('createdBy', 'admin@72x.co.za');
                formData.append('file', newLearning.file);
                
                // NEW: Add organisation targeting for super admin
                if (isSuperAdmin) {
                    if (newLearning.showAllOrganisations) {
                        formData.append('isPublic', 'true');
                    } else if (newLearning.targetOrganisation) {
                        formData.append('targetOrganisation', newLearning.targetOrganisation);
                        formData.append('isPublic', 'false');
                    }
                }

                console.log('Uploading file:', newLearning.file.name, 'Size:', getFileSize(newLearning.file.size));

                const response = await learningService.uploadLearningMaterialFormData(formData, {
                    onUploadProgress: (progressEvent: any) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                        console.log(`Upload progress: ${progress}%`);
                    }
                });

                console.log('File upload successful:', response.data);
                alert(`File "${newLearning.file.name}" uploaded successfully!`);
            } else {
                // URL-based material
                const requestData: any = {
                    title: newLearning.title,
                    type: newLearning.type,
                    category: backendCategory,
                    resourceUrl: newLearning.resourceUrl,
                    description: newLearning.description,
                    createdBy: 'admin@72x.co.za'
                };
                
                // NEW: Add organisation targeting for super admin
                if (isSuperAdmin) {
                    if (newLearning.showAllOrganisations) {
                        requestData.isPublic = true;
                    } else if (newLearning.targetOrganisation) {
                        requestData.targetOrganisation = newLearning.targetOrganisation;
                        requestData.isPublic = false;
                    }
                }

                console.log('Creating URL-based material:', requestData);
                await learningService.createLearningMaterial(requestData);
                console.log('Material created successfully');
                alert('Learning material added successfully!');
            }
            
            // Refresh data
            await fetchLearningMaterials();
            
            // Reset form
            setShowAddLearning(false);
            setNewLearning({ 
                title: '', 
                type: 'ARTICLE',
                category: 'business-plan',
                resourceUrl: '',
                description: '',
                file: undefined,
                targetOrganisation: '',
                isPublic: false,
                showAllOrganisations: false
            });
            setUploadProgress(0);
        } catch (error: any) {
            console.error('Error adding learning material:', error);
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else if (error.response?.data?.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert('Error adding learning material. Please try again.');
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteLearning = async (materialId: string, title: string) => {
        if (!materialId) {
            alert('Invalid material ID. Please refresh and try again.');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            console.log('Deleting material:', materialId);

            await learningService.deleteLearningMaterial(materialId);

            await fetchLearningMaterials();
            alert('Learning material deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting learning material:', error);

            if (error.response?.status === 400) {
                alert('Delete failed. Backend rejected the request.');
            } else if (error.response?.data?.message) {
                alert(`Error deleting learning material: ${error.response.data.message}`);
            } else if (error.response?.data?.error) {
                alert(`Error deleting learning material: ${error.response.data.error}`);
            } else {
                alert('Error deleting learning material.');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewLearning({...newLearning, file});
            console.log('File selected:', file.name, 'Size:', getFileSize(file.size));
        }
    };

    const getVisibilityBadge = (item: LearningItem) => {
        if (item.isPublic) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                </span>
            );
        } else if (item.targetOrganisation) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Building2 className="w-3 h-3 mr-1" />
                    {item.targetOrganisation}
                </span>
            );
        } else if (item.createdByOrganisation) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Building2 className="w-3 h-3 mr-1" />
                    {item.createdByOrganisation}
                </span>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Materials</h1>
                    <p className="text-gray-600">
                        {isSuperAdmin 
                            ? 'Manage learning resources across all organisations' 
                            : `Manage learning resources for ${userOrganisation || 'your organisation'}`}
                    </p>
                </div>
                {isSuperAdmin && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm font-medium">Super Admin</span>
                    </div>
                )}
            </div>
            
            {/* Horizontal nav for sections */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex flex-wrap gap-2">
                    {(Object.keys(sectionTitles) as LearningSection[]).map(section => (
                        <button 
                            key={section}
                            onClick={() => setLearningSection(section)}
                            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                                learningSection === section 
                                    ? 'border-primary-600 text-primary-700' 
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {sectionTitles[section]}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Table + Add Content button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="text-sm text-gray-700 font-medium">
                        {sectionTitles[learningSection]} • <span className="font-bold">{learningData[learningSection].length}</span> items
                        {!isSuperAdmin && userOrganisation && (
                            <span className="ml-2 text-xs text-gray-500">(only showing {userOrganisation} materials)</span>
                        )}
                    </div>
                    <button 
                        onClick={() => setShowAddLearning(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                        + Add Content
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VISIBILITY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FILE / RESOURCE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPDATED</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
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
                            ) : learningData[learningSection].length === 0 ? (
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
                                learningData[learningSection].map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 mt-1">{item.description.substring(0, 50)}...</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.type === 'VIDEO' ? 'bg-red-100 text-red-800' :
                                                item.type === 'DOCUMENT' ? 'bg-purple-100 text-purple-800' :
                                                item.type === 'ARTICLE' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getVisibilityBadge(item)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                {item.resourceUrl ? (
                                                    <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                                                        {item.fileName || item.resourceUrl.split('/').pop() || 'View Resource'}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">No resource</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{item.updatedAt || item.createdAt || item.updated || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button 
                                                className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                                onClick={() => handleDeleteLearning(item.id, item.title)}
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

            {/* Add Learning Modal */}
            {showAddLearning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add Content to {sectionTitles[learningSection]}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input 
                                    value={newLearning.title} 
                                    onChange={e => setNewLearning({...newLearning, title: e.target.value})} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Enter title"
                                    disabled={uploading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                <select 
                                    value={newLearning.type} 
                                    onChange={e => setNewLearning({...newLearning, type: e.target.value as any, file: undefined, resourceUrl: ''})} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    disabled={uploading}
                                >
                                    <option value="ARTICLE">Article</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="DOCUMENT">Document</option>
                                </select>
                            </div>
                            
                            {/* NEW: Organisation targeting for super admin */}
                            {isSuperAdmin && (
                                <div className="space-y-3 border-t border-gray-200 pt-3">
                                    <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                                    
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="showAllOrganisations"
                                            checked={newLearning.showAllOrganisations}
                                            onChange={(e) => setNewLearning({
                                                ...newLearning, 
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
                                                onChange={(e) => setNewLearning({
                                                    ...newLearning, 
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

                            {(newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange}
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
                                            <p className="text-xs text-green-800"><strong>Selected:</strong> {newLearning.file.name} ({getFileSize(newLearning.file.size)})</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL *</label>
                                    <input 
                                        value={newLearning.resourceUrl} 
                                        onChange={e => setNewLearning({...newLearning, resourceUrl: e.target.value})} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://example.com"
                                        disabled={uploading}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea 
                                    value={newLearning.description} 
                                    onChange={e => setNewLearning({...newLearning, description: e.target.value})} 
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
                                    onClick={() => {
                                        setShowAddLearning(false);
                                        setUploadProgress(0);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddLearning}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {uploading ? `Uploading (${uploadProgress}%)...` : 'Add Material'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}