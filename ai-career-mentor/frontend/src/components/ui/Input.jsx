// Reusable input component with label, error text and glass styling.

import React from "react";

const Input = ({
  label,
  type = "text",
  error,
  name,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-slate-200 tracking-wide"
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 backdrop-blur-xl shadow-sm shadow-slate-950/40 focus-within:border-brand-400/70 focus-within:ring-1 focus-within:ring-brand-400/70 ${className}`}
      >
        <input
          id={name}
          name={name}
          type={type}
          className="w-full bg-transparent text-sm text-slate-50 placeholder:text-slate-400 outline-none border-none"
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-300/95 tracking-wide">{error}</p>
      )}
    </div>
  );
};

export default Input;

