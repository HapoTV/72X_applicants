type ApplicantsFetchErrorProps = {
  message: string;
  onRetry: () => void;
};

export function ApplicantsFetchError({ message, onRetry }: ApplicantsFetchErrorProps) {
  return (
    <div className="w-full">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h3>
        <p className="text-red-600">{message}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
