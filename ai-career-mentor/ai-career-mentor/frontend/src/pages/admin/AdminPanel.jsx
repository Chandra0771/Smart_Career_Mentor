import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, TrendingUp, Crown, Search, Trash2, Shield, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const togglePro = async (id, isPro) => {
    try {
      await api.patch(`/admin/users/${id}`, { isPro: !isPro });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isPro: !isPro } : u));
      toast.success('User updated');
    } catch { toast.error('Failed to update user'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-white/50 text-sm mt-1">{label}</div>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield size={24} className="text-purple-400" /> Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Manage users, view analytics, and monitor platform health</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-xl glass-card text-white/60 hover:text-white hover:bg-white/15 transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['overview', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${activeTab === tab ? 'bg-purple-500/30 border border-purple-500/60 text-white' : 'glass-card text-white/60 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard icon={<Users size={20} />} label="Total Users" value={stats.stats?.totalUsers || 0} color="from-violet-600 to-purple-600" />
            <StatCard icon={<Crown size={20} />} label="Pro Members" value={stats.stats?.proUsers || 0} color="from-amber-600 to-orange-600" />
            <StatCard icon={<MessageSquare size={20} />} label="Total Chats" value={stats.stats?.totalChats || 0} color="from-blue-600 to-cyan-600" />
            <StatCard icon={<TrendingUp size={20} />} label="Free Users" value={stats.stats?.freeUsers || 0} color="from-emerald-600 to-teal-600" />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-bold text-white mb-5">Users by Career Interest</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.usersByCareer?.map(d => ({ name: d._id || 'Unknown', count: d.count }))}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-white mb-5">User Roles Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.usersByRole?.map(d => ({ name: d._id || 'Unknown', value: d.count }))}
                    cx="50%" cy="50%" outerRadius={80} dataKey="value" label
                  >
                    {stats.usersByRole?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Users */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4">Recent Registrations</h3>
            <div className="space-y-3">
              {stats.recentUsers?.map(user => (
                <div key={user._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-white/40 text-xs">{user.email}</p>
                  </div>
                  <span className="text-xs text-white/40">{new Date(user.createdAt).toLocaleDateString()}</span>
                  {user.isPro && <Crown size={14} className="text-amber-400" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-all"
            />
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    {['User', 'Email', 'Role', 'Career', 'Plan', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                            {user.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-white/60">{user.email}</td>
                      <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60 capitalize">{user.role}</span></td>
                      <td className="p-4 text-sm text-white/60">{user.careerInterest || '-'}</td>
                      <td className="p-4">
                        <button onClick={() => togglePro(user._id, user.isPro)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${user.isPro ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                        >
                          {user.isPro ? '✨ Pro' : 'Free'}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-white/40">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => deleteUser(user._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-white/30">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;
