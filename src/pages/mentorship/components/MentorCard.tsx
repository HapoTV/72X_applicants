import React from 'react';
import { Star, MessageSquare, Clock, Globe } from 'lucide-react';
import { mentorshipService } from '../../../services/MentorshipService';
import type { Mentor } from '../../../interfaces/MentorshipData';

interface Props {
  mentor: Mentor;
  onConnect: (mentorId: string) => void;
  onChat: (mentor: Mentor) => void;
  chatLoading: string | null;
}

const MentorCard: React.FC<Props> = ({ mentor, onConnect, onChat, chatLoading }) => {
  const availability = mentorshipService.isMentorAvailable(mentor.availability);
  const ratingText = mentorshipService.formatRating(mentor.rating);
  const sessionsText = mentorshipService.formatSessionsCount(mentor.sessionsCompleted);
  const isChatLoading = chatLoading === mentor.mentorId;
  const skills = mentor.expertise?.split(',').map(skill => skill.trim()).filter(Boolean) ?? [];
  const firstLanguage = mentor.languages?.split(',')[0]?.trim();
  const firstAvailability = mentor.availability?.split(',')[0]?.trim();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={mentor.imageUrl || mentorshipService.getUserImageUrl(mentor.name)}
          alt={mentor.name}
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{mentor.name}</h3>
          <p className="text-gray-600 text-xs">{mentor.expertise}</p>
          {mentor.experience && (
            <p className="text-gray-500 text-xs">{mentor.experience}</p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {availability ? 'Available' : 'Not Available'}
        </span>
      </div>

      {mentor.bio && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
      )}

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Expertise:</p>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 2).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {skill}
              </span>
            ))}
            {skills.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{skills.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          {firstLanguage && (
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>{firstLanguage}</span>
            </div>
          )}
          {firstAvailability && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{firstAvailability}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-600 text-xs">{ratingText}</span>
          </div>
          <span className="text-gray-600 text-xs">{sessionsText}</span>
          {mentor.sessionPrice && (
            <span className="text-gray-600 text-xs">{mentor.sessionPrice}</span>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onConnect(mentor.mentorId)}
          type="button"
          className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs"
        >
          Connect
        </button>
        <button
          onClick={() => onChat(mentor)}
          disabled={isChatLoading}
          type="button"
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Message"
        >
          {isChatLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
