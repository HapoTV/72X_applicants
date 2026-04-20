import React from 'react';

const AdPreview: React.FC = () => {
  return (
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
  );
};

export default AdPreview;