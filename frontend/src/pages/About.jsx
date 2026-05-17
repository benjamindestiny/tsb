// About.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const About = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading or fetch data
  useEffect(() => {
    // Page loads instantly after mount
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // THIS MUST BE INSIDE the component function
  if (loading) return <LoadingSpinner message="Loading About..." />;

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const teamCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 200 },
    },
  };

  const founderInfo = {
    name: "Benjamin Destiny",
    title: "Founder & CEO of TSB",
    company: "Founder at Flint",
    companyBio:
      "Neos is a tech company that delivers cutting-edge AI solutions, solving problems in better and innovative ways. We're reimagining how technology can transform everyday challenges into opportunities.",
    bio: "A passionate creator and developer who believes in empowering creators to turn their passion into sustainable careers. Built TSB to solve the funding gap for African creators.",
    image: "/founder.jpeg",
  };

  const coFounderInfo = {
    name: "Victor Omeife",
    title: "Co-Founder & CTO of TSB",
    company: "Co-Founder at Flint",
    companyBio:
      "Leading the technical vision at Neos, building AI-powered solutions that tackle complex problems with elegant, forward-thinking approaches.",
    bio: "Tech enthusiast and problem solver dedicated to building seamless payment solutions for creators. Leading the technical vision behind TSB's platform.",
    image: "/images/cofounder.jpg",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-purple-500/50 transition-all group"
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </motion.svg>
              <span className="font-medium">Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm">
              💜 Our Story
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            About
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              T.S.B
            </span>
          </motion.h1>

          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl px-8 py-4">
              <p className="text-gray-300 text-lg">
                <span className="text-purple-400 font-bold text-xl">TSB</span>{" "}
                stands for{" "}
                <span className="text-white font-semibold text-xl">
                  The Support Button
                </span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                One click to support your favorite creators
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto px-4 md:px-0 leading-relaxed"
          >
            We're on a mission to empower African creators by making it easy to
            receive support from their community. What started as a simple idea
            has grown into a platform that helps thousands of creators turn
            their passion into sustainable income.{" "}
            <span className="text-purple-400 font-semibold">
              The Support Button
            </span>{" "}
            is more than just a name — it's our promise to make creator support
            as simple as clicking a button.
          </motion.p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To democratize creator funding in Africa by building the most
              accessible, user-friendly support platform that connects creators
              directly with their communities through seamless local payment
              methods.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              A world where every African creator can turn their passion into a
              thriving career, supported by a community that values their work.
              We envision TSB as the go-to platform for creator support across
              the continent.
            </p>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet the Founders
            </h2>
            <p className="text-gray-400 text-lg">
              The passionate team behind TSB, building for creators across
              Africa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Founder */}
            <motion.div
              variants={teamCardVariants}
              whileHover={{ y: -10 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 border-4 border-purple-500/30">
                <img
                  src={founderInfo.image}
                  alt={`${founderInfo.name} - ${founderInfo.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                        ${founderInfo.name.charAt(0)}
                      </div>
                    `;
                  }}
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                {founderInfo.name}
              </h3>
              <p className="text-purple-400 font-medium mb-1">
                {founderInfo.title}
              </p>

              <div className="mb-4 inline-block">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
                  🚀 {founderInfo.company}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                {founderInfo.bio}
              </p>

              <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🤖</span>
                  <h4 className="text-white font-semibold text-sm">
                    About Neos
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {founderInfo.companyBio}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <a
                  href="https://x.com/BenjaminD_000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/benjamindestiny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/benjamin-destiny-a90881344/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Co-Founder */}
            <motion.div
              variants={teamCardVariants}
              whileHover={{ y: -10 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-pink-500 border-4 border-indigo-500/30">
                <img
                  src={coFounderInfo.image}
                  alt={`${coFounderInfo.name} - ${coFounderInfo.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                        ${coFounderInfo.name.charAt(0)}
                      </div>
                    `;
                  }}
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                {coFounderInfo.name}
              </h3>
              <p className="text-purple-400 font-medium mb-1">
                {coFounderInfo.title}
              </p>

              <div className="mb-4 inline-block">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium">
                  🚀 {coFounderInfo.company}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                {coFounderInfo.bio}
              </p>

              <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🤖</span>
                  <h4 className="text-white font-semibold text-sm">
                    About Neos
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {coFounderInfo.companyBio}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤝",
                title: "Community First",
                description:
                  "We believe in the power of community to transform creative careers. Every feature we build puts creators and their supporters at the center.",
              },
              {
                icon: "🔒",
                title: "Trust & Transparency",
                description:
                  "We're committed to secure, transparent transactions. What you earn is what you get, with no hidden fees or complicated terms.",
              },
              {
                icon: "🌍",
                title: "Africa-Focused",
                description:
                  "Built specifically for African creators with local payment methods, currencies, and an understanding of the unique challenges faced by creators on the continent.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 bg-gray-800/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-8">
              Need help or want to connect directly? Reach out on WhatsApp and
              we'll get back to you ASAP.
            </p>
            <a
              href="https://wa.me/2347017153753"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-3xl transition-colors"
            >
              <span>Chat on WhatsApp</span>
              <span className="text-xl">💬</span>
            </a>
            <p className="text-gray-400 mt-4">WhatsApp: +234 701 715 3753</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6 md:p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of creators who are already building their dreams
            with TSB.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={localStorage.getItem("tsb_token") ? "/dashboard" : "/login"}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl text-lg shadow-lg"
              >
                {localStorage.getItem("tsb_token")
                  ? "Go to Dashboard"
                  : "Get Started Now"}
              </motion.button>
            </Link>
            <a
              href="https://wa.me/2347017153753"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-lg"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
