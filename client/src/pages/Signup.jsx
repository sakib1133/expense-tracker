import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import PasswordInput from '../components/PasswordInput';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await register(fullName, email, password, confirmPassword);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Mini Expense Tracker
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Create your account</p>
        </div>

        <div className="rounded-lg p-6 sm:p-8 shadow-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 rounded-md text-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 text-sm"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 text-sm"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-text)' }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {isInstallable && !isInstalled && (
            <button
              onClick={promptInstall}
              className="w-full mt-4 py-2 sm:py-3 px-4 rounded-md font-medium transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid var(--primary)',
                color: 'var(--primary)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Install App
            </button>
          )}

          <p className="mt-4 sm:mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
