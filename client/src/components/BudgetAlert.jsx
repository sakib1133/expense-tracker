export default function BudgetAlert({ percentage, category }) {
  if (percentage < 80) return null;

  const isOverspent = percentage >= 100;

  return (
    <div
      className={`border-l-4 p-3 sm:p-4 mb-3 sm:mb-4 rounded-r ${
        isOverspent
          ? 'bg-red-50 border-red-500'
          : 'bg-yellow-50 border-yellow-500'
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {isOverspent ? (
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-2 sm:ml-3">
          <p className={`text-xs sm:text-sm font-medium ${isOverspent ? 'text-red-800' : 'text-yellow-800'}`}>
            {isOverspent
              ? `Overspent Alert: ${category} budget exceeded by ${percentage.toFixed(1)}%`
              : `Warning: ${category} budget usage at ${percentage.toFixed(1)}%`}
          </p>
        </div>
      </div>
    </div>
  );
}
