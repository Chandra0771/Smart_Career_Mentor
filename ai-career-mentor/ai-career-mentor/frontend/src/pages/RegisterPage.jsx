import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
  AlertCircle, Briefcase, GraduationCap, ChevronDown, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const careerOptions = [
  'Software Engineering', 'Data Science', 'Machine Learning / AI',
  'Product Management', 'UX/UI Design', 'Cybersecurity',
  'Cloud Computing', 'DevOps', 'Business Analytics',
  'Digital Marketing', 'Finance & FinTech', 'Healthcare IT', 'Other'
];

const SelectField = ({ label, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="block text-white/70 text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="glass-input flex items-center justify-between w-full text-left"
          style={{ color: value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={14} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl overflow-hidden border border-white/15 max-h-52 overflow-y-auto"
              style={{ background: 'rgba(10,10,30,0.98)', backdropFilter: 'blur(24px)' }}
            >
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-violet-500/15 transition-all flex items-center justify-between"
                >
                  {opt}
                  {value === opt && <Check size={13} className="text-violet-400" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', careerInterest: '', skillLevel: 'beginner'
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    if (!form.name.trim() || form.name.length < 2) return 'Name must be at least 2 characters.';
    if (!form.email) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return "Passwords don't match.";
    if (!form.careerInterest) return 'Please select your career interest.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await register(form);
      toast.success("Welcome to CareerAI! 🚀");
      navigate('/dashboard');
    } catch (err) {
      const msgs = err.response?.data?.errors;
      const msg = msgs?.[0]?.msg || err.response?.data?.error || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 py-24">
      <motion.div
        className="fixed top-20 right-20 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-white font-display font-bold text-xl">CareerAI</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/50">Start your AI-powered career journey today</p>
        </div>

        <div
          className="glass-card p-8"
          style={{ background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(24px)' }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3.5 mb-5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name')(e.target.value)}
                  placeholder="Your name"
                  className="glass-input pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email')(e.target.value)}
                  placeholder="you@example.com"
                  className="glass-input pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password')(e.target.value)}
                    placeholder="Min 8 chars"
                    className="glass-input pl-11 pr-11"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword')(e.target.value)}
                  placeholder="Repeat password"
                  className="glass-input"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: GraduationCap },
                  { value: 'professional', label: 'Working Professional', icon: Briefcase },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('role')(value)}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      form.role === value
                        ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Interest */}
            <SelectField
              label="Career Interest"
              value={form.careerInterest}
              onChange={set('careerInterest')}
              options={careerOptions}
              placeholder="Select your career field..."
            />

            {/* Skill Level */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Skill Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: 'Beginner', color: 'from-emerald-500' },
                  { value: 'intermediate', label: 'Intermediate', color: 'from-amber-500' },
                  { value: 'advanced', label: 'Advanced', color: 'from-rose-500' },
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('skillLevel')(value)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      form.skillLevel === value
                        ? `border-violet-500/50 bg-violet-500/12 text-violet-300`
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/45 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
