import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Star, Clock, Shield, Users, Award, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const AboutUsPage = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-terracotta-500" />,
      title: "Crafted with Love",
      description: "Every piece we create is infused with passion and attention to detail, ensuring your memories are preserved beautifully."
    },
    {
      icon: <Star className="w-6 h-6 text-terracotta-500" />,
      title: "Quality Excellence",
      description: "We use only the finest materials and cutting-edge technology to deliver premium quality products that last a lifetime."
    },
    {
      icon: <Clock className="w-6 h-6 text-terracotta-500" />,
      title: "Timely Delivery",
      description: "We understand the importance of your special moments and ensure your customized gifts reach you right on time."
    },
    {
      icon: <Shield className="w-6 h-6 text-terracotta-500" />,
      title: "Satisfaction Guaranteed",
      description: "Your happiness is our priority. We stand behind our products with a 100% satisfaction guarantee."
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "With over 15 years of experience in custom gift design, Sarah leads our creative vision."
    },
    {
      name: "Michael Chen",
      role: "Head of Production",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Michael ensures every product meets our high-quality standards before reaching your hands."
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Emily and her team work tirelessly to ensure your experience with us is nothing short of amazing."
    }
  ];

  const testimonials = [
    {
      name: "Jessica Smith",
      role: "Happy Customer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      quote: "The quality and attention to detail in every piece from Picloopz is simply amazing. They've helped me create the perfect gifts for my family."
    },
    {
      name: "David Wilson",
      role: "Loyal Client",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      quote: "I've been a customer for over 2 years now, and each creation has been more beautiful than the last. Their customer service is exceptional!"
    }
  ];

  const timeline = [
    {
      year: "2018",
      title: "Our Beginning",
      description: "Started with a small workshop and big dreams."
    },
    {
      year: "2019",
      title: "Digital Innovation",
      description: "Launched our online platform for custom orders."
    },
    {
      year: "2020",
      title: "Growing Community",
      description: "Reached 5,000+ happy customers milestone."
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Now serving customers worldwide with love."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white relative overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={targetRef} className="relative h-screen overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src="https://images.unsplash.com/photo-1596825205280-55adf7852f17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
            alt="Picloopz Workshop"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-20 h-full flex items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto px-4"
          >
            <span className="inline-block px-4 py-1 bg-terracotta-500/80 text-white rounded-full text-sm font-medium mb-4">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-bold font-playfair mb-6">
              Transforming Memories into
              <span className="block mt-2 text-terracotta-200">Timeless Treasures</span>
            </h1>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              At Picloopz, we believe every moment deserves to be cherished and celebrated. Our journey began with a simple idea: to help people preserve their precious memories in the most beautiful and meaningful way possible.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/category/all"
                className="inline-flex items-center px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all group"
              >
                Explore Our Collection
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cream-50 to-transparent" />
      </section>

      {/* Values Section with Enhanced Animation */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              We combine artisanal craftsmanship with modern technology to transform your special moments into beautiful, lasting keepsakes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-terracotta-50 rounded-full flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-terracotta-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              Milestones That Define Us
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-terracotta-200" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center justify-${index % 2 === 0 ? 'end' : 'start'} mb-8`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <span className="text-terracotta-500 font-bold text-xl">{item.year}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">{item.title}</h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-terracotta-500 rounded-full border-4 border-white" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Enhanced Cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-terracotta-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1 bg-terracotta-50 text-terracotta-700 rounded-full text-sm font-medium mb-4">
              Meet Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              The Artisans Behind Your Memories
            </h2>
            <p className="text-lg text-gray-600">
              Our talented team of craftspeople and designers work together to bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-terracotta-200">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-terracotta-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg relative"
              >
                <Quote className="w-12 h-12 text-terracotta-200 absolute -top-6 -left-6" />
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-terracotta-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-8 h-8" />, value: "10,000+", label: "Happy Customers" },
              { icon: <Award className="w-8 h-8" />, value: "50+", label: "Design Awards" },
              { icon: <Star className="w-8 h-8" />, value: "4.9/5", label: "Customer Rating" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 mx-auto mb-4 bg-terracotta-50 rounded-full flex items-center justify-center text-terracotta-600"
                >
                  {stat.icon}
                </motion.div>
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-4xl font-bold text-gray-900 mb-2"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-terracotta-50 to-cream-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair mb-6">
              Ready to Create Something Special?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Let us help you transform your cherished memories into beautiful, lasting keepsakes.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/category/all"
                className="inline-flex items-center px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all group"
              >
                Explore Our Collection
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage; 