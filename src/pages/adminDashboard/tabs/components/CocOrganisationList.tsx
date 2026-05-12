import { Building2 } from 'lucide-react';
import type { CocSubOrganisation } from '../../../../services/CocOrganisationService';
import { CocOrganisationTable } from './CocOrganisationTable';

interface CocOrganisationListProps {
  loading: boolean;
  items: CocSubOrganisation[];
  revealedRefs: Set<string>;
  onToggleReveal: (id: string) => void;
  onEdit: (item: CocSubOrganisation) => void;
  onDelete: (id: string) => void;
}

export function CocOrganisationList({ loading, items, revealedRefs, onToggleReveal, onEdit, onDelete }: CocOrganisationListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading organisations...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No organisations yet</h3>
        <p className="text-gray-600">Add your first organisation under your COC.</p>
      </div>
    );
  }

  return (
    <CocOrganisationTable
      items={items}
      revealedRefs={revealedRefs}
      onToggleReveal={onToggleReveal}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
