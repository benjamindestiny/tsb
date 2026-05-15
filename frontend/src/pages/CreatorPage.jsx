import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = "http://localhost:5000/api";

const CreatorPage = () => {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [supportAmount, setSupportAmount] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [supporterEmail, setSupporterEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("opay");
  const [showPayment, setShowPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const quickAmounts = [3000, 5000, 10000, 20000];

  useEffect(() => {
    fetchCreator();
  }, [username]);

  const fetchCreator = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/creator/${username}`);
      if (data.success) {
        setCreator(data.creator);
      } else {
        setError("Creator not found");
      }
    } catch (err) {
      setError("Creator not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async (e) => {
    e.preventDefault();
    if (!supportAmount || Number(supportAmount) < 3000) {
      setError("Minimum support is ₦3,000");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post(`${API_URL}/donations/support/${username}`, {
        supporterName: isAnonymous ? "Anonymous" : supporterName,
        supporterEmail,
        amount: Number(supportAmount),
        message,
        isAnonymous,
        paymentMethod,
        paymentReference: `manual-${Date.now()}`,
      });

      setSuccessMessage("Thank you for your support! 🎉");
      setShowPayment(false);
      setSupportAmount("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading creator..." />;
  if (error && !creator) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😔</span>
          <h1 className="text-3xl font-bold text-white mb-2">{error}</h1>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="TSB"
              className="w-10 h-10 object-contain"
            />
            <span className="text-white font-bold">TSB</span>
          </Link>
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Are you a creator? Login
          </Link>
        </div>
      </div>

      {/* Creator Profile */}
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
          {(creator.displayName || creator.username || "?")
            .charAt(0)
            .toUpperCase()}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          {creator.displayName || creator.username}
        </h1>
        <p className="text-gray-400 mb-2">@{creator.username}</p>
        {creator.bio && <p className="text-gray-300 mb-6">{creator.bio}</p>}

        {/* Social Links */}
        {creator.socialLinks && creator.socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {creator.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-full text-gray-300 hover:text-white hover:border-purple-500/50 transition-all text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Support Message */}
        <p className="text-gray-400 mb-8 italic">
          "Enjoy my content? Tap The Support Button ☕"
        </p>

        {/* Success */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 mb-6"
          >
            <span className="text-4xl block mb-2">🎉</span>
            <p className="text-green-300 font-semibold">{successMessage}</p>
          </motion.div>
        )}

        {/* Support Button */}
        {!showPayment ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPayment(true)}
            className="px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl text-xl shadow-lg"
          >
            ☕ Support Me
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-left"
          >
            <h3 className="text-white font-semibold text-lg mb-4 text-center">
              Send Support
            </h3>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Amount (₦)
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSupportAmount(amt.toString())}
                    className={`px-3 py-1 rounded-lg text-sm ${supportAmount === amt.toString() ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={supportAmount}
                onChange={(e) => setSupportAmount(e.target.value)}
                placeholder="Custom amount"
                min={3000}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Name */}
            {!isAnonymous && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Anonymous */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-400 text-sm">Support anonymously</span>
            </label>

            {/* Message */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Leave a message..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Payment Method
              </label>
              <div className="flex gap-2">
                {[
                  { id: "opay", label: "OPay" },
                  { id: "bank_transfer", label: "Bank Transfer" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`px-4 py-2 rounded-lg text-sm ${paymentMethod === m.id ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* OPay Details */}
            {paymentMethod === "opay" && creator.opayNumber && (
              <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                <p className="text-gray-400 text-sm">Send your support to:</p>
                <p className="text-white font-bold text-lg">
                  {creator.opayNumber}
                </p>
                <p className="text-gray-500 text-xs">
                  OPay • {creator.displayName || creator.username}
                </p>
              </div>
            )}

            {/* Bank Details */}
            {paymentMethod === "bank_transfer" &&
              creator.bankDetails?.accountNumber && (
                <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-gray-400 text-sm">Send your support to:</p>
                  <p className="text-white font-bold">
                    {creator.bankDetails.bankName}
                  </p>
                  <p className="text-white">
                    {creator.bankDetails.accountNumber}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {creator.bankDetails.accountName}
                  </p>
                </div>
              )}

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleSupport}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50"
            >
              {submitting
                ? "Processing..."
                : `Support with ₦${supportAmount ? Number(supportAmount).toLocaleString() : "0"}`}
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-2 py-2 text-gray-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </div>

      {/* TSB Branding */}
      <div className="text-center pb-8">
        <p className="text-gray-600 text-sm">
          Powered by{" "}
          <Link to="/" className="text-purple-500 hover:text-purple-400">
            TSB
          </Link>{" "}
          — The Support Button
        </p>
      </div>
    </div>
  );
};

export default CreatorPage;
