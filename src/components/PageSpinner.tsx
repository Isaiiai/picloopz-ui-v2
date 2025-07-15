import React from 'react';

interface PageSpinnerProps {
  icon?: React.ReactNode;
  label?: string;
}

const PageSpinner: React.FC<PageSpinnerProps> = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {icon && (
        <div className="mb-6 text-terracotta-500 animate-bounce drop-shadow-lg">
          {icon}
        </div>
      )}
      <div className="relative w-16 h-16 flex items-center justify-center mb-4">
        <svg className="animate-spin-slow w-16 h-16 text-terracotta-400" viewBox="0 0 50 50">
          <circle
            className="opacity-20"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M25 5a20 20 0 0 1 20 20"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-terracotta-500 rounded-full animate-pulse" />
        </div>
      </div>
      {label && <div className="text-gray-600 text-base mt-2 animate-pulse">{label}</div>}
    </div>
  );
};

export default PageSpinner;

// Add to tailwind.config.js:
// animation: {
//   'spin-slow': 'spin 1.2s linear infinite',
// }, 