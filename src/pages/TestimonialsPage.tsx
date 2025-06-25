import React from 'react';
import { mockTestimonials } from '../data/mockData';
import { Link } from 'react-router-dom';

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-cream-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-gray-900">Customer Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTestimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-cream-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.userAvatar} 
                  alt={testimonial.userName} 
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-cream-200"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.userName}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-terracotta-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic flex-1">{testimonial.text}</p>
              {testimonial.productImage && (
                <img 
                  src={testimonial.productImage} 
                  alt="Customer product" 
                  className="mt-4 w-full h-48 object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="inline-flex items-center px-8 py-3 border-2 border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors group font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;