import MadeBy from '@/components/MadeBy';
import React, { useMemo } from 'react';
import { formatClass } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getMode } from '@/lib/adaptive';
import { getAllLessons, getRecommendedLessons, getRecommendedProjects, getTotalLessons, getSubjects} from '@/lib/curriculum';
import { getLevel, BADGES } from '@/lib/gamification';
import AvatarBadge from '@/components/AvatarBadge';
import { WeeklyChallengeCard } from '@/pages/Leaderboard';
import { equippedItems, localDay } from '@/lib/gamification';
import { getReminderSettings } from '@/lib/reminders';
import { GraduationCap, Shapes, RotateCcw, Cpu, Sigma, Calculator, Terminal, Medal, ShoppingBag, Map as MapIcon, Bell, Flame, Target, Zap, BookOpen, ArrowRight, Lightbulb, TrendingUp, Clock, Coins, Star, Bot, Award, ChevronRight, Calendar, Rocket, Wrench, FileText } from 'lucide-react';
import DailyMissions from '@/components/learning/DailyMissions';
import ExamSeasonCard from '@/components/ExamSeasonCard';
import EngineeringHome from '@/components/adaptive/EngineeringHome';
import { useInk } from '@/lib/ui/ink';

export default function Home() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const ink = useInk();
  const progress = getProgressForClass(selectedClass);
  const allLessons = getAllLessons(selectedClass);
  const recommended = getRecommendedLessons(selectedClass, progress.completedLessons);
  const recommendedProjects = getRecommendedProjects(selectedClass);
  const totalLessons = getTotalLessons(selectedClass);
  const subjects = getSubjects(selectedClass);
  const completionRate = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  const levelInfo = getLevel(progress.xp || 0);
  const earnedBadges = (progress.achievements || []).map(id => BADGES.find(b => b.id === id)).filter(Boolean);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const continueLearning = useMemo(() => {
    if (progress.recentlyViewed?.length > 0) {
      const lesson = allLessons.find(l => l.id === progress.recentlyViewed[0]);
      if (lesson) return lesson;
    }
    if (progress.completedLessons?.length > 0) {
      const lastCompleted = allLessons.find(l => l.id === progress.completedLessons[progress.completedLessons.length - 1]);
      if (lastCompleted) {
        const idx = allLessons.findIndex(l => l.id === lastCompleted.id);
        if (idx < allLessons.length - 1) return allLessons[idx + 1];
      }
    }
    return allLessons[0];
  }, [progress, allLessons]);

  const dailyTip = useMemo(() => {
    const tips = [
      'PID controllers are used in everything from drones to robots to keep them stable and accurate.',
      'The Arduino Uno runs at 16MHz — that\'s 16 million instructions per second!',
      'A servo motor knows its position using a built-in potentiometer for feedback.',
      'Binary is the language of computers because transistors have two states: on (1) and off (0).',
      'The HC-SR04 ultrasonic sensor uses sound waves to measure distance like a bat.',
      'Python is named after Monty Python\'s Flying Circus, not the snake!',
      'A 4-bar linkage is the simplest mechanism that converts rotary to oscillating motion.',
      'ESP32 has WiFi and Bluetooth built-in, making it perfect for IoT robotics projects.',
      'The first industrial robot, Unimate, was installed at GM in 1961 — over 60 years ago!',
      'A human arm has 7 degrees of freedom — more than most industrial robot arms!',
    ];
    return tips[new Date().getDate() % tips.length];
  }, []);

  const dailyChallenge = useMemo(() => {
    const incompleteLessons = allLessons.filter(l => !progress.completedLessons.includes(l.id));
    const lesson = incompleteLessons[new Date().getDate() % Math.max(1, incompleteLessons.length)] || allLessons[0];
    return lesson;
  }, [allLessons, progress.completedLessons]);

  if (getMode(selectedClass) === 'engineering') return <EngineeringHome />;

  const subjectColors = { Robotics: '#00D2FF', 'Python Programming': '#4ADE80', 'Artificial Intelligence': '#A78BFA', 'Computing Fundamentals': '#F59E0B', 'Mechanical Systems': '#F97316', Computing: '#F59E0B', Microcontrollers: '#22D3EE', 'Electrical & Control Systems': '#EAB308', Applications: '#EC4899' };

  const ringSize = 140;
  const ringStroke = 12;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (completionRate / 100) * ringCircumference;

  const levelRingSize = 60;
  const levelRingStroke = 5;
  const levelRingRadius = (levelRingSize - levelRingStroke) / 2;
  const levelCirc = 2 * Math.PI * levelRingRadius;
  const levelOffset = levelCirc - (levelInfo.levelProgress / 100) * levelCirc;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-5">
      {/* Hero greeting + level */}
      <div className="animate-slide-up flex items-center justify-between">
        <button onClick={() => navigate('/shop')} className="flex items-center gap-3 text-left" aria-label="Open Reward Shop">
          <AvatarBadge progress={progress} size={52} />
          <div>
            <h1 className="text-2xl font-bold">{greeting}! 👋</h1>
            <p className="text-sm text-muted-foreground">{equippedItems(progress).title?.name} · Ready to build robots?</p>
          </div>
        </button>
        <div className="relative" style={{ width: levelRingSize, height: levelRingSize }}>
          <svg width={levelRingSize} height={levelRingSize} className="-rotate-90">
            <circle cx={levelRingSize/2} cy={levelRingSize/2} r={levelRingRadius} fill="none" stroke="rgba(0,210,255,0.1)" strokeWidth={levelRingStroke} />
            <circle
              cx={levelRingSize/2} cy={levelRingSize/2} r={levelRingRadius} fill="none"
              stroke={levelInfo.current?.color || '#00D2FF'} strokeWidth={levelRingStroke} strokeLinecap="round"
              strokeDasharray={levelCirc} strokeDashoffset={levelOffset}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold" style={{ color: ink(levelInfo.current?.color) }}>{levelInfo.levelNumber}</span>
            <span className="text-[8px] text-muted-foreground">LVL</span>
          </div>
        </div>
      </div>

      {/* Level title bar */}
      <div className="glass-strong rounded-2xl p-3 flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.03s' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${levelInfo.current?.color}20` }}>
            <Star className="w-4 h-4" style={{ color: ink(levelInfo.current?.color, 0.125) }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: ink(levelInfo.current?.color) }}>{levelInfo.current?.title}</p>
            <p className="text-[10px] text-muted-foreground">{levelInfo.next ? `${levelInfo.xpToNext} XP to Level ${levelInfo.next.level}` : 'Max Level!'}</p>
          </div>
        </div>
        <div className="flex-1 mx-3 h-1.5 glass rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${levelInfo.levelProgress}%`, background: `linear-gradient(90deg, ${levelInfo.current?.color}, ${levelInfo.next?.color || levelInfo.current?.color})` }}
          />
        </div>
      </div>

      {/* Streak reminder (shown in the evening if the student hasn't studied today) */}
      {(() => {
        const studied = progress.lastStreakDate === localDay() || (progress.xpDay === localDay() && (progress.xpToday || 0) > 0);
        const r = getReminderSettings();
        const [h] = (r.time || '18:00').split(':').map(Number);
        if (studied || new Date().getHours() < Math.min(h, 17)) return null;
        return (
          <button onClick={() => navigate(continueLearning ? `/lesson/${continueLearning.id}` : '/learn')}
            className="w-full glass-strong rounded-2xl p-3 flex items-center gap-3 text-left border border-orange-500/30 animate-slide-up">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center"><Bell className="w-4 h-4 text-orange-400" /></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-orange-400">{progress.streak > 0 ? `Keep your ${progress.streak}-day streak alive!` : 'Start a streak today!'}</p>
              <p className="text-[11px] text-muted-foreground">One quick lesson or quiz today counts.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>
        );
      })()}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="glass rounded-2xl p-3 flex items-center gap-2.5 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">XP</p>
            <p className="text-base font-bold text-cyan-400">{progress.xp || 0}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-3 flex items-center gap-2.5 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Streak</p>
            <p className="text-base font-bold text-orange-400">{progress.streak || 0} <span className="text-[10px]">days</span></p>
          </div>
        </div>
        <div onClick={() => navigate('/shop')} role="button" title="Spend coins in the Reward Shop" className="glass rounded-2xl p-3 flex items-center gap-2.5 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Coins className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Coins · Shop ›</p>
            <p className="text-base font-bold text-yellow-400">{progress.coins || 0}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-3 flex items-center gap-2.5 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Lessons</p>
            <p className="text-base font-bold text-green-400">{progress.completedLessons?.length || 0}/{totalLessons}</p>
          </div>
        </div>
      </div>

      {/* Progress Ring + Continue Learning */}
      <div className="grid sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-strong rounded-2xl p-5 flex items-center gap-4">
          <div className="relative" style={{ width: ringSize, height: ringSize }}>
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <circle cx={ringSize/2} cy={ringSize/2} r={ringRadius} fill="none" stroke="rgba(0,210,255,0.1)" strokeWidth={ringStroke} />
              <circle
                cx={ringSize/2} cy={ringSize/2} r={ringRadius} fill="none"
                stroke="url(#progressGradient)" strokeWidth={ringStroke} strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
          <div>
            <h3 className="font-bold text-sm mb-1">Your Progress</h3>
            <p className="text-xs text-muted-foreground">{formatClass(selectedClass)} curriculum</p>
            <p className="text-xs text-cyan-400 mt-2 font-medium">{progress.completedLessons?.length || 0} of {totalLessons} lessons done</p>
          </div>
        </div>

        {continueLearning && (
          <div
            onClick={() => navigate(`/lesson/${continueLearning.id}`)}
            className="glass-strong rounded-2xl p-5 cursor-pointer hover:neon-glow transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-cyan-500/5 animate-float" />
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">CONTINUE LEARNING</span>
            </div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors">{continueLearning.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{continueLearning.subject}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] glass px-2 py-1 rounded-full text-muted-foreground">{continueLearning.difficulty}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}
      </div>

      {/* Exam-season plan */}
      <ExamSeasonCard />

      {/* Daily Missions */}
      <DailyMissions />

      {/* Weekly challenge -> leaderboard */}
      <div role="button" onClick={() => navigate('/leaderboard')} className="cursor-pointer animate-slide-up">
        <WeeklyChallengeCard compact />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 animate-slide-up" style={{ animationDelay: '0.12s' }}>
        {[
          { icon: BookOpen, label: 'Learn', path: '/learn', color: '#4ADE80' },
          { icon: GraduationCap, label: 'Exam Prep', path: '/exam', color: '#F59E0B' },
          { icon: FileText, label: 'Practical File', path: '/assessment', color: '#34D399' },
          { icon: Wrench, label: 'Circuit Lab', path: '/lab', color: '#F97316' },
          { icon: Rocket, label: 'Robot Arena', path: '/arena', color: '#38BDF8' },
          { icon: Shapes, label: '3D Design', path: '/design', color: '#FB7185' },
          { icon: Cpu, label: 'Mechanisms', path: '/mechanisms', color: '#A3E635' },
          { icon: Bot, label: 'AI Mentor', path: '/mentor', color: '#A78BFA' },
          { icon: MapIcon, label: 'Story Map', path: '/story', color: '#22D3EE' },
          { icon: Terminal, label: 'Python', path: '/python', color: '#34D399' },
          { icon: Shapes, label: 'Diagrams', path: '/diagrams', color: '#C084FC' },
          { icon: RotateCcw, label: 'Revision', path: '/revision', color: '#2DD4BF' },
          { icon: Medal, label: 'Leaderboard', path: '/leaderboard', color: '#F472B6' },
          { icon: ShoppingBag, label: 'Shop', path: '/shop', color: '#FACC15' },
          { icon: Sigma, label: 'Numericals', path: '/problems', color: '#60A5FA' },
          { icon: Calculator, label: 'Tools', path: '/tools', color: '#FBBF24' },
        ].map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:scale-[1.05] hover:neon-glow transition-all"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${action.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: ink(action.color, 0.082) }} />
              </div>
              <span className="text-[10px] font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <div
          onClick={() => navigate(`/lesson/${dailyChallenge.id}`)}
          className="glass-strong rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:neon-glow transition-all animate-slide-up"
          style={{ animationDelay: '0.13s' }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-orange-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-orange-400 mb-0.5">⚡ DAILY CHALLENGE</h4>
            <p className="text-sm font-medium">{dailyChallenge.title}</p>
            <p className="text-[10px] text-muted-foreground">{dailyChallenge.subject} • Earn +50 XP</p>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400" />
        </div>
      )}

      {/* Daily Tip */}
      <div className="glass-strong rounded-2xl p-4 flex items-start gap-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-yellow-400 mb-1">💡 DAILY ROBOTICS TIP</h4>
          <p className="text-sm text-foreground/90">{dailyTip}</p>
        </div>
      </div>

      {/* Subject Progress */}
      {subjects.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.17s' }}>
          <h2 className="font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-cyan-400" /> Subject Progress</h2>
          <div className="space-y-2">
            {subjects.map(subject => {
              const subjectLessons = subject.lessons;
              const completed = subjectLessons.filter(l => progress.completedLessons?.includes(l.id)).length;
              const pct = subjectLessons.length > 0 ? Math.round((completed / subjectLessons.length) * 100) : 0;
              const color = subjectColors[subject.name] || '#00D2FF';
              return (
                <div key={subject.id} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: ink(color) }}>{subject.name}</span>
                    <span className="text-[10px] text-muted-foreground">{completed}/{subjectLessons.length}</span>
                  </div>
                  <div className="h-1.5 glass rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements preview */}
      {earnedBadges.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.19s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold flex items-center gap-2"><Award className="w-4 h-4 text-cyan-400" /> Achievements</h2>
            <button onClick={() => navigate('/progress')} className="text-xs text-cyan-400 hover:underline">View All</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {earnedBadges.slice(0, 8).map(badge => (
              <div key={badge.id} className="glass rounded-xl p-3 min-w-[80px] text-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center" style={{ background: `${badge.color}20` }}>
                  <Award className="w-5 h-5" style={{ color: ink(badge.color, 0.125) }} />
                </div>
                <span className="text-[9px] font-medium block leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Lessons */}
      {recommended.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Recommended Lessons</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {recommended.slice(0, 4).map(lesson => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="glass rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-transform group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${subjectColors[lesson.subject] || '#00D2FF'}20`, color: ink(subjectColors[lesson.subject] || '#00D2FF', 0.125) }}>
                    {lesson.subject}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{lesson.difficulty}</span>
                </div>
                <h4 className="font-semibold text-sm group-hover:text-cyan-400 transition-colors">{lesson.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.readingTime} min</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Projects */}
      {recommendedProjects.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h2 className="font-bold mb-3 flex items-center gap-2"><Rocket className="w-4 h-4 text-cyan-400" /> Recommended Projects</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {recommendedProjects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="glass rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-transform group"
              >
                <h4 className="font-semibold text-sm group-hover:text-cyan-400 transition-colors mb-1">{project.title}</h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="glass px-2 py-0.5 rounded-full text-cyan-400">{project.estimatedTime}</span>
                  <span className="glass px-2 py-0.5 rounded-full text-green-400">{project.estimatedCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <MadeBy className="mt-6" />
    </div>
  );
}