import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// "Made by Aryan" card that opens the About page; shown on the home screens.
export default function MadeBy({ className = 'mt-4' }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/creator')} className={`${className} w-full glass-strong rounded-2xl p-3 flex items-center gap-3 text-left group`}>
      <span className="relative w-12 h-12 shrink-0 rounded-full p-[2px] bg-[conic-gradient(#06b6d4,#2563eb,#a855f7,#22c55e,#06b6d4)] animate-[spin_6s_linear_infinite]">
        <img src={`${import.meta.env.BASE_URL}about-photo.jpg`} alt="" className="w-full h-full rounded-full object-cover border-2 border-background animate-[spin_6s_linear_infinite_reverse]" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold">Made by Aryan</span>
        <span className="block text-[11px] text-muted-foreground">Meet the creator of RoboCraft</span>
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
