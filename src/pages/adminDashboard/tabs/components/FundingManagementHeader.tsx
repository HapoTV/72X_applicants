interface FundingManagementHeaderProps {
  onAddFunding: () => void;
}

export function FundingManagementHeader({ onAddFunding }: FundingManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Funding Opportunities</h1>
        <p className="text-gray-600 mt-1">Create and manage funding opportunities and visibility for organisations</p>
      </div>
      <button onClick={onAddFunding} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
        Add Funding
      </button>
    </div>
  );
}
