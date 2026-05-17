import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview", to: "/dashboard" },
    { id: "supporters", icon: "❤️", label: "Supporters", to: "/supporter-history" },
    { id: "withdraw", icon: "💸", label: "Withdraw", to: "/withdraw" },
    { id: "settings", icon: "⚙️", label: "Settings", to: "/settings" },
    { id: "profile", icon: "👤", label: "My Profile", to: "/profile" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <Link to="/" onClick={onClose}>
            <div className="flex items-center gap-3 mb-8 cursor-pointer">
              <img src="/logo.png" alt="TSB" className="w-32 h-auto object-contain" />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom CTA */}
          <Link
            to="/supporter-history"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg text-white hover:border-purple-500/50 transition-all group mt-auto"
          >
            <span className="text-lg">📋</span>
            <span className="font-medium">Support History</span>
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
