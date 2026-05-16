// Profile.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const linkInputRef = useRef(null);

  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    bio: "",
    email: "",
    avatar: null,
    coverImage: null,
    category: "",
    phone: "",
    location: "",
  });

  const [socialLinks, setSocialLinks] = useState([
    {
      platform: "twitter",
      url: "",
      label: "View on Twitter",
      enabled: false,
      connected: false,
      logo: null,
    },
    {
      platform: "instagram",
      url: "",
      label: "View on Instagram",
      enabled: false,
      connected: false,
      logo: null,
    },
    {
      platform: "youtube",
      url: "",
      label: "View on YouTube",
      enabled: false,
      connected: false,
      logo: null,
    },
    {
      platform: "github",
      url: "",
      label: "View on GitHub",
      enabled: false,
      connected: false,
      logo: null,
    },
    {
      platform: "website",
      url: "",
      label: "Visit Website",
      enabled: false,
      connected: false,
      logo: null,
    },
    {
      platform: "linkedin",
      url: "",
      label: "View on LinkedIn",
      enabled: false,
      connected: false,
      logo: null,
    },
    {
      platform: "tiktok",
      url: "",
      label: "View on TikTok",
      enabled: false,
      connected: false,
      logo: null,
    },
  ]);

  const [appearance, setAppearance] = useState({
    theme: "dark",
    accentColor: "purple",
    showSupporters: true,
    showEarnings: false,
    customMessage: "Enjoy my content? Tap The Support Button ☕",
  });

  const accentColors = {
    purple: "#8b5cf6",
    blue: "#3b82f6",
    green: "#22c55e",
    pink: "#ec4899",
    orange: "#f97316",
    cyan: "#06b6d4",
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", appearance.theme);
    document.documentElement.style.setProperty(
      "--accent",
      accentColors[appearance.accentColor],
    );
    if (appearance.theme === "light") {
      document.body.classList.add("light-theme");
      document.body.style.backgroundColor = "#f5f5f5";
    } else {
      document.body.classList.remove("light-theme");
      document.body.style.backgroundColor = "";
    }
  }, [appearance.theme, appearance.accentColor]);

  useEffect(() => {
    const savedCreator = localStorage.getItem("tsb_creator");
    const savedProfile = localStorage.getItem("tsb_profile");
    const savedLinks = localStorage.getItem("tsb_socialLinks");
    const savedAppearance = localStorage.getItem("tsb_appearance");

    if (savedCreator) {
      const creatorData = JSON.parse(savedCreator);
      setProfile((prev) => ({
        ...prev,
        displayName: creatorData.displayName || creatorData.username || "",
        username: creatorData.username || "",
        email: creatorData.email || "",
        ...(savedProfile ? JSON.parse(savedProfile) : {}),
      }));
    }

    if (savedLinks) setSocialLinks(JSON.parse(savedLinks));
    if (savedAppearance)
      setAppearance((prev) => ({ ...prev, ...JSON.parse(savedAppearance) }));

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem("tsb_profile", JSON.stringify(profile));
    localStorage.setItem("tsb_socialLinks", JSON.stringify(socialLinks));
    localStorage.setItem("tsb_appearance", JSON.stringify(appearance));

    const savedCreator = localStorage.getItem("tsb_creator");
    if (savedCreator) {
      const creatorData = JSON.parse(savedCreator);
      creatorData.displayName = profile.displayName;
      localStorage.setItem("tsb_creator", JSON.stringify(creatorData));
    }

    setSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (loading) return <LoadingSpinner message="Loading Profile..." />;

  const supportLink = `https://tsb-blue.vercel.app/${profile.username}`;
  const inputClass =
    "w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  const handleSocialLinkChange = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };
  const toggleConnect = (index) => {
    const updated = [...socialLinks];
    updated[index].connected = !updated[index].connected;
    if (!updated[index].connected) {
      updated[index].url = "";
      updated[index].enabled = false;
    }
    setSocialLinks(updated);
  };
  const handleSocialLogoUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const updated = [...socialLinks];
        updated[index].logo = ev.target.result;
        setSocialLinks(updated);
      };
      reader.readAsDataURL(file);
    }
  };
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setProfile({ ...profile, avatar: ev.target.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
              >
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Creator Profile
                </h1>
                <p className="text-gray-400 text-sm">
                  Set up your public presence
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${isSaved ? "bg-green-500 text-white" : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"}`}
            >
              {saving ? "Saving..." : isSaved ? "✅ Saved!" : "Save Changes"}
            </button>
          </div>
          <div className="flex gap-1 mt-4 bg-gray-800/50 rounded-xl p-1 inline-flex flex-wrap">
            {[
              { id: "profile", label: "👤 Profile" },
              { id: "links", label: "🔗 Social Links" },
              { id: "appearance", label: "🎨 Appearance" },
              { id: "share", label: "📤 Share Link" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              {...fadeIn}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Profile Picture
                  </h3>
                  <label className="cursor-pointer inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold hover:ring-4 hover:ring-purple-500/50 transition-all overflow-hidden">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (profile.displayName || profile.username || "?")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                  <p className="text-gray-400 text-xs mt-3">
                    Click to change photo
                  </p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Cover Image
                  </h3>
                  <label className="cursor-pointer block">
                    <div className="h-24 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-xl flex items-center justify-center hover:ring-2 hover:ring-purple-500/50 transition-all">
                      {profile.coverImage ? (
                        <img
                          src={profile.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          📷 Add Cover Image
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setProfile({
                              ...profile,
                              coverImage: ev.target.result,
                            });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Display Name</label>
                        <input
                          type="text"
                          name="displayName"
                          value={profile.displayName}
                          onChange={handleProfileChange}
                          className={inputClass}
                          placeholder="Your public name"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Username</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            tsb.com/
                          </span>
                          <input
                            type="text"
                            name="username"
                            value={profile.username}
                            disabled
                            className="w-full pl-20 pr-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Bio</label>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        maxLength={200}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell your supporters about yourself..."
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        {profile.bio.length}/200
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className={inputClass}
                          placeholder="08012345678"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleProfileChange}
                          className={inputClass}
                          placeholder="e.g., Lagos, Nigeria"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Category</label>
                        <select
                          name="category"
                          value={profile.category}
                          onChange={handleProfileChange}
                          className={inputClass}
                        >
                          <option value="">Select category</option>
                          <option value="tech">Technology</option>
                          <option value="design">Design</option>
                          <option value="music">Music</option>
                          <option value="art">Art</option>
                          <option value="writing">Writing</option>
                          <option value="education">Education</option>
                          <option value="gaming">Gaming</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SOCIAL LINKS TAB */}
          {activeTab === "links" && (
            <motion.div key="links" {...fadeIn} className="max-w-3xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Social Media Links
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Connect your social media accounts. Connect first, then add
                  your link.
                </p>
                <div className="space-y-4">
                  {socialLinks.map((link, index) => (
                    <div
                      key={link.platform}
                      className="p-4 bg-gray-700/20 rounded-xl"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <label className="cursor-pointer flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center hover:ring-2 hover:ring-purple-500/50 transition-all overflow-hidden">
                            {link.logo ? (
                              <img
                                src={link.logo}
                                alt={link.platform}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Logo
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleSocialLogoUpload(index, e)}
                          />
                        </label>
                        <span className="text-white font-semibold capitalize text-sm w-20">
                          {link.platform}
                        </span>
                        {!link.connected ? (
                          <button
                            onClick={() => toggleConnect(index)}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Connect{" "}
                            {link.platform.charAt(0).toUpperCase() +
                              link.platform.slice(1)}
                          </button>
                        ) : (
                          <>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  index,
                                  "url",
                                  e.target.value,
                                )
                              }
                              placeholder={`https://${link.platform}.com/yourhandle`}
                              className="flex-1 min-w-[200px] px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                            />
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  index,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Button text"
                              className="w-44 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                            />
                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={link.enabled}
                                onChange={() =>
                                  handleSocialLinkChange(
                                    index,
                                    "enabled",
                                    !link.enabled,
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                            <button
                              onClick={() => toggleConnect(index)}
                              className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <motion.div
              key="appearance"
              {...fadeIn}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  Appearance Settings
                </h3>
                <div>
                  <label className={labelClass}>Theme</label>
                  <div className="flex gap-3">
                    {["dark", "light"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setAppearance({ ...appearance, theme })}
                        className={`px-6 py-3 rounded-xl font-medium capitalize ${appearance.theme === theme ? "bg-purple-500 text-white" : "bg-gray-700/50 text-gray-400 hover:text-white"}`}
                      >
                        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Accent Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {Object.entries(accentColors).map(([color, hex]) => (
                      <button
                        key={color}
                        onClick={() =>
                          setAppearance({ ...appearance, accentColor: color })
                        }
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold transition-all"
                        style={{
                          backgroundColor: hex,
                          ...(appearance.accentColor === color
                            ? { boxShadow: "0 0 0 3px white, 0 0 0 6px " + hex }
                            : {}),
                        }}
                      >
                        {appearance.accentColor === color && "✓"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      key: "showSupporters",
                      label: "Show Recent Supporters",
                      desc: "Display supporter names on your public page",
                    },
                    {
                      key: "showEarnings",
                      label: "Show Earnings",
                      desc: "Display total earnings publicly",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearance[item.key]}
                          onChange={(e) =>
                            setAppearance({
                              ...appearance,
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
                <div>
                  <label className={labelClass}>Custom Support Message</label>
                  <input
                    type="text"
                    value={appearance.customMessage}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        customMessage: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Enjoy my content? Buy me a coffee! ☕"
                  />
                </div>
                <div
                  className="p-4 rounded-xl border-2 border-dashed border-gray-600"
                  style={{
                    backgroundColor:
                      appearance.theme === "light" ? "#f5f5f5" : "#111",
                  }}
                >
                  <p className="text-xs text-gray-500 mb-2">LIVE PREVIEW</p>
                  <p
                    style={{
                      color: appearance.theme === "light" ? "#111" : "#fff",
                      marginBottom: 8,
                    }}
                  >
                    This is how your page looks
                  </p>
                  <div
                    className="h-3 rounded-full"
                    style={{
                      backgroundColor: accentColors[appearance.accentColor],
                      width: "60%",
                    }}
                  ></div>
                  <button
                    className="mt-3 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{
                      backgroundColor: accentColors[appearance.accentColor],
                    }}
                  >
                    Support Button
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SHARE TAB */}
          {activeTab === "share" && (
            <motion.div
              key="share"
              {...fadeIn}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your Support Link
                </h3>
                <p className="text-gray-400 mb-6">
                  Share this link on your social media and start receiving
                  support
                </p>
                <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      ref={linkInputRef}
                      type="text"
                      value={supportLink}
                      readOnly
                      className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(supportLink, "link")}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      {copiedField === "link" ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  Embed Codes
                </h3>
                <div>
                  <label className={labelClass}>HTML Code</label>
                  <p className="text-gray-400 text-xs mb-2">
                    Paste this in your website HTML
                  </p>
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-3 relative">
                    <code className="text-green-400 text-xs break-all block pr-16">{`<a href="${supportLink}" target="_blank" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:white;border-radius:12px;text-decoration:none;font-family:sans-serif;font-weight:bold;">☕ Support Me</a>`}</code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `<a href="${supportLink}" target="_blank" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:white;border-radius:12px;text-decoration:none;font-family:sans-serif;font-weight:bold;">☕ Support Me</a>`,
                          "html",
                        )
                      }
                      className="absolute top-2 right-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs"
                    >
                      {copiedField === "html" ? "✅" : "Copy"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>JavaScript Code</label>
                  <p className="text-gray-400 text-xs mb-2">
                    Paste this in your website's JavaScript
                  </p>
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-3 relative">
                    <code className="text-yellow-400 text-xs break-all block pr-16">{`<script>(function(){var btn=document.createElement('a');btn.href='${supportLink}';btn.target='_blank';btn.innerHTML='☕ Support Me';btn.style.cssText='display:inline-block;padding:12px 24px;background:#8b5cf6;color:white;border-radius:12px;text-decoration:none;font-family:sans-serif;font-weight:bold;cursor:pointer;';document.getElementById('tsb-support-btn')?.appendChild(btn);})();</script><div id="tsb-support-btn"></div>`}</code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `<script>(function(){var btn=document.createElement('a');btn.href='${supportLink}';btn.target='_blank';btn.innerHTML='☕ Support Me';btn.style.cssText='display:inline-block;padding:12px 24px;background:#8b5cf6;color:white;border-radius:12px;text-decoration:none;font-family:sans-serif;font-weight:bold;cursor:pointer;';document.getElementById('tsb-support-btn')?.appendChild(btn);})();</script><div id="tsb-support-btn"></div>`,
                          "js",
                        )
                      }
                      className="absolute top-2 right-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs"
                    >
                      {copiedField === "js" ? "✅" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Share Directly To
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "Twitter", icon: "𝕏" },
                    { name: "WhatsApp", icon: "💬" },
                    { name: "Copy Link", icon: "📋" },
                    { name: "Embed", icon: "💻" },
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => {
                        if (platform.name === "Embed") {
                          copyToClipboard(
                            `<a href="${supportLink}" target="_blank">Support Me ☕</a>`,
                            "embed",
                          );
                        } else {
                          copyToClipboard(supportLink, "share");
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-700/30 border border-gray-600 rounded-xl text-white hover:border-purple-500/50 transition-all"
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs font-medium">
                        {platform.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
