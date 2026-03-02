import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Menu, X, LogOut, User, LayoutDashboard,
  MessageSquare, FileText, Map, Shield, Sun, Moon, ChevronDown, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/chat', label: 'AI Mentor', icon: MessageSquare },
        { to: '/resume', label: 'Resume', icon: FileText },
        { to: '/roadmap', label: 'Roadmap', icon: Map },
        ...(user.isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
      ]
    : [
        { to: '/#features', label: 'Features', icon: null },
        { to: '/pricing', label: 'Pricing', icon: null },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled ? 'w-[95%] max-w-5xl' : 'w-[90%] max-w-5xl'
        }`}
      >
        <div
          className="glass-card px-5 py-3.5 flex items-center justify-between"
          style={{
            background: scrolled
              ? 'rgba(10, 10, 30, 0.85)'
              : 'rgba(10, 10, 30, 0.7)',
            backdropFilter: 'blur(24px)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600" />
              <Sparkles size={16} className="absolute inset-0 m-auto text-white" />
            </div>
            <span className="font-display font-700 text-white text-base tracking-tight hidden sm:block">
              Career<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/7'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:bg-white/15 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-white/80 text-sm font-medium hidden sm:block max-w-24 truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className={`text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-card py-1.5 overflow-hidden"
                      style={{ background: 'rgba(10, 10, 30, 0.95)', backdropFilter: 'blur(24px)' }}
                    >
                      <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                        {user.isPro && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs">
                            <Zap size={10} /> Pro
                          </span>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/8 transition-all duration-150 text-sm"
                      >
                        <User size={14} /> Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 text-sm"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/8 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-gradient text-sm py-2 px-4">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-card py-2 overflow-hidden"
              style={{ background: 'rgba(10, 10, 30, 0.95)', backdropFilter: 'blur(24px)' }}
            >
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/8 text-sm font-medium transition-all"
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </Link>
              ))}
              {!user && (
                <>
                  <div className="border-t border-white/10 my-1" />
                  <Link to="/login" className="flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="mx-4 mb-2 block text-center btn-gradient py-2.5 text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
}
