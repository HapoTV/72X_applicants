import { Loader2 } from 'lucide-react';

export function AdminPaymentsLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading payment data...</p>
      </div>
    </div>
  );
}
