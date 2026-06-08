import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetVsSpendingChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Budget vs Spending
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No budget data available
        </p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    category: item.category,
    Budget: item.budget,
    Spending: item.spent
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
      <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Budget vs Spending
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" style={{ fill: 'var(--text-secondary)' }} tick={{ fontSize: 10 }} />
          <YAxis style={{ fill: 'var(--text-secondary)' }} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: 'var(--text-primary)' }}
            labelStyle={{ color: 'var(--text-secondary)' }}
          />
          <Legend />
          <Bar dataKey="Budget" fill="#3b82f6" name="Budget" />
          <Bar dataKey="Spending" fill="#ef4444" name="Actual Spending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
