// src/pages/adminDashboard/tabs/MentorshipTab.tsx
import { useState, useEffect } from 'react';
import { mentorshipService } from '../../../services/MentorshipService';

interface Mentor {
    id: string;
    name: string;
    expertise: string;
    contact?: string;
    experience?: string;
    availability?: string;
    rating?: number;
    sessionsCompleted?: number;
    bio?: string;
    languages?: string;
    createdBy?: string;
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
        rating: string;
        sessionsCompleted: string;
        bio: string;
        languages: string;
    }>({
        name: '',
        expertise: '',
        contact: '',
        experience: '',
        availability: '',
        rating: '4.0',
        sessionsCompleted: '0',
        bio: '',
        languages: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const mentorsData = await mentorshipService.getAllMentors();
            
            // Transform to table format
            const transformedMentors: Mentor[] = mentorsData.map(mentor => ({
                id: mentor.mentorshipId,
                name: mentor.mentorName,
                expertise: mentor.expertise.join(', '),
                contact: mentor.mentorEmail,
                experience: mentor.experience,
                availability: mentor.availability,
                rating: mentor.rating,
                sessionsCompleted: mentor.sessionsCompleted,
                bio: mentor.bio,
                languages: mentor.languages?.join(', '),
                createdBy: mentor.createdBy
            }));
            
            setMentors(transformedMentors);
        } catch (err) {
            setError('Failed to load mentors. Please try again.');
            console.error('Error fetching mentors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMentor = async () => {
        if (!newMentor.name.trim() || !newMentor.expertise.trim()) {
            setError('Please enter name and expertise');
            return;
        }
        
        try {
            setError(null);
            setSuccess(null);
            
            const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';
            
            const mentorFormData = {
                mentorName: newMentor.name,
                mentorTitle: newMentor.expertise,
                mentorEmail: newMentor.contact,
                expertise: newMentor.expertise,
                experience: newMentor.experience,
                background: newMentor.bio,
                availability: newMentor.availability,
                rating: parseFloat(newMentor.rating),
                sessionsCompleted: parseInt(newMentor.sessionsCompleted),
                bio: newMentor.bio,
                sessionDuration: '60 minutes',
                sessionPrice: 'Free',
                languages: newMentor.languages,
                imageUrl: ''
            };
            
            await mentorshipService.createMentor(mentorFormData, userEmail);
            
            setSuccess('Mentor added successfully!');
            setShowAddMentor(false);
            setNewMentor({
                name: '',
                expertise: '',
                contact: '',
                experience: '',
                availability: '',
                rating: '4.0',
                sessionsCompleted: '0',
                bio: '',
                languages: ''
            });
            
            // Refresh the list
            fetchMentors();
        } catch (err) {
            setError('Error adding mentor. Please try again.');
            console.error('Error adding mentor:', err);
        }
    };

    const handleDeleteMentor = async (mentorId: string) => {
        if (!window.confirm('Are you sure you want to delete this mentor?')) {
            return;
        }
        
        try {
            setError(null);
            setSuccess(null);
            
            const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';
            
            await mentorshipService.deleteMentor(mentorId, userEmail);
            
            setSuccess('Mentor deleted successfully!');
            
            // Refresh the list
            fetchMentors();
        } catch (err) {
            setError('Error deleting mentor. Please try again.');
            console.error('Error deleting mentor:', err);
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
            
            {/* Success Message */}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-green-800 text-sm">{success}</span>
                    </div>
                </div>
            )}
            
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-red-600">✗</span>
                        <span className="text-red-800 text-sm">{error}</span>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPERTISE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPERIENCE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RATING</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AVAILABILITY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-6 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No mentors yet. Click "Add Mentor" to create one.
                                    </td>
                                </tr>
                            ) : (
                                mentors.map(mentor => (
                                    <tr key={mentor.id}>
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-gray-900">{mentor.name}</div>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">{mentor.expertise}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.experience || '—'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-1">★</span>
                                                <span>{mentor.rating?.toFixed(1) || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{mentor.availability || '—'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.contact ? (
                                                <a href={`mailto:${mentor.contact}`} className="text-blue-600 hover:text-blue-800">
                                                    {mentor.contact}
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.createdBy || '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            <button 
                                                className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Mentor</h3>
                            <button 
                                onClick={() => setShowAddMentor(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Name *</label>
                                    <input 
                                        value={newMentor.name} 
                                        onChange={e => setNewMentor({...newMentor, name: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Expertise *</label>
                                    <input 
                                        value={newMentor.expertise} 
                                        onChange={e => setNewMentor({...newMentor, expertise: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Experience</label>
                                    <input 
                                        value={newMentor.experience} 
                                        onChange={e => setNewMentor({...newMentor, experience: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="e.g., 5+ years in marketing"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Availability</label>
                                    <input 
                                        value={newMentor.availability} 
                                        onChange={e => setNewMentor({...newMentor, availability: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="e.g., Weekdays 9am-5pm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Contact Email</label>
                                    <input 
                                        type="email"
                                        value={newMentor.contact} 
                                        onChange={e => setNewMentor({...newMentor, contact: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="mentor@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Rating (1-5)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={newMentor.rating} 
                                        onChange={e => setNewMentor({...newMentor, rating: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="4.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Sessions Completed</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={newMentor.sessionsCompleted} 
                                        onChange={e => setNewMentor({...newMentor, sessionsCompleted: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Languages</label>
                                    <input 
                                        value={newMentor.languages} 
                                        onChange={e => setNewMentor({...newMentor, languages: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="e.g., English, isiZulu, Afrikaans"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Bio/Background</label>
                                <textarea 
                                    value={newMentor.bio} 
                                    onChange={e => setNewMentor({...newMentor, bio: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                    rows={3}
                                    placeholder="Brief description of the mentor's background and experience..."
                                />
                            </div>
                            <div className="flex gap-2 pt-2 justify-end">
                                <button 
                                    onClick={() => setShowAddMentor(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddMentor}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Add Mentor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}