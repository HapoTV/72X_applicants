import React from 'react';

interface AdvertisingSectionProps {
  onRequestAdSpace: () => void;
}

const AdvertisingSection: React.FC<AdvertisingSectionProps> = ({ onRequestAdSpace }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
              Advertising Space Available
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">Advertise your business on 72X</h2>
            <p className="text-xl text-gray-700 mt-4 max-w-2xl">
              Promote your business, products, or services directly to entrepreneurs and business owners. Tell us about your
              advertising needs and we’ll help you reach the right audience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                <div className="text-sm font-bold text-gray-900 mb-1">Targeted audience</div>
                <div className="text-sm text-gray-700">Reach business owners actively looking for tools and services.</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                <div className="text-sm font-bold text-gray-900 mb-1">High visibility</div>
                <div className="text-sm text-gray-700">Your ad appears inside the platform dashboard and key areas.</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                <div className="text-sm font-bold text-gray-900 mb-1">Flexible campaigns</div>
                <div className="text-sm text-gray-700">Run image or video ads with budgets that suit your goals.</div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={onRequestAdSpace}
                className="inline-flex items-center justify-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-md font-semibold text-sm shadow-md transition-colors mx-auto"
              >
                Request Ad Space
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-gray-900">Advertising Space</div>
                  <div className="text-xs font-semibold text-gray-700 bg-white/70 border border-gray-200 px-3 py-1 rounded-full">
                    Sponsored
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-white border border-gray-200 p-4">
                  <div className="h-40 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="text-white text-lg font-extrabold">Your business here</div>
                      <div className="text-white/90 text-sm mt-1">Promote products, services, and offers</div>
                      <div className="text-white/90 text-xs mt-3">
                        Image or video <span className="text-purple-300">•</span> Clickable{' '}
                        <span className="text-pink-300">•</span> Trackable
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">Build trust. Get customers.</div>
                    <div className="text-xs text-gray-600">72X Ads</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    We’ll guide you on creative, targeting, and budget so your ad performs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisingSection;
