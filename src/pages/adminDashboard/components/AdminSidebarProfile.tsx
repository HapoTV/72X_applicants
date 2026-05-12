import type { ChangeEvent, RefObject } from 'react';

interface AdminSidebarProfileProps {
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadingPicture: boolean;
  organisationLogoUrl: string;
  userInitials: string;
  onUploadPictureChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveLogo: () => Promise<void>;
  onClearLogo: () => void;
}

export function AdminSidebarProfile({
  uploadInputRef,
  uploadingPicture,
  organisationLogoUrl,
  userInitials,
  onUploadPictureChange,
  onRemoveLogo,
  onClearLogo,
}: AdminSidebarProfileProps) {
  return (
    <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-200">
      <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadPictureChange} />
      <button
        type="button"
        onClick={() => uploadInputRef.current?.click()}
        disabled={uploadingPicture}
        className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-md overflow-hidden disabled:opacity-50"
      >
        {organisationLogoUrl ? (
          <img src={organisationLogoUrl} alt="Organisation" className="w-full h-full object-cover" onError={onClearLogo} />
        ) : (
          <span className="text-white text-xl font-bold">{userInitials}</span>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-2">{uploadingPicture ? 'Uploading...' : 'Click to upload logo'}</p>
      {organisationLogoUrl && (
        <button
          type="button"
          onClick={onRemoveLogo}
          disabled={uploadingPicture}
          className="mt-2 text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Remove logo
        </button>
      )}
    </div>
  );
}
