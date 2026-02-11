import React from 'react';

interface HeroSectionProps {
  typedHeadline: string;
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ typedHeadline, onGetStarted }) => {
  return (
    <section id="features" className="relative bg-center bg-cover " style={{ backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 min-h-[680px] lg:min-h-[580px]">
        <div className="flex justify-center items-center">
          <div className="text-blue text-center max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-6xl font-extrabold leading-tight mb-4 text-black">
              {typedHeadline}
              <span className="typing-caret align-middle" />
            </h1>
            <p className="text-4xl font-semibold mb-4 text-black">72X, the smart partner for your business growth.</p>
            <p className="mx-auto text-3xl text-black/90 mb-8">
              Empowering South African entrepreneurs with AI-driven growth tools, local language support,
              interactive learning, and affordable business software tailored for{' '}
              <strong style={{ color: '#0b76faff' }}>townships and rural areas</strong>.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
