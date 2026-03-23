import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  type = 'text',
  error,
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Generate random ID if not provided for accessibility
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`relative w-full mb-5 ${className}`}>
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 z-10">
            <Icon size={20} />
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          className={`
            peer block w-full rounded-lg border 
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-brand-orange focus:ring-orange-100'}
            bg-white px-3 py-3 text-gray-900 placeholder-transparent focus:outline-none focus:ring-4 transition-all
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
          `}
          placeholder={label}
          autoComplete="off"
          {...props}
        />

        {/* Floating Label */}
        <label
          htmlFor={inputId}
          className={`
            absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-500 transition-all
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
            peer-placeholder-shown:top-3.5 
            ${Icon ? 'peer-placeholder-shown:left-10' : 'peer-placeholder-shown:left-3'}
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-brand-orange peer-focus:left-3
            cursor-text
          `}
        >
          {label}
        </label>

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-500 mt-1 ml-1 block animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};