import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = "https://tsb-taln.onrender.com/api";


const YOUR_OPAY_NUMBER = "7017153753";
const YOUR_OPAY_NAME = "Williams Ruth Ashomen";

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
  const [showPayment, setShowPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showOpayDetails, setShowOpayDetails] = useState(false);
  const [supportReference, setSupportReference] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const quickAmounts = [3000, 5000, 10000, 20000];

  useEffect(() => {
    const savedCreator = localStorage.getItem("tsb_creator");
    if (savedCreator) {
      const user = JSON.parse(savedCreator);
      setLoggedInUser(user);
      setSupporterEmail(user.email || "");
      setSupporterName(user.displayName || user.username || "");
    }
    fetchCreator();
  }, [username]);

  const fetchCreator = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/creator/${username}`);
      if (data.success) setCreator(data.creator);
      else setError("Creator not found");
    } catch (err) {
      setError("Creator not found");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSupport = async () => {
    if (!supportAmount || Number(supportAmount) < 3000) {
      setError("Minimum support is ₦3,000");
      return;
    }

    setSubmitting(true);
    setError("");

    const reference = `TSB-${Date.now().toString(36).toUpperCase().slice(-4)}`;
    setSupportReference(reference);

    try {
      // Record the donation as pending
      await axios.post(`${API_URL}/donations/support/${username}`, {
        supporterName: isAnonymous
          ? "Anonymous"
          : supporterName || loggedInUser?.displayName || "Supporter",
        supporterEmail: supporterEmail || "anonymous@tsb.com",
        amount: Number(supportAmount),
        message,
        isAnonymous,
        paymentMethod: "opay",
        paymentReference: reference,
      });

      // Show OPay details
      setShowOpayDetails(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmPaymentSent = () => {
    setShowSuccessPopup(true);
    setShowPayment(false);
    setShowOpayDetails(false);
    setSupportAmount("");
    setMessage("");
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
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="TSB"
                className="w-10 h-10 object-contain"
              />
              <span className="text-white font-bold">TSB</span>
            </Link>
          </div>
          {loggedInUser ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(loggedInUser.displayName || loggedInUser.username || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span>@{loggedInUser.username}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white"
            >
              Are you a creator? Login
            </Link>
          )}
        </div>
      </div>

      {/* Creator Profile */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
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

        <p className="text-gray-400 mb-8 italic">
          "Enjoy my content? Tap The Support Button ☕"
        </p>

        {!showPayment ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPayment(true)}
            className="px-6 md:px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl text-xl shadow-lg"
          >
            ☕ Support Me
          </motion.button>
        ) : showOpayDetails ? (
          /* OPAY DETAILS SCREEN */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 text-left"
          >
            <h3 className="text-white font-semibold text-lg mb-4 text-center">
              📱 Send via OPay
            </h3>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-400 text-sm mb-1">
                Send exactly this amount:
              </p>
              <p className="text-green-400 font-bold text-3xl">
                ₦{Number(supportAmount).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-400 text-sm mb-1">To this OPay number:</p>
              <p className="text-white font-bold text-2xl tracking-widest">
                {YOUR_OPAY_NUMBER}
              </p>
              <p className="text-gray-400 text-sm mt-1">{YOUR_OPAY_NAME}</p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-400 text-sm mb-1">
                Reference (add as note):
              </p>
              <p className="text-yellow-400 font-mono font-bold text-lg">
                {supportReference}
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
              <p className="text-yellow-400 text-sm text-center">
                ⚠️ Open your OPay app now and send{" "}
                <strong>₦{Number(supportAmount).toLocaleString()}</strong> to{" "}
                <strong>{YOUR_OPAY_NUMBER}</strong>
              </p>
            </div>

            <button
              onClick={confirmPaymentSent}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              ✅ I've Sent the Money
            </button>

            <button
              onClick={() => {
                setShowOpayDetails(false);
                setShowPayment(false);
              }}
              className="w-full mt-2 py-2 text-gray-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          /* PAYMENT FORM */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-left"
          >
            <h3 className="text-white font-semibold text-lg mb-4 text-center">
              Send Support via OPay
            </h3>

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

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-400 text-sm">Support anonymously</span>
            </label>

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

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-gray-500 text-xs">Powered by</span>
              <span className="text-green-400 font-bold text-sm">OPay</span>
              <span className="text-gray-500 text-xs">📱</span>
            </div>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleConfirmSupport}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50"
            >
              {submitting
                ? "Processing..."
                : `Confirm Support - ₦${supportAmount ? Number(supportAmount).toLocaleString() : "0"}`}
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

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
              <p className="text-green-400 text-lg font-semibold mb-4">
                ₦{supportAmount ? Number(supportAmount).toLocaleString() : "0"}
              </p>
              <p className="text-gray-300 mb-6">
                Your support means the world to{" "}
                <strong className="text-purple-400">
                  {creator?.displayName || creator?.username}
                </strong>
                ! 💜
              </p>
              <p className="text-gray-500 text-sm mb-6">
                The creator will verify your payment shortly.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setShowPayment(true);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium"
                >
                  Support Again 💜
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
