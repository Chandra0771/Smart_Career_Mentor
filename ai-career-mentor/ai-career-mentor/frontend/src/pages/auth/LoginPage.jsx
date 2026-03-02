import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrors({ email: !formData.email ? 'Email required' : '', password: !formData.password ? 'Password required' : '' });
      return;
    }
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
      <div className="fixed top-20 right-10 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 mb-4 shadow-2xl shadow-purple-500/30">
            <Brain size={32} className="text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/50 mt-2">Continue your career journey</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full bg-white/10 border ${errors.email ? 'border-red-500/60' : 'border-white/20'} rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:bg-white/15 transition-all duration-200`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input name="password" type={showPass ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                  placeholder="Your password"
                  className={`w-full bg-white/10 border ${errors.password ? 'border-red-500/60' : 'border-white/20'} rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:bg-white/15 transition-all duration-200`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full gradient-btn py-3.5 text-base rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : (<>Sign In <ArrowRight size={18} /></>)}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 text-center">Demo: admin@carerai.com / admin123</p>
          </div>

          <p className="text-center text-white/50 text-sm mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
