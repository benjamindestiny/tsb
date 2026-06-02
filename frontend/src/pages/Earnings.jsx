import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

const Earnings = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner message="Loading Earnings..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 md:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 md:p-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl text-white font-bold">
              Earnings
            </h1>
          </div>
          <p className="text-gray-400 mb-8">
            View your full earnings breakdown, payout history, and revenue
            trends.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-gray-800/60 rounded-3xl border border-gray-700/50">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-3">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-white">₦0</p>
              <p className="text-gray-500 mt-2">
                All-time earnings across all channels.
              </p>
            </div>
            <div className="p-6 bg-gray-800/60 rounded-3xl border border-gray-700/50">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-3">
                Monthly Payout
              </p>
              <p className="text-3xl font-bold text-white">₦0</p>
              <p className="text-gray-500 mt-2">
                Your latest payout total for the current month.
              </p>
            </div>
            <div className="p-6 bg-gray-800/60 rounded-3xl border border-gray-700/50">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-3">
                Recent Balance
              </p>
              <p className="text-3xl font-bold text-white">₦0dollars</p>
              <p className="text-gray-500 mt-2">
                Available balance ready for withdrawal.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Earnings;
