import React from "react";
import { X } from "lucide-react";

interface PeerSupportGroupsErrorBannerProps {
  error: string;
  onRetry: () => void;
}

const PeerSupportGroupsErrorBanner: React.FC<
  PeerSupportGroupsErrorBannerProps
> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <X className="w-5 h-5 text-red-600" />
        <span className="text-red-800 text-sm">{error}</span>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
      >
        Try Again
      </button>
    </div>
  );
};

export default PeerSupportGroupsErrorBanner;
