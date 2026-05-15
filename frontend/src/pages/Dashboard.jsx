// Dashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

const API_URL = "https://tsb-api.onrender.com/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [creator, setCreator] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState(() => {
    const saved = localStorage.getItem("tsb_timeRange");
    return saved ? saved : "month";
  });

  const [stats, setStats] = useState({
    todayEarnings: 0,
    monthlyEarnings: 0,
    totalEarnings: 0,
    totalSupporters: 0,
    recentSupporters: [],
    earningsChart: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const savedCreator = localStorage.getItem("tsb_creator");
    if (savedCreator) {
      setCreator(JSON.parse(savedCreator));
      fetchStats();
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("tsb_token");
      const { data } = await axios.get(`${API_URL}/creator/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.log("Stats fetch failed, using defaults");
    }
  };

  useEffect(() => {
    localStorage.setItem("tsb_timeRange", timeRange);
  }, [timeRange]);

  if (loading) return <LoadingSpinner message="Loading Dashboard..." />;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -260, opacity: 0 },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 p-6 flex-shrink-0"
          >
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 mb-6 cursor-pointer"
              >
                <img
                  src="logo.png"
                  alt="tsb logo"
                  className="w-40 h-auto object-contain"
                />
              </motion.div>
            </Link>

            <nav className="space-y-2">
              {[
                {
                  id: "overview",
                  icon: "📊",
                  label: "Overview",
                  to: "/dashboard",
                },
                {
                  id: "supporters",
                  icon: "❤️",
                  label: "Supporters",
                  to: "/supporter-history",
                },
                {
                  id: "withdraw",
                  icon: "💸",
                  label: "Withdraw",
                  to: "/withdraw",
                },
                {
                  id: "settings",
                  icon: "⚙️",
                  label: "Settings",
                  to: "/settings",
                },
                {
                  id: "profile",
                  icon: "👤",
                  label: "My Profile",
                  to: "/profile",
                },
              ].map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.to}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 bg-purple-400 rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
              <Link
                to="/supporter-history"
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg text-white hover:border-purple-500/50 transition-all group"
              >
                <span className="text-lg">📋</span>
                <span className="font-medium">Support History</span>
                <motion.svg
                  className="w-4 h-4 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </motion.button>
              <h1 className="text-2xl font-bold text-white">
                Welcome back,{" "}
                {creator?.displayName || creator?.username || "Creator"}! 👋
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/supporter-history"
                  className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <span>📋</span> Support History
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link
                  to="/profile"
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform overflow-hidden"
                  title="Go to Profile"
                >
                  {creator?.avatar ? (
                    <img
                      src={creator.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {creator?.displayName?.charAt(0)?.toUpperCase() ||
                        creator?.username?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Today's Earnings",
                value: `₦${stats.todayEarnings.toLocaleString()}`,
                icon: "💎",
                change: stats.todayEarnings > 0 ? "Today" : "No data yet",
                color: "from-purple-500/20 to-purple-600/20",
              },
              {
                label: "Monthly Earnings",
                value: `₦${stats.monthlyEarnings.toLocaleString()}`,
                icon: "💰",
                change:
                  stats.monthlyEarnings > 0 ? "This month" : "No data yet",
                color: "from-green-500/20 to-green-600/20",
              },
              {
                label: "Total Supporters",
                value: stats.totalSupporters,
                icon: "❤️",
                change: stats.totalSupporters > 0 ? "Total" : "No data yet",
                color: "from-pink-500/20 to-pink-600/20",
              },
              {
                label: "Total Earnings",
                value: `₦${stats.totalEarnings.toLocaleString()}`,
                icon: "🏆",
                change: "All time",
                color: "from-indigo-500/20 to-indigo-600/20",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Earnings Chart & Recent Supporters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Earnings Overview
                </h3>
                <div className="flex gap-2">
                  {["week", "month", "year"].map((range) => (
                    <motion.button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-lg text-sm capitalize ${timeRange === range ? "bg-purple-500 text-white" : "bg-gray-700/50 text-gray-400 hover:text-white"}`}
                    >
                      {range}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between h-48 gap-2">
                {stats.earningsChart.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{
                      height: `${Math.max((value / 50000) * 100, 2)}%`,
                    }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg relative group"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ₦{value.toLocaleString()}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-gray-500 text-sm">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Recent Support
                </h3>
                <Link
                  to="/supporter-history"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>

              {stats.recentSupporters.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-3 block">💝</span>
                  <p className="text-gray-400 text-sm mb-1">
                    No supporters yet
                  </p>
                  <p className="text-gray-500 text-xs">
                    Share your support link to start receiving support!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentSupporters
                    .slice(0, 4)
                    .map((supporter, index) => (
                      <motion.div
                        key={supporter.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {supporter.anonymous ? "?" : supporter.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {supporter.anonymous ? "Anonymous" : supporter.name}
                          </p>
                          {supporter.message && (
                            <p className="text-gray-400 text-xs truncate">
                              "{supporter.message}"
                            </p>
                          )}
                        </div>
                        <span className="text-green-400 font-semibold text-sm">
                          ₦{supporter.amount.toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your Support History
                </h3>
                <p className="text-gray-400">
                  View all {stats.totalSupporters} supporters, their messages,
                  and manage your community
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/supporter-history"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-3 whitespace-nowrap"
                >
                  <span className="text-xl">📋</span>
                  <span>View Full History</span>
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
