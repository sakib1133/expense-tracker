import { useState, useEffect } from 'react';
import { getExpenses } from './api/expenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import FilterBar from './components/FilterBar';
import SummaryPanel from './components/SummaryPanel';
import ExpensePieChart from './components/PieChart';
import ExportButton from './components/ExportButton';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
      setFilteredExpenses(sorted);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...expenses];

    if (filters.category !== 'All') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.dateRange === 'This Month') {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      });
    } else if (filters.dateRange === 'Last Month') {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
      });
    } else if (filters.dateRange === 'Custom' && filters.startDate && filters.endDate) {
      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= new Date(filters.startDate) && expDate <= new Date(filters.endDate);
      });
    }

    setFilteredExpenses(filtered);
  };

  const handleFormSubmit = () => {
    loadExpenses();
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
          Mini Expense Tracker
        </h1>

        <ExpenseForm
          editingExpense={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
        />

        <FilterBar onFilterChange={handleFilterChange} />

        <div className="flex justify-end mb-4">
          <ExportButton expenses={filteredExpenses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <SummaryPanel expenses={filteredExpenses} />
          </div>
          <div>
            <ExpensePieChart expenses={filteredExpenses} />
          </div>
        </div>

        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleEdit}
          onDelete={loadExpenses}
        />
      </div>
    </div>
  );
}
