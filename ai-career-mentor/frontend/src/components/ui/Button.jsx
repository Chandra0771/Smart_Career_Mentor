// Reusable glass-styled button with subtle hover and focus animations.

import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "relative inline-flex items-center justify-center px-4 py-2.5 rounded-2xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-brand-500/90 via-fuchsia-500/90 to-sky-400/90 text-white shadow-[0_0_25px_rgba(129,140,248,0.6)] hover:shadow-[0_0_40px_rgba(129,140,248,0.95)]",
    ghost:
      "bg-white/5 border border-white/15 text-slate-100 hover:bg-white/10 hover:border-white/30",
    subtle:
      "bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -1, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Soft inner glow layer */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/0 to-white/5 opacity-60 mix-blend-screen pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;

