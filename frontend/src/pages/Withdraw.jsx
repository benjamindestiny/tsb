import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MINIMUM_WITHDRAWAL = 3000;
const QUICK_AMOUNTS = [3000, 5000, 10000];

const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "GTBank",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Opay",
  "PalmPay",
  "Parallex Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC",
  "Standard Chartered",
  "Sterling Bank",
  "SunTrust Bank",
  "Taj Bank",
  "Titan Trust Bank",
  "UBA",
  "Union Bank",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

const getToken = () => localStorage.getItem("tsb_token");

// Smooth fade-in animation
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Withdraw = () => {
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("opay");

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    opayNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  const filteredBanks = NIGERIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase()),
  );

  const fetchBalance = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/creator/balance`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data?.success) {
        setBalance(data.balance || 0);
        if (data.bankDetails) {
          setBankDetails((prev) => ({ ...prev, ...data.bankDetails }));
        }
      }
    } catch (err) {
      console.log("Balance fetch failed");
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchWithdrawalHistory = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/withdrawals/history`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data?.success) {
        setWithdrawalHistory(data.withdrawals || []);
      }
    } catch (err) {
      console.log("History fetch failed");
      setWithdrawalHistory([]);
    }
  }, []);

  useEffect(() => {
    const savedCreator = localStorage.getItem("tsb_creator");
    if (!savedCreator) {
      navigate("/login");
      return;
    }
    setCreator(JSON.parse(savedCreator));
    fetchBalance();
    fetchWithdrawalHistory();
  }, [navigate, fetchBalance, fetchWithdrawalHistory]);

  const validate = (amount) => {
    setError("");
    setSuccess("");
    if (isNaN(amount) || amount <= 0) return "Enter a valid amount";
    if (amount < MINIMUM_WITHDRAWAL)
      return `Minimum withdrawal is ₦${MINIMUM_WITHDRAWAL.toLocaleString()}`;
    if (amount > balance) return "Insufficient balance";
    if (paymentMethod === "bank_transfer") {
      if (
        !bankDetails.bankName ||
        !bankDetails.accountNumber ||
        !bankDetails.accountName
      ) {
        return "Please complete bank details";
      }
      if (!/^\d{10}$/.test(bankDetails.accountNumber)) {
        return "Account number must be 10 digits";
      }
    }
    if (paymentMethod === "opay" && !bankDetails.opayNumber) {
      return "Please enter your OPay number";
    }
    return null;
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    const validationError = validate(amount);
    if (validationError) {
      setError(validationError);
      return;
    }
    setShowConfirm(true);
  };

  const confirmWithdrawal = async () => {
    setLoading(true);
    setShowConfirm(false);
    const amount = parseFloat(withdrawAmount);
    const payload = {
      amount,
      paymentMethod,
      ...(paymentMethod === "opay"
        ? { opayNumber: bankDetails.opayNumber }
        : {
            bankName: bankDetails.bankName,
            accountNumber: bankDetails.accountNumber,
            accountName: bankDetails.accountName,
          }),
    };

    try {
      const { data } = await axios.post(
        `${API_URL}/withdrawals/request`,
        payload,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (data?.success) {
        setSuccess(
          "Withdrawal request submitted! You'll receive funds within 24 hours.",
        );
        setWithdrawAmount("");
        await fetchBalance();
        await fetchWithdrawalHistory();
      } else {
        setError(data?.message || "Withdrawal failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Request failed. Try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <motion.div {...fadeIn} className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Withdraw Earnings</h1>
            <p className="text-gray-400 mt-1">
              Transfer your earnings to your bank or OPay
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* BALANCE CARD */}
        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold text-white">
                ₦{balance.toLocaleString()}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Minimum withdrawal: ₦{MINIMUM_WITHDRAWAL.toLocaleString()}
              </p>
            </div>
            <div className="text-6xl">💰</div>
          </div>
          <div className="mt-4 bg-gray-700/50 rounded-full h-2">
            <div
              style={{
                width: `${Math.min((balance / MINIMUM_WITHDRAWAL) * 100, 100)}%`,
              }}
              className={`h-full rounded-full transition-all duration-500 ${balance >= MINIMUM_WITHDRAWAL ? "bg-green-500" : "bg-yellow-500"}`}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {balance >= MINIMUM_WITHDRAWAL
              ? "✅ You can withdraw now!"
              : `⚠️ You need ₦${(MINIMUM_WITHDRAWAL - balance).toLocaleString()} more to withdraw`}
          </p>
        </div>

        {/* WITHDRAW FORM */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Request Withdrawal
          </h3>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                {...fadeIn}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                {...fadeIn}
                className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AMOUNT */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                ₦
              </span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                min={MINIMUM_WITHDRAWAL}
                max={balance}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWithdrawAmount(amount.toString())}
                  disabled={amount > balance}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    withdrawAmount === amount.toString()
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700/50 text-gray-400 hover:text-white disabled:opacity-30"
                  }`}
                >
                  ₦{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "opay", label: "OPay", icon: "📱" },
                { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    paymentMethod === method.id
                      ? "border-purple-500 bg-purple-500/10 text-white"
                      : "border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  <span className="text-2xl block mb-1">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BANK DETAILS / OPAY */}
          <AnimatePresence>
            {paymentMethod === "bank_transfer" && (
              <motion.div {...fadeIn} className="space-y-4 mb-6">
                {/* BANK DROPDOWN */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-left flex items-center justify-between focus:outline-none focus:border-purple-500"
                  >
                    <span
                      className={
                        bankDetails.bankName ? "text-white" : "text-gray-400"
                      }
                    >
                      {bankDetails.bankName || "Select your bank"}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${showBankDropdown ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {showBankDropdown && (
                      <motion.div
                        {...fadeIn}
                        className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-hidden"
                      >
                        <div className="p-2 border-b border-gray-700">
                          <input
                            type="text"
                            value={bankSearch}
                            onChange={(e) => setBankSearch(e.target.value)}
                            placeholder="Search banks..."
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white text-sm focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredBanks.map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => {
                                setBankDetails({
                                  ...bankDetails,
                                  bankName: bank,
                                });
                                setShowBankDropdown(false);
                                setBankSearch("");
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-500/20 transition-colors ${
                                bankDetails.bankName === bank
                                  ? "bg-purple-500/30 text-purple-300"
                                  : "text-gray-300"
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                          {filteredBanks.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">
                              No banks found
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {showBankDropdown && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowBankDropdown(false)}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="10-digit account number"
                    maxLength={10}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountName: e.target.value,
                      })
                    }
                    placeholder="Name on bank account"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </motion.div>
            )}

            {paymentMethod === "opay" && (
              <motion.div {...fadeIn} className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  OPay Phone Number
                </label>
                <input
                  type="text"
                  value={bankDetails.opayNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      opayNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="e.g., 08012345678"
                  maxLength={11}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT */}
          <button
            onClick={handleWithdraw}
            disabled={balance < MINIMUM_WITHDRAWAL || loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
          >
            {balance < MINIMUM_WITHDRAWAL
              ? `Need ₦${(MINIMUM_WITHDRAWAL - balance).toLocaleString()} More to Withdraw`
              : loading
                ? "Processing..."
                : `Withdraw ₦${withdrawAmount ? Number(withdrawAmount).toLocaleString() : "0"}`}
          </button>
        </div>

        {/* HISTORY */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Withdrawal History
          </h3>
          {withdrawalHistory.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="text-gray-400">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalHistory.map((withdrawal, index) => (
                <div
                  key={withdrawal._id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {withdrawal.paymentMethod === "opay" ? "📱" : "🏦"}
                    </span>
                    <div>
                      <p className="text-white font-semibold">
                        ₦{withdrawal.amount.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(withdrawal.createdAt).toLocaleDateString(
                          "en-NG",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      withdrawal.status === "completed"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : withdrawal.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : withdrawal.status === "rejected"
                            ? "bg-red-500/20 text-red-300 border-red-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {withdrawal.status.charAt(0).toUpperCase() +
                      withdrawal.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            {...fadeIn}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">
                Confirm Withdrawal
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Amount:</span>
                  <span className="text-white font-bold">
                    ₦{Number(withdrawAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Method:</span>
                  <span className="text-white">
                    {paymentMethod === "opay" ? "OPay" : "Bank Transfer"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Destination:</span>
                  <span className="text-white">
                    {paymentMethod === "opay"
                      ? bankDetails.opayNumber
                      : `${bankDetails.bankName} - ${bankDetails.accountNumber}`}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                You'll receive your money within 24 hours after approval.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWithdrawal}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Withdraw;
