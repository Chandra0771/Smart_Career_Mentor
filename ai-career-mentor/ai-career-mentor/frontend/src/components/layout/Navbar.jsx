import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, Sun, Moon, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = user
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'Chat', href: '/dashboard/chat', icon: <Brain size={16} /> },
        { label: 'Resume', href: '/dashboard/resume', icon: <User size={16} /> },
        ...(user.isAdmin ? [{ label: 'Admin', href: '/admin', icon: <Shield size={16} /> }] : [])
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/pricing' }
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-purple-900/20'
            : 'bg-white/5 backdrop-blur-xl border border-white/10'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gradient hidden sm:block">CareerAI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 hidden sm:block font-medium">{user.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all duration-200"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200">Login</Link>
                <Link to="/register" className="gradient-btn text-sm px-4 py-2 !rounded-xl">Get Started</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 glass-card p-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
