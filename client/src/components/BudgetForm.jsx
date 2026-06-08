import { useState } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export default function BudgetForm({ onSubmit, onCancel, editingBudget }) {
  const [category, setCategory] = useState(editingBudget?.category || '');
  const [monthlyBudget, setMonthlyBudget] = useState(editingBudget?.monthlyBudget || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!category || !monthlyBudget) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
      setError('Monthly budget must be a positive number');
      return;
    }

    onSubmit({
      category,
      monthlyBudget: parseFloat(monthlyBudget)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: 'var(--bg-card)' }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {editingBudget ? 'Edit Budget' : 'Add New Budget'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Monthly Budget (₹)
          </label>
          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            placeholder="Enter monthly budget"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {editingBudget ? 'Update Budget' : 'Add Budget'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
