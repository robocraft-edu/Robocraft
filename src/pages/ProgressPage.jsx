import React, {} from 'react';
import { formatClass } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getMode } from '@/lib/adaptive';
import { getAllLessons, getTotalLessons, getSubjects, getProjects } from '@/lib/curriculum';
import EngineeringProgress from '@/components/adaptive/EngineeringProgress';
import SkillTree from '@/components/SkillTree';
import { Zap, Flame, Trophy, BookOpen, Bookmark, Star, Target, Award, TrendingUp } from 'lucide-react';
import { useInk } from '@/lib/ui/ink';

export default function ProgressPage() {
  const ink = useInk();
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  if (getMode(selectedClass) === 'engineering') return <EngineeringProgress />;
  const progress = getProgressForClass(selectedClass);
  const allLessons = getAllLessons(selectedClass);
  const totalLessons = getTotalLessons(selectedClass);
  const subjects = getSubjects(selectedClass);
  const projects = getProjects(selectedClass);
  const completionRate = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;

  // Quiz stats
  const quizScores = Object.entries(progress.quizScores);
  const totalQuizzes = quizScores.length;
  const avgQuizScore = totalQuizzes > 0
    ? Math.round(quizScores.reduce((acc, [, scores]) => {
        const last = scores[scores.length - 1];
        return acc + (last?.percentage || 0);
      }, 0) / totalQuizzes)
    : 0;

  // Subject-wise progress
  const subjectProgress = subjects.map(subject => {
    const completed = subject.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    const total = subject.lessons.length;
    return { ...subject, completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });

  // Achievements
  const achievements = [
    { id: 'first_lesson', title: 'First Steps', desc: 'Complete your first lesson', icon: BookOpen, earned: progress.completedLessons.length >= 1, color: '#4ADE80' },
    { id: 'five_lessons', title: 'Getting Started', desc: 'Complete 5 lessons', icon: TrendingUp, earned: progress.completedLessons.length >= 5, color: '#00D2FF' },
    { id: 'ten_lessons', title: 'Dedicated Learner', desc: 'Complete 10 lessons', icon: Award, earned: progress.completedLessons.length >= 10, color: '#A78BFA' },
    { id: 'first_quiz', title: 'Quiz Master', desc: 'Complete your first quiz', icon: Target, earned: totalQuizzes >= 1, color: '#F59E0B' },
    { id: 'xp_100', title: 'Centurion', desc: 'Earn 100 XP', icon: Zap, earned: progress.xp >= 100, color: '#EC4899' },
    { id: 'xp_500', title: 'XP Hunter', desc: 'Earn 500 XP', icon: Star, earned: progress.xp >= 500, color: '#818CF8' },
  ];

  const ringSize = 140;
  const ringStroke = 12;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (completionRate / 100) * ringCircumference;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-5">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold gradient-text">Progress</h1>
        <p className="text-sm text-muted-foreground">{formatClass(selectedClass)} • Your learning journey</p>
      </div>

      {/* Overall Progress Ring */}
      <div className="glass-strong rounded-2xl p-6 flex items-center gap-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle cx={ringSize/2} cy={ringSize/2} r={ringRadius} fill="none" stroke="rgba(0,210,255,0.1)" strokeWidth={ringStroke} />
            <circle
              cx={ringSize/2} cy={ringSize/2} r={ringRadius} fill="none"
              stroke="url(#progressGrad)" strokeWidth={ringStroke} strokeLinecap="round"
              strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-cyan-400">{completionRate}%</span>
            <span className="text-[10px] text-muted-foreground">Complete</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-1">Overall Progress</h3>
          <p className="text-sm text-muted-foreground mb-3">{progress.completedLessons.length} of {totalLessons} lessons completed</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="glass rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">XP</p>
              <p className="text-lg font-bold text-cyan-400">{progress.xp}</p>
            </div>
            <div className="glass rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">Quizzes</p>
              <p className="text-lg font-bold text-purple-400">{totalQuizzes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass rounded-2xl p-4 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-orange-400">{progress.streak}</p>
          <p className="text-[10px] text-muted-foreground">Day Streak</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-green-400">{progress.completedLessons.length}</p>
          <p className="text-[10px] text-muted-foreground">Lessons Done</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Target className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-cyan-400">{avgQuizScore}%</p>
          <p className="text-[10px] text-muted-foreground">Avg Quiz</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Bookmark className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-yellow-400">{progress.bookmarks.length}</p>
          <p className="text-[10px] text-muted-foreground">Bookmarks</p>
        </div>
      </div>

      {/* Skill tree: levels unlock as XP grows */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <SkillTree xp={progress.xp || 0} />
      </div>

      {/* Subject Progress */}
      <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="font-bold mb-3">Subject Progress</h2>
        <div className="space-y-3">
          {subjectProgress.map(subject => (
            <div key={subject.id} className="glass-strong rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium" style={{ color: ink(subject.color) }}>{subject.name}</h4>
                <span className="text-xs text-muted-foreground">{subject.completed}/{subject.total}</span>
              </div>
              <div className="h-2 glass rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${subject.percentage}%`, background: subject.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="font-bold mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-purple-400" /> Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map(ach => {
            const Icon = ach.icon;
            return (
              <div key={ach.id} className={`glass-strong rounded-2xl p-4 text-center transition-all ${ach.earned ? '' : 'opacity-40 grayscale'}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${ach.color}15` }}>
                  <Icon className="w-6 h-6" style={{ color: ink(ach.color, 0.125) }} />
                </div>
                <h4 className="text-xs font-bold">{ach.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{ach.desc}</p>
                {ach.earned && <p className="text-[10px] mt-1" style={{ color: ink(ach.color) }}>✓ Earned</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}