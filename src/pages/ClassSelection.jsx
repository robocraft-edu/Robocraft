import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { ArrowLeft, Check, Cpu } from 'lucide-react';

import { LESSONS, PROJECTS } from '@/lib/pycourse/course';
const LESSON_COUNT = LESSONS.length, PROJECT_COUNT = PROJECTS.length;

export default function ClassSelection() {
  const navigate = useNavigate();
  const { selectClass, selectedClass, user, isGuest } = useApp();
  const [selecting, setSelecting] = useState(null);

  const classes = [
    { id: 'class_9', name: 'Class 9', desc: 'Foundation of Robotics, Python, AI & Computing', icon: '🤖', color: '#00D2FF', lessons: '35+ Lessons' },
    { id: 'class_10', name: 'Class 10', desc: 'Advanced Robotics, Python Libraries & ML', icon: '⚙️', color: '#818CF8', lessons: '29+ Lessons' },
    { id: 'class_11', name: 'Class 11', desc: 'Mechanical Systems, Microcontrollers & Control', icon: '🔧', color: '#C084FC', lessons: '30+ Lessons' },
  ];

  const handleSelect = (classId) => {
    setSelecting(classId);
    selectClass(classId);
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div className="min-h-screen animated-bg grid-pattern flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          {selectedClass && <button
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 text-muted-foreground hover:text-cyan-400 flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-strong neon-glow mb-4 animate-pulse-glow">
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Choose Your Class</h1>
          <p className="text-sm text-muted-foreground">Select a class to load its specific curriculum</p>
        </div>

        {/* Class cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {classes.map((cls, idx) => {
            const isSelected = selectedClass === cls.id;
            const isSelecting = selecting === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => handleSelect(cls.id)}
                className={`group relative glass-strong rounded-3xl p-6 text-left transition-all duration-500 animate-slide-up hover:scale-[1.03] hover:neon-glow ${
                  isSelecting ? 'scale-105 neon-glow' : ''
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{ background: `radial-gradient(circle at center, ${cls.color}15, transparent 70%)` }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ borderColor: `${cls.color}30` }}
                  >
                    {cls.icon}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold mb-1" style={{ color: cls.color }}>{cls.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{cls.desc}</p>
                  <p className="text-xs font-medium" style={{ color: `${cls.color}99` }}>{cls.lessons}</p>

                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: cls.color }}>
                      <Check className="w-3.5 h-3.5 text-background" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Learn Python: a separate course, open to every class */}
        <button
          onClick={() => navigate('/python-course')}
          className="group mt-4 w-full rounded-3xl p-5 text-left flex items-center gap-4 border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 hover:neon-glow transition-all animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform duration-300">🐍</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Learn Python</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Beginner to advanced · Hindi videos by CodeWithHarry · quizzes, flash cards, coding tasks and projects</p>
            <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-1">{LESSON_COUNT} lessons · {PROJECT_COUNT} projects</p>
          </div>
          <span className="text-2xl text-emerald-500 group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in">
          {isGuest ? 'Browsing as Guest • Progress saved on this device' : `Signed in as ${user?.email || 'user'}`}
        </p>
        <p className="text-center text-xs text-muted-foreground mt-2">
          You can change your class anytime from Settings
        </p>
      </div>
    </div>
  );
}