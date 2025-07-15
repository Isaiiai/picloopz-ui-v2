import React from 'react';

const PageSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="w-12 h-12 border-4 border-terracotta-300 border-t-terracotta-500 rounded-full animate-spin" />
    </div>
  );
};

export default PageSpinner;

// Add to tailwind.config.js:
// animation: {
//   'spin-slow': 'spin 1.2s linear infinite',
// }, 