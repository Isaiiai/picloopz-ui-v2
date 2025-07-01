import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Send, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Ordering & Customization']);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqData: FAQCategory[] = [
    {
      title: "Ordering & Customization",
      items: [
        {
          question: "How do I place an order for a customized gift?",
          answer: "To place an order, simply select your desired product, upload your image, choose customization options, and proceed to checkout. Our system will guide you through each step to ensure your gift is exactly as you want it."
        },
        {
          question: "What image formats do you accept for customization?",
          answer: "We accept most common image formats including JPEG, PNG, and HEIF. For the best quality results, we recommend high-resolution images of at least 1500x1500 pixels."
        },
        {
          question: "Can I preview my customized gift before ordering?",
          answer: "Yes! After uploading your image and selecting customization options, you'll see a preview of your gift. Additionally, before final production, we'll send you a digital proof for approval."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          question: "What are your shipping options and delivery times?",
          answer: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days) for physical products. Digital products are delivered via email immediately after design approval."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. International shipping times and costs vary by location. You can see exact shipping costs during checkout."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard under 'Order History'."
        }
      ]
    },
    {
      title: "Product & Quality",
      items: [
        {
          question: "What is the quality of your printed products?",
          answer: "We use premium materials and state-of-the-art printing technology to ensure the highest quality. Our frames are handcrafted, and we use archival-quality paper for all prints."
        },
        {
          question: "What if I'm not satisfied with my order?",
          answer: "Your satisfaction is our priority. If you're not completely happy with your order, please contact us within 30 days of receipt, and we'll work to make it right through our satisfaction guarantee."
        }
      ]
    },
    {
      title: "Payment & Pricing",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept payments through Razorpay, which supports credit/debit cards, UPI, net banking, and various digital wallets."
        },
        {
          question: "Are there any hidden costs?",
          answer: "No hidden costs! The price you see includes the product and customization. Shipping costs, if applicable, are clearly shown at checkout."
        }
      ]
    }
  ];

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/support/public', formData);
      toast.success('Thank you! Your question has been submitted. Our support team will respond soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit your question. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredFAQData = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-40 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(236,201,186,0.15)_0%,rgba(255,255,255,0)_100%)]"></div>
      <div className="absolute -left-24 top-1/3 w-48 h-48 rounded-full border border-terracotta-200 opacity-30"></div>
      <div className="absolute -right-32 bottom-1/4 w-64 h-64 rounded-full border-2 border-terracotta-100 opacity-40"></div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium mb-4">
            Help Center
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Find answers to common questions about our products, services, and processes.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 transition-colors"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {filteredFAQData.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className="mb-8"
              >
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-playfair font-semibold text-gray-900">{category.title}</h2>
                  {expandedCategories.includes(category.title) ? (
                    <ChevronUp className="w-5 h-5 text-terracotta-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-terracotta-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedCategories.includes(category.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.question}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                          className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                          <button
                            onClick={() => toggleQuestion(item.question)}
                            className="w-full flex items-center justify-between p-4 hover:bg-cream-50 transition-colors"
                          >
                            <h3 className="text-left font-medium text-gray-900">{item.question}</h3>
                            {expandedQuestions.includes(item.question) ? (
                              <ChevronUp className="w-4 h-4 text-terracotta-500 flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-terracotta-500 flex-shrink-0 ml-4" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedQuestions.includes(item.question) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-4 pb-4"
                              >
                                <p className="text-gray-600">{item.answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* No Results Message */}
          {searchQuery && filteredFAQData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-gray-600">No matching questions found. Please try a different search term or contact our support team for assistance.</p>
            </motion.div>
          )}
        </div>

        {/* Submit New Question Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mt-20 bg-white rounded-2xl p-8 shadow-lg relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          
          <h2 className="text-2xl font-playfair font-semibold mb-8 relative">
            Can't Find Your Answer?
            <div className="absolute -bottom-3 left-0 w-16 h-1 bg-terracotta-300 rounded-full"></div>
          </h2>

          <p className="text-gray-600 mb-6">
            Submit your question and we'll get back to you with an answer. Your question might even be added to our FAQ to help others!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 transition-colors"
                placeholder="How can we help you?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 transition-colors resize-none"
                placeholder="Type your question here..."
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Question
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Support Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Need immediate assistance? Visit our{' '}
            <a href="/contact" className="text-terracotta-600 hover:text-terracotta-700 font-medium">
              Contact Support
            </a>{' '}
            page.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage; 