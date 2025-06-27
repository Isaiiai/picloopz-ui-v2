import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Star, Clock, Shield, Users, Award, ArrowRight, Quote, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const DEFAULT_PROFILE =
  "https://ui-avatars.com/api/?name=User&background=eee&color=888&size=100&rounded=true";

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
      description: "We create every piece with care and emotion, ensuring your memories are preserved beautifully."
    },
    {
      icon: <Star className="w-6 h-6 text-terracotta-500" />,
      title: "Wide Variety",
      description: "Over 1000+ unique gifts & frames – all crafted to suit your moments perfectly."
    },
    {
      icon: <Clock className="w-6 h-6 text-terracotta-500" />,
      title: "Fast Packing",
      description: "We value your time and pack your personalized gifts quickly and securely."
    },
    {
      icon: <Shield className="w-6 h-6 text-terracotta-500" />,
      title: "Satisfaction Guarantee",
      description: "We offer 100% replacement support and stand by the quality of our work."
    }
  ];

  const testimonials = [
    {
      name: "Roshan Kumar",
      role: "Customer",
      image: "https://source.unsplash.com/random/100x100?person-1",
      quote: "Very good service and customer friendly staff."
    },
    {
      name: "Ganesh Kumar",
      role: "Customer",
      image: "https://source.unsplash.com/random/100x100?person-2",
      quote: "Good work with awesome finish... Home delivery is one of the best support."
    },
    {
      name: "Kalees",
      role: "Customer",
      image: "https://source.unsplash.com/random/100x100?person-3",
      quote: "Excellent work... quick response... thank you so much sissy 🥰"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white relative overflow-hidden">
      {/* Hero Section */}
      <section ref={targetRef} className="relative min-h-[400px] sm:min-h-[600px] md:h-screen overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src="https://res.cloudinary.com/dr6n03ecb/image/upload/v1751004201/pic_loopz_logo_copy_ic1bro.jpg"
            alt="Picloopz Workshop"
            className="w-full h-full object-cover"
            style={{ minHeight: '400px' }} // fallback for very small screens
          />
        </motion.div>

        <div className="relative z-20 h-full flex items-center justify-center text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold font-playfair mb-6">
              Welcome to the World of <span className="block mt-2 text-terracotta-200">Customized Gifts</span>
            </h1>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              🎁 1000+ Unique Gifts & Frames – All in One Place! From Photo Collage Frames to Personal Gifts – We Craft Memories. Perfect for Birthdays, Anniversaries, and All Special Moments. 🌍 Worldwide Delivery | 💰 Affordable Prices | 🚚 Fast Packing.
            </p>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Pic Loopz is your go-to destination for online Photoshop edits, digital art, and custom picture frames. Our team of freelance Photoshop editors specializes in mosaic collages, digital painting, photo gifts, photo manipulation, old photo restoration, and more. We craft custom-size frames and deliver all over Tamil Nadu with 100% satisfaction and replacement guarantee.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

      {/* Values Section */}
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
              Why Choose Pic Loopz?
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              We turn your special memories into handcrafted frames and photo gifts with care, quality, and creativity.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-lg relative flex flex-col items-center text-center"
              >
                <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-terracotta-200 absolute -top-5 -left-5 sm:-top-6 sm:-left-6" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-2 sm:mr-4 flex items-center justify-center">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.user-icon-fallback')?.classList.remove('hidden');
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300" />
                  )}
                  <span className="user-icon-fallback hidden absolute inset-0 flex items-center justify-center">
                    <User className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300" />
                  </span>
                </div>
                <p className="text-gray-600 italic text-sm sm:text-base">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              Let us help you turn your favorite moments into beautiful, lasting gifts.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
