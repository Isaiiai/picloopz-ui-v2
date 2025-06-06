import { FC } from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error loading products</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
