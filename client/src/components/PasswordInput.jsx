import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ 
  id, 
  value, 
  onChange, 
  required = false, 
  minLength, 
  placeholder = '••••••••',
  className = '',
  style = {}
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePasswordVisibility();
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border focus:outline-none focus:ring-2 text-sm pr-10 ${className}`}
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          ...style
        }}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        onKeyDown={handleKeyDown}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        tabIndex={0}
      >
        {showPassword ? (
          <EyeOff size={20} aria-hidden="true" />
        ) : (
          <Eye size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
