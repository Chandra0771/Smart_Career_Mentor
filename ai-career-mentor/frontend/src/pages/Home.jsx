// Landing page with hero, animated feature cards, and testimonials.

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  FileText,
  Sparkles,
  Target,
  MessageCircle,
  GraduationCap
} from "lucide-react";

const featureCards = [
  {
    icon: <Target className="h-6 w-6 text-emerald-300" />,
    title: "AI Career Roadmap",
    description:
      "Get a step-by-step, personalized journey from where you are to where you want to be.",
    accent: "from-emerald-400/70 to-cyan-400/70"
  },
  {
    icon: <FileText className="h-6 w-6 text-sky-300" />,
    title: "Smart Resume Analyzer",
    description:
      "Instantly highlight impact, identify gaps, and rewrite bullet points that recruiters love.",
    accent: "from-sky-400/70 to-indigo-400/70"
  },
  {
    icon: <Brain className="h-6 w-6 text-fuchsia-300" />,
    title: "Skill Gap Insights",
    description:
      "See exactly which skills to build next, and get curated resources to close the gap fast.",
    accent: "from-fuchsia-400/70 to-violet-400/70"
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-amber-300" />,
    title: "Interview Co-Pilot",
    description:
      "Mock interviews, feedback, and story coaching so you walk into every call prepared.",
    accent: "from-amber-400/70 to-rose-400/70"
  }
];

const testimonials = [
  {
    name: "Aditi, Frontend Engineer",
    role: "Transitioned from Student to FAANG",
    quote:
      "My roadmap felt like a mentor walking next to me. In 6 months I landed the role I dreamed of.",
    badge: "Career Switch"
  },
  {
    name: "Rahul, Data Analyst",
    role: "Promoted to Senior in 8 months",
    quote:
      "The skill-gap analysis turned into a clear weekly plan. My manager noticed the difference immediately.",
    badge: "Fast Promotion"
  },
  {
    name: "Sara, Product Manager",
    role: "Broke into Tech from Non-Tech",
    quote:
      "The interview prep made story-telling feel natural. I finally felt confident instead of rehearsed.",
    badge: "Confident Storytelling"
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated aurora background */}
      <div className="bg-aurora" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:px-8">
        {/* Hero Section */}
        <section className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-slate-100 shadow-sm shadow-slate-900/60 backdrop-blur-xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Built for ambitious careers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
            >
              Your{" "}
              <span className="bg-gradient-to-r from-brand-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
                AI Career Mentor
              </span>
              , on demand.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-xl text-sm leading-relaxed text-slate-200/80 sm:text-base"
            >
              Turn uncertainty into a clear roadmap. From choosing your next
              role to rewriting your resume and practicing interviews, your
              personal AI mentor sits one tab away—day or night.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Button
                onClick={() => navigate("/register")}
                className="px-4 py-2.5 text-sm sm:px-6 sm:py-3"
              >
                Start your roadmap
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="px-4 py-2.5 text-sm sm:px-5 sm:py-3"
              >
                Already with us? Log in
              </Button>
              <div className="flex items-center gap-2 text-[0.7rem] text-slate-300/80">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-400 to-fuchsia-400 shadow-[0_0_0_2px_rgba(15,23,42,1)]" />
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-sky-400 to-violet-400 shadow-[0_0_0_2px_rgba(15,23,42,1)]" />
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-[0_0_0_2px_rgba(15,23,42,1)]" />
                </div>
                <span>Trusted by 3,000+ learners</span>
              </div>
            </motion.div>
          </div>

          {/* Right: stacked glass stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative mx-auto w-full max-w-md"
          >
            <GlassCard className="relative overflow-hidden p-4 sm:p-5">
              <div className="absolute -right-12 -top-6 h-40 w-40 rounded-full bg-gradient-to-br from-brand-400/40 via-fuchsia-400/40 to-sky-400/40 blur-3xl opacity-60" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300/90">
                    <GraduationCap className="h-4 w-4 text-emerald-300" />
                    Student or Professional
                  </p>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Designed for your next chapter
                  </h2>
                  <p className="max-w-xs text-xs text-slate-200/80">
                    Whether you&apos;re landing your first role or your first
                    leadership title, your mentor adapts to you.
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-[0.7rem] text-slate-200">
                  <div className="rounded-2xl bg-slate-900/60 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span>Offer rate</span>
                      <span className="text-emerald-300 font-semibold">
                        +38%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-700/80">
                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span>Time saved</span>
                      <span className="text-sky-300 font-semibold">6h/wk</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-slate-300/80">
                      vs. doing it alone with scattered resources.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mt-16 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Everything your career needs, in one glassy dashboard.
              </h2>
              <p className="mt-1 text-sm text-slate-300/85">
                No more guessing. Four core experiences power your growth, from
                roadmap to interviews.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature, index) => (
              <GlassCard
                key={feature.title}
                delay={0.1 + index * 0.05}
                className="flex flex-col justify-between p-4 sm:p-5"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900/60 to-slate-800/60">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-300/90">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
                <div className="mt-3 flex items-center justify-between text-[0.7rem] text-slate-300/85">
                  <span>Powered by your data</span>
                  <span
                    className={`inline-flex h-1.5 w-10 rounded-full bg-gradient-to-r ${feature.accent}`}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-16 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Real people. Real career momentum.
              </h2>
              <p className="mt-1 text-sm text-slate-300/85">
                Your story is next. Our AI mentor quietly supports you in the
                background.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <GlassCard
                key={item.name}
                delay={0.05 + index * 0.06}
                className="flex flex-col justify-between p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-300/80">{item.role}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    {item.badge}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-200/90">&ldquo;{item.quote}&rdquo;</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

