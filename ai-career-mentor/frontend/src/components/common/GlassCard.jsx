// Generic glassmorphism card used across the UI for consistent styling.

import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  hover = true,
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={hover ? { y: -6, scale: 1.01 } : {}}
      className={`glass-panel relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Soft inner border glow */}
      <div className="pointer-events-none absolute inset-px rounded-[22px] bg-gradient-to-br from-white/20 via-white/0 to-white/10 opacity-80 mix-blend-screen" />
      {/* Light grid texture for subtle depth */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;

