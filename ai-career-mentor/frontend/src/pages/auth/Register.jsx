// Registration page with form validation and friendly error messages.

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import GlassCard from "../../components/common/GlassCard";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Student",
  careerInterest: "",
  skillLevel: "Beginner"
};

const Register = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (!form.careerInterest.trim())
      newErrors.careerInterest = "Please choose or write a career interest.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    const { confirmPassword, ...payload } = form;

    const result = await registerUser({ ...payload, confirmPassword });

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <div className="bg-aurora" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-xl">
        <GlassCard className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500/80 to-fuchsia-500/80 text-white shadow-[0_0_18px_rgba(129,140,248,0.9)]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Create your mentor space
              </h1>
              <p className="text-xs text-slate-300/85 sm:text-[0.8rem]">
                Tell us where you&apos;re at today so your AI mentor can guide
                your next move.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Johnson"
                error={errors.name}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
              />
            </div>

            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                error={errors.password}
              />
            </div>

            <div>
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Retype your password"
                error={errors.confirmPassword}
              />
            </div>

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
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-50 outline-none"
                >
                  <option className="bg-slate-900" value="Student">
                    Student
                  </option>
                  <option className="bg-slate-900" value="Working Professional">
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
                Skill Level
              </label>
              <div className="mt-1.5 rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-50 backdrop-blur-xl">
                <select
                  id="skillLevel"
                  name="skillLevel"
                  value={form.skillLevel}
                  onChange={handleChange}
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

            <div className="sm:col-span-2">
              <Input
                label="Career Interest"
                name="careerInterest"
                value={form.careerInterest}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineer, Data Scientist, PM..."
                error={errors.careerInterest}
              />
            </div>

            {serverError && (
              <div className="sm:col-span-2">
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                  {serverError}
                </div>
              </div>
            )}

            <div className="sm:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : "Create account"}
              </Button>
              <p className="text-[0.75rem] text-slate-300/85">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-sky-300 hover:text-sky-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;

