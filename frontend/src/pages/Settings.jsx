// Settings.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://tsb-taln.onrender.com/api";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaved, setIsSaved] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [token, setToken] = useState("");
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });
  const [paymentSettings, setPaymentSettings] = useState({
    minimumAmount: 3000,
  });
  const [notifications, setNotifications] = useState({
    newSupporterAlert: true,
    messageNotifications: true,
    milestoneAlerts: true,
    paymentConfirmations: true,
    weeklyReport: false,
    monthlyReport: false,
  });
  const [appearance, setAppearance] = useState({
    theme: "dark",
    accentColor: "purple",
  });

  const accentColors = {
    purple: "#8b5cf6",
    blue: "#3b82f6",
    green: "#22c55e",
    pink: "#ec4899",
    orange: "#f97316",
    red: "#ef4444",
    cyan: "#06b6d4",
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", appearance.theme);
    document.documentElement.style.setProperty(
      "--accent-color",
      accentColors[appearance.accentColor] || "#8b5cf6",
    );
  }, [appearance.theme, appearance.accentColor]);

  useEffect(() => {
    const savedToken = localStorage.getItem("tsb_token");
    const savedCreator = localStorage.getItem("tsb_creator");
    if (savedToken && savedCreator) {
      setToken(savedToken);
      const creatorData = JSON.parse(savedCreator);
      setCreator(creatorData);
      setProfile({
        displayName: creatorData.displayName || creatorData.username || "",
        username: creatorData.username || "",
        email: creatorData.email || "",
        phone: "",
        bio: "",
        location: "",
      });
      fetchSettings(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSettings = async (authToken) => {
    try {
      const { data } = await axios.get(`${API_URL}/creator/settings`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data.success) {
        if (data.profile) setProfile((prev) => ({ ...prev, ...data.profile }));
        if (data.payment)
          setPaymentSettings((prev) => ({ ...prev, ...data.payment }));
        if (data.notifications)
          setNotifications((prev) => ({ ...prev, ...data.notifications }));
        if (data.appearance)
          setAppearance((prev) => ({ ...prev, ...data.appearance }));
      }
    } catch (err) {
      console.log("Could not fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    let sectionData;
    switch (section) {
      case "profile":
        sectionData = profile;
        break;
      case "payment":
        sectionData = paymentSettings;
        break;
      case "notifications":
        sectionData = notifications;
        break;
      case "appearance":
        sectionData = appearance;
        localStorage.setItem("tsb_appearance", JSON.stringify(appearance));
        setIsSaved("appearance");
        setSaving(false);
        setTimeout(() => setIsSaved(null), 2000);
        return;
      default:
        sectionData = {};
    }
    try {
      const { data } = await axios.put(
        `${API_URL}/creator/settings`,
        { section, data: sectionData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        setIsSaved(section);
        if (section === "profile") {
          const updatedCreator = {
            ...creator,
            displayName: profile.displayName,
          };
          localStorage.setItem("tsb_creator", JSON.stringify(updatedCreator));
          setCreator(updatedCreator);
        }
        setTimeout(() => setIsSaved(null), 2000);
      }
    } catch (err) {
      setIsSaved("error");
      setTimeout(() => setIsSaved(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const inputClass =
    "w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";
  const saveBtnClass = (section) =>
    `px-6 py-3 rounded-xl font-semibold transition-all ${isSaved === section ? "bg-green-500 text-white" : isSaved === "error" ? "bg-red-500 text-white" : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your account</p>
            </div>
          </div>
          {creator && (
            <p className="text-gray-400 text-sm">@{creator.username}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 space-y-1 sticky top-24">
              {[
                { id: "profile", icon: "👤", label: "Profile" },
                { id: "notifications", icon: "🔔", label: "Notifications" },
                { id: "appearance", icon: "🎨", label: "Appearance" },
                { id: "security", icon: "🔒", label: "Security" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${activeSection === item.id ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-gray-400 hover:text-white hover:bg-gray-700/30"}`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div
                  key="profile"
                  {...fadeIn}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Display Name</label>
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            displayName: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Username</label>
                      <input
                        type="text"
                        value={profile.username}
                        disabled
                        className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className={inputClass}
                        placeholder="08012345678"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className={inputClass}
                        placeholder="e.g., Lagos, Nigeria"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        rows={3}
                        maxLength={200}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell people about yourself..."
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        {profile.bio.length}/200
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <button
                      onClick={() => handleSave("profile")}
                      disabled={saving}
                      className={saveBtnClass("profile")}
                    >
                      {saving
                        ? "Saving..."
                        : isSaved === "profile"
                          ? "✅ Saved!"
                          : "Save Profile"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === "payment" && (
                <motion.div
                  key="payment"
                  {...fadeIn}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Payment Settings
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    All payments are processed securely via{" "}
                    <strong className="text-green-400">Paystack</strong>. TSB
                    takes a 5% fee per transaction to keep the platform running.
                  </p>
                  <div>
                    <label className={labelClass}>
                      Minimum Support Amount (₦)
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.minimumAmount}
                      onChange={(e) =>
                        setPaymentSettings({
                          minimumAmount: Math.max(3000, Number(e.target.value)),
                        })
                      }
                      className={inputClass}
                      min="3000"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Minimum: ₦3,000
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <button
                      onClick={() => handleSave("payment")}
                      disabled={saving}
                      className={saveBtnClass("payment")}
                    >
                      {saving
                        ? "Saving..."
                        : isSaved === "payment"
                          ? "✅ Saved!"
                          : "Save Payment Settings"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === "notifications" && (
                <motion.div
                  key="notifications"
                  {...fadeIn}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        key: "newSupporterAlert",
                        label: "New Supporter Alerts",
                        desc: "Get notified when someone supports you",
                      },
                      {
                        key: "messageNotifications",
                        label: "Message Notifications",
                        desc: "When supporters leave you a message",
                      },
                      {
                        key: "milestoneAlerts",
                        label: "Milestone Alerts",
                        desc: "Celebrate when you hit earning goals",
                      },
                      {
                        key: "paymentConfirmations",
                        label: "Payment Confirmations",
                        desc: "Receive confirmation for each payment",
                      },
                      {
                        key: "weeklyReport",
                        label: "Weekly Report",
                        desc: "Summary of your weekly earnings",
                      },
                      {
                        key: "monthlyReport",
                        label: "Monthly Report",
                        desc: "Detailed monthly analytics report",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0"
                      >
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <button
                      onClick={() => handleSave("notifications")}
                      disabled={saving}
                      className={saveBtnClass("notifications")}
                    >
                      {saving
                        ? "Saving..."
                        : isSaved === "notifications"
                          ? "✅ Saved!"
                          : "Save Notifications"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === "appearance" && (
                <motion.div
                  key="appearance"
                  {...fadeIn}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Appearance Settings
                  </h2>
                  <div className="mb-6">
                    <label className={labelClass}>Theme</label>
                    <div className="flex gap-3">
                      {["dark", "light"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() =>
                            setAppearance({ ...appearance, theme })
                          }
                          className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${appearance.theme === theme ? "bg-purple-500 text-white" : "bg-gray-700/50 text-gray-400 hover:text-white"}`}
                        >
                          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Accent Color</label>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(accentColors).map(([color, hex]) => (
                        <button
                          key={color}
                          onClick={() =>
                            setAppearance({ ...appearance, accentColor: color })
                          }
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs transition-all"
                          style={{
                            backgroundColor: hex,
                            ...(appearance.accentColor === color
                              ? {
                                  ring: "4px solid white",
                                  ringOffset: "2px",
                                  ringOffsetColor: "#1f2937",
                                }
                              : {}),
                          }}
                        >
                          {appearance.accentColor === color && "✓"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-xl border border-gray-700/50"
                    style={{
                      backgroundColor:
                        appearance.theme === "light" ? "#f5f5f5" : "#111",
                    }}
                  >
                    <p
                      style={{
                        color: appearance.theme === "light" ? "#111" : "#fff",
                      }}
                    >
                      Preview text
                    </p>
                    <div
                      className="h-2 rounded-full mt-2"
                      style={{
                        backgroundColor: accentColors[appearance.accentColor],
                      }}
                    ></div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <button
                      onClick={() => handleSave("appearance")}
                      disabled={saving}
                      className={saveBtnClass("appearance")}
                    >
                      {saving
                        ? "Saving..."
                        : isSaved === "appearance"
                          ? "✅ Saved!"
                          : "Save Appearance"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === "security" && (
                <motion.div key="security" {...fadeIn} className="space-y-6">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Change Password
                    </h2>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className={labelClass}>Current Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>New Password</label>
                        <input
                          type="password"
                          className={inputClass}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className={inputClass}
                          placeholder="••••••••"
                        />
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl">
                        Update Password
                      </button>
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-red-400 mb-4">
                      Danger Zone
                    </h2>
                    <p className="text-gray-400 mb-4">
                      Once you delete your account, there is no going back.
                    </p>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition-colors"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-white font-medium">
                          Are you absolutely sure?
                        </p>
                        <div className="flex gap-3">
                          <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl">
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
