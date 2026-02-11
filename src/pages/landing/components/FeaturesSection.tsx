import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturePanel {
  title: string;
  bullets: string[];
}

interface FeaturesSectionProps {
  features: Feature[];
  activeFeatureIdx: number;
  setActiveFeatureIdx: (idx: number) => void;
  featurePanels: FeaturePanel[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  activeFeatureIdx,
  setActiveFeatureIdx,
  featurePanels,
}) => {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything You Need to Grow</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools designed for the unique challenges of South African businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveFeatureIdx(index)}
              className={`text-center group rounded-xl p-4 transition-all ${
                activeFeatureIdx === index ? '' : 'bg-transparent'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 ${
                  activeFeatureIdx === index ? 'bg-[#60A5FA]' : 'bg-[#60A5FA]'
                }`}
              >
                <span className={`text-2xl ${activeFeatureIdx === index ? 'text-[#111827]' : 'text-white'}`}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 font-semibold text-sm leading-relaxed">{feature.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 bg-[#60A5FA] border border-black/5 rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{featurePanels[activeFeatureIdx].title}</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            {featurePanels[activeFeatureIdx].bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
