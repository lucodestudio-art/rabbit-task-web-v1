import React from 'react';

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center justify-center w-full px-4 py-2.5 
        border border-gray-300 rounded-lg shadow-sm bg-white 
        text-sm font-medium text-gray-700 hover:bg-gray-50 
        transition-all duration-200 transform hover:-translate-y-0.5
        ${className}
      `}
    >
      <span className="mr-2 h-5 w-5 flex items-center justify-center">
        {icon}
      </span>
      {label}
    </button>
  );
};

export default SocialButton;