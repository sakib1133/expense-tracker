export default function BudgetProgressCard({ category, budget, spent, remaining, percentage }) {
  const getProgressColor = () => {
    if (percentage <= 70) return 'bg-green-500';
    if (percentage <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressBgColor = () => {
    if (percentage <= 70) return 'bg-green-100';
    if (percentage <= 90) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTextColor = () => {
    if (percentage <= 70) return 'text-green-700';
    if (percentage <= 90) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {category}
        </h3>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>Budget:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            ₹{budget.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>Spent:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            ₹{spent.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>Remaining:</span>
          <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{remaining.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
