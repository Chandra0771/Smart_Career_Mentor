import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare, FileText, Map, BarChart3, Zap, ArrowRight,
  TrendingUp, Clock, Target, Edit, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, authAPI } from '../services/api';
import Navbar from '../components/ui/Navbar';
import toast from 'react-hot-toast';

const QuickActionCard = ({ to, icon: Icon, title, desc, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4, scale: 1.02 }}
  >
    <Link to={to} className="block glass-card p-5 group relative overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-8 transition-opacity duration-500 ${gradient}`} />
      <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center mb-4 shadow-md`}>
        <Icon size={18} className="text-white" />
      </div>
      <h3 className="text-white font-semibold mb-1.5 text-sm">{title}</h3>
      <p className="text-white/45 text-xs leading-relaxed">{desc}</p>
      <ArrowRight size={14} className="mt-3 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200" />
    </Link>
  </motion.div>
);

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await analyticsAPI.getUserStats();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const { data } = await authAPI.updateProfile(editForm);
      updateUser(data.user);
      setEditMode(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed.');
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      to: '/chat',
      icon: MessageSquare,
      title: 'AI Career Mentor',
      desc: 'Chat with your personal AI for career guidance',
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
      delay: 0.1
    },
    {
      to: '/resume',
      icon: FileText,
      title: 'Resume Review',
      desc: 'Get AI feedback and ATS score for your resume',
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      delay: 0.15
    },
    {
      to: '/roadmap',
      icon: Map,
      title: 'Career Roadmap',
      desc: 'Generate your personalized 6-month career plan',
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      delay: 0.2
    },
    {
      to: '/pricing',
      icon: Zap,
      title: user?.isPro ? 'Pro Member' : 'Upgrade to Pro',
      desc: user?.isPro ? 'Enjoy unlimited AI access' : 'Unlock all features for $9.99/mo',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      delay: 0.25
    },
  ];

  return (
    <div className="min-h-screen bg-mesh text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {editMode ? (
                <div className="flex items-center gap-3">
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ name: e.target.value })}
                    className="glass-input text-2xl font-display font-bold py-2"
                    style={{ width: '240px' }}
                  />
                  <button onClick={handleSaveProfile} className="btn-gradient py-2 px-4 text-sm flex items-center gap-1.5">
                    <CheckCircle size={14} /> Save
                  </button>
                  <button onClick={() => setEditMode(false)} className="text-white/50 text-sm hover:text-white">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-display font-bold">
                    {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                  </h1>
                  <button onClick={() => setEditMode(true)} className="p-2 text-white/30 hover:text-white/60 transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
              )}
              <p className="text-white/45 mt-1.5 text-base">
                {user?.careerInterest} · {user?.skillLevel?.charAt(0)?.toUpperCase() + user?.skillLevel?.slice(1)} · {user?.role === 'student' ? 'Student' : 'Professional'}
              </p>
            </div>

            {!user?.isPro && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-amber-300 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/18 transition-all duration-200"
                >
                  <Zap size={15} />
                  Upgrade to Pro
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'AI Chats', value: loading ? '...' : analytics?.totalChats || 0, icon: MessageSquare, color: 'text-violet-400' },
            { label: 'Resumes', value: loading ? '...' : analytics?.totalResumes || 0, icon: FileText, color: 'text-blue-400' },
            { label: 'Messages', value: loading ? '...' : analytics?.totalMessages || 0, icon: BarChart3, color: 'text-emerald-400' },
            { label: 'Career Goal', value: user?.careerInterest?.split(' ')[0] || '—', icon: Target, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-5 flex items-center gap-4">
              <div className={`${color} opacity-80`}>
                <Icon size={22} />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-white">{value}</div>
                <div className="text-white/40 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.to} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-violet-400" />
              Recent Activity
            </h2>
            <Link to="/chat" className="text-violet-400 text-sm hover:text-violet-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : analytics?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 bg-white/4 rounded-xl hover:bg-white/7 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={15} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-white/35 text-xs">{activity.messageCount} messages</p>
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs flex-shrink-0">
                    <Clock size={11} />
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessageSquare size={36} className="mx-auto text-white/15 mb-3" />
              <p className="text-white/40 text-sm mb-4">No activity yet</p>
              <Link to="/chat" className="btn-gradient py-2 px-5 text-sm inline-flex items-center gap-2">
                Start a conversation <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
