// Minimal, glassy footer pinned to the bottom area of the layout.

import React from "react";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/10/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 border-t border-white/10/30 bg-slate-950/10 px-4 py-5 text-xs text-slate-400/90 backdrop-blur-xl sm:flex-row sm:text-[0.8rem]">
        <p>© {new Date().getFullYear()} AI Career Mentor. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="#"
            className="transition hover:text-slate-100 hover:underline"
          >
            Privacy
          </a>
          <a
            href="#"
            className="transition hover:text-slate-100 hover:underline"
          >
            Terms
          </a>
          <a
            href="#"
            className="transition hover:text-slate-100 hover:underline"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

