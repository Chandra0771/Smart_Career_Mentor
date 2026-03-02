import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Briefcase, BookOpen, Tag, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CAREER_OPTIONS = ['Software Engineering', 'Data Science', 'Product Management', 'UI/UX Design', 'DevOps / Cloud', 'Cybersecurity', 'Machine Learning / AI', 'Marketing', 'Finance / FinTech', 'Healthcare', 'Education', 'Entrepreneurship', 'Other'];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    careerInterest: user?.careerInterest || '',
    skillLevel: user?.skillLevel || 'beginner',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Edit Profile</h1>
        <p className="text-white/50">Update your personal information and career preferences</p>
      </motion.div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-5"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-white/50 text-sm">{user?.email}</p>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${user?.isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/50'}`}>
            {user?.isPro ? '✨ Pro Member' : 'Free Plan'}
          </span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2"><User size={14} /> Full Name</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-all"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2"><Mail size={14} /> Email (read-only)</label>
          <input value={user?.email} disabled
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/40 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 mb-1.5">Career Interest</label>
          <select name="careerInterest" value={form.careerInterest} onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/60 transition-all appearance-none"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <option value="" style={{ background: '#1a1a2e' }}>Select career path</option>
            {CAREER_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#1a1a2e' }}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 mb-2">Skill Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['beginner', 'intermediate', 'advanced'].map(l => (
              <button key={l} type="button" onClick={() => setForm(p => ({ ...p, skillLevel: l }))}
                className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.skillLevel === l ? 'bg-purple-500/30 border-purple-500/60 text-white' : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2"><BookOpen size={14} /> Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
            placeholder="Tell us about yourself and your career goals..."
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-all resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2"><Tag size={14} /> Skills (comma separated)</label>
          <input name="skills" value={form.skills} onChange={handleChange}
            placeholder="JavaScript, React, Python, ..."
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-all"
          />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full gradient-btn py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
