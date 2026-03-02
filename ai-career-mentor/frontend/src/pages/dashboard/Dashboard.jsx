// Dashboard shown after login. Includes greeting, profile summary,
// simple profile editor, and a mock AI chat experience.

import React, { useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import {
  Brain,
  MessageCircle,
  PenSquare,
  Send,
  Sparkles,
  Target
} from "lucide-react";

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    role: user?.role || "Student",
    careerInterest: user?.careerInterest || "",
    skillLevel: user?.skillLevel || "Beginner"
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      from: "ai",
      text: `Hi ${
        user?.name?.split(" ")[0] || "there"
      } 👋 — I'm your AI Career Mentor. Ask me anything about your journey as a ${
        user?.role || "professional"
      } aiming for ${user?.careerInterest || "your next big role"}.`
    }
  ]);
  const [chatThinking, setChatThinking] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setSaveMessage("");
    const result = await updateProfile(profileForm);
    setSaving(false);

    if (!result.success) {
      setSaveMessage(result.message);
      return;
    }

    setSaveMessage("Profile updated ✨");
    setEditing(false);
    setTimeout(() => setSaveMessage(""), 2500);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { from: "user", text: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatThinking(true);

    // Very simple mock AI behavior based on keywords.
    setTimeout(() => {
      const interest = user?.careerInterest || "your target role";
      const level = user?.skillLevel || "your current level";

      let response =
        "Great question! Let's break this down into a clear, focused next step.";

      if (/resume|cv/i.test(userMessage.text)) {
        response =
          "I'll help you rewrite impact-driven bullets. Start each with a strong verb, add context, quantify results, and tie to the skills this role needs.";
      } else if (/interview/i.test(userMessage.text)) {
        response =
          "Let's prep with a story bank. Pick 5 projects and write STAR stories for each—then we can map them to common interview questions.";
      } else if (/roadmap|path|plan/i.test(userMessage.text)) {
        response = `Based on your interest in ${interest}, a strong 90-day roadmap would include 3 projects, 2 core skills, and 1 visible outcome (like a portfolio or internal demo).`;
      } else if (/skill|learn/i.test(userMessage.text)) {
        response = `At your ${level.toLowerCase()} level, focus on 1–2 skills at a time. Depth beats breadth. Let's choose one you can demonstrate within 4 weeks.`;
      }

      const aiMessage = { from: "ai", text: response };
      setChatMessages((prev) => [...prev, aiMessage]);
      setChatThinking(false);
    }, 900);
  };

  return (
    <div className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <div className="bg-aurora" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        {/* Left column: profile & roadmap */}
        <div className="flex-1 space-y-4">
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-300/90">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  Welcome back
                </p>
                <h1 className="mt-1 text-xl font-semibold text-slate-50 sm:text-2xl">
                  {user?.name || "Explorer"},
                </h1>
                <p className="mt-1 text-sm text-slate-300/85">
                  Your AI mentor is optimizing for your next move as a{" "}
                  <span className="font-medium text-sky-200">
                    {user?.role}
                  </span>{" "}
                  aiming for{" "}
                  <span className="font-medium text-fuchsia-200">
                    {user?.careerInterest || "your next big opportunity"}
                  </span>
                  .
                </p>
              </div>
              <div className="rounded-2xl bg-slate-900/60 px-3 py-2 text-[0.7rem] text-slate-200/90">
                <p className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-emerald-300" />
                  Skill level
                </p>
                <p className="mt-1 font-semibold text-emerald-200">
                  {user?.skillLevel}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
                  Your profile
                </h2>
                <p className="mt-1 text-xs text-slate-300/85">
                  Keep this aligned with your current goals so your roadmap
                  stays accurate.
                </p>
              </div>
              <Button
                variant="ghost"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                onClick={() => setEditing((prev) => !prev)}
              >
                <PenSquare className="h-3.5 w-3.5" />
                {editing ? "Cancel" : "Edit"}
              </Button>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400/90">Name</p>
                <p className="mt-1 font-medium text-slate-100">
                  {user?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400/90">Email</p>
                <p className="mt-1 font-medium text-slate-100">
                  {user?.email || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400/90">Role</p>
                <p className="mt-1 font-medium text-slate-100">
                  {user?.role || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400/90">Skill level</p>
                <p className="mt-1 font-medium text-slate-100">
                  {user?.skillLevel || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400/90">Career interest</p>
                <p className="mt-1 text-sm font-medium text-slate-100">
                  {user?.careerInterest || "-"}
                </p>
              </div>
            </div>

            {editing && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                  />
                  <div>
                    <label
                      htmlFor="role"
                      className="text-xs font-medium text-slate-200 tracking-wide"
                    >
                      Role
                    </label>
                    <div className="mt-1.5 rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 backdrop-blur-xl">
                      <select
                        id="role"
                        name="role"
                        value={profileForm.role}
                        onChange={handleProfileChange}
                        className="w-full bg-transparent text-sm text-slate-50 outline-none"
                      >
                        <option className="bg-slate-900" value="Student">
                          Student
                        </option>
                        <option
                          className="bg-slate-900"
                          value="Working Professional"
                        >
                          Working Professional
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="skillLevel"
                      className="text-xs font-medium text-slate-200 tracking-wide"
                    >
                      Skill level
                    </label>
                    <div className="mt-1.5 rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 backdrop-blur-xl">
                      <select
                        id="skillLevel"
                        name="skillLevel"
                        value={profileForm.skillLevel}
                        onChange={handleProfileChange}
                        className="w-full bg-transparent text-sm text-slate-50 outline-none"
                      >
                        <option className="bg-slate-900" value="Beginner">
                          Beginner
                        </option>
                        <option className="bg-slate-900" value="Intermediate">
                          Intermediate
                        </option>
                        <option className="bg-slate-900" value="Advanced">
                          Advanced
                        </option>
                      </select>
                    </div>
                  </div>
                  <Input
                    label="Career interest"
                    name="careerInterest"
                    value={profileForm.careerInterest}
                    onChange={handleProfileChange}
                    className="sm:col-span-2"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-3">
                    {saveMessage && (
                      <p className="text-xs text-emerald-200">{saveMessage}</p>
                    )}
                    <Button
                      className="px-4 py-2 text-xs"
                      onClick={handleProfileSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save profile"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500/80 to-sky-400/80 text-white">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-50">
                  Next 7-day focus
                </h2>
                <p className="mt-1 text-xs text-slate-300/90">
                  Choose one small but meaningful outcome you&apos;ll commit to
                  this week.
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-200/90">
              <li>• Complete 1 project aligned with your target role.</li>
              <li>• Ship a resume tailored to 2–3 dream companies.</li>
              <li>• Practice 5 behavioral questions using STAR stories.</li>
            </ul>
          </GlassCard>
        </div>

        {/* Right column: AI chat */}
        <div className="mt-4 w-full max-w-xl lg:mt-0 lg:w-[420px]">
          <GlassCard className="flex h-full flex-col p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500/80 to-sky-400/80 text-white shadow-[0_0_18px_rgba(129,140,248,0.8)]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    AI Career Chat
                  </h2>
                  <p className="text-[0.7rem] text-slate-300/85">
                    Ask about roadmaps, resumes, skills, or interviews.
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-medium text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                Live
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl bg-slate-950/40">
              <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_1px_1px,#64748b_1px,transparent_0)] [background-size:18px_18px]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.from === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                          msg.from === "user"
                            ? "bg-gradient-to-r from-brand-500/80 to-sky-400/80 text-slate-50"
                            : "bg-slate-900/80 text-slate-100"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatThinking && (
                    <div className="flex items-center gap-2 text-slate-300/90">
                      <div className="flex h-6 w-10 items-center justify-center rounded-full bg-slate-800/90">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-200" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-200 delay-100" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-200 delay-200" />
                      </div>
                      <span className="text-[0.7rem]">
                        Your mentor is thinking...
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800/80 bg-slate-950/80 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Input
                      name="chat"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask for a roadmap, resume feedback, or interview prep..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-3 py-2 text-xs"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-slate-400/85">
                    Tip: try &ldquo;Create a 90-day roadmap for{" "}
                    {user?.careerInterest || "my target role"}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

