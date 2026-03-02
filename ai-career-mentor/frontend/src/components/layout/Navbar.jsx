// Floating transparent navbar with smooth hover states and auth-aware actions.

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClasses =
    "text-xs sm:text-sm font-medium text-slate-200/80 hover:text-white transition-colors tracking-wide";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-4 sm:px-6 sm:pt-6">
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-3xl border border-white/15 bg-slate-900/40 px-3 py-2.5 shadow-lg shadow-slate-950/60 backdrop-blur-2xl sm:px-5 sm:py-3"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
            <span>AI CAREER MENTOR</span>
          </Link>
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClasses}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
              <Button
                className="px-3 py-1.5 text-xs sm:px-4 sm:py-2"
                onClick={() => navigate("/register")}
              >
                Get started
              </Button>
            </>
          ) : (
            <>
              <span className="hidden text-xs text-slate-200/80 sm:inline">
                Hi, <span className="font-semibold">{user.name}</span>
              </span>
              <Button
                variant="subtle"
                className="px-3 py-1.5 text-xs"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;

