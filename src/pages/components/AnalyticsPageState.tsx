import React from 'react';
import { AlertCircle, Loader2, Users } from 'lucide-react';

interface AnalyticsLoadingStateProps {
  message?: string;
}

export const AnalyticsLoadingState: React.FC<AnalyticsLoadingStateProps> = ({
  message = 'Loading analytics data...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

interface AnalyticsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const AnalyticsErrorState: React.FC<AnalyticsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-900">Unable to Load Data</h3>
      <p className="text-gray-600 text-center max-w-md">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

const AnalyticsEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <Users className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No Analytics Data Available</h3>
      <p className="text-gray-600 text-center max-w-md">
        Start by adding your financial data to see analytics.
        <br />
        Go to Data Input to add revenue, expenses, and customer information.
      </p>
      <button
        onClick={() => window.location.href = '/data-input'}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Go to Data Input
      </button>
    </div>
  );
};

export default AnalyticsEmptyState;
