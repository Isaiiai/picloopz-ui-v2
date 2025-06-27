import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const ThankYouPage = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Stop confetti after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}

      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg z-10">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-playfair">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your response has been received. We appreciate your feedback and will proceed accordingly.
        </p>

        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 bg-terracotta-600 text-white rounded-full hover:bg-terracotta-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
