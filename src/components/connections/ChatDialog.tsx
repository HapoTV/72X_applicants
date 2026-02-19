// src/components/connections/ChatDialog.tsx
import React, { useEffect } from 'react';
import ChatWindow from '../ChatWindow';
import type { ConnectionUser } from '../../pages/hooks/useConnections';
import MessageServices from '../../services/MessageServices';

interface Props {
  selectedUser: ConnectionUser | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: () => void; // Add this callback to refresh the list
}

const ChatDialog: React.FC<Props> = ({ selectedUser, isOpen, onClose, onMarkAsRead }) => {
  // Mark messages as read when dialog opens
  useEffect(() => {
    if (selectedUser && isOpen) {
      const markMessagesAsRead = async () => {
        try {
          await MessageServices.markMessagesAsRead(selectedUser.userId);
          console.log(`Marked messages as read from ${selectedUser.firstName} ${selectedUser.lastName}`);
          if (onMarkAsRead) {
            onMarkAsRead(); // Refresh the parent component
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      };
      
      markMessagesAsRead();
    }
  }, [selectedUser, isOpen, onMarkAsRead]);

  if (!selectedUser || !isOpen) return null;

  // Prevent event propagation to avoid accidental closes
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="absolute inset-0 bg-black/40" 
        aria-label="Close dialog"
      />
      <div 
        className="relative w-[95vw] max-w-3xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        onClick={handleDialogClick}
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="font-semibold text-gray-900 text-sm">
            Chat with {selectedUser.firstName} {selectedUser.lastName}
            {selectedUser.isOnline && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
        <div className="h-[600px]">
          <ChatWindow
            receiverId={selectedUser.userId}
            receiverName={`${selectedUser.firstName} ${selectedUser.lastName}`}
            receiverEmail={selectedUser.email}
            onClose={onClose}
            isOpen={isOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;