import { useState } from 'react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
const DATE_RANGES = ['All Time', 'This Month', 'Last Month', 'Custom'];

export default function FilterBar({ onFilterChange }) {
  const [category, setCategory] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    onFilterChange({
      category: newCategory,
      dateRange,
      startDate,
      endDate
    });
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    onFilterChange({
      category,
      dateRange: newDateRange,
      startDate,
      endDate
    });
  };

  const handleCustomDateChange = () => {
    onFilterChange({
      category,
      dateRange: 'Custom',
      startDate,
      endDate
    });
  };

  return (
    <div className="shadow p-4 mb-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '14px' }}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border focus:outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px' }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 border focus:outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px' }}
          >
            {DATE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {dateRange === 'Custom' && (
          <>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={handleCustomDateChange}
                className="w-full px-3 py-2 border focus:outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px' }}
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={handleCustomDateChange}
                className="w-full px-3 py-2 border focus:outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px' }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
