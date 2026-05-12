import type { AdminFundingItem } from '../../../../interfaces/FundingData';

interface FundingTableProps {
  fundingItems: AdminFundingItem[];
  loading: boolean;
  onEdit: (funding: AdminFundingItem) => void;
  onDelete: (fundingId: string) => void;
}

export function FundingTable({ fundingItems, loading, onEdit, onDelete }: FundingTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROVIDER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INDUSTRY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORGANISATION</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VISIBILITY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEADLINE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-6 text-center text-sm text-gray-600">
                  Loading funding opportunities...
                </td>
              </tr>
            ) : fundingItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-6 text-center text-sm text-gray-600">
                  No funding opportunities yet
                </td>
              </tr>
            ) : (
              fundingItems.map((funding) => (
                <tr key={funding.id}>
                  <td className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-900">{funding.title}</div>
                    {funding.description && <div className="text-sm text-gray-500 mt-1 line-clamp-2">{funding.description}</div>}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{funding.provider}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {funding.industry ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{funding.industry}</span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {funding.type ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{funding.type}</span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{funding.organisation || 'All Organisations'}</td>
                  <td className="px-6 py-3 text-sm">
                    {funding.isPublic ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Public</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Restricted</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{funding.fundingAmount || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{funding.deadline || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {funding.contactInfo ? (
                      <a href={`mailto:${funding.contactInfo}`} className="text-blue-600 hover:text-blue-800">
                        {funding.contactInfo}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {funding.applicationUrl && (
                      <a href={funding.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mr-4">
                        View
                      </a>
                    )}
                    <button className="text-green-600 hover:text-green-800 mr-4" onClick={() => onEdit(funding)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(funding.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
