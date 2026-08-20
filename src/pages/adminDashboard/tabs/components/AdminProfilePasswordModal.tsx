import { Eye, EyeOff, X } from 'lucide-react';

type PasswordRequirements = {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
};

type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordVisibilityState = {
  current: boolean;
  new: boolean;
  confirm: boolean;
};

type AdminProfilePasswordModalProps = {
  isOpen: boolean;
  passwordError: string | null;
  passwordData: PasswordChangeData;
  showPasswords: PasswordVisibilityState;
  passwordRequirements: PasswordRequirements;
  changingPassword: boolean;
  onClose: () => void;
  onPasswordDataChange: (next: PasswordChangeData) => void;
  onNewPasswordChange: (value: string) => void;
  onTogglePasswordVisibility: (field: 'current' | 'new' | 'confirm') => void;
  onSubmit: () => void;
};

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-gray-100'}`}>
      <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
        {met ? '✓' : '○'}
      </span>
    </div>
    <span className={`text-sm ${met ? 'text-green-700' : 'text-gray-500'}`}>
      {text}
    </span>
  </div>
);

export function AdminProfilePasswordModal({
  isOpen,
  passwordError,
  passwordData,
  showPasswords,
  passwordRequirements,
  changingPassword,
  onClose,
  onPasswordDataChange,
  onNewPasswordChange,
  onTogglePasswordVisibility,
  onSubmit,
}: AdminProfilePasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {passwordError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{passwordError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => onTogglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => onTogglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordDataChange({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => onTogglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
            <RequirementItem met={passwordRequirements.minLength} text="At least 8 characters long" />
            <RequirementItem met={passwordRequirements.hasUppercase} text="One uppercase letter" />
            <RequirementItem met={passwordRequirements.hasLowercase} text="One lowercase letter" />
            <RequirementItem met={passwordRequirements.hasNumber} text="One number" />
            <RequirementItem met={passwordRequirements.hasSpecialChar} text="One special character" />
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
            {changingPassword && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{changingPassword ? 'Changing Password...' : 'Change Password'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
