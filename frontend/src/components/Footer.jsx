import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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

  const links = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "pricing" },
      { label: "Security", href: "security" },
      { label: "Roadmap", href: "roadmap" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "blog" },
      { label: "Careers", href: "careers" },
      { label: "Contact", href: "https://wa.me/2347017153753" },
    ],
    support: [
      { label: "Help Center", href: "help" },
      { label: "Community", href: "community" },
      { label: "Docs", href: "docs" },
      { label: "Status", href: "status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "privacy" },
      { label: "Terms of Service", href: "terms" },
      { label: "Cookie Policy", href: "cookies" },
      { label: "Compliance", href: "compliance" },
    ],
  };

  const socials = [
    { icon: "𝕏", label: "Twitter", href: "https://x.com/BenjaminD_000" },
    {
      icon: "in",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/benjamin-destiny-a90881344/",
    },
    { icon: "💬", label: "WhatsApp", href: "https://wa.me/2347017153753" },
  ];

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative z-10 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-xl"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img src="logo.png" alt="tsb logo" className="w-20" />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empower creators worldwide to build sustainable careers through
              community support.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800/50 hover:bg-purple-500/20 border border-gray-700/50 hover:border-purple-500/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-300 transition-all"
                  title={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-8 mb-12"
        >
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4">
              Get the latest updates and tips for creators delivered to your
              inbox.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-700/30"
        >
          <div className="text-gray-400 text-sm text-center md:text-left">
            <p>
              © {currentYear} T.S.B. All rights reserved. Built for creators.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <motion.a
              href="/privacy"
              whileHover={{ color: "#a78bfa" }}
              className="text-gray-400 transition-colors"
            >
              Privacy
            </motion.a>
            <motion.a
              href="/terms"
              whileHover={{ color: "#a78bfa" }}
              className="text-gray-400 transition-colors"
            >
              Terms
            </motion.a>
            <motion.a
              href="/cookies"
              whileHover={{ color: "#a78bfa" }}
              className="text-gray-400 transition-colors"
            >
              Cookies
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </motion.footer>
  );
};

export default Footer;
