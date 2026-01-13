// src/pages/adminDashboard/tabs/components/Messages.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface MessagesProps {
  success: string | null;
  error: string | null;
}

const Messages: React.FC<MessagesProps> = ({ success, error }) => {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
    </>
  );
};

export default Messages;