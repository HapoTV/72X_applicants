import { useState, useEffect } from 'react';
import { learningService } from '../../../services/LearningService';
import { useAuth } from '../../../context/AuthContext';
import axiosClient from '../../../api/axiosClient';

interface LearningItem {
    id: string;
    title: string;
    type: 'ARTICLE' | 'VIDEO' | 'DOCUMENT' | 'LINK';
    category: string;
    resourceUrl?: string;
    fileName?: string;
    updated?: string;
    createdBy: string;
}

type LearningSection = 'business-plan' | 'marketing' | 'finance' | 'operations' | 'leadership' | 'standardbank';

export default function LearningTab() {
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
    const [newLearning, setNewLearning] = useState<{ 
        title: string; 
        type: 'ARTICLE' | 'VIDEO' | 'DOCUMENT' | 'LINK'; 
        category: LearningSection;
        resourceUrl: string;
        description: string;
        file?: File;
    }>({ 
        title: '', 
        type: 'ARTICLE',
        category: learningSection,
        resourceUrl: '',
        description: '',
        file: undefined
    });
    const [loading, setLoading] = useState(true);

    const sectionTitles = {
        'business-plan': 'Business Planning',
        'marketing': 'Marketing & Sales',
        'finance': 'Financial Management',
        'operations': 'Operations',
        'leadership': 'Leadership',
        'standardbank': 'StandardBank'
    };

    useEffect(() => {
        fetchLearningMaterials();
    }, []);

    const fetchLearningMaterials = async () => {
        try {
            setLoading(true);
            console.log('Fetching learning materials...');
            // Use LearningService to get all learning materials
            const allMaterials = await learningService.getAllLearningMaterials();
            console.log('Fetched materials:', allMaterials);
            
            // Transform API response to admin format
            const transformedData: Record<LearningSection, LearningItem[]> = {
                'business-plan': [],
                'marketing': [],
                'finance': [],
                'operations': [],
                'leadership': [],
                'standardbank': [],
            };
            
            // Group by category - use the same format as backend returns
            allMaterials.forEach((material) => {
                console.log('Existing material category:', material.category, 'Title:', material.title);
                // Use the category directly from backend since LearningService already transforms it
                const category = material.category as LearningSection;
                
                console.log('Processing material:', material, 'Using category:', category);
                if (transformedData[category]) {
                    transformedData[category].push({
                        id: material.id,
                        title: material.title,
                        type: (material.type as 'ARTICLE' | 'VIDEO' | 'DOCUMENT' | 'LINK') || 'ARTICLE',
                        category: material.category,
                        resourceUrl: material.resourceUrl,
                        fileName: material.fileName,
                        updated: new Date().toLocaleDateString(), // Use current date as fallback
                        createdBy: 'admin@72x.co.za' // Default creator
                    });
                    console.log('Added to category:', category, 'Items now:', transformedData[category].length);
                } else {
                    console.warn('Category not found in transformedData:', category);
                }
            });
            
            console.log('Final transformed data:', transformedData);
            setLearningData(transformedData);
        } catch (error) {
            console.error('Error fetching learning materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLearning = async () => {
        if (!newLearning.title.trim()) {
            alert('Please enter a title');
            return;
        }
        
        // For DOCUMENT and VIDEO types, require file upload
        if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && !newLearning.file) {
            alert('Please select a file to upload');
            return;
        }
        
        // For ARTICLE and LINK types, require URL
        if ((newLearning.type === 'ARTICLE' || newLearning.type === 'LINK') && !newLearning.resourceUrl.trim()) {
            alert('Please enter a resource URL');
            return;
        }
        
        try {
            // Map frontend category to backend enum format (use exact enum values)
            const backendCategoryMap: Record<LearningSection, string> = {
                'business-plan': 'BUSINESS_PLANNING',
                'marketing': 'MARKETING_SALES', 
                'finance': 'FINANCIAL_MANAGEMENT',
                'operations': 'OPERATIONS',
                'leadership': 'LEADERSHIP',
                'standardbank': 'STANDARD_BANK'
            };
            
            const backendCategory = backendCategoryMap[learningSection];
            
            console.log('Attempting to create learning material:', {
                title: newLearning.title,
                type: newLearning.type,
                category: backendCategory,
                resourceUrl: newLearning.resourceUrl,
                description: newLearning.description,
                createdBy: 'admin@72x.co.za'
            });
            
            if ((newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') && newLearning.file) {
                // Use multipart/form-data for file upload
                const formData = new FormData();
                formData.append('title', newLearning.title);
                formData.append('description', newLearning.description);
                formData.append('category', backendCategory);
                formData.append('type', newLearning.type);
                formData.append('createdBy', 'admin@72x.co.za');
                formData.append('file', newLearning.file);
                
                console.log('Sending file upload request with backend category:', backendCategory);
                const response = await axiosClient.post('/learning-materials', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('File upload successful:', response.data);
            } else {
                // Use JSON for URL-based materials
                const requestData = {
                    title: newLearning.title,
                    type: newLearning.type,
                    category: backendCategory,
                    resourceUrl: newLearning.resourceUrl,
                    description: newLearning.description,
                    createdBy: 'admin@72x.co.za'
                };
                console.log('Sending JSON request with backend category:', backendCategory, 'data:', requestData);
                const response = await axiosClient.post('/learning-materials', requestData);
                console.log('JSON request successful:', response.data);
            }
            
            fetchLearningMaterials(); // Refresh data
            setShowAddLearning(false);
            setNewLearning({ 
                title: '', 
                type: 'ARTICLE',
                category: learningSection,
                resourceUrl: '',
                description: '',
                file: undefined
            });
        } catch (error) {
            console.error('Error adding learning material:', error);
            if (error.response) {
                console.error('Backend error response:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            }
            alert('Error adding learning material. Please try again.');
        }
    };

    const handleDeleteLearning = async (materialId: string) => {
        if (window.confirm('Are you sure you want to delete this learning material?')) {
            try {
                await axiosClient.delete(`/learning-materials/${materialId}`, {
                    params: { userEmail: 'admin@72x.co.za' }
                });
                fetchLearningMaterials(); // Refresh data
            } catch (error) {
                console.error('Error deleting learning material:', error);
                alert('Error deleting learning material. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Material</h1>
            
            {/* Horizontal nav for sections */}
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex flex-wrap gap-2">
                    {(Object.keys(sectionTitles) as LearningSection[]).map(section => (
                        <button 
                            key={section}
                            onClick={() => setLearningSection(section)}
                            className={`px-3 py-2 text-sm font-medium border-b-2 ${
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

            {/* Table + Add Content button for selected section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        {sectionTitles[learningSection]} content ({learningData[learningSection].length} items)
                    </div>
                    <button 
                        onClick={() => setShowAddLearning(true)}
                        className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                    >
                        Add Content
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESOURCE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST UPDATED</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-600">
                                        Loading learning materials...
                                    </td>
                                </tr>
                            ) : learningData[learningSection].length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No content yet in this category
                                    </td>
                                </tr>
                            ) : (
                                learningData[learningSection].map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {item.resourceUrl ? (
                                                    <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                        {item.fileName || 'View Resource'}
                                                    </a>
                                                ) : 'No resource'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{item.updated || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDeleteLearning(item.id)}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add Content to {sectionTitles[learningSection]}</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Title *</label>
                                <input 
                                    value={newLearning.title} 
                                    onChange={e => setNewLearning({...newLearning, title: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Type</label>
                                <select 
                                    value={newLearning.type} 
                                    onChange={e => setNewLearning({...newLearning, type: e.target.value as any, file: undefined, resourceUrl: ''})} 
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="ARTICLE">Article</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="DOCUMENT">Document</option>
                                    <option value="LINK">Link</option>
                                </select>
                            </div>
                            {(newLearning.type === 'DOCUMENT' || newLearning.type === 'VIDEO') ? (
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Upload File *</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setNewLearning({...newLearning, file: e.target.files?.[0]})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        accept={newLearning.type === 'VIDEO' ? '.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv' : '.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx'}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supported formats: {newLearning.type === 'VIDEO' ? 'MP4, AVI, MOV, WMV, FLV, WebM, MKV' : 'PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX'}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Resource URL *</label>
                                    <input 
                                        value={newLearning.resourceUrl} 
                                        onChange={e => setNewLearning({...newLearning, resourceUrl: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg" 
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Description</label>
                                <textarea 
                                    value={newLearning.description} 
                                    onChange={e => setNewLearning({...newLearning, description: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    rows={3}
                                    placeholder="Brief description of the learning material..."
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button 
                                    onClick={() => setShowAddLearning(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddLearning}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}