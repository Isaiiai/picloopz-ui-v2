import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Upload, Palette, Eye, Truck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Photos",
      description: "Share your cherished memories through our easy-to-use upload system. We accept all common image formats.",
      details: [
        "Drag and drop or click to upload",
        "Support for multiple image formats",
        "High-resolution images recommended",
        "Secure cloud storage"
      ]
    },
    {
      icon: Palette,
      title: "Choose Your Design",
      description: "Browse our extensive collection of handcrafted designs or let us create something unique just for you.",
      details: [
        "Browse by category or style",
        "Custom design consultations available",
        "Multiple size options",
        "Frame and material selection"
      ]
    },
    {
      icon: Eye,
      title: "Preview & Approve",
      description: "Review your personalized design before production begins. Request unlimited revisions until you're completely satisfied.",
      details: [
        "Digital preview of your artwork",
        "Unlimited revision requests",
        "Professional design feedback",
        "Final approval before production"
      ]
    },
    {
      icon: Truck,
      title: "Handcrafted Creation",
      description: "Our skilled artisans carefully craft your artwork using premium materials and traditional techniques.",
      details: [
        "Handcrafted by skilled artisans",
        "Premium quality materials",
        "Traditional crafting techniques",
        "Quality control at every step"
      ]
    },
    {
      icon: Heart,
      title: "Elegant Delivery",
      description: "Receive your beautifully packaged custom creation, ready to bring warmth and memories to your space.",
      details: [
        "Careful packaging for protection",
        "Tracking information provided",
        "Express delivery options",
        "Satisfaction guarantee"
      ]
    }
  ];

  const features = [
    {
      title: "100% Handcrafted",
      description: "Every piece is individually crafted by our skilled artisans, ensuring unique quality and attention to detail."
    },
    {
      title: "Premium Materials",
      description: "We use only the finest materials, from archival-quality papers to museum-grade frames and finishes."
    },
    {
      title: "Unlimited Revisions",
      description: "Your satisfaction is our priority. Request as many changes as needed until your design is perfect."
    },
    {
      title: "Quality Guarantee",
      description: "We stand behind every piece with our satisfaction guarantee. Not happy? We'll make it right."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-terracotta-50 pt-24 sm:pt-20 md:pt-14">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-100/30 to-cream-100/30"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-6">
                Our Process
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-playfair mb-6">
                How We Create Your
                <span className="block text-terracotta-600">Perfect Piece</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                From your treasured memories to exquisite finished artwork, discover the meticulous process 
                that transforms your photos into stunning handcrafted pieces.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-terracotta-200 to-transparent"></div>
              
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center relative"
                  >
                    {/* Step Number */}
                    <div className="relative inline-flex mb-6">
                      <div className="absolute inset-0 rounded-full bg-terracotta-200 animate-pulse opacity-50" 
                           style={{ animationDelay: `${index * 0.2}s` }}></div>
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto relative z-10 border-2 border-terracotta-200 shadow-lg">
                        <IconComponent size={32} className="text-terracotta-600" />
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <h3 className="text-xl font-semibold mb-3 font-playfair text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Step Details */}
                    <ul className="text-left space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle size={16} className="text-terracotta-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-terracotta-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-6">
              Why Choose Picloopz?
            </h2>
            <p className="text-lg text-gray-600">
              We combine traditional craftsmanship with modern technology to deliver exceptional quality and service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg border border-cream-200 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 font-playfair text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-terracotta-600 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Start your journey today and transform your memories into stunning handcrafted artwork.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/category/all"
                  className="inline-flex items-center px-8 py-4 bg-white text-terracotta-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Start Shopping
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-terracotta-600 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-6">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Find answers to common questions about our process, materials, and services.
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center px-6 py-3 border-2 border-terracotta-400 text-terracotta-600 rounded-lg hover:bg-terracotta-50 transition-colors font-medium"
            >
              View FAQ
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage; 