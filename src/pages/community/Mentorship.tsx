import React, { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import type { UserMentorshipItem } from '../../interfaces/MentorshipData';

const Mentorship: React.FC = () => {
  const [mentors, setMentors] = useState<UserMentorshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const mentorsData = await mentorshipService.getActiveMentorship();
        setMentors(mentorsData);
      } catch (error: any) {
        console.error('Error fetching mentors:', error);
        
        // Handle 500 errors gracefully - show empty state instead of error
        if (error.response?.status === 500) {
          console.log('Backend 500 error - showing empty mentors state');
          setMentors([]);
        } else {
          setError('Failed to load mentors. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
          <p className="text-gray-600">Get guidance from experienced entrepreneurs and industry experts</p>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors available</h3>
          <p className="text-gray-600">Check back later for available mentors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
        <p className="text-gray-600">Get guidance from experienced entrepreneurs and industry experts</p>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-lg">{getInitials(mentor.mentorName)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{mentor.mentorName}</h3>
                <p className="text-gray-600 text-sm">{mentor.mentorTitle}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {mentor.experience && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Experience:</span> {mentor.experience}</p>
                </div>
              )}
              
              {mentor.background && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Background:</span> {mentor.background}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                {mentor.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{mentor.rating}</span>
                    <span className="text-gray-500">rating</span>
                  </div>
                )}
                {mentor.sessionsCompleted && (
                  <span className="text-gray-600">{mentor.sessionsCompleted} sessions</span>
                )}
              </div>
            </div>
            
            <button 
              className={`w-full py-2 rounded-lg transition-colors font-medium ${
                mentor.isAvailable 
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!mentor.isAvailable}
            >
              {mentor.isAvailable ? 'Book Session' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mentorship;
