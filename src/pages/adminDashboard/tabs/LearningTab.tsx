import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';

interface LearningItem {
    id: string;
    title: string;
    type: 'ARTICLE' | 'VIDEO' | 'PDF' | 'DOCUMENT' | 'LINK';
    category: string;
    resourceUrl?: string;
    fileName?: string;
    updated?: string;
    createdBy: string;
}

type LearningSection = 'BUSINESS' | 'MARKETING' | 'FINANCE' | 'OPERATIONS' | 'LEADERSHIP' | 'STANDARD_BANK';

export default function LearningTab() {
    const [learningSection, setLearningSection] = useState<LearningSection>('BUSINESS');
    const [learningData, setLearningData] = useState<Record<LearningSection, LearningItem[]>>({
        BUSINESS: [],
        MARKETING: [],
        FINANCE: [],
        OPERATIONS: [],
        LEADERSHIP: [],
        STANDARD_BANK: [],
    });
    const [showAddLearning, setShowAddLearning] = useState(false);
    const [newLearning, setNewLearning] = useState<{ 
        title: string; 
        type: 'ARTICLE' | 'VIDEO' | 'PDF' | 'DOCUMENT' | 'LINK'; 
        category: string;
        resourceUrl: string;
        description: string;
    }>({ 
        title: '', 
        type: 'ARTICLE',
        category: 'BUSINESS',
        resourceUrl: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);

    const sectionTitles = {
        BUSINESS: 'Business Planning',
        MARKETING: 'Marketing & Sales',
        FINANCE: 'Financial Management',
        OPERATIONS: 'Operations',
        LEADERSHIP: 'Leadership',
        STANDARD_BANK: 'StandardBank'
    };

    useEffect(() => {
        fetchLearningMaterials();
    }, []);

    const fetchLearningMaterials = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/learning-materials');
            
            // Transform API response
            const transformedData: Record<LearningSection, LearningItem[]> = {
                BUSINESS: [],
                MARKETING: [],
                FINANCE: [],
                OPERATIONS: [],
                LEADERSHIP: [],
                STANDARD_BANK: [],
            };
            
            // Group by category
            response.data.forEach((material: any) => {
                const category = material.category as LearningSection;
                if (transformedData[category]) {
                    transformedData[category].push({
                        id: material.materialId,
                        title: material.title,
                        type: material.type,
                        category: material.category,
                        resourceUrl: material.resourceUrl,
                        fileName: material.fileName,
                        updated: material.updatedAt ? new Date(material.updatedAt).toLocaleDateString() : undefined,
                        createdBy: material.createdBy
                    });
                }
            });
            
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
        
        try {
            await axiosClient.post('/learning-materials', {
                title: newLearning.title,
                type: newLearning.type,
                category: learningSection,
                resourceUrl: newLearning.resourceUrl,
                description: newLearning.description,
                createdBy: 'admin@72x.co.za'
            });
            
            fetchLearningMaterials(); // Refresh data
            setShowAddLearning(false);
            setNewLearning({ 
                title: '', 
                type: 'ARTICLE',
                category: learningSection,
                resourceUrl: '',
                description: ''
            });
        } catch (error) {
            console.error('Error adding learning material:', error);
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
                                    onChange={e => setNewLearning({...newLearning, type: e.target.value as any})} 
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="ARTICLE">Article</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="PDF">PDF</option>
                                    <option value="DOCUMENT">Document</option>
                                    <option value="LINK">Link</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Resource URL</label>
                                <input 
                                    value={newLearning.resourceUrl} 
                                    onChange={e => setNewLearning({...newLearning, resourceUrl: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    placeholder="https://..."
                                />
                            </div>
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