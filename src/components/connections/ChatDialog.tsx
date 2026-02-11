// src/components/connections/ChatDialog.tsx
import React from 'react';
import ChatWindow from '../ChatWindow';
import type { ConnectionUser } from '../../pages/hooks/useConnections';

interface Props {
  selectedUser: ConnectionUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChatDialog: React.FC<Props> = ({ selectedUser, isOpen, onClose }) => {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative w-[95vw] max-w-3xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="font-semibold text-gray-900 text-sm">
            Chat with {selectedUser.firstName} {selectedUser.lastName}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="p-4">
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
