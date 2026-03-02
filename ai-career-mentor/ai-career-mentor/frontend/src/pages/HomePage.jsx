import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, FileText, Map, Target, Mic, ArrowRight, Star, Twitter, Github, Linkedin, Sparkles, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';

const FEATURES = [
  { icon: <FileText size={26} />, title: 'AI Resume Review', desc: 'Get instant, AI-powered feedback on your resume with ATS score, improvement tips, and keyword optimization.', color: 'from-violet-600 to-purple-600', delay: 0 },
  { icon: <Map size={26} />, title: 'Career Roadmap', desc: 'Generate a personalized, step-by-step career path tailored to your goals, skills, and industry trends.', color: 'from-blue-600 to-cyan-600', delay: 0.1 },
  { icon: <Target size={26} />, title: 'Skill Gap Analysis', desc: 'Discover exactly what skills you need to land your dream job and get curated resources to fill the gaps.', color: 'from-pink-600 to-rose-600', delay: 0.2 },
  { icon: <Mic size={26} />, title: 'Interview Prep', desc: 'Practice with AI-generated questions, get real-time feedback, and build the confidence to ace any interview.', color: 'from-amber-600 to-orange-600', delay: 0.3 },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Software Engineer @ Google', avatar: 'S', text: 'The AI roadmap feature completely changed my job search strategy. Got 3 offers in 2 months!', stars: 5 },
  { name: 'Marcus L.', role: 'Product Manager @ Stripe', avatar: 'M', text: 'Resume review scored my CV at 64% and gave actionable tips. Improved to 89% in one session.', stars: 5 },
  { name: 'Priya V.', role: 'Data Scientist @ Netflix', avatar: 'P', text: 'The interview prep is incredibly realistic. Felt totally prepared walking into my dream job interview.', stars: 5 },
];

const STATS = [
  { label: 'Active Users', value: '50,000+', icon: <Users size={20} /> },
  { label: 'Resumes Improved', value: '120,000+', icon: <FileText size={20} /> },
  { label: 'Job Offers Secured', value: '18,000+', icon: <TrendingUp size={20} /> },
  { label: 'AI Interactions', value: '2M+', icon: <Zap size={20} /> },
];

const PRICING = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 AI chats/day', 'Basic resume review', 'Career roadmap basics', 'Skill gap overview'], cta: 'Get Started', href: '/register', gradient: 'from-white/10 to-white/5' },
  { name: 'Pro', price: '$19.99', period: '/month', features: ['Unlimited AI chats', 'Full resume analysis', 'Custom career roadmaps', 'Mock interviews', 'Priority support', 'Analytics dashboard'], cta: 'Start Pro', href: '/register?plan=pro', gradient: 'from-violet-600/40 to-pink-600/40', popular: true },
  { name: 'Team', price: '$49', period: '/month', features: ['Everything in Pro', 'Team dashboard', 'Bulk resume analysis', 'Admin controls', 'Custom integrations', 'Dedicated support'], cta: 'Contact Sales', href: '/contact', gradient: 'from-white/10 to-white/5' },
];

const FloatingOrb = ({ cx, cy, size, color, delay }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${color}`}
    style={{ left: cx, top: cy, width: size, height: size }}
    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

const HomePage = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Your AI Career Mentor';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen mesh-bg overflow-x-hidden">
      {/* Floating Orbs */}
      <FloatingOrb cx="10%" cy="10%" size={500} color="bg-violet-600" delay={0} />
      <FloatingOrb cx="70%" cy="5%" size={400} color="bg-pink-600" delay={2} />
      <FloatingOrb cx="40%" cy="60%" size={300} color="bg-blue-600" delay={4} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-purple-300 mb-8 border-purple-500/30"
          >
            <Sparkles size={14} /> Powered by Google Gemini AI <Sparkles size={14} />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-white">{typedText}</span>
            <span className="text-purple-400 animate-pulse">{typedText.length < fullText.length ? '|' : ''}</span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Accelerate your career with personalized AI guidance, resume optimization, skill gap analysis, and interview preparation—all in one beautiful platform.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="gradient-btn text-base px-8 py-4 flex items-center justify-center gap-2 rounded-2xl">
              Start Free Today <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-2xl glass-card text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300 text-base font-medium">
              Sign In
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="text-purple-400 flex justify-center mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Comprehensive AI-powered tools to guide every step of your career journey</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users <span className="text-gradient">Say</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple <span className="text-gradient">Pricing</span></h2>
            <p className="text-white/50">Start free, upgrade when you're ready</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-7 relative ${plan.popular ? 'border-purple-500/50 ring-2 ring-purple-500/30' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/40 mb-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.href} className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 ${plan.popular ? 'gradient-btn' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-12 glow-purple"
        >
          <Brain size={48} className="text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
          <p className="text-white/60 mb-8 text-lg">Join 50,000+ professionals already using AI Career Mentor</p>
          <Link to="/register" className="gradient-btn text-lg px-10 py-4 inline-flex items-center gap-2 rounded-2xl">
            Start Free Today <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">CareerAI</span>
            </div>
            <div className="flex gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div className="flex gap-3">
              {[<Twitter size={18} />, <Github size={18} />, <Linkedin size={18} />].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          <div className="text-center text-white/30 text-sm mt-8">
            © 2024 CareerAI. All rights reserved. Built with ❤️ and AI.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
