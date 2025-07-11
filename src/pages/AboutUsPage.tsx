import { motion } from 'framer-motion';

const AboutUsPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-terracotta-50">
      {/* Immersive Hero Section */}
      <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center items-center overflow-hidden pb-10 md:pb-20">
        {/* Enhanced Animated 3D shapes for hero section */}
        <motion.div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {/* Distribute shapes all over the hero section */}
          {/* Top left */}
          <motion.div className="absolute top-[8%] left-[6%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-terracotta-400 via-terracotta-300 to-cream-300 shadow-2xl opacity-90" animate={{ y: [0, 30, 0], x: [0, 10, 0], rotate: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Top center */}
          <motion.div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-16 h-16 md:w-24 md:h-24 border-4 border-terracotta-400 rounded-full opacity-80 shadow-lg" animate={{ y: [0, 18, 0], x: [0, -10, 0], rotate: [0, 45, 0] }} transition={{ duration: 9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Top right */}
          <motion.div className="absolute top-[12%] right-[8%] w-14 h-14 md:w-20 md:h-20 bg-gradient-to-tr from-terracotta-500 to-terracotta-300 shadow-xl opacity-90 rounded-lg rotate-12" animate={{ y: [0, -20, 0], x: [0, -12, 0], rotate: [12, 24, 12] }} transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Left center */}
          <motion.div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 bg-gradient-to-tr from-terracotta-300 to-terracotta-400 shadow-md opacity-80 rounded-lg rotate-6" animate={{ y: [0, -10, 0], x: [0, 8, 0], rotate: [6, 18, 6] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Center left blob */}
          <motion.div className="absolute left-[22%] top-[60%] w-16 h-8 md:w-28 md:h-14 bg-gradient-to-br from-cream-200 via-terracotta-200 to-terracotta-300 opacity-70 blur-lg rounded-full" animate={{ scale: [1, 1.08, 1], y: [0, 10, 0] }} transition={{ duration: 11, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Center right blob */}
          <motion.div className="absolute right-[18%] top-[55%] w-20 h-12 md:w-32 md:h-20 bg-gradient-to-br from-terracotta-200 via-cream-200 to-terracotta-300 opacity-70 blur-lg rounded-full" animate={{ scale: [1, 1.08, 1], y: [0, 10, 0] }} transition={{ duration: 13, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Right center small sphere */}
          <motion.div className="absolute right-[10%] top-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-terracotta-500 to-terracotta-300 shadow-lg opacity-80" animate={{ y: [0, 12, 0], x: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Bottom left */}
          <motion.div className="absolute left-[8%] bottom-[10%] w-10 h-10 md:w-14 md:h-14 bg-gradient-to-tr from-terracotta-300 to-terracotta-400 shadow-md opacity-80 rounded-lg rotate-6" animate={{ y: [0, -10, 0], x: [0, 8, 0], rotate: [6, 18, 6] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Bottom center */}
          <motion.div className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-24 h-10 md:w-40 md:h-16 bg-gradient-to-br from-terracotta-300 via-cream-200 to-terracotta-400 opacity-80 blur-2xl rounded-full" animate={{ scale: [1, 1.1, 1], y: [0, 18, 0] }} transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
          {/* Bottom right */}
          <motion.div className="absolute right-[8%] bottom-[12%] w-12 h-12 md:w-16 md:h-16 border-4 border-terracotta-400 rounded-full opacity-80 shadow-lg" animate={{ y: [0, 18, 0], x: [0, -10, 0], rotate: [0, 45, 0] }} transition={{ duration: 9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} style={{ zIndex: 1 }} />
        </motion.div>
        <div className="relative z-30 flex flex-col items-center justify-center px-4 pt-40 pb-10 sm:pt-40 md:pt-40 md:pb-16 lg:pt-56 lg:pb-20 w-full max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 font-playfair text-center mb-6 drop-shadow-xl"
          >
            <span className="block animate-typewriter">Crafting Memories,</span>
            <span className="block bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 bg-clip-text text-transparent animate-gradient-move">Delivering Smiles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-800 text-center max-w-xl mb-8 drop-shadow"
          >
            Your trusted online destination for personalized gifts, handcrafted with care and delivered with love.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.07, boxShadow: '0 0 40px 0 rgba(188, 134, 106, 0.6)' }}
            whileTap={{ scale: 0.97 }}
            href="/category/all"
            className="inline-flex items-center px-7 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 text-white font-bold rounded-xl shadow-2xl text-base sm:text-lg tracking-wide animate-glow drop-shadow-lg hover:shadow-terracotta-500/50 transition-all duration-300"
          >
            Shop Gifts
            <svg className="ml-3 w-7 h-7 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.a>
        </div>
      </section>
      {/* Editorial Our Story Timeline */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair text-center mb-16 relative"
        >
          Our Story
          <span className="block w-24 h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 rounded-full mt-2 mx-auto shadow-lg"></span>
        </motion.h2>
        <div className="relative flex flex-col md:flex-row items-stretch gap-0 md:gap-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta-300 via-terracotta-400 to-terracotta-500 rounded-full md:block hidden shadow-lg" />
          <div className="flex-1 flex flex-col items-end gap-16 md:pr-8">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-cream-200 relative hover:shadow-2xl transition-all duration-300">
              <span className="absolute -left-8 top-8 w-8 h-8 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-full border-4 border-white shadow-lg md:block hidden"></span>
              <h3 className="text-xl font-bold mb-2 font-playfair text-terracotta-700">Founded with Passion</h3>
              <p className="text-gray-700">Picloopz began with a simple idea: to make every occasion special with unique, handcrafted gifts. Our founders believed in the joy of giving and the power of memories.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }} className="max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-cream-200 relative hover:shadow-2xl transition-all duration-300">
              <span className="absolute -left-8 top-8 w-8 h-8 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full border-4 border-white shadow-lg md:block hidden"></span>
              <h3 className="text-xl font-bold mb-2 font-playfair text-terracotta-700">Growing With You</h3>
              <p className="text-gray-700">From our first order to thousands of happy customers, we've grown thanks to your trust and love. Every gift is a story, and we're honored to be part of yours.</p>
            </motion.div>
          </div>
          <div className="flex-1 flex flex-col items-start gap-16 md:pl-8 mt-16 md:mt-0">
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }} className="max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-cream-200 relative hover:shadow-2xl transition-all duration-300">
              <span className="absolute -right-8 top-8 w-8 h-8 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-full border-4 border-white shadow-lg md:block hidden"></span>
              <h3 className="text-xl font-bold mb-2 font-playfair text-terracotta-700">Handcrafted With Care</h3>
              <p className="text-gray-700">Our artisans pour their heart into every creation, ensuring each gift is as unique as the person receiving it. Quality and creativity are at the core of everything we do.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }} className="max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-cream-200 relative hover:shadow-2xl transition-all duration-300">
              <span className="absolute -right-8 top-8 w-8 h-8 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full border-4 border-white shadow-lg md:block hidden"></span>
              <h3 className="text-xl font-bold mb-2 font-playfair text-terracotta-700">Delivering Smiles</h3>
              <p className="text-gray-700">We believe in making gifting easy, memorable, and delightful. Our mission is to deliver not just gifts, but happiness—right to your doorstep.</p>
          </motion.div>
          </div>
        </div>
      </section>
      {/* Why Choose Us - Animated Icon Row */}
      <section className="relative w-full flex justify-center py-16">
        <div className="max-w-6xl w-full px-4 md:px-8 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair text-center mb-12 relative"
          >
            Why Choose Picloopz?
            <span className="block w-24 h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 rounded-full mt-2 mx-auto shadow-lg"></span>
          </motion.h2>
          <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:gap-8 overflow-x-auto py-4 hide-scrollbar justify-center w-full">
            {[
              {
                icon: <svg className="w-16 h-16 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4m0 0L3 9m9-5l9 5"/></svg>,
                title: "Handcrafted Quality",
                desc: "Made by skilled artisans."
              },
              {
                icon: <svg className="w-16 h-16 text-terracotta-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
                title: "Fast Delivery",
                desc: "Quick, reliable shipping."
              },
              {
                icon: <svg className="w-16 h-16 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>,
                title: "1000+ Happy Customers",
                desc: "Trusted for every occasion."
              },
              {
                icon: <svg className="w-16 h-16 text-terracotta-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87"/><path d="M9 20H4v-2a4 4 0 013-3.87"/><path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/></svg>,
                title: "Secure Ordering",
                desc: "Safe, easy checkout."
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.08, rotate: [0, 3, -3, 0], boxShadow: '0 12px 40px 0 rgba(188, 134, 106, 0.25)' }}
                className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-cream-200 px-4 py-6 sm:px-8 mx-0 sm:mx-2 transition-all text-center min-w-0 hover:shadow-2xl"
              >
                <div className="p-3 bg-gradient-to-br from-terracotta-100 to-terracotta-200 rounded-full mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 font-playfair mt-4 mb-1 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works - Animated Stepper */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair text-center mb-12 relative"
        >
          How It Works
          <span className="block w-24 h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 rounded-full mt-2 mx-auto shadow-lg"></span>
        </motion.h2>
        <div className="relative flex flex-col items-center">
          <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-1 bg-gradient-to-b from-terracotta-300 via-terracotta-400 to-terracotta-500 rounded-full shadow-lg" />
          {[
            {
              icon: <svg className="w-12 h-12 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M8 8h8v8H8z"/></svg>,
              title: "Choose Your Gift",
              desc: "Browse our curated collection online."
            },
            {
              icon: <svg className="w-12 h-12 text-terracotta-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4m0 0L3 9m9-5l9 5"/></svg>,
              title: "Personalize & Order",
              desc: "Add your photos or message and place your order."
            },
            {
              icon: <svg className="w-12 h-12 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
              title: "We Handcraft & Pack",
              desc: "Our team creates and carefully packs your gift."
            },
            {
              icon: <svg className="w-12 h-12 text-terracotta-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>,
              title: "Delivered to Your Doorstep",
              desc: "Fast, safe delivery to you or your loved one."
            }
          ].map((item, idx) => (
              <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="relative flex flex-col items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-cream-200 px-8 py-10 mb-12 w-full max-w-md hover:shadow-3xl transition-all duration-300"
              style={{ zIndex: 10 - idx }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-8 h-8 bg-gradient-to-br from-terracotta-400 via-terracotta-500 to-terracotta-600 rounded-full shadow-xl border-2 border-white" />
              <div className="p-4 bg-gradient-to-br from-terracotta-100 to-terracotta-200 rounded-full mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 font-playfair mt-4 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-center text-base">{item.desc}</p>
              </motion.div>
            ))}
        </div>
      </section>
      {/* Customer Love - Testimonial Carousel */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair text-center mb-12 relative"
        >
          Customer Love
          <span className="block w-24 h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 rounded-full mt-2 mx-auto shadow-lg"></span>
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 sm:flex sm:flex-row sm:gap-8 overflow-x-auto py-4 hide-scrollbar justify-center">
          {[
            {
              name: "Roshan Kumar",
              quote: "Very good service and customer friendly staff.",
              img: "https://source.unsplash.com/random/100x100?person-1"
            },
            {
              name: "Ganesh Kumar",
              quote: "Good work with awesome finish... Home delivery is one of the best support.",
              img: "https://source.unsplash.com/random/100x100?person-2"
            },
            {
              name: "Kalees",
              quote: "Excellent work... quick response... thank you so much sissy 🥰",
              img: "https://source.unsplash.com/random/100x100?person-3"
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px 0 rgba(188, 134, 106, 0.25)' }}
              className="flex flex-col items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-cream-200 px-4 py-6 sm:px-8 sm:py-8 mx-0 sm:mx-2 transition-all min-w-0 hover:shadow-3xl"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-terracotta-300 shadow-xl mb-4">
                <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-700 italic mb-2 text-lg">"{testimonial.quote}"</p>
              <span className="text-terracotta-600 font-semibold">{testimonial.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Final CTA */}
      <section className="relative w-full py-16 flex flex-col items-center justify-center bg-gradient-to-br from-cream-100 via-terracotta-50 to-cream-200">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-terracotta-700 font-playfair text-center mb-6 drop-shadow-lg"
        >
          Ready to make someone smile?
        </motion.h2>
        <motion.a
          whileHover={{ scale: 1.07, boxShadow: '0 0 40px 0 rgba(188, 134, 106, 0.6)' }}
          whileTap={{ scale: 0.97 }}
          href="/category/all"
          className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 text-white font-bold rounded-xl shadow-2xl text-xl tracking-wide mt-4 animate-glow hover:shadow-terracotta-500/50 transition-all duration-300"
        >
          Start Shopping
          <svg className="ml-3 w-7 h-7 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </motion.a>
      </section>
      {/* Floating image animation CSS */}
      <style>{`
        .floating-img { animation: floatY 4s ease-in-out infinite alternate; }
        .floating-img:nth-child(2) { animation-delay: 1.2s; }
        .floating-img:nth-child(3) { animation-delay: 2.1s; }
        @keyframes floatY {
          0% { transform: translateY(0) scale(1) rotate(var(--tw-rotate)); }
          100% { transform: translateY(-18px) scale(1.04) rotate(var(--tw-rotate)); }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 3s ease-in-out infinite;
        }
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;
