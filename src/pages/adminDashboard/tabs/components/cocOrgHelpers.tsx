import type { ReactNode } from 'react';
import type { CocSubOrganisation, CocSubOrganisationUpsert } from '../../../../services/CocOrganisationService';

export const EMPTY_COC_ORGANISATION_FORM: CocSubOrganisationUpsert = {
  name: '',
  contactFullName: '',
  contactEmail: '',
  contactMobile: '',
  industry: '',
  location: '',
  employees: '',
  yearEstablished: new Date().getFullYear(),
  businessReference: '',
  subscriptionType: '',
};

export const isCocOrganisationFormValid = (form: CocSubOrganisationUpsert): boolean =>
  form.name.trim().length > 0 &&
  form.contactFullName.trim().length > 0 &&
  form.contactEmail.trim().length > 0 &&
  form.contactMobile.trim().length > 0 &&
  form.industry.trim().length > 0 &&
  form.location.trim().length > 0 &&
  form.employees.trim().length > 0 &&
  Number.isFinite(Number(form.yearEstablished)) &&
  form.businessReference.trim().length > 0 &&
  form.subscriptionType.trim().length > 0;

export const getCocOrganisationFormFromItem = (item: CocSubOrganisation): CocSubOrganisationUpsert => ({
  name: item.name || '',
  contactFullName: item.contactFullName || '',
  contactEmail: item.contactEmail || '',
  contactMobile: item.contactMobile || '',
  industry: item.industry || '',
  location: item.location || '',
  employees: item.employees || '',
  yearEstablished: item.yearEstablished || new Date().getFullYear(),
  businessReference: item.businessReference || '',
  subscriptionType: item.subscriptionType || '',
});

export const getCocOrganisationUpsertPayload = (form: CocSubOrganisationUpsert): CocSubOrganisationUpsert => ({
  ...form,
  name: form.name.trim(),
  yearEstablished: Number(form.yearEstablished),
});

export const renderSubscriptionBadge = (type: string | undefined): ReactNode => {
  switch (type) {
    case 'PREMIUM':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">PREMIUM</span>;
    case 'ESSENTIAL':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">ESSENTIAL</span>;
    case 'START_UP':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">START_UP</span>;
    default:
      return null;
  }
};

export const toggleSetMembership = (source: Set<string>, id: string): Set<string> => {
  const next = new Set(source);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};
