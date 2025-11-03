import { useState } from 'react';

interface FundingItem {
    id: string;
    title: string;
    provider: string;
    deadline?: string;
}

export default function FundingTab() {
    const [fundingItems, setFundingItems] = useState<FundingItem[]>([]);
    const [showAddFunding, setShowAddFunding] = useState(false);
    const [newFunding, setNewFunding] = useState<{ title: string; provider: string; deadline: string }>({ 
        title: '', 
        provider: '', 
        deadline: '' 
    });

    const handleAddFunding = () => {
        if (!newFunding.title.trim() || !newFunding.provider.trim()) {
            alert('Please enter title and provider');
            return;
        }
        
        setFundingItems(prev => [...prev, {
            id: String(Date.now()),
            title: newFunding.title,
            provider: newFunding.provider,
            deadline: newFunding.deadline
        }]);
        
        setShowAddFunding(false);
        setNewFunding({ title: '', provider: '', deadline: '' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Funding</h1>
                <button 
                    onClick={() => setShowAddFunding(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                    Add Funding
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROVIDER</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEADLINE</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fundingItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No funding opportunities yet
                                    </td>
                                </tr>
                            ) : (
                                fundingItems.map(funding => (
                                    <tr key={funding.id}>
                                        <td className="px-6 py-3 text-sm text-gray-900">{funding.title}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{funding.provider}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{funding.deadline || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Funding Modal */}
            {showAddFunding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add Funding</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Title</label>
                                <input 
                                    value={newFunding.title} 
                                    onChange={e => setNewFunding({...newFunding, title: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Provider</label>
                                <input 
                                    value={newFunding.provider} 
                                    onChange={e => setNewFunding({...newFunding, provider: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Deadline</label>
                                <input 
                                    type="date" 
                                    value={newFunding.deadline} 
                                    onChange={e => setNewFunding({...newFunding, deadline: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button 
                                    onClick={() => setShowAddFunding(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddFunding}
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