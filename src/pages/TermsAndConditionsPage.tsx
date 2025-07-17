import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Users, CreditCard, Truck, Clock } from 'lucide-react';

const TermsAndConditionsPage = () => {
  const sections = [
    {
      icon: <Shield className="w-6 h-6 text-terracotta-500" />,
      title: "Acceptance of Terms",
      content: "By accessing and using Picloopz.com, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: <Users className="w-6 h-6 text-terracotta-500" />,
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-terracotta-500" />,
      title: "Payment Terms",
      content: "All payments must be made in full at the time of order placement. We accept major credit cards, debit cards, and digital wallets. Prices are subject to change without notice."
    },
    {
      icon: <Truck className="w-6 h-6 text-terracotta-500" />,
      title: "Shipping & Delivery",
      content: "Delivery times are estimates only. We are not responsible for delays due to circumstances beyond our control. Risk of loss and title for items pass to you upon delivery."
    },
    {
      icon: <Clock className="w-6 h-6 text-terracotta-500" />,
      title: "Returns & Refunds",
      content: "Custom personalized items cannot be returned unless defective. Standard items may be returned within 14 days in original condition. Refunds will be processed within 5-7 business days."
    },
    {
      icon: <FileText className="w-6 h-6 text-terracotta-500" />,
      title: "Intellectual Property",
      content: "All content on this website, including text, graphics, logos, and images, is the property of Picloopz and is protected by copyright laws."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-terracotta-50">
      {/* Animated background shapes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-terracotta-200 via-terracotta-100 to-cream-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-200 to-cream-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-cream-100 via-cream-200 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link 
              to="/" 
              className="inline-flex items-center text-terracotta-600 hover:text-terracotta-700 mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-playfair mb-4">
              Terms & Conditions
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services. 
              By using Picloopz, you agree to be bound by these terms.
            </p>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-cream-200"
          >
            <p className="text-center text-gray-700">
              <strong>Last Updated:</strong> December 15, 2024
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Key Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cream-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-terracotta-100 rounded-lg">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Detailed Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-cream-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-playfair">Detailed Terms & Conditions</h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Service Description</h3>
                  <p className="mb-4">
                    Picloopz is an online platform that specializes in creating personalized gifts, custom artwork, 
                    and handcrafted items. Our services include design consultation, custom creation, and delivery 
                    of personalized products.
                  </p>
                  <p>
                    We offer a wide range of products including but not limited to: custom photo frames, 
                    personalized artwork, handcrafted gifts, and decorative items.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Order Process & Customization</h3>
                  <p className="mb-4">
                    All orders are processed on a first-come, first-served basis. Custom orders require 
                    additional processing time and may not be available for rush delivery.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Custom designs require approval before production begins</li>
                    <li>Changes to custom orders may incur additional fees</li>
                    <li>Production begins only after final approval and payment confirmation</li>
                    <li>Rush orders are subject to availability and additional charges</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Pricing & Payment</h3>
                  <p className="mb-4">
                    All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated. 
                    Prices are subject to change without prior notice.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Custom design fees are non-refundable</li>
                    <li>Shipping costs are calculated based on delivery location and package weight</li>
                    <li>International orders may incur additional customs duties and taxes</li>
                    <li>Payment must be completed before order processing begins</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Shipping & Delivery</h3>
                  <p className="mb-4">
                    We strive to deliver all orders within the estimated timeframe. However, delivery times 
                    are estimates and may vary based on location and order complexity.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Standard delivery: 5-7 business days</li>
                    <li>Express delivery: 2-3 business days (additional charges apply)</li>
                    <li>Custom orders: 7-14 business days</li>
                    <li>International shipping: 10-21 business days</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Returns & Refunds</h3>
                  <p className="mb-4">
                    Due to the personalized nature of our products, returns are limited. We want you to be 
                    completely satisfied with your purchase.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Custom personalized items cannot be returned unless defective</li>
                    <li>Standard items may be returned within 14 days in original condition</li>
                    <li>Defective items will be replaced or refunded at our discretion</li>
                    <li>Return shipping costs are the responsibility of the customer</li>
                    <li>Refunds will be processed within 5-7 business days</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Privacy & Data Protection</h3>
                  <p className="mb-4">
                    We are committed to protecting your privacy. Your personal information is collected, 
                    used, and protected in accordance with our Privacy Policy.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Personal photos and information are used solely for order fulfillment</li>
                    <li>We do not share your personal information with third parties</li>
                    <li>All data is stored securely and encrypted</li>
                    <li>You may request deletion of your personal data at any time</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
                  <p className="mb-4">
                    Picloopz shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages arising from your use of our services.
                  </p>
                  <p>
                    Our total liability shall not exceed the amount paid by you for the specific product 
                    or service giving rise to the claim.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Governing Law</h3>
                  <p>
                    These terms and conditions are governed by and construed in accordance with the laws 
                    of India. Any disputes arising from these terms shall be subject to the exclusive 
                    jurisdiction of the courts in Chennai, Tamil Nadu.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h3>
                  <p className="mb-4">
                    If you have any questions about these Terms & Conditions, please contact us:
                  </p>
                  <div className="bg-terracotta-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> picloopz@gmail.com</p>
                    <p><strong>Phone:</strong> +91 63696 31356</p>
                    <p><strong>Address:</strong> Picloopz Color Lab and Customized Gifts, SML Complex, Ground Floor, Income Tax Office Opposite, Arunachalam Chettyar Street, Karaikudi - 630001</p>
                  </div>
                </section>
              </div>
            </motion.div>

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-xl p-8 text-white shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
              <p className="text-terracotta-100 mb-6">
                If you need clarification on any of these terms, our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="px-6 py-3 bg-white text-terracotta-600 rounded-lg font-semibold hover:bg-terracotta-50 transition-colors"
                >
                  Contact Support
                </Link>
                <Link 
                  to="/privacy-policy" 
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-terracotta-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated accent keyframes */}
      <style>{`
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite alternate; }
        @keyframes pulse-slow { 0% { opacity: 0.3; } 100% { opacity: 0.6; } }
        .animate-floatY { animation: floatY 8s ease-in-out infinite alternate; }
        .animate-floatX { animation: floatX 10s ease-in-out infinite alternate; }
        @keyframes floatY { 0% { transform: translateY(0); } 100% { transform: translateY(-18px); } }
        @keyframes floatX { 0% { transform: translateX(0); } 100% { transform: translateX(18px); } }
      `}</style>
    </div>
  );
};

export default TermsAndConditionsPage; 