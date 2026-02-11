import React from 'react';
import { BookOpen, Video, MessageCircle, Phone } from 'lucide-react';

const HelpSection: React.FC = () => {
  return (
    <section id="help" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">We're Here to Help</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the support you need to succeed with our comprehensive help resources and dedicated team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <BookOpen className="w-6 h-6" />,
              title: 'Knowledge Base',
              desc: 'Comprehensive guides and documentation to help you get the most out of our platform',
            },
            {
              icon: <Video className="w-6 h-6" />,
              title: 'Video Tutorials',
              desc: 'Step-by-step video guides for all features and workflows',
            },
            {
              icon: <MessageCircle className="w-6 h-6" />,
              title: 'Live Chat',
              desc: 'Instant help from our friendly support team, available 24/7',
            },
            {
              icon: <Phone className="w-6 h-6" />,
              title: 'Direct Support',
              desc: 'Talk directly with our experts for personalized assistance',
            },
          ].map((help, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {help.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{help.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{help.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
