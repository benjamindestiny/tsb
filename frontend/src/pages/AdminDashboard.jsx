import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = "https://tsb-taln.onrender.com/api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({ totalCreators: 0, totalEarnings: 0, pendingWithdrawals: 0 });
  const [adminToken] = useState(localStorage.getItem("tsb_admin_token") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    if (adminToken) {
      setAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (data.success) {
        setWithdrawals(data.withdrawals || []);
        setStats(data.stats || stats);
      }
    } catch (err) {
      console.log("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === "tsbadmin2024") {
      const token = "admin_" + Date.now();
      localStorage.setItem("tsb_admin_token", token);
      setAuthenticated(true);
      setLoading(true);
      fetchData();
    } else {
      alert("Wrong password");
    }
  };

  const processWithdrawal = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/admin/withdrawal/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchData();
    } catch (err) {
      alert("Failed to update");
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin..." />;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Login</h1>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-gray-700 rounded-xl text-white mb-4 focus:outline-none focus:border-purple-500"
          />
          <button onClick={handleAdminLogin} className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage withdrawals and view platform stats</p>
          </div>
          <Link to="/dashboard" className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
            ← My Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Creators", value: stats.totalCreators, color: "from-purple-500/20 to-purple-600/20" },
            { label: "Platform Earnings", value: `₦${stats.totalEarnings?.toLocaleString() || 0}`, color: "from-green-500/20 to-green-600/20" },
            { label: "Pending", value: stats.pendingWithdrawals, color: "from-yellow-500/20 to-yellow-600/20" },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6`}>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Withdrawal Requests */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Withdrawal Requests</h2>
          
          {withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-gray-400">No pending withdrawals</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 text-sm">Creator</th>
                    <th className="text-left p-3 text-gray-400 text-sm">Amount</th>
                    <th className="text-left p-3 text-gray-400 text-sm">Bank Details</th>
                    <th className="text-left p-3 text-gray-400 text-sm">Status</th>
                    <th className="text-left p-3 text-gray-400 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w._id} className="border-b border-gray-700/50">
                      <td className="p-3">
                        <p className="text-white font-medium">{w.creator?.displayName || w.creator?.username || "Unknown"}</p>
                        <p className="text-gray-500 text-xs">@{w.creator?.username}</p>
                      </td>
                      <td className="p-3">
                        <span className="text-green-400 font-semibold">₦{w.amount?.toLocaleString()}</span>
                      </td>
                      <td className="p-3 text-gray-300 text-sm">
                        <p>{w.bankDetails?.bankName}</p>
                        <p>{w.bankDetails?.accountNumber}</p>
                        <p className="text-gray-500">{w.bankDetails?.accountName}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          w.status === "completed" ? "bg-green-500/20 text-green-300" :
                          w.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                          "bg-red-500/20 text-red-300"
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {w.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => processWithdrawal(w._id, "completed")}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => processWithdrawal(w._id, "rejected")}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {w.status === "completed" && <span className="text-green-400 text-xs">✅ Paid</span>}
                        {w.status === "rejected" && <span className="text-red-400 text-xs">❌ Rejected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
