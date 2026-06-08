import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className="shadow-md" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Mini Expense Tracker
            </h1>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/analytics" className={navLinkClass('/analytics')}>
                Analytics
              </Link>
              <Link to="/budgets" className={navLinkClass('/budgets')}>
                Budgets
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Welcome, {user?.fullName}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-text)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
