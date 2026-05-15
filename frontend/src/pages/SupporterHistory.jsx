import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const SupporterHistory = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [supporters] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner message="Loading Support History..." />;

  const filteredSupporters = supporters
    .filter((s) => {
      if (filter === "anonymous") return s.anonymous;
      if (filter === "with-message") return s.message?.length > 0;
      return true;
    })
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.message?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const totalEarnings = filteredSupporters.reduce(
    (sum, s) => sum + s.amount,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Support History</h1>
            <p className="text-gray-400 mt-1">
              All the amazing people who support your work
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
          >
            <p className="text-gray-400 text-sm">Total Supporters</p>
            <p className="text-2xl font-bold text-white">{supporters.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
          >
            <p className="text-gray-400 text-sm">Total Earned</p>
            <p className="text-2xl font-bold text-green-400">
              ₦{totalEarnings.toLocaleString()}
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search supporters or messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Supporters</option>
            <option value="anonymous">Anonymous Only</option>
            <option value="with-message">With Messages</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {filteredSupporters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              No supporters found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        ) : (
          <div className="hidden md:block bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Supporter
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Amount
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Message
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSupporters.map((supporter, index) => (
                    <motion.tr
                      key={supporter.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.05)",
                      }}
                      className="border-b border-gray-700/50 last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {supporter.anonymous
                              ? "?"
                              : supporter.name?.charAt(0)}
                          </div>
                          <span className="text-white font-medium">
                            {supporter.anonymous ? "Anonymous" : supporter.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-semibold">
                          ₦{supporter.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        {supporter.message ? (
                          <p className="text-gray-300 italic max-w-xs truncate">
                            "{supporter.message}"
                          </p>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(supporter.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupporterHistory;
