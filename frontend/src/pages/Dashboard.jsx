import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const API_URL = "https://tsb-taln.onrender.com/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState(() => {
    const saved = localStorage.getItem("tsb_timeRange");
    return saved ? saved : "month";
  });
  const [copied, setCopied] = useState(false);

  const [stats, setStats] = useState({
    todayEarnings: 0, monthlyEarnings: 0, totalEarnings: 0,
    totalSupporters: 0, recentSupporters: [],
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
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.log("Stats fetch failed");
    }
  };

  useEffect(() => {
    localStorage.setItem("tsb_timeRange", timeRange);
  }, [timeRange]);

  const copySupportLink = () => {
    navigator.clipboard.writeText(`https://tsb-blue.vercel.app/${creator.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner message="Loading Dashboard..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Welcome back, {creator?.displayName || creator?.username || "Creator"}! 👋
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/supporter-history"
                className="hidden sm:flex px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all text-sm font-medium items-center gap-2"
              >
                <span>📋</span> History
              </Link>
              <Link
                to="/profile"
                className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
              >
                <span className="text-white font-bold text-xs">
                  {creator?.displayName?.charAt(0)?.toUpperCase() ||
                    creator?.username?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Today", value: `₦${stats.todayEarnings.toLocaleString()}`, icon: "💎", color: "from-purple-500/20 to-purple-600/20" },
              { label: "Monthly", value: `₦${stats.monthlyEarnings.toLocaleString()}`, icon: "💰", color: "from-green-500/20 to-green-600/20" },
              { label: "Supporters", value: stats.totalSupporters, icon: "❤️", color: "from-pink-500/20 to-pink-600/20" },
              { label: "Total", value: `₦${stats.totalEarnings.toLocaleString()}`, icon: "🏆", color: "from-indigo-500/20 to-indigo-600/20" },
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 md:p-6`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Support Link Card */}
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">🔗 Your Support Link</h3>
                <p className="text-gray-400 text-sm">Share this link everywhere to receive support</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <code className="bg-gray-900/50 px-3 py-2 rounded-lg text-purple-400 text-xs md:text-sm truncate max-w-[200px]">
                  tsb-blue.vercel.app/{creator.username}
                </code>
                <button onClick={copySupportLink} className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
                  {copied ? "✅" : "📋"}
                </button>
                <a href={`https://tsb-blue.vercel.app/${creator.username}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors text-sm">
                  👁️
                </a>
              </div>
            </div>
          </div>

          {/* Recent Supporters */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Support</h3>
              <Link to="/supporter-history" className="text-purple-400 hover:text-purple-300 text-sm">View All →</Link>
            </div>
            {stats.recentSupporters.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">💝</span>
                <p className="text-gray-400">No supporters yet</p>
                <p className="text-gray-500 text-xs mt-1">Share your support link to start receiving support!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentSupporters.slice(0, 5).map((supporter, index) => (
                  <div key={supporter.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {supporter.anonymous ? "?" : supporter.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{supporter.anonymous ? "Anonymous" : supporter.name}</p>
                      {supporter.message && <p className="text-gray-400 text-xs truncate">"{supporter.message}"</p>}
                    </div>
                    <span className="text-green-400 font-semibold text-sm flex-shrink-0">₦{supporter.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
