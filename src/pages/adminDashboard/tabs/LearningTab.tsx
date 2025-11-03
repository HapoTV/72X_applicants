import { useState } from 'react';

interface LearningItem {
    id: string;
    title: string;
    type: 'Article' | 'Video' | 'PDF';
    updated?: string;
}

type LearningSection = 'business' | 'marketing' | 'financial' | 'operations' | 'leadership';

export default function LearningTab() {
    const [learningSection, setLearningSection] = useState<LearningSection>('business');
    const [learningData, setLearningData] = useState<Record<LearningSection, LearningItem[]>>({
        business: [],
        marketing: [],
        financial: [],
        operations: [],
        leadership: [],
    });
    const [showAddLearning, setShowAddLearning] = useState(false);
    const [newLearning, setNewLearning] = useState<{ title: string; type: 'Article' | 'Video' | 'PDF' }>({ 
        title: '', 
        type: 'Article' 
    });

    const sectionTitles = {
        business: 'Business Planning',
        marketing: 'Marketing & Sales',
        financial: 'Financial Management',
        operations: 'Operations',
        leadership: 'Leadership'
    };

    const handleAddLearning = () => {
        if (!newLearning.title.trim()) {
            alert('Please enter a title');
            return;
        }
        
        const id = String(Date.now());
        const updated = new Date().toLocaleDateString();
        
        setLearningData(prev => ({
            ...prev,
            [learningSection]: [...prev[learningSection], { 
                id, 
                title: newLearning.title, 
                type: newLearning.type, 
                updated 
            }]
        }));
        
        setShowAddLearning(false);
        setNewLearning({ title: '', type: 'Article' });
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
                        {sectionTitles[learningSection]} content
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST UPDATED</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {learningData[learningSection].length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No content yet
                                    </td>
                                </tr>
                            ) : (
                                learningData[learningSection].map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{item.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{item.updated || '—'}</div>
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
                        <h3 className="text-lg font-semibold mb-4">Add Content</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Title</label>
                                <input 
                                    value={newLearning.title} 
                                    onChange={e => setNewLearning({...newLearning, title: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Type</label>
                                <select 
                                    value={newLearning.type} 
                                    onChange={e => setNewLearning({...newLearning, type: e.target.value as 'Article' | 'Video' | 'PDF'})} 
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="Article">Article</option>
                                    <option value="Video">Video</option>
                                    <option value="PDF">PDF</option>
                                </select>
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