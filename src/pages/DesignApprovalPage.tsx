import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/axiosConfig';

const DesignApprovalPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [designPreview, setDesignPreview] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await api.get(`/design/token/${token}`, {
          headers: { 'X-Public-Request': true }
        });
        setDesignPreview(res.data?.data?.designPreview);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Invalid or expired token');
        navigate('/');
      }
    };

    if (token) fetchDesign();
  }, [token, navigate]);

  const handleApproval = async (approved: boolean) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await api.post(`/design/approve/${token}`, { approved, feedback }, {
        headers: { 'X-Public-Request': true }
      });

      toast.success(approved ? 'Design approved!' : 'Change request submitted.');
      navigate('/thank-you');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!designPreview) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 font-playfair">Design Approval</h1>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <img 
          src={designPreview.designImageUrl} 
          alt="Design Preview" 
          className="w-full object-contain rounded-md max-h-[500px] mb-4" 
        />

        <p className="mb-6 text-gray-700">
          Please review your design preview carefully. Once approved, we’ll move forward with production.
        </p>

        {!isFeedbackMode ? (
          <div className="flex gap-4">
            <button
              disabled={isSubmitting}
              onClick={() => handleApproval(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Approve Design
            </button>
            <button
              onClick={() => setIsFeedbackMode(true)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Request Changes
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApproval(false);
            }}
            className="space-y-4"
          >
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Let us know what changes you'd like to see..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setIsFeedbackMode(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DesignApprovalPage;
