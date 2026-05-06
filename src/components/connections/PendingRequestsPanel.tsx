// src/components/connections/PendingRequestsPanel.tsx
import React, { useState } from 'react';
import { UserCheck, UserX, BriefcaseBusiness, MapPin, Building2, Clock } from 'lucide-react';
import type { ConnectionRequestDTO } from '../../services/ConnectionRequestService';
import ConnectionRequestService from '../../services/ConnectionRequestService';

interface Props {
  requests: ConnectionRequestDTO[];
  onStatusChange: () => void;
}

const PendingRequestsPanel: React.FC<Props> = ({ requests, onStatusChange }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No pending connection requests</p>
      </div>
    );
  }

  const handleAccept = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      await ConnectionRequestService.acceptRequest(requestId);
      onStatusChange();
    } catch (err) {
      console.error('Error accepting request:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      await ConnectionRequestService.declineRequest(requestId);
      onStatusChange();
    } catch (err) {
      console.error('Error declining request:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {requests.map((req) => {
          const isLoading = loadingId === req.requestId;
          const nameParts = (req.senderName || '').trim().split(/\s+/);
          const initials = nameParts
            .slice(0, 2)
            .map((p) => p[0])
            .join('');

          return (
            <div key={req.requestId} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Avatar */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center text-sm font-semibold text-blue-700 flex-shrink-0">
                    {req.senderProfileImage ? (
                      <img
                        src={req.senderProfileImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900">{req.senderName}</div>
                    <div className="text-sm text-gray-500 truncate">{req.senderEmail}</div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {req.senderOrganisation && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {req.senderOrganisation}
                        </span>
                      )}
                      {req.senderIndustry && (
                        <span className="inline-flex items-center gap-1">
                          <BriefcaseBusiness className="w-3.5 h-3.5" />
                          {req.senderIndustry}
                        </span>
                      )}
                      {req.senderLocation && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {req.senderLocation}
                        </span>
                      )}
                    </div>

                    {req.message && (
                      <div className="mt-2 text-sm text-gray-600 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        "{req.message}"
                      </div>
                    )}

                    <div className="mt-1 text-xs text-gray-400">
                      {formatDate(req.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:ml-auto flex-shrink-0">
                  <button
                    onClick={() => handleAccept(req.requestId)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req.requestId)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingRequestsPanel;
