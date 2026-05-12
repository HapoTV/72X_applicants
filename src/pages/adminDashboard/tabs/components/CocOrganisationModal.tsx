import type React from 'react';
import type { CocSubOrganisationUpsert } from '../../../../services/CocOrganisationService';
import { CocOrganisationFormFields } from './CocOrganisationFormFields';

interface CocOrganisationModalProps {
  title: string;
  form: CocSubOrganisationUpsert;
  setForm: React.Dispatch<React.SetStateAction<CocSubOrganisationUpsert>>;
  confirmLabel: string;
  confirmDisabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CocOrganisationModal({
  title,
  form,
  setForm,
  confirmLabel,
  confirmDisabled,
  onCancel,
  onConfirm,
}: CocOrganisationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <CocOrganisationFormFields form={form} setForm={setForm} />
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={confirmDisabled} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
