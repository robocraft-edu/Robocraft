import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { getSubjects } from '@/lib/curriculum';
import { getTextbook } from '@/lib/curriculum/textbook';
import { buildPaper, scorePaper, PATTERNS, UNITS } from '@/lib/exam/paper';
import { downloadPaperPdf } from '@/lib/exam/paperPdf';
import ExamCorner from '@/components/lesson/ExamCorner';
import RichText from '@/components/lesson/RichText';
import AnswerChecker from '@/components/exam/AnswerChecker';
import ShareScoreButton from '@/components/share/ShareScoreButton';
import BackButton from '@/components/BackButton';
import { formatClass } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { GraduationCap, FileText, Timer, Play, Pause, Download, Eye, EyeOff, Check, X, Trophy, BookOpen, ChevronDown, ChevronUp, RotateCcw, Loader2, ExternalLink } from 'lucide-react';

const fmt = s => `${Math.floor(s / 3600) ? Math.floor(s / 3600) + ':' : ''}${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function MarkButtons({ max, value, onPick }) {
  return (
    <div className="flex items-center gap-1 flex-wrap mt-2">
      <span className="text-[10px] text-muted-foreground mr-1">Your marks:</span>
      {Array.from({ length: max + 1 }, (_, m) => (
        <button key={m} onClick={() => onPick(m)}
          className={`w-7 h-7 rounded-lg text-xs font-bold ${value === m ? 'bg-green-500 text-white' : 'glass hover:bg-green-500/10'}`}>{m}</button>
      ))}
    </div>
  );
}

function WrittenQuestion({ label, q, marks, value, onMark, lessonTitle }) {
  const [show, setShow] = useState(false);
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex gap-2 items-start">
        <span className="text-xs font-bold text-cyan-500 mt-0.5 whitespace-nowrap">{label}</span>
        <p className="text-sm flex-1">{q.q}</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">[{marks}]</span>
      </div>
      {lessonTitle && <p className="text-[10px] text-muted-foreground mt-1 ml-6">Chapter: {lessonTitle}</p>}
      <AnswerChecker question={q.q} model={q.a} marks={marks} onMarks={onMark} lessonId={q.lessonId} />
      <button onClick={() => setShow(!show)} className="mt-2 text-xs font-semibold text-cyan-500 flex items-center gap-1">
        {show ? <><EyeOff className="w-3.5 h-3.5" /> Hide model answer</> : <><Eye className="w-3.5 h-3.5" /> Check with model answer</>}
      </button>
      {show && (
        <div className="mt-2 border-l-2 border-green-500 pl-3">
          <RichText text={q.a} className="text-[13px]" />
          <MarkButtons max={marks} value={value} onPick={onMark} />
        </div>
      )}
    </div>
  );
}

function PaperView({ paper, onFinish }) {
  const p = paper.pattern;
  const [mcqPicks, setMcqPicks] = useState({});
  const [shortMarks, setShortMarks] = useState({});
  const [longMarks, setLongMarks] = useState({});
  const [secs, setSecs] = useState(p.minutes * 60);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    if (!running || submitted) return;
    timer.current = setInterval(() => setSecs(s => {
      if (s <= 1) { clearInterval(timer.current); setRunning(false); toast({ title: "Time's up!", description: 'Finish checking your answers and see your score.' }); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(timer.current);
  }, [running, submitted]);

  const score = scorePaper(paper, { mcqPicks, shortMarks, longMarks });

  const pdf = async (withAnswers) => {
    setBusy(withAnswers ? 'key' : 'paper');
    try { await downloadPaperPdf(paper, withAnswers); }
    catch (e) { console.error(e); toast({ title: "Couldn't make the PDF", description: 'Please try again.' }); }
    finally { setBusy(''); }
  };

  const finish = () => { setSubmitted(true); setRunning(false); onFinish(score); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-30 glass-strong rounded-2xl px-3 py-2 flex items-center gap-2">
        <Timer className={`w-4 h-4 ${secs < 600 ? 'text-red-500' : 'text-cyan-500'}`} />
        <span className={`font-mono text-sm font-bold ${secs < 600 ? 'text-red-500' : ''}`}>{fmt(secs)}</span>
        {!submitted && (
          <button onClick={() => setRunning(!running)} className="p-1.5 rounded-lg glass" aria-label={running ? 'Pause' : 'Resume'}>
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        )}
        <span className="ml-auto text-xs font-bold text-green-500">{score.total}/{score.max}</span>
        {!submitted && <button onClick={finish} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">Finish</button>}
      </div>

      {submitted && (
        <div className="glass-strong rounded-2xl p-5 text-center">
          <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{score.total} / {score.max}</p>
          <p className="text-sm text-muted-foreground">{Math.round((score.total / score.max) * 100)}% · Section A {score.mcq + score.short}/{score.aMax} · Section B {score.bestB}/{score.bMax}</p>
          <p className="text-xs text-muted-foreground mt-2">Section B counts your best {p.B.attempt} questions. Written answers are self-marked — be honest with yourself!</p>
          <ShareScoreButton className="mt-3 w-full" card={() => ({
            title: p.title, subtitle: `${p.board} pattern · practice paper`,
            value: `${score.total}/${score.max}`, outOf: `${Math.round((score.total / score.max) * 100)}%`,
            percent: Math.round((score.total / score.max) * 100),
            stats: [['Section A', `${score.mcq + score.short}/${score.aMax}`], ['Section B', `${score.bestB}/${score.bMax}`], ['Time', fmt(p.minutes * 60 - secs)]],
          })} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => pdf(false)} disabled={!!busy} className="glass rounded-xl py-2.5 text-xs font-bold text-cyan-500 flex items-center justify-center gap-1.5">
          {busy === 'paper' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Paper PDF
        </button>
        <button onClick={() => pdf(true)} disabled={!!busy} className="glass rounded-xl py-2.5 text-xs font-bold text-green-500 flex items-center justify-center gap-1.5">
          {busy === 'key' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Answer key PDF
        </button>
      </div>

      <div className="glass-strong rounded-2xl p-4">
        <h3 className="text-sm font-bold">Section A <span className="text-muted-foreground font-normal">({score.aMax} marks · attempt all)</span></h3>
        <p className="text-xs font-bold text-muted-foreground mt-3 mb-2">Question 1 — choose the correct option [1 mark each]</p>
        <div className="space-y-2">
          {paper.sectionA.mcqs.map((q, i) => {
            const picked = mcqPicks[i];
            const show = picked !== undefined;
            return (
              <div key={i} className="glass rounded-xl p-3">
                <p className="text-sm mb-2"><span className="font-bold text-cyan-500">({i + 1})</span> {q.q}</p>
                <div className="grid gap-1.5">
                  {q.options.map((o, k) => {
                    const right = k === q.answer, mine = picked === k;
                    return (
                      <button key={k} disabled={show} onClick={() => setMcqPicks({ ...mcqPicks, [i]: k })}
                        className={`text-left text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${show ? (right ? 'bg-green-500/15 text-green-600 dark:text-green-400' : mine ? 'bg-red-500/15 text-red-500' : 'opacity-50') : 'glass hover:bg-cyan-500/10'}`}>
                        {show && right && <Check className="w-3.5 h-3.5" />}{show && mine && !right && <X className="w-3.5 h-3.5" />}
                        <span>({'abcd'[k]}) {o}</span>
                      </button>
                    );
                  })}
                </div>
                {show && q.explanation && <p className="text-[11px] text-muted-foreground mt-2">{q.explanation}</p>}
              </div>
            );
          })}
        </div>
        <p className="text-xs font-bold text-muted-foreground mt-4 mb-2">Question 2 — answer briefly [{p.A.shortMarks} marks each]</p>
        <div className="space-y-2">
          {paper.sectionA.shorts.map((q, i) => (
            <WrittenQuestion key={i} label={`(${i + 1})`} q={q} marks={p.A.shortMarks} value={shortMarks[i]}
              onMark={m => setShortMarks({ ...shortMarks, [i]: m })} lessonTitle={paper.lessonTitle(q.lessonId)} />
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-4">
        <h3 className="text-sm font-bold">Section B <span className="text-muted-foreground font-normal">({score.bMax} marks · attempt any {p.B.attempt})</span></h3>
        <div className="space-y-4 mt-3">
          {paper.sectionB.map((b, bi) => (
            <div key={bi}>
              <p className="text-xs font-bold mb-2">Question {bi + 3} <span className="text-muted-foreground font-normal">· {b.unit}</span></p>
              <div className="space-y-2">
                {b.parts.map((q, pi) => (
                  <WrittenQuestion key={pi} label={`(${'abc'[pi]})`} q={q} marks={p.B.partMarks} value={longMarks[`${bi}-${pi}`]}
                    onMark={m => setLongMarks({ ...longMarks, [`${bi}-${pi}`]: m })} lessonTitle={paper.lessonTitle(q.lessonId)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!submitted && (
        <button onClick={finish} className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold">Finish paper &amp; see score</button>
      )}
    </div>
  );
}

function QuestionBank({ classId }) {
  const subjects = getSubjects(classId);
  const [sub, setSub] = useState(subjects[0]?.id);
  const [open, setOpen] = useState(null);
  const lessons = subjects.find(s => s.id === sub)?.lessons || [];
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {subjects.map(s => (
          <button key={s.id} onClick={() => { setSub(s.id); setOpen(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${sub === s.id ? 'bg-cyan-500 text-white' : 'glass'}`}>{s.name}</button>
        ))}
      </div>
      {lessons.map(l => {
        const book = getTextbook(l.id);
        const n = (book?.exam?.short?.length || 0) + (book?.exam?.long?.length || 0);
        if (!n) return null;
        const isOpen = open === l.id;
        return (
          <div key={l.id} className="glass-strong rounded-2xl">
            <button onClick={() => setOpen(isOpen ? null : l.id)} className="w-full flex items-center gap-2 p-4 text-left">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-semibold flex-1">{l.title}</span>
              <span className="text-[10px] text-muted-foreground">{n} Qs</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isOpen && <div className="px-2 pb-2"><ExamCorner exam={book.exam} /></div>}
          </div>
        );
      })}
    </div>
  );
}

export default function ExamPractice() {
  const { selectedClass, getProgressForClass, updateProgress, addXP } = useApp();
  const progress = getProgressForClass(selectedClass);
  const pattern = PATTERNS[selectedClass];
  const history = progress.examHistory || [];
  const [tab, setTab] = useState('paper');
  const [paperNo, setPaperNo] = useState(null);
  const paper = useMemo(() => (paperNo ? buildPaper(selectedClass, paperNo) : null), [selectedClass, paperNo]);
  const nextNo = (history.reduce((m, h) => Math.max(m, h.paperNo || 0), 0) || 0) + 1;

  const onFinish = (score) => {
    const entry = { paperNo, total: score.total, max: score.max, date: new Date().toISOString() };
    updateProgress(selectedClass, { examHistory: [entry, ...history].slice(0, 30) });
    addXP(selectedClass, Math.round(20 + (score.total / score.max) * 80));
  };

  if (!pattern) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="text-lg font-bold flex items-center gap-2"><GraduationCap className="w-5 h-5 text-amber-500" /> Exam Practice</h1>
      </div>

      {!paper && (
        <>
          <div className="glass-strong rounded-2xl p-5 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">{pattern.board} · {formatClass(selectedClass)}</p>
            <h2 className="text-base font-bold mt-1">{pattern.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{pattern.total} marks · {pattern.minutes / 60} hours · Section A compulsory, Section B attempt any {pattern.B.attempt}</p>
            <div className="mt-3 grid gap-1">
              {UNITS[selectedClass].map(u => (
                <div key={u.name} className="flex text-[11px] text-muted-foreground"><span className="flex-1">{u.name}</span><span className="font-semibold">{u.marks} marks</span></div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Unit marks follow the syllabus. The section layout is a RoboCraft practice format — check the official specimen paper below for the exact pattern.</p>
          </div>

          <OfficialPapers classId={selectedClass} />

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[['paper', 'Sample papers', FileText], ['bank', 'Question bank', BookOpen]].map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${tab === id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'glass'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {tab === 'paper' ? (
            <div className="space-y-3">
              <button onClick={() => setPaperNo(nextNo)} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Start Paper #{nextNo} (timed)
              </button>
              {history.length > 0 && (
                <div className="glass-strong rounded-2xl p-4">
                  <h3 className="text-xs font-bold mb-2">Your past papers</h3>
                  <div className="space-y-1.5">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-semibold w-16">Paper #{h.paperNo}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${(h.total / h.max) * 100}%` }} /></div>
                        <span className="w-14 text-right">{h.total}/{h.max}</span>
                        <button onClick={() => setPaperNo(h.paperNo)} className="p-1 rounded glass" aria-label="Retry"><RotateCcw className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground text-center">Every paper is different and covers every unit. Download it as a PDF to write on paper.</p>
            </div>
          ) : (
            <QuestionBank classId={selectedClass} />
          )}
        </>
      )}

      {paper && (
        <>
          <button onClick={() => setPaperNo(null)} className="text-xs text-cyan-500 mb-3">← All papers</button>
          <PaperView key={paperNo} paper={paper} onFinish={onFinish} />
        </>
      )}
    </div>
  );
}

/** Where to get official specimen and past papers. */
function OfficialPapers({ classId }) {
  const [open, setOpen] = useState(false);
  const isXI = classId === 'class_11';
  const go = (url) => window.open(url, '_blank', 'noopener');
  return (
    <div className="glass-strong rounded-2xl p-4 mb-4 border-l-2 border-amber-500">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-2 text-left">
        <ExternalLink className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="flex-1">
          <span className="block text-sm font-bold">Official specimen &amp; past papers</span>
          <span className="block text-[11px] text-muted-foreground">Free from your board's own website — always practise these too.</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="mt-3 space-y-2 text-[11px] text-muted-foreground">
          {isXI ? (
            <p>Class XI is a <b>school examination</b>, so the board does not publish a specimen paper for it. Your school sets the paper from the Class XI syllabus — and your board's Class XII specimen paper for Robotics is the closest official guide to the style of questions.</p>
          ) : (
            <p>Your board publishes a specimen paper for <b>Robotics and Artificial Intelligence</b> every year, plus the previous years' board papers.</p>
          )}
          <ol className="list-decimal ml-4 space-y-0.5">
            <li>Open your <b>board's official website</b>.</li>
            <li>Go to <b>Examinations</b> → <b>{isXI ? 'Class XII' : 'Class X'}</b>.</li>
            <li>Choose <b>Specimen Question Papers</b> for the latest year, then the <b>Robotics</b> paper.</li>
          </ol>
          <div className="flex flex-wrap gap-2 pt-1">
                        <button onClick={() => go('https://www.google.com/search?q=' + encodeURIComponent(isXI ? 'Class 12 Robotics specimen question paper' : 'Class 10 Robotics and Artificial Intelligence specimen question paper'))} className="px-3 py-1.5 rounded-lg glass font-bold text-cyan-500">Search for the paper</button>
          </div>
          <p className="pt-1">Write the specimen paper on real paper with a timer, then mark it with the board's marking scheme. Use RoboCraft's papers for extra practice between them.</p>
        </div>
      )}
    </div>
  );
}
