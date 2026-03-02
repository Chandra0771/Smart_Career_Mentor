import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Map, Target, Mic, TrendingUp, Clock, Zap, ArrowRight, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const QUICK_ACTIONS = [
  { icon: <MessageSquare size={22} />, label: 'AI Chat', desc: 'Get career advice', href: '/dashboard/chat', color: 'from-violet-600 to-purple-600' },
  { icon: <FileText size={22} />, label: 'Resume AI', desc: 'Analyze your resume', href: '/dashboard/resume', color: 'from-blue-600 to-cyan-600' },
  { icon: <Map size={22} />, label: 'Roadmap', desc: 'Build career path', href: '/dashboard/chat', color: 'from-emerald-600 to-teal-600' },
  { icon: <Mic size={22} />, label: 'Mock Interview', desc: 'Practice interviews', href: '/dashboard/chat', color: 'from-pink-600 to-rose-600' },
];

const CAREER_TIPS = [
  'Update your LinkedIn profile with quantifiable achievements',
  'Apply to 5-10 jobs per week for best results',
  'Network actively — 70% of jobs are filled through connections',
  'Practice your elevator pitch until it feels natural',
  'Research companies before every interview',
];

const DashboardHome = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [tip] = useState(() => CAREER_TIPS[Math.floor(Math.random() * CAREER_TIPS.length)]);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsRes, chatsRes] = await Promise.all([
          api.get('/analytics/user'),
          api.get('/chat/history')
        ]);
        setAnalytics(analyticsRes.data);
        setRecentChats(chatsRes.data.chats?.slice(0, 3) || []);
      } catch {}
    };
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-7 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-pink-600/20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1 flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> {greeting}!</p>
            <h1 className="text-3xl font-bold text-white">{user?.name} 👋</h1>
            <p className="text-white/60 mt-1">Career Interest: <span className="text-purple-300 font-medium">{user?.careerInterest || 'Not set'}</span> · Level: <span className="text-purple-300 font-medium capitalize">{user?.skillLevel || 'Beginner'}</span></p>
          </div>
          <div className="flex items-center gap-3">
            {user?.isPro ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-sm font-medium">
                <Crown size={16} /> Pro Member
              </div>
            ) : (
              <Link to="/pricing" className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-btn text-sm">
                <Crown size={16} /> Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Chats', value: analytics?.chatCount || 0, icon: <MessageSquare size={18} />, color: 'text-violet-400' },
          { label: 'Days Active', value: Math.ceil((Date.now() - new Date(user?.createdAt)) / 86400000) || 1, icon: <Clock size={18} />, color: 'text-blue-400' },
          { label: 'Skill Level', value: user?.skillLevel?.charAt(0).toUpperCase() + user?.skillLevel?.slice(1) || 'Beginner', icon: <Target size={18} />, color: 'text-emerald-400' },
          { label: 'Progress', value: user?.isPro ? '100%' : '40%', icon: <TrendingUp size={18} />, color: 'text-pink-400' },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className="glass-card p-5">
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div key={i} whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link to={action.href} className="glass-card p-5 block hover:border-white/30 transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                  {action.icon}
                </div>
                <p className="font-semibold text-white text-sm">{action.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Chats + Tip */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Conversations</h2>
            <Link to="/dashboard/chat" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentChats.length > 0 ? recentChats.map((chat, i) => (
              <motion.div key={chat._id} whileHover={{ x: 4 }}>
                <Link to={`/dashboard/chat?id=${chat._id}`} className="glass-card p-4 flex items-center gap-3 hover:border-white/25 transition-all duration-200 block">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{chat.title || 'New Chat'}</p>
                    <p className="text-white/40 text-xs">{new Date(chat.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight size={14} className="text-white/30 flex-shrink-0" />
                </Link>
              </motion.div>
            )) : (
              <Link to="/dashboard/chat" className="glass-card p-8 block text-center border-dashed hover:bg-white/5 transition-all">
                <MessageSquare size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No conversations yet</p>
                <p className="text-purple-400 text-sm mt-1 font-medium">Start chatting with AI →</p>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Daily Tip */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-bold text-white mb-4">Today's Career Tip</h2>
          <div className="glass-card p-5 h-fit" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))' }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center mb-4">
              <Zap size={20} className="text-white" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
            <Link to="/dashboard/chat" className="mt-5 flex items-center gap-1 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">
              Discuss with AI <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
