import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';

interface Mentor {
    id: string;
    name: string;
    expertise: string;
    contact?: string;
    experience?: string;
    availability?: string;
}

export default function MentorshipTab() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [showAddMentor, setShowAddMentor] = useState(false);
    const [newMentor, setNewMentor] = useState<{ 
        name: string; 
        expertise: string; 
        contact: string;
        experience: string;
        availability: string;
    }>({ 
        name: '', 
        expertise: '', 
        contact: '',
        experience: '',
        availability: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            // Note: You'll need to create a mentors API endpoint
            // For now, we'll use a placeholder - you can create the backend for this
            const response = await axiosClient.get('/users/role/USER'); // Using users as placeholder
            
            // Transform API response - this is a placeholder
            const transformedMentors: Mentor[] = response.data.slice(0, 5).map((user: any, index: number) => ({
                id: user.userId || `mentor-${index}`,
                name: user.fullName,
                expertise: 'Business Development', // Placeholder
                contact: user.email,
                experience: '5+ years',
                availability: 'Available'
            }));
            setMentors(transformedMentors);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            // Fallback to empty array if API not available
            setMentors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMentor = async () => {
        if (!newMentor.name.trim() || !newMentor.expertise.trim()) {
            alert('Please enter name and expertise');
            return;
        }
        
        try {
            // Note: You'll need to create a mentors API endpoint
            // For now, we'll simulate the addition
            const newMentorWithId: Mentor = {
                id: `mentor-${Date.now()}`,
                name: newMentor.name,
                expertise: newMentor.expertise,
                contact: newMentor.contact,
                experience: newMentor.experience,
                availability: newMentor.availability
            };
            
            setMentors(prev => [...prev, newMentorWithId]);
            setShowAddMentor(false);
            setNewMentor({ 
                name: '', 
                expertise: '', 
                contact: '',
                experience: '',
                availability: ''
            });
            
            // Once you have the backend, use this:
            // await axiosClient.post('/mentors', newMentor);
            // fetchMentors(); // Refresh the list
        } catch (error) {
            console.error('Error adding mentor:', error);
            alert('Error adding mentor. Please try again.');
        }
    };

    const handleDeleteMentor = async (mentorId: string) => {
        if (window.confirm('Are you sure you want to delete this mentor?')) {
            try {
                // Note: You'll need to create a mentors API endpoint
                setMentors(prev => prev.filter(mentor => mentor.id !== mentorId));
                
                // Once you have the backend, use this:
                // await axiosClient.delete(`/mentors/${mentorId}`);
                // fetchMentors(); // Refresh the list
            } catch (error) {
                console.error('Error deleting mentor:', error);
                alert('Error deleting mentor. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Mentorship Program</h1>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPERIENCE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AVAILABILITY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-600">
                                        Loading mentors...
                                    </td>
                                </tr>
                            ) : mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No mentors yet
                                    </td>
                                </tr>
                            ) : (
                                mentors.map(mentor => (
                                    <tr key={mentor.id}>
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-gray-900">{mentor.name}</div>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.expertise}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.experience || '—'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.availability || '—'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.contact ? (
                                                <a href={`mailto:${mentor.contact}`} className="text-blue-600 hover:text-blue-800">
                                                    {mentor.contact}
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDeleteMentor(mentor.id)}
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

            {/* Add Mentor Modal */}
            {showAddMentor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add Mentor</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Name *</label>
                                <input 
                                    value={newMentor.name} 
                                    onChange={e => setNewMentor({...newMentor, name: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Expertise *</label>
                                <input 
                                    value={newMentor.expertise} 
                                    onChange={e => setNewMentor({...newMentor, expertise: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Experience</label>
                                <input 
                                    value={newMentor.experience} 
                                    onChange={e => setNewMentor({...newMentor, experience: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    placeholder="e.g., 5+ years in marketing"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Availability</label>
                                <input 
                                    value={newMentor.availability} 
                                    onChange={e => setNewMentor({...newMentor, availability: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    placeholder="e.g., Weekdays 9am-5pm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Contact Email</label>
                                <input 
                                    type="email"
                                    value={newMentor.contact} 
                                    onChange={e => setNewMentor({...newMentor, contact: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg" 
                                    placeholder="mentor@email.com"
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