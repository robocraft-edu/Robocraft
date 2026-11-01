import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// "Which robot are you?" A short, fun personality quiz for anyone (no robotics
// knowledge needed). Public page: no login, nothing is stored or sent anywhere.

const ROBOTS = {
  planner: {
    emoji: '🗓️', name: 'The Planner Bot', color: '#38bdf8',
    line: 'Colour-coded timetable? Done. Backup timetable? Also done.',
    traits: ['Always ready before everyone else', 'Turns chaos into a checklist', 'The group chat\'s calm voice of reason'],
    tip: 'Superpower: you make big goals feel doable. Warning: leave room for surprises.',
  },
  chaos: {
    emoji: '🌪️', name: 'The Chaos Bot', color: '#f472b6',
    line: 'Runs on last-minute energy and somehow always finishes.',
    traits: ['Best ideas at 1 a.m.', 'Plans are just suggestions', 'Never boring to be around'],
    tip: 'Superpower: you adapt faster than anyone. Warning: charge your phone sometimes.',
  },
  helper: {
    emoji: '🤝', name: 'The Helper Bot', color: '#4ade80',
    line: 'Everyone\'s favourite teammate and the first person they call.',
    traits: ['Explains things without making you feel silly', 'Notices when someone is struggling', 'Shares notes. Always.'],
    tip: 'Superpower: people trust you instantly. Warning: save some energy for yourself.',
  },
  genius: {
    emoji: '🧠', name: 'The Genius Bot', color: '#a78bfa',
    line: 'Asks "but why?" until the whole system makes sense.',
    traits: ['Falls into curiosity rabbit holes', 'Loves figuring out how things work', 'Has a theory about everything'],
    tip: 'Superpower: you learn anything you care about. Warning: finish one thing before the next idea.',
  },
  cool: {
    emoji: '😎', name: 'The Cool Bot', color: '#22d3ee',
    line: 'Low battery, zero panic. Things just work out around you.',
    traits: ['Stays calm when everyone else spirals', 'Gives the best advice', 'Never in a rush'],
    tip: 'Superpower: you keep the room steady. Warning: do the thing before the deadline, not after.',
  },
  hype: {
    emoji: '⚡', name: 'The Hype Bot', color: '#fbbf24',
    line: 'The reason the group does anything fun in the first place.',
    traits: ['Turns any plan into an event', 'Makes people laugh in tough moments', 'Main character energy'],
    tip: 'Superpower: you get people moving. Warning: let others finish their sentences.',
  },
};

const QUESTIONS = [
  { q: 'Exam tomorrow. What are you doing right now?', a: [
    ['My revision plan was done days ago 📅', 'planner'],
    ['Learning the whole syllabus tonight 😅', 'chaos'],
    ['Explaining the topics to friends 🧑‍🤝‍🧑', 'helper'],
    ['Staying calm, I will be fine 😌', 'cool'],
  ] },
  { q: 'Group project. What is your role?', a: [
    ['I make the schedule ✅', 'planner'],
    ['I bring the big ideas 💡', 'genius'],
    ['I keep everyone motivated 📣', 'hype'],
    ['I do whatever needs doing 🛠️', 'helper'],
  ] },
  { q: 'Perfect weekend?', a: [
    ['Sleeping in, doing nothing 🛌', 'cool'],
    ['A surprise plan with friends 🎉', 'hype'],
    ['A deep dive into a new topic 🔍', 'genius'],
    ['No plan, see what happens 🎲', 'chaos'],
  ] },
  { q: 'Phone battery: 5%.', a: [
    ['Impossible, I carry a charger 🔌', 'planner'],
    ['5% is a lifestyle 😎', 'chaos'],
    ['Battery saver on, all good 🧘', 'cool'],
    ['Post one last story first 📸', 'hype'],
  ] },
  { q: 'A friend is having a bad day. You…', a: [
    ['Listen to everything 👂', 'helper'],
    ['Make them laugh 😂', 'hype'],
    ['Help them find a fix 🧩', 'genius'],
    ['Sit with them, no pressure 🫶', 'cool'],
  ] },
  { q: 'A new gadget arrives. You…', a: [
    ['Read the manual first 📖', 'planner'],
    ['Press every button 🔘', 'chaos'],
    ['Work out how it really works ⚙️', 'genius'],
    ['Show it to everyone 🤩', 'hype'],
  ] },
  { q: 'People would describe you as…', a: [
    ['Kind 💚', 'helper'],
    ['Chill 🧊', 'cool'],
    ['Smart and curious 🤓', 'genius'],
    ['Unpredictable 🌀', 'chaos'],
  ] },
];

function pickResult(answers) {
  const score = {};
  const firstSeen = {};
  answers.forEach((k, i) => {
    score[k] = (score[k] || 0) + 1;
    if (firstSeen[k] === undefined) firstSeen[k] = i;
  });
  // most points wins; on a tie the type you picked first wins
  return Object.keys(score).sort((a, b) => score[b] - score[a] || firstSeen[a] - firstSeen[b])[0];
}

export default function RobotQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [copied, setCopied] = useState(false);

  const done = answers.length === QUESTIONS.length;
  const resultKey = useMemo(() => (done ? pickResult(answers) : null), [done, answers]);
  const robot = resultKey ? ROBOTS[resultKey] : null;

  const pick = (key) => {
    setAnswers(a => [...a, key]);
    setStep(s => s + 1);
  };
  const restart = () => { setAnswers([]); setStep(0); setCopied(false); };

  const quizUrl = `${window.location.origin}${import.meta.env.BASE_URL}robot-quiz`;
  const share = async () => {
    const text = `I got ${robot.name} ${robot.emoji}. Which robot are you? Take the 1-minute quiz:`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Which robot are you?', text, url: quizUrl }); return; }
    } catch { /* cancelled: fall through to copy */ }
    try {
      await navigator.clipboard.writeText(`${text} ${quizUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard blocked: nothing else to do */ }
  };

  const shell = 'min-h-screen flex flex-col items-center justify-center px-5 py-10 text-white';
  const bg = { background: 'radial-gradient(circle at 20% 10%, #7c3aed66, transparent 45%), radial-gradient(circle at 85% 90%, #0ea5e955, transparent 45%), #0a0f1f' };

  if (!done) {
    const cur = QUESTIONS[step];
    return (
      <div className={shell} style={bg}>
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-yellow-300 text-black text-xs font-bold px-4 py-1.5 mb-3">WHICH ROBOT ARE YOU? 🤖</div>
            <div className="text-sm text-white/70">Question {step + 1} of {QUESTIONS.length}</div>
            <div className="h-2 rounded-full bg-white/15 mt-3 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step}>
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center mb-6 leading-snug">{cur.q}</h1>
          <div className="space-y-3">
            {cur.a.map(([label, key]) => (
              <button key={label} onClick={() => pick(key)}
                className="w-full text-left rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/15 px-5 py-4 text-base font-medium transition">
                {label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-white/50 mt-6">Just for fun. Your answers stay on your device.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={shell} style={bg}>
      <div className="w-full max-w-md text-center">
        <div className="text-sm text-white/70 mb-2">You are…</div>
        <div className="rounded-3xl p-6 border" style={{ background: `${robot.color}22`, borderColor: `${robot.color}88`, boxShadow: `0 0 60px ${robot.color}44` }}>
          <div className="text-7xl mb-3">{robot.emoji}</div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: robot.color }}>{robot.name}</h1>
          <p className="text-lg mb-4">{robot.line}</p>
          <ul className="text-left space-y-2 mb-4">
            {robot.traits.map(t => (
              <li key={t} className="flex gap-2 text-base"><span style={{ color: robot.color }}>✔</span><span>{t}</span></li>
            ))}
          </ul>
          <p className="text-sm text-white/80">{robot.tip}</p>
        </div>

        <button onClick={share}
          className="w-full mt-5 rounded-2xl bg-white text-[#6d28d9] font-extrabold text-lg py-4 active:scale-[0.98] transition">
          {copied ? 'Link copied ✅' : 'Send to a friend: which robot are they? 👀'}
        </button>
        <button onClick={() => navigate('/')}
          className="w-full mt-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#04111f] font-extrabold text-base py-3.5 active:scale-[0.98] transition">
          Explore RoboCraft: free robotics &amp; Python 🚀
        </button>
        <button onClick={restart} className="mt-4 text-sm text-white/70 underline underline-offset-4">Take the quiz again</button>
      </div>
    </div>
  );
}
