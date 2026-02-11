import React from 'react';

interface TrustBarProps {
  reactSvg: string;
}

const TrustBar: React.FC<TrustBarProps> = ({ reactSvg }) => {
  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Trusted by South African Entrepreneurs
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 ">
            <img
              src={reactSvg}
              alt="Trust Badge"
              className=" object-contain height-1200"
              style={{ height: '400px', width: '700px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
