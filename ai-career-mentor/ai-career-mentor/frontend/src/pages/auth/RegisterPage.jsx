import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Eye, EyeOff, User, Mail, Lock, Briefcase, BookOpen, Rocket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CAREER_OPTIONS = [
  'Software Engineering', 'Data Science', 'Product Management', 'UI/UX Design',
  'DevOps / Cloud', 'Cybersecurity', 'Machine Learning / AI', 'Marketing',
  'Finance / FinTech', 'Healthcare', 'Education', 'Entrepreneurship', 'Other'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', careerInterest: '', skillLevel: 'beginner'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.careerInterest) e.careerInterest = 'Please select a career interest';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, label, icon, type = 'text', placeholder, rightElement }) => (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>
        <input
          name={name} type={type} value={formData[name]}
          onChange={handleChange} placeholder={placeholder}
          className={`w-full bg-white/10 border ${errors[name] ? 'border-red-500/60' : 'border-white/20'} 
            rounded-xl py-3 pl-10 pr-${rightElement ? '10' : '4'} text-white placeholder-white/30 
            focus:outline-none focus:border-purple-500/60 focus:bg-white/15 transition-all duration-200`}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-24">
      {/* Background orbs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 mb-4 shadow-2xl shadow-purple-500/30">
            <Brain size={32} className="text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-white/50 mt-2">Start your AI-powered career journey</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField name="name" label="Full Name" icon={<User size={16} />} placeholder="John Doe" />
            <InputField name="email" label="Email Address" type="email" icon={<Mail size={16} />} placeholder="john@example.com" />
            <InputField name="password" label="Password" type={showPass ? 'text' : 'password'} icon={<Lock size={16} />} placeholder="Min 6 characters"
              rightElement={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/40 hover:text-white/70 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <InputField name="confirmPassword" label="Confirm Password" type={showConfirm ? 'text' : 'password'} icon={<Lock size={16} />} placeholder="Repeat password"
              rightElement={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-white/40 hover:text-white/70 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'student', label: 'Student', icon: <BookOpen size={16} /> },
                  { value: 'professional', label: 'Professional', icon: <Briefcase size={16} /> }].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setFormData(p => ({ ...p, role: opt.value }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                      formData.role === opt.value
                        ? 'bg-purple-500/30 border-purple-500/60 text-white'
                        : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Interest */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Career Interest</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Rocket size={16} /></div>
                <select
                  name="careerInterest" value={formData.careerInterest} onChange={handleChange}
                  className={`w-full bg-white/10 border ${errors.careerInterest ? 'border-red-500/60' : 'border-white/20'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500/60 transition-all duration-200 appearance-none`}
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <option value="" style={{ background: '#1a1a2e' }}>Select your career path</option>
                  {CAREER_OPTIONS.map(opt => (
                    <option key={opt} value={opt} style={{ background: '#1a1a2e' }}>{opt}</option>
                  ))}
                </select>
              </div>
              {errors.careerInterest && <p className="text-red-400 text-xs mt-1">{errors.careerInterest}</p>}
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Skill Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button key={level} type="button" onClick={() => setFormData(p => ({ ...p, skillLevel: level }))}
                    className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                      formData.skillLevel === level
                        ? 'bg-purple-500/30 border-purple-500/60 text-white'
                        : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full gradient-btn py-3.5 text-base rounded-xl mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
