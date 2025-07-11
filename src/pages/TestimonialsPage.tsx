import { useState } from 'react';
import { mockTestimonials } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const clampText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const TestimonialsPage = () => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-terracotta-50 pt-24 sm:pt-20 md:pt-14">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-100/40 to-cream-100/30 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-4">
                Real Stories, Real Smiles
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-playfair mb-4">
                What Our Customers Say
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Discover how Picloopz has helped people turn their memories into art. Read their stories and see why they love us!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTestimonials.map((testimonial, idx) => {
            const isLong = testimonial.text.length > 180;
            const isExpanded = expanded[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl shadow-lg border border-cream-200 hover:shadow-2xl transition-shadow flex flex-col p-6 group"
              >
                {/* Quote Icon */}
                <Quote className="absolute -top-6 left-6 w-10 h-10 text-terracotta-200 opacity-60" />
                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.userAvatar}
                    alt={testimonial.userName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-terracotta-200 shadow"
                  />
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">{testimonial.userName}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < testimonial.rating
                              ? 'text-terracotta-400 fill-terracotta-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Testimonial Text */}
                <div className="flex-1 mb-4">
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                    {isLong && !isExpanded
                      ? clampText(testimonial.text, 180)
                      : testimonial.text}
                  </p>
                  {isLong && (
                    <button
                      className="mt-2 text-sm text-brand-cyan hover:underline flex items-center gap-1"
                      onClick={() => toggleExpand(idx)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
                {/* Product Image */}
                {testimonial.productImage && (
                  <div className="mt-2 mb-2 rounded-xl overflow-hidden border border-cream-100 shadow-sm">
                    <img
                      src={testimonial.productImage}
                      alt="Customer product"
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-terracotta-600 to-amber-400">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-playfair text-white mb-4">
              Ready to Create Your Own Story?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Join thousands of happy customers. Start your journey with Picloopz today!
            </p>
            <Link
              to="/category/all"
              className="inline-flex items-center px-8 py-4 bg-white text-terracotta-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start Shopping
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;