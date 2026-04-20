import React from 'react';

interface RequestButtonProps {
  onRequestAdSpace: () => void;
}

const RequestButton: React.FC<RequestButtonProps> = ({ onRequestAdSpace }) => {
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onRequestAdSpace}
        className="inline-flex items-center justify-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-md font-semibold text-sm shadow-md transition-colors mx-auto"
      >
        Request Ad Space
      </button>
    </div>
  );
};

export default RequestButton;