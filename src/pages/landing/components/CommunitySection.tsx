import React from 'react';

const CommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-gray-600">Connect, learn, and grow with fellow entrepreneurs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <i className="bx bxs-user-plus" style={{ color: 'white' }}></i>,
              title: 'Network & Connect',
              desc: 'Join thousands of South African entrepreneurs sharing insights and opportunities',
            },
            {
              icon: <i className="bx bxs-graduation" style={{ color: 'white' }}></i>,
              title: 'Learn & Grow',
              desc: 'Access exclusive workshops, webinars, and mentorship programs',
            },
            {
              icon: <i className="bx bxs-group" style={{ color: 'white' }}></i>,
              title: 'Collaborate',
              desc: 'Find business partners, suppliers, and customers within our community',
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#60A5FA' }}>
                <span className="text-2xl text-white">{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
