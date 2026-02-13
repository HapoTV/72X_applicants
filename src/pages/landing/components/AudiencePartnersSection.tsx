import React from 'react';

interface AudiencePartnersSectionProps {
  rotatingUsers: string[];
  userWordIdx: number;
}

const AudiencePartnersSection: React.FC<AudiencePartnersSectionProps> = ({ rotatingUsers, userWordIdx }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-center text-gray-900 leading-tight mb-4">
          <span key={userWordIdx} className="text-[#3B82F6] rotating-word">
            {rotatingUsers[userWordIdx]}
          </span>
          <br className="hidden md:block" />
          use 72X to grow their business
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          From solo founders to established teams, 72X provides the tools, learning, and community to scale faster—without burnout.
        </p>

        <div className="flex justify-center items-center gap-12 md:gap-16">
          <img
            src="/StardandBank.png"
            alt="Standard Bank"
            className="h-16 w-auto object-contain"
            style={{ maxWidth: '180px' }}
          />
          <img
            src="/COC pic.png"
            alt="Chamber of Commerce"
            className="h-16 w-auto object-contain"
            style={{ maxWidth: '180px' }}
          />
        </div>
      </div>
    </section>
  );
};

export default AudiencePartnersSection;
