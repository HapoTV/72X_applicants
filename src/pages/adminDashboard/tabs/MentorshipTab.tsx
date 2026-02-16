// src/pages/adminDashboard/tabs/MentorshipTab.tsx
import { useState, useEffect } from 'react';
import { mentorshipService } from '../../../services/MentorshipService';
import { useAuth } from '../../../context/AuthContext';
import type { Mentor } from '../../../interfaces/MentorshipData';

export default function MentorshipTab() {
    const { user } = useAuth();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [showAddMentor, setShowAddMentor] = useState(false);
    const [newMentor, setNewMentor] = useState({
        name: '',
        expertise: '',
        contactInfo: '',
        experience: '',
        background: '',
        availability: '',
        rating: '4.0',
        sessionsCompleted: '0',
        bio: '',
        sessionDuration: '60 minutes',
        sessionPrice: 'Free',
        languages: '',
        organisation: '', // New field
        isPublic: false   // New field
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const mentorsData = await mentorshipService.getAllMentors();
            setMentors(mentorsData);
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
            
            // Get current user email
            const currentUser = mentorshipService.getCurrentUser();
            const userEmail = currentUser?.email || '';
            
            if (!userEmail) {
                setError('User email not found');
                return;
            }
            
            // Create mentor data
            const mentorFormData = {
                name: newMentor.name,
                expertise: newMentor.expertise,
                contactInfo: newMentor.contactInfo,
                experience: newMentor.experience,
                background: newMentor.background,
                availability: newMentor.availability,
                rating: parseFloat(newMentor.rating),
                sessionsCompleted: parseInt(newMentor.sessionsCompleted),
                bio: newMentor.bio,
                sessionDuration: newMentor.sessionDuration,
                sessionPrice: newMentor.sessionPrice,
                languages: newMentor.languages,
                imageUrl: '',
                organisation: newMentor.organisation,
                isPublic: newMentor.isPublic
            };
            
            await mentorshipService.createMentor(mentorFormData, userEmail);
            
            setSuccess('Mentor added successfully!');
            setShowAddMentor(false);
            
            // Reset form
            setNewMentor({
                name: '',
                expertise: '',
                contactInfo: '',
                experience: '',
                background: '',
                availability: '',
                rating: '4.0',
                sessionsCompleted: '0',
                bio: '',
                sessionDuration: '60 minutes',
                sessionPrice: 'Free',
                languages: '',
                organisation: '',
                isPublic: false
            });
            
            // Refresh the list
            fetchMentors();
        } catch (err: any) {
            setError(`Error adding mentor: ${err.message || 'Please try again.'}`);
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
            
            // Get current user email
            const currentUser = mentorshipService.getCurrentUser();
            const userEmail = currentUser?.email || '';
            
            await mentorshipService.deleteMentor(mentorId, userEmail);
            
            setSuccess('Mentor deleted successfully!');
            
            // Refresh the list
            fetchMentors();
        } catch (err: any) {
            setError(`Error deleting mentor: ${err.message || 'Please try again.'}`);
            console.error('Error deleting mentor:', err);
        }
    };

    const formatExpertise = (expertise: string) => {
        if (!expertise) return '—';
        return expertise.split(',').map(e => e.trim()).join(', ');
    };

    const formatLanguages = (languages: string) => {
        if (!languages) return '—';
        return languages.split(',').map(l => l.trim()).join(', ');
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Mentorship Program</h1>
                <button 
                    onClick={() => setShowAddMentor(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORGANISATION</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VISIBILITY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-6 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-6 text-center text-sm text-gray-600">
                                        No mentors yet. Click "Add Mentor" to create one.
                                    </td>
                                </tr>
                            ) : (
                                mentors.map(mentor => (
                                    <tr key={mentor.mentorId} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-gray-900">{mentor.name}</div>
                                            {mentor.bio && (
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{mentor.bio}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {formatExpertise(mentor.expertise)}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.experience || '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-1">★</span>
                                                <span>{mentorshipService.formatRating(mentor.rating)}</span>
                                                {mentor.sessionsCompleted !== undefined && mentor.sessionsCompleted > 0 && (
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        ({mentor.sessionsCompleted} sessions)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                mentorshipService.isMentorAvailable(mentor.availability)
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {mentor.availability || 'Not specified'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.organisation || 'All Organisations'}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            {mentor.isPublic ? (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                    Public
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                                    Restricted
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.contactInfo ? (
                                                <a 
                                                    href={`mailto:${mentor.contactInfo}`} 
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {mentor.contactInfo}
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {mentor.createdBy || '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 text-sm"
                                                    onClick={() => {
                                                        // View details action
                                                        alert(`Mentor Details:\n\nName: ${mentor.name}\nExpertise: ${mentor.expertise}\nExperience: ${mentor.experience || 'N/A'}\nBio: ${mentor.bio || 'N/A'}\nLanguages: ${formatLanguages(mentor.languages || '')}\nCreated: ${mentorshipService.formatDate(mentor.createdAt || '')}`);
                                                    }}
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 text-sm"
                                                    onClick={() => handleDeleteMentor(mentor.mentorId)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
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
                                        placeholder="e.g., John Smith"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Expertise *</label>
                                    <input 
                                        value={newMentor.expertise} 
                                        onChange={e => setNewMentor({...newMentor, expertise: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        required
                                        placeholder="e.g., Marketing, Business Strategy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Contact Email *</label>
                                    <input 
                                        type="email"
                                        value={newMentor.contactInfo} 
                                        onChange={e => setNewMentor({...newMentor, contactInfo: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        required
                                        placeholder="mentor@example.com"
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
                            </div>

                            {/* Organisation selection for Super Admin */}
                            {isSuperAdmin && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Target Organisation</label>
                                        <input 
                                            value={newMentor.organisation} 
                                            onChange={e => setNewMentor({...newMentor, organisation: e.target.value})} 
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                            placeholder="e.g., 72X, TechCorp (leave empty for all)"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Leave empty to make visible to all organisations
                                        </p>
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox"
                                                checked={newMentor.isPublic}
                                                onChange={e => setNewMentor({...newMentor, isPublic: e.target.checked})}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700">Make this mentor public (visible to all)</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Background</label>
                                    <input 
                                        value={newMentor.background} 
                                        onChange={e => setNewMentor({...newMentor, background: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                        placeholder="e.g., Former Marketing Director at ABC Corp"
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
                                    <label className="block text-sm text-gray-700 mb-1">Session Duration</label>
                                    <select 
                                        value={newMentor.sessionDuration} 
                                        onChange={e => setNewMentor({...newMentor, sessionDuration: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="30 minutes">30 minutes</option>
                                        <option value="45 minutes">45 minutes</option>
                                        <option value="60 minutes">60 minutes</option>
                                        <option value="90 minutes">90 minutes</option>
                                        <option value="120 minutes">2 hours</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Session Price</label>
                                    <select 
                                        value={newMentor.sessionPrice} 
                                        onChange={e => setNewMentor({...newMentor, sessionPrice: e.target.value})} 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="R50">R50</option>
                                        <option value="R100">R100</option>
                                        <option value="R200">R200</option>
                                        <option value="R500">R500</option>
                                        <option value="Custom">Custom</option>
                                    </select>
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
                                <label className="block text-sm text-gray-700 mb-1">Bio *</label>
                                <textarea 
                                    value={newMentor.bio} 
                                    onChange={e => setNewMentor({...newMentor, bio: e.target.value})} 
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                                    rows={3}
                                    required
                                    placeholder="Brief description of the mentor's background, expertise, and what they can help with..."
                                />
                            </div>
                            <div className="text-sm text-gray-600">
                                <p className="mb-2">Note: The mentor will be created under your account ({user?.email || 'current user'}).</p>
                                <p>Mentors created here will appear to users in the specified organisation or to all users if marked public.</p>
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