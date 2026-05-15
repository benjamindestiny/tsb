// HowItWorks.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const HowItWorks = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner message="Loading..." />;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const steps = [
    {
      number: "01",
      icon: "✨",
      title: "Create Your Account",
      description:
        "Sign up in seconds. Set up your profile, add your display name, bio, and customize how your support page looks.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      number: "02",
      icon: "🔗",
      title: "Get Your Support Link",
      description:
        "Once your profile is set up, you'll get a unique link like tsb.com/yourname. This is your personal support page.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      number: "03",
      icon: "📤",
      title: "Share Everywhere",
      description:
        "Put your link on your social media bios, YouTube descriptions, website, or anywhere your fans find you.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "04",
      icon: "💝",
      title: "Receive Support",
      description:
        "Your supporters click the link, choose an amount, and send support via OPay, bank transfer, or card payment.",
      color: "from-cyan-500 to-green-500",
    },
    {
      number: "05",
      icon: "💰",
      title: "Track & Withdraw",
      description:
        "Monitor your earnings in real-time from your dashboard. Withdraw to your bank or OPay when you reach ₦3,000.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const features = [
    {
      icon: "🎨",
      title: "Customizable Page",
      desc: "Make your support page match your brand with themes and colors.",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      desc: "Your supporters can chip in from any device, anywhere.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      desc: "Multiple local payment methods with bank-level security.",
    },
    {
      icon: "📊",
      title: "Smart Dashboard",
      desc: "Track every donation, see supporter messages, and manage withdrawals.",
    },
    {
      icon: "💬",
      title: "Supporter Messages",
      desc: "Fans can leave encouraging messages with their support.",
    },
    {
      icon: "🌍",
      title: "Built for Africa",
      desc: "OPay, PalmPay, bank transfers — we support local payment methods.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-purple-500/50 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div {...fadeIn} className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm mb-6">
            📖 Simple & Easy
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TSB
            </span>{" "}
            Works
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Five simple steps to start receiving support from your community. No
            technical skills needed.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`flex flex-col md:flex-row gap-6 items-center bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}
              >
                {step.icon}
              </div>

              {/* Step Number */}
              <div className="hidden md:block text-6xl font-bold text-gray-600/30 flex-shrink-0 w-24 text-center">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div
                  className={`inline-block px-3 py-1 bg-gradient-to-r ${step.color} rounded-full text-white text-xs font-bold mb-3`}
                >
                  Step {step.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Creators Love TSB
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Receiving Support?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join creators across Africa who are turning their passion into
            income.
          </p>
          <Link
            to={localStorage.getItem("tsb_token") ? "/dashboard" : "/signup"}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl text-lg shadow-lg"
            >
              {localStorage.getItem("tsb_token")
                ? "Go to Dashboard"
                : "Create Your Account"}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
