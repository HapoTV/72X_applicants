import React from 'react';
import { Star, Plus } from 'lucide-react';

const Mentorship: React.FC = () => {
  const mentors = [
    {
      id: 1,
      name: 'Robert Johnson',
      title: 'Serial Entrepreneur & Investor',
      expertise: ['Startup Strategy', 'Fundraising', 'Scaling'],
      experience: '15+ years',
      companies: 'Founded 3 companies, 2 exits',
      rating: 4.9,
      sessions: 127,
      avatar: 'RJ'
    },
    {
      id: 2,
      name: 'Lisa Thompson',
      title: 'Marketing Director & Consultant',
      expertise: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking'],
      experience: '12+ years',
      companies: 'Ex-Google, Ex-Shopify',
      rating: 4.8,
      sessions: 89,
      avatar: 'LT'
    },
    {
      id: 3,
      name: 'Carlos Martinez',
      title: 'Operations & Finance Expert',
      expertise: ['Operations', 'Financial Planning', 'Process Optimization'],
      experience: '10+ years',
      companies: 'Ex-McKinsey, CFO at 2 startups',
      rating: 4.9,
      sessions: 156,
      avatar: 'CM'
    },
    {
      id: 4,
      name: 'Emily Chen',
      title: 'Product Management Leader',
      expertise: ['Product Strategy', 'User Experience', 'Agile Development'],
      experience: '8+ years',
      companies: 'Ex-Amazon, VP Product at SaaS startup',
      rating: 4.7,
      sessions: 73,
      avatar: 'EC'
    },
    {
      id: 5,
      name: 'Michael Brown',
      title: 'Sales & Business Development',
      expertise: ['Sales Strategy', 'B2B Sales', 'Partnership Development'],
      experience: '14+ years',
      companies: 'Built sales teams at 3 unicorns',
      rating: 4.8,
      sessions: 112,
      avatar: 'MB'
    },
    {
      id: 6,
      name: 'Sophia Williams',
      title: 'Legal & Compliance Advisor',
      expertise: ['Startup Law', 'Contracts', 'IP Protection'],
      experience: '11+ years',
      companies: 'Corporate lawyer, startup advisor',
      rating: 4.9,
      sessions: 94,
      avatar: 'SW'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
        <p className="text-gray-600">Get guidance from experienced entrepreneurs and industry experts</p>
      </div>

      {/* Become a Mentor Button */}
      <button className="w-full md:w-auto px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
        <Plus className="w-5 h-5" />
        <span>Become a Mentor</span>
      </button>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-lg">{mentor.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-gray-600 text-sm">{mentor.title}</p>
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
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Experience:</span> {mentor.experience}</p>
                <p><span className="font-medium">Background:</span> {mentor.companies}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900">{mentor.rating}</span>
                  <span className="text-gray-500">rating</span>
                </div>
                <span className="text-gray-600">{mentor.sessions} sessions</span>
              </div>
            </div>
            
            <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mentorship;
