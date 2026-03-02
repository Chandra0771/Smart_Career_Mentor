import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, FileText, User, Shield, LogOut, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Overview', href: '/dashboard' },
    { icon: <MessageSquare size={18} />, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: <FileText size={18} />, label: 'Resume AI', href: '/dashboard/resume' },
    { icon: <User size={18} />, label: 'Profile', href: '/dashboard/profile' },
    ...(user?.isAdmin ? [{ icon: <Shield size={18} />, label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <div className="min-h-screen mesh-bg">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? '70px' : '240px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className={`p-4 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <Link to="/" className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg">
            <span className="text-xl">🚀</span>
          </Link>
          {!collapsed && <span className="font-bold text-white text-sm">CareerAI</span>}
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="mx-3 mb-4 p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-white/40 text-xs flex items-center gap-1">
                  {user?.isPro ? (<><Crown size={10} className="text-amber-400" /> Pro</>) : 'Free Plan'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
                  active ? 'bg-purple-500/30 border border-purple-500/40 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={collapsed ? item.label : ''}
              >
                {item.icon}
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse & Logout */}
        <div className="p-3 space-y-1 border-t border-white/10">
          {!collapsed && !user?.isPro && (
            <Link to="/pricing" className="flex items-center gap-2 px-3 py-2.5 rounded-xl gradient-btn text-sm mb-2 justify-center">
              <Crown size={14} /> Upgrade
            </Link>
          )}
          <button onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: collapsed ? '70px' : '240px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
