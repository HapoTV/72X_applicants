// pages/adminDashboard/tabs/LearningTab.tsx
import { useState, useEffect } from 'react';
import { learningService } from '../../../services/LearningService';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/AuthContext';
import { Crown } from 'lucide-react';
import { LearningTabs } from './components/LearningTabs';
import { LearningTable } from './components/LearningTable';
import { LearningModal } from './components/LearningModal';

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

type LearningSection = 'business-plan' | 'marketing' | 'finance' | 'operations' | 'leadership' | 'technical';

export default function LearningTab() {
    const { isSuperAdmin, userOrganisation } = useAuth();
    const [learningSection, setLearningSection] = useState<LearningSection>('business-plan');
    const [learningData, setLearningData] = useState<Record<LearningSection, LearningItem[]>>({
        'business-plan': [],
        'marketing': [],
        'finance': [],
        'operations': [],
        'leadership': [],
        'technical': [],
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
        targetOrganisation?: string;
        isPublic?: boolean;
        showAllOrganisations?: boolean;
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
    const [organisations, setOrganisations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const sectionTitles: Record<LearningSection, string> = {
        'business-plan': 'Business Planning',
        'marketing': 'Marketing & Sales',
        'finance': 'Financial Management',
        'operations': 'Operations',
        'leadership': 'Leadership',
        'technical': 'Technical'
    };

    const backendToFrontendCategory: Record<string, LearningSection> = {
        'BUSINESS_PLANNING': 'business-plan',
        'MARKETING_SALES': 'marketing',
        'FINANCIAL_MANAGEMENT': 'finance',
        'OPERATIONS': 'operations',
        'LEADERSHIP': 'leadership',
        'TECHNICAL': 'technical',
        'business-planning': 'business-plan',
        'marketing': 'marketing',
        'finance': 'finance',
        'operations': 'operations',
        'leadership': 'leadership',
        'technical': 'technical',
        'BUSINESS_PLAN': 'business-plan',
        'BUSINESSPLANNING': 'business-plan',
        'MARKETING_AND_SALES': 'marketing',
        'FINANCIAL': 'finance',
        'TECH': 'technical',
        'TECHNOLOGY': 'technical'
    };

    const frontendToBackendCategory: Record<LearningSection, string> = {
        'business-plan': 'BUSINESS_PLANNING',
        'marketing': 'MARKETING_SALES',
        'finance': 'FINANCIAL_MANAGEMENT',
        'operations': 'OPERATIONS',
        'leadership': 'LEADERSHIP',
        'technical': 'TECHNICAL'
    };

    useEffect(() => {
        fetchLearningMaterials();
        if (isSuperAdmin) {
            fetchOrganisations();
        }
    }, [isSuperAdmin]);

    const fetchLearningMaterials = async () => {
        try {
            setLoading(true);
            console.log('Fetching learning materials...');
            const allMaterials = await learningService.getAllLearningMaterials();
            
            const transformedData: Record<LearningSection, LearningItem[]> = {
                'business-plan': [],
                'marketing': [],
                'finance': [],
                'operations': [],
                'leadership': [],
                'technical': [],
            };
            
            allMaterials.forEach((material: any) => {
                const backendCategory = material.category || '';
                const frontendCategory = backendToFrontendCategory[backendCategory] || 
                                         backendToFrontendCategory[backendCategory.toUpperCase()] ||
                                         guessCategory(backendCategory);
                
                const learningItem: LearningItem = {
                    id: material.id || '',
                    title: material.title || '',
                    type: (material.type as 'ARTICLE' | 'VIDEO' | 'DOCUMENT') || 'ARTICLE',
                    category: material.category || '',
                    resourceUrl: material.resourceUrl || '',
                    fileName: material.fileName || '',
                    fileSize: material.fileSize || '',
                    description: material.description || '',
                    updated: material.updatedAt ? new Date(material.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
                    createdBy: material.createdBy || 'admin@72x.co.za',
                    createdByOrganisation: material.createdByOrganisation,
                    targetOrganisation: material.targetOrganisation,
                    isPublic: material.isPublic
                };
                
                if (frontendCategory && transformedData[frontendCategory]) {
                    transformedData[frontendCategory].push(learningItem);
                } else {
                    console.warn(`Could not map category "${backendCategory}" for material "${material.title}"`);
                    if (transformedData['technical']) {
                        transformedData['technical'].push(learningItem);
                    } else {
                        transformedData['business-plan'].push(learningItem);
                    }
                }
            });
            
            setLearningData(transformedData);
        } catch (error) {
            console.error('Error fetching learning materials:', error);
            alert('Error loading learning materials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const guessCategory = (category: string): LearningSection | undefined => {
        if (!category) return undefined;
        
        const lower = category.toLowerCase();
        
        if (lower.includes('business') || lower.includes('plan')) return 'business-plan';
        if (lower.includes('marketing') || lower.includes('sales')) return 'marketing';
        if (lower.includes('finance') || lower.includes('financial')) return 'finance';
        if (lower.includes('operation')) return 'operations';
        if (lower.includes('leader') || lower.includes('manage')) return 'leadership';
        if (lower.includes('tech') || lower.includes('technical') || lower.includes('technology')) return 'technical';
        
        return undefined;
    };

    const fetchOrganisations = async () => {
        try {
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
        const maxSizeVideo = 500 * 1024 * 1024;
        const maxSizeDocument = 50 * 1024 * 1024;
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

        if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && newLearning.file) {
            if (!validateFile(newLearning.file, newLearning.type)) {
                return;
            }
        }
        
        try {
            setUploading(true);
            setUploadProgress(0);

            const backendCategory = frontendToBackendCategory[learningSection];
            
            console.log('Creating learning material with category:', backendCategory);
            
            if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && newLearning.file) {
                const formData = new FormData();
                formData.append('title', newLearning.title);
                formData.append('description', newLearning.description);
                formData.append('category', backendCategory);
                formData.append('type', newLearning.type);
                formData.append('createdBy', 'admin@72x.co.za');
                formData.append('file', newLearning.file);
                
                if (isSuperAdmin) {
                    if (newLearning.showAllOrganisations) {
                        formData.append('isPublic', 'true');
                    } else if (newLearning.targetOrganisation) {
                        formData.append('targetOrganisation', newLearning.targetOrganisation);
                        formData.append('isPublic', 'false');
                    }
                }


                alert(`File "${newLearning.file.name}" uploaded successfully!`);
            } else {
                const requestData: any = {
                    title: newLearning.title,
                    type: newLearning.type,
                    category: backendCategory,
                    resourceUrl: newLearning.resourceUrl,
                    description: newLearning.description,
                    createdBy: 'admin@72x.co.za'
                };
                
                if (isSuperAdmin) {
                    if (newLearning.showAllOrganisations) {
                        requestData.isPublic = true;
                    } else if (newLearning.targetOrganisation) {
                        requestData.targetOrganisation = newLearning.targetOrganisation;
                        requestData.isPublic = false;
                    }
                }

                await axiosClient.post('/learning-materials', requestData);
                alert('Learning material added successfully!');
            }
            
            await fetchLearningMaterials();
            
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
            await axiosClient.delete(`/learning-materials/${materialId}`);
            await fetchLearningMaterials();
            alert('Learning material deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting learning material:', error);
            if (error.response?.status === 400) {
                alert('Delete failed. Backend rejected the request.');
            } else {
                alert('Error deleting learning material.');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewLearning({...newLearning, file});
        }
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
            
            <LearningTabs 
                sections={sectionTitles}
                activeSection={learningSection}
                onSectionChange={setLearningSection}
                itemCounts={Object.fromEntries(
                    Object.entries(learningData).map(([key, items]) => [key, items.length])
                ) as Record<LearningSection, number>}
            />

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
                
                <LearningTable 
                    items={learningData[learningSection]}
                    loading={loading}
                    sectionTitle={sectionTitles[learningSection]}
                    userOrganisation={userOrganisation}
                    isSuperAdmin={isSuperAdmin}
                    onDelete={handleDeleteLearning}
                />
            </div>

            <LearningModal
                isOpen={showAddLearning}
                onClose={() => setShowAddLearning(false)}
                onSubmit={handleAddLearning}
                uploading={uploading}
                uploadProgress={uploadProgress}
                newLearning={newLearning}
                onNewLearningChange={(updates) => setNewLearning(prev => ({ ...prev, ...updates }))}
                onFileChange={handleFileChange}
                sectionTitle={sectionTitles[learningSection]}
                isSuperAdmin={isSuperAdmin}
                organisations={organisations}
                getFileSize={getFileSize}
            />
        </div>
    );
}