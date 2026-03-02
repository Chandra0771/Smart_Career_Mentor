// Login page with error handling and redirect to dashboard on success.

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import GlassCard from "../../components/common/GlassCard";
import { useNavigate, Link } from "react-router-dom";
import { LockIcon } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { loginUser, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const result = await loginUser(form);
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <div className="bg-aurora" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500/80 to-brand-500/80 text-white shadow-[0_0_18px_rgba(56,189,248,0.9)]">
              <LockIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Welcome back
              </h1>
              <p className="text-xs text-slate-300/85 sm:text-[0.8rem]">
                Pick up where you left off—your mentor remembers your journey.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />

            {serverError && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {serverError}
              </div>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Sign in"}
              </Button>
              <p className="text-[0.75rem] text-slate-300/85">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-medium text-sky-300 hover:text-sky-200"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;

