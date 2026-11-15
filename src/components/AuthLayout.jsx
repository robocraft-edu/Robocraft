import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center animated-bg grid-pattern px-4 py-8 relative overflow-hidden">
      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Logo & Tagline */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-[28%] bg-cyan-400/40 blur-xl animate-pulse-glow" />
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="RoboCraft logo" className="relative w-20 h-20 drop-shadow-xl animate-float" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">RoboCraft</h1>
          <p className="text-sm text-cyan-400/80 mt-1.5 font-medium">Learn Robotics. Build Robots. Control Them.</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-7 shadow-2xl">
          {title && <h2 className="text-xl font-bold text-foreground mb-1">{title}</h2>}
          {subtitle && <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>}
          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-5">{footer}</p>
        )}
        <Link to="/creator" className="mt-5 mx-auto w-fit flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
          <img src={`${import.meta.env.BASE_URL}about-photo.jpg`} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-cyan-500" />
          Made by Aryan · About
        </Link>
        <p className="text-center text-[10px] text-muted-foreground/80 mt-2">© {new Date().getFullYear()} RoboCraft · Licensed by Aryan</p>
      </div>
    </div>
  );
}
