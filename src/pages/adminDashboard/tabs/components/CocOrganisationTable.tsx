import { Building2, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { CocSubOrganisation } from '../../../../services/CocOrganisationService';
import { renderSubscriptionBadge } from './cocOrgHelpers';

interface CocOrganisationTableProps {
  items: CocSubOrganisation[];
  revealedRefs: Set<string>;
  onToggleReveal: (id: string) => void;
  onEdit: (item: CocSubOrganisation) => void;
  onDelete: (id: string) => void;
}

export function CocOrganisationTable({ items, revealedRefs, onToggleReveal, onEdit, onDelete }: CocOrganisationTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription / Reference</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.contactEmail && <div className="text-xs text-gray-500 mt-0.5">{item.contactEmail}</div>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                  {renderSubscriptionBadge(item.subscriptionType)}
                  {item.businessReference && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <span className="font-mono">
                        {revealedRefs.has(item.id) ? item.businessReference : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleReveal(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={revealedRefs.has(item.id) ? 'Hide reference' : 'Show reference'}
                      >
                        {revealedRefs.has(item.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button type="button" onClick={() => onEdit(item)} className="text-gray-400 hover:text-blue-600 mr-3">
                  <Edit className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
