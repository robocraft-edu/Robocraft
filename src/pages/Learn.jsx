import React, { useState, useCallback } from 'react';
import { formatClass } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import PullToRefresh from '@/components/PullToRefresh';
import { useApp } from '@/lib/AppContext';
import { getSubjects } from '@/lib/curriculum';
import { getMode, subjectMastery } from '@/lib/adaptive';
import { exportRevisionPdf } from '@/lib/revision/exportRevisionPdf';
import { Bot, Code, Brain, Cpu, Cog, CircuitBoard, Zap, Rocket, BookOpen, Clock, ChevronRight, CheckCircle2, Download, Wrench} from 'lucide-react';

const ICON_MAP = { Bot, Code, Brain, Cpu, Cog, CircuitBoard, Zap, Rocket, BookOpen };

export default function Learn() {
  const navigate = useNavigate();
  const { selectedClass, getProgressForClass } = useApp();
  const progress = getProgressForClass(selectedClass);
  const subjects = getSubjects(selectedClass);
  const engineering = getMode(selectedClass) === 'engineering';
  const [expandedSubject, setExpandedSubject] = useState(subjects[0]?.id || null);

  const handleRefresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 500));
  }, []);

  const getIcon = (name) => ICON_MAP[name] || BookOpen;

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold gradient-text">Learn</h1>
        <p className="text-sm text-muted-foreground">{formatClass(selectedClass)} curriculum • {subjects.length} subjects</p>
      </div>

      <button onClick={() => navigate('/python-course')} className="w-full rounded-2xl p-4 flex items-center gap-3 text-left border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
        <span className="text-3xl">🐍</span>
        <span className="flex-1 min-w-0">
          <span className="block font-bold text-emerald-600 dark:text-emerald-400">Learn Python: beginner to advanced</span>
          <span className="block text-[11px] text-muted-foreground">Hindi videos by CodeWithHarry · quizzes · flash cards · coding tasks · projects</span>
        </span>
        <span className="text-emerald-500 text-xl">→</span>
      </button>

      {subjects.map((subject, sIdx) => {
        const Icon = getIcon(subject.icon);
        const isExpanded = expandedSubject === subject.id;
        const completedCount = subject.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
        const subjectProgress = subject.lessons.length > 0 ? Math.round((completedCount / subject.lessons.length) * 100) : 0;
        const engMastery = engineering ? subjectMastery(subject, progress) : null;

        return (
          <div key={subject.id} className="glass-strong rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${sIdx * 0.05}s` }}>
            <button
              onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-cyan-500/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${subject.color}15` }}>
                <Icon className="w-6 h-6" style={{ color: subject.color }} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-sm">{subject.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {engineering
                    ? `${engMastery.mastery}% mastered • ${engMastery.mastered} mastered · ${engMastery.weak} weak`
                    : `${subject.lessons.length} lessons • ${completedCount} completed`}
                </p>
                <div className="mt-2 h-1.5 glass rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${engineering ? engMastery.mastery : subjectProgress}%`, background: subject.color }} />
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>

            {isExpanded && engineering && (
              <div className="px-4 py-3 border-t border-cyan-500/10 bg-cyan-500/[0.03] grid grid-cols-3 gap-2">
                <div className="glass rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-green-400">{engMastery.mastered}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Mastered</p>
                </div>
                <div className="glass rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-yellow-400">{engMastery.review}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Needs Work</p>
                </div>
                <div className="glass rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-red-400">{engMastery.weak}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Weak</p>
                </div>
                <button onClick={() => navigate('/challenges')} className="col-span-2 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg glass text-purple-400 text-[11px] font-bold">
                  <Wrench className="w-3.5 h-3.5" /> Engineering Challenge
                </button>
                <button onClick={() => exportRevisionPdf(selectedClass, subject)} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg glass text-cyan-400 text-[11px] font-bold">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            )}

            {isExpanded && (
              <div className="border-t border-cyan-500/10 divide-y divide-cyan-500/5">
                {subject.lessons.map((lesson, lIdx) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isBookmarked = progress.bookmarks.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="flex items-center gap-3 p-3 hover:bg-cyan-500/5 cursor-pointer transition-colors group animate-fade-in"
                      style={{ animationDelay: `${lIdx * 0.03}s` }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500/15' : 'glass'}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">{lIdx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium group-hover:text-cyan-400 transition-colors ${isCompleted ? 'text-green-400/80' : ''}`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lesson.readingTime} min
                          </span>
                          <span className="text-[10px] glass px-1.5 py-0.5 rounded text-muted-foreground">{lesson.difficulty}</span>
                          {isBookmarked && <span className="text-[10px] text-yellow-400">★</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
    </PullToRefresh>
  );
}