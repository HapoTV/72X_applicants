import type React from 'react';
import type { CocSubOrganisationUpsert } from '../../../../services/CocOrganisationService';

interface CocOrganisationFormFieldsProps {
  form: CocSubOrganisationUpsert;
  setForm: React.Dispatch<React.SetStateAction<CocSubOrganisationUpsert>>;
}

const fields = [
  { key: 'contactFullName', label: 'Full Name', type: 'text' },
  { key: 'contactEmail', label: 'Email Address', type: 'email' },
  { key: 'contactMobile', label: 'Mobile Number', type: 'text' },
  { key: 'industry', label: 'Industry', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'employees', label: 'Employees', type: 'text' },
  { key: 'yearEstablished', label: 'Year Established', type: 'number' },
] as const;

export function CocOrganisationFormFields({ form, setForm }: CocOrganisationFormFieldsProps) {
  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      {fields.map(({ key, label, type }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type}
            value={String(form[key])}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                [key]: type === 'number' ? Number(e.target.value) : e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Reference</label>
        <input
          type="text"
          value={form.businessReference}
          onChange={(e) => setForm((p) => ({ ...p, businessReference: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Type</label>
        <select
          value={form.subscriptionType}
          onChange={(e) => setForm((p) => ({ ...p, subscriptionType: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select subscription type</option>
          <option value="START_UP">START_UP</option>
          <option value="ESSENTIAL">ESSENTIAL</option>
          <option value="PREMIUM">PREMIUM</option>
        </select>
      </div>
    </div>
  );
}
