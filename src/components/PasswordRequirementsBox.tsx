import React from 'react';
import type { PasswordRequirements } from '../utils/passwordHelpers';

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-gray-100'}`}>
      <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>{met ? '✓' : '○'}</span>
    </div>
    <span className={`text-sm ${met ? 'text-green-700' : 'text-gray-500'}`}>{text}</span>
  </div>
);

const PasswordRequirementsBox: React.FC<{ requirements: PasswordRequirements }> = ({ requirements }) => (
  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
    <RequirementItem met={requirements.minLength} text="At least 8 characters long" />
    <RequirementItem met={requirements.hasUppercase} text="One uppercase letter" />
    <RequirementItem met={requirements.hasLowercase} text="One lowercase letter" />
    <RequirementItem met={requirements.hasNumber} text="One number" />
    <RequirementItem met={requirements.hasSpecialChar} text="One special character" />
  </div>
);

export default PasswordRequirementsBox;
