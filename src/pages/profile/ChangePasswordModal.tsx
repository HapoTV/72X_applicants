import React from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import type { PasswordRequirements } from './profileHelpers';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface ChangePasswordModalProps {
  passwordData: PasswordData;
  showPasswords: ShowPasswords;
  passwordError: string | null;
  changingPassword: boolean;
  requirements: PasswordRequirements;
  onPasswordDataChange: (data: PasswordData) => void;
  onNewPasswordChange: (value: string) => void;
  onToggleVisibility: (field: keyof ShowPasswords) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-gray-100'}`}>
      <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>{met ? '✓' : '○'}</span>
    </div>
    <span className={`text-sm ${met ? 'text-green-700' : 'text-gray-500'}`}>{text}</span>
  </div>
);

const inputClass = 'w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent';

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  passwordData, showPasswords, passwordError, changingPassword, requirements,
  onPasswordDataChange, onNewPasswordChange, onToggleVisibility, onSubmit, onClose,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {passwordError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{passwordError}</p>
          </div>
        )}

        {([
          { key: 'currentPassword', label: 'Current Password', visKey: 'current', placeholder: 'Enter current password' },
          { key: 'newPassword', label: 'New Password', visKey: 'new', placeholder: 'Enter new password' },
          { key: 'confirmPassword', label: 'Confirm New Password', visKey: 'confirm', placeholder: 'Confirm new password' },
        ] as const).map(({ key, label, visKey, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
              <input
                type={showPasswords[visKey] ? 'text' : 'password'}
                value={passwordData[key]}
                onChange={(e) =>
                  key === 'newPassword'
                    ? onNewPasswordChange(e.target.value)
                    : onPasswordDataChange({ ...passwordData, [key]: e.target.value })
                }
                className={inputClass}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => onToggleVisibility(visKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords[visKey] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
          <RequirementItem met={requirements.minLength} text="At least 8 characters long" />
          <RequirementItem met={requirements.hasUppercase} text="One uppercase letter" />
          <RequirementItem met={requirements.hasLowercase} text="One lowercase letter" />
          <RequirementItem met={requirements.hasNumber} text="One number" />
          <RequirementItem met={requirements.hasSpecialChar} text="One special character" />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={changingPassword}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={changingPassword}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {changingPassword && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          <span>{changingPassword ? 'Changing Password...' : 'Change Password'}</span>
        </button>
      </div>
    </div>
  </div>
);

export default ChangePasswordModal;
