import { useState } from 'react';

interface Mentor {
    id: string;
    name: string;
    expertise: string;
    contact?: string;
}

export default function MentorshipTab() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [showAddMentor, setShowAddMentor] = useState(false);
    const [newMentor, setNewMentor] = useState<{ name: string; expertise: string; contact: string }>({ 
        name: '', 
        expertise: '', 
        contact: '' 
    });

    const handleAddMentor = () => {
        if (!newMentor.name.trim() || !newMentor.expertise.trim()) {
            alert('Please enter name and expertise');
            return;
        }
        
        setMentors(prev => [...prev, {
            id: String(Date.now()),
            name: newMentor.name,
            expertise: newMentor.expertise,
            contact: newMentor.contact
        }]);
        
        setShowAddMentor(false);
        setNewMentor({ name: '', expertise: '', contact: '' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Mentorship</h1>
                <button 
                    onClick={() => setShowAddMentor(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                    Add Mentor
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPERTISE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No mentors yet
                                    </td>
                                </tr>
                            ) : (
                                mentors.map(mentor => (
                                    <tr key={mentor.id}>
                                        <td className="px-6 py-3 text-sm text-gray-900">{mentor.name}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.expertise}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.contact || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Mentor Modal */}
            {showAddMentor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add Mentor</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Name</label>
                                <input 
                                    value={newMentor.name} 
                                    onChange={e => setNewMentor({...newMentor, name: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Expertise</label>
                                <input 
                                    value={newMentor.expertise} 
                                    onChange={e => setNewMentor({...newMentor, expertise: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Contact</label>
                                <input 
                                    value={newMentor.contact} 
                                    onChange={e => setNewMentor({...newMentor, contact: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button 
                                    onClick={() => setShowAddMentor(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddMentor}
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