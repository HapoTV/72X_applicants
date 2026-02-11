import React from 'react';

type Mentor = {
  id: number;
  name: string;
  title: string;
  expertise: string[];
  experience: string;
  companies: string;
  rating: number;
  sessions: number;
  avatar: string;
};

interface CommunityMentorsProps {
  mentors: Mentor[];
}

const CommunityMentors: React.FC<CommunityMentorsProps> = ({ mentors }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Available Mentors</h3>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          Become a Mentor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{mentor.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-gray-600 text-sm">{mentor.title}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expertise:</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>{mentor.experience} experience</p>
                <p>{mentor.companies}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">{mentor.rating}</span>
                </div>
                <span className="text-gray-600">{mentor.sessions} sessions</span>
              </div>
            </div>

            <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityMentors;
