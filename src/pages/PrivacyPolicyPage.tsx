import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, Database, Users, Bell, Globe } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <Eye className="w-6 h-6 text-terracotta-500" />,
      title: "Information We Collect",
      content: "We collect personal information you provide directly to us, such as when you create an account, place an order, or contact us for support."
    },
    {
      icon: <Database className="w-6 h-6 text-terracotta-500" />,
      title: "How We Use Your Data",
      content: "We use your information to process orders, provide customer support, improve our services, and communicate with you about your account and orders."
    },
    {
      icon: <Lock className="w-6 h-6 text-terracotta-500" />,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      icon: <Users className="w-6 h-6 text-terracotta-500" />,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy or with your consent."
    },
    {
      icon: <Bell className="w-6 h-6 text-terracotta-500" />,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time."
    },
    {
      icon: <Globe className="w-6 h-6 text-terracotta-500" />,
      title: "Cookies & Tracking",
      content: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from."
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
              Privacy Policy
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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

            {/* Detailed Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-cream-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-playfair">Detailed Privacy Policy</h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
                  <p className="mb-4">
                    We collect information you provide directly to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Create an account or profile on our website</li>
                    <li>Place an order for our products or services</li>
                    <li>Upload photos or provide custom design requirements</li>
                    <li>Contact us for customer support or inquiries</li>
                    <li>Subscribe to our newsletter or marketing communications</li>
                    <li>Participate in surveys, contests, or promotions</li>
                  </ul>
                  <p className="mt-4">
                    The types of information we collect include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Personal identification information (name, email address, phone number)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Photos and images you upload for custom designs</li>
                    <li>Order history and preferences</li>
                    <li>Communication records and support tickets</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Automatically Collected Information</h3>
                  <p className="mb-4">
                    When you visit our website, we automatically collect certain information about your device and usage:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, links clicked)</li>
                    <li>Location information (general location based on IP address)</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Referral source and search terms</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h3>
                  <p className="mb-4">
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Order Processing:</strong> To process and fulfill your orders, including custom designs</li>
                    <li><strong>Customer Support:</strong> To provide assistance and respond to your inquiries</li>
                    <li><strong>Account Management:</strong> To maintain your account and provide personalized services</li>
                    <li><strong>Communication:</strong> To send order confirmations, updates, and important notices</li>
                    <li><strong>Marketing:</strong> To send promotional offers and newsletters (with your consent)</li>
                    <li><strong>Improvement:</strong> To analyze usage patterns and improve our website and services</li>
                    <li><strong>Security:</strong> To protect against fraud and ensure the security of our platform</li>
                    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing and Disclosure</h3>
                  <p className="mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and providing services (payment processors, shipping partners, etc.)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                    <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data for research and analytics purposes</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h3>
                  <p className="mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Secure payment processing through certified partners</li>
                    <li>Regular backups and disaster recovery procedures</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                  <p className="mt-4">
                    However, no method of transmission over the internet or electronic storage is 100% secure. 
                    While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies and Tracking Technologies</h3>
                  <p className="mb-4">
                    We use cookies and similar technologies to enhance your browsing experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                  </ul>
                  <p className="mt-4">
                    You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights and Choices</h3>
                  <p className="mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                    <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
                    <li><strong>Objection:</strong> Object to certain types of processing</li>
                    <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications at any time</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Data Retention</h3>
                  <p className="mb-4">
                    We retain your personal information for as long as necessary to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide our services and maintain your account</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                  <p className="mt-4">
                    When we no longer need your information, we will securely delete or anonymize it.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h3>
                  <p className="mb-4">
                    Our services are not intended for children under the age of 13. We do not knowingly collect 
                    personal information from children under 13. If you believe we have collected information 
                    from a child under 13, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h3>
                  <p className="mb-4">
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your information in accordance 
                    with this privacy policy and applicable data protection laws.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Policy</h3>
                  <p className="mb-4">
                    We may update this privacy policy from time to time. We will notify you of any material 
                    changes by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting the updated policy on our website</li>
                    <li>Sending an email notification to registered users</li>
                    <li>Displaying a notice on our website</li>
                  </ul>
                  <p className="mt-4">
                    Your continued use of our services after any changes indicates your acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h3>
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-terracotta-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> privacy@picloopz.com</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Address:</strong> Picloopz, Chennai, Tamil Nadu, India</p>
                    <p><strong>Data Protection Officer:</strong> dpo@picloopz.com</p>
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
              <h3 className="text-2xl font-bold mb-4">Have Questions About Privacy?</h3>
              <p className="text-terracotta-100 mb-6 max-w-2xl mx-auto">
                We're committed to protecting your privacy and being transparent about how we handle your data. 
                If you have any concerns or questions, don't hesitate to reach out to our privacy team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-terracotta-600 font-semibold rounded-lg hover:bg-terracotta-50 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/terms"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-terracotta-600 transition-colors"
                >
                  View Terms & Conditions
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 