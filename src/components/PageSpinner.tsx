import React from 'react';

interface PageSpinnerProps {
  icon?: React.ReactNode;
}

const PageSpinner: React.FC<PageSpinnerProps> = ({ icon }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {icon && (
        <div className="mb-6 text-terracotta-500 animate-bounce drop-shadow-lg">
          {icon}
        </div>
      )}
      
      
    </div>
  );
};

export default PageSpinner;

// Add to tailwind.config.js:
// animation: {
//   'spin-slow': 'spin 1.2s linear infinite',
// }, 