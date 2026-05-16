import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect } from "react";

const MotionLink = motion(Link);

const Home = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Page loads instantly after mount
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // THIS MUST BE INSIDE the component function
  if (loading) return <LoadingSpinner message="Loading Home..." />;
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    },
  };

  // New smooth entry animations
  const pageEntrance = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      },
    },
  };

  const navReveal = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const heroTextReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.4 + i * 0.15,
        ease: "easeOut",
      },
    }),
  };

  const featureCardReveal = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  const scaleReveal = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Navigation with smooth reveal */}
      <motion.nav
        variants={navReveal}
        initial="hidden"
        animate="visible"
        className="relative z-20 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-36 h-36 rounded-3xl flex items-center justify-center"
            >
              <img
                src="logo.png"
                alt="tsb logo"
                className="w-[440px] h-[180px] object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Nav Links */}
          {/* Nav Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="hidden lg:flex items-center gap-8"
          >
            <motion.a
              whileHover={{ scale: 1.05, color: "#a78bfa" }}
              href="#features"
              className="text-gray-300 transition-colors"
            >
              Features
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, color: "#a78bfa" }}
              href="/about"
              className="text-gray-300 transition-colors"
            >
              About tsb
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {localStorage.getItem("tsb_token") ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Creator Login
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-20 md:pb-32"
      >
        <div className="text-center">
          {/* Badge with bounce animation */}
          <motion.div
            custom={0}
            variants={heroTextReveal}
            className="inline-block mb-6"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm inline-block"
            >
              🚀 Support Creators You Love
            </motion.span>
          </motion.div>

          {/* Main Heading with word-by-word reveal */}
          <motion.h1
            custom={1}
            variants={heroTextReveal}
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              Fuel Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, backgroundPosition: "200% center" }}
              animate={{ opacity: 1, backgroundPosition: "0% center" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {" "}
              Creative Journey
            </motion.span>
          </motion.h1>

          {/* Subtitle with smooth slide up */}
          <motion.p
            custom={2}
            variants={heroTextReveal}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Get support from your community, build your creative empire, and
            turn your passion into a sustainable career.
          </motion.p>

          {/* CTA Buttons with sequential reveal */}
          <motion.div
            custom={3}
            variants={heroTextReveal}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl text-lg shadow-lg"
            >
              <Link
                to={localStorage.getItem("tsb_token") ? "/dashboard" : "/login"}
              >
                <motion.span>
                  {localStorage.getItem("tsb_token")
                    ? "Go to Dashboard"
                    : "Start Creating Today"}
                </motion.span>
              </Link>
            </motion.button>

            <Link to="/how-it-works" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600 text-white font-semibold rounded-xl text-lg hover:bg-gray-700/50 transition-colors"
              >
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7, duration: 0.3 }}
                >
                  How It Works
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating Coffee with enhanced animation */}
          <motion.div
            custom={4}
            variants={heroTextReveal}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="text-8xl mb-12"
          >
            ☕
          </motion.div>

          {/* Stats with pop-in animation */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "8.4K+", label: "Creators", icon: "✨" },
              { number: "₦27M+", label: "Earned", icon: "💰" },
              { number: "85K+", label: "Supporters", icon: "❤️" },
              { number: "99%", label: "Satisfaction", icon: "🌟" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 10px 30px -5px rgba(139, 92, 246, 0.3)",
                }}
                className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="text-3xl mb-2"
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.2 }}
                  className="text-3xl font-bold text-white mb-1"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section with staggered card reveal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <motion.h2
          variants={scaleReveal}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Creators Love Us
          </motion.span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Instant Setup",
              description:
                "Get your support page live in minutes. No technical skills needed.",
            },
            {
              icon: "🔒",
              title: "Secure Payments",
              description:
                "Multiple payment options with bank-level security for peace of mind.",
            },
            {
              icon: "📊",
              title: "Smart Dashboard",
              description:
                "Track your earnings, manage supporters, and grow your community.",
            },
            {
              icon: "🎨",
              title: "Customizable",
              description:
                "Make it yours with custom branding, colors, and messaging.",
            },
            {
              icon: "📱",
              title: "Mobile First",
              description:
                "Your supporters can chip in from any device, anywhere.",
            },
            {
              icon: "💬",
              title: "Community Builder",
              description:
                "Build relationships with supporters through messages and updates.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureCardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.3)",
              }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section with pulse effect */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center"
      >
        <motion.div
          variants={scaleReveal}
          className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <MotionLink
            to="/login?signup=true"
            variants={slideInLeft}
            className="text-3xl md:text-4xl font-bold text-white cursor-pointer mb-4 relative z-10 block"
          >
            Ready to Start Your Journey?
          </MotionLink>
          <motion.p
            variants={slideInRight}
            className="text-xl text-gray-300 mb-8 relative z-10"
          >
            Join thousands of creators who are already building their dreams.
          </motion.p>
          <motion.div variants={scaleReveal} className="relative z-10">
            <Link
              to={localStorage.getItem("tsb_token") ? "/dashboard" : "/login"}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <motion.button>
                {localStorage.getItem("tsb_token")
                  ? "Go to Dashboard"
                  : "Get Started For Free"}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer with subtle reveal */}
      <Footer />
    </motion.div>
  );
};

export default Home;
