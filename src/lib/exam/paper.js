// Builds board-style practice papers from the lesson exam questions.
// Patterns follow common board written-paper totals: Classes IX/X — 100 marks, 2 hours;
// Class XI Robotics theory — 70 marks, 3 hours. Section layout is a RoboCraft practice format.
import { getAllLessons, getHandQuiz } from '@/lib/curriculum';
import { TEXTBOOK } from '@/lib/curriculum/textbook';

// Syllabus units (with board marks) → lesson ids.
export const UNITS = {
  class_9: [
    { name: 'Introduction to Robotics', marks: 10, ids: ['c9_r_1', 'c9_r_2', 'c9_r_3', 'c9_r_4', 'c9_r_5', 'c9_r_6'] },
    { name: 'Robot as a System', marks: 20, ids: ['c9_r_7', 'c9_r_8', 'c9_r_9', 'c9_r_14'] },
    { name: 'Concepts in Robotics', marks: 20, ids: ['c9_r_10', 'c9_r_11', 'c9_r_12', 'c9_r_13'] },
    { name: 'Introduction to AI', marks: 10, ids: ['c9_a_1', 'c9_a_2', 'c9_a_3', 'c9_a_4', 'c9_a_5'] },
    { name: 'Data, Information & Evolution of Computing', marks: 10, ids: ['c9_a_6', 'c9_c_1', 'c9_c_2', 'c9_c_3', 'c9_c_4', 'c9_c_5', 'c9_c_6', 'c9_c_7'] },
    { name: 'Data and Programming with Python', marks: 20, ids: ['c9_p_1', 'c9_p_2', 'c9_p_3', 'c9_p_4', 'c9_p_5', 'c9_p_6', 'c9_p_7', 'c9_p_8', 'c9_p_9'] },
    { name: 'AI Concepts & AI Project Framework', marks: 10, ids: ['c9_a_7', 'c9_a_8', 'c9_a_9', 'c9_a_10', 'c9_a_11'] },
  ],
  class_10: [
    { name: 'New Age Robotic Systems', marks: 12, ids: ['c10_r_1', 'c10_r_2', 'c10_r_3', 'c10_r_4'] },
    { name: 'Components of Robots as a System', marks: 15, ids: ['c10_r_5', 'c10_r_6', 'c10_r_7', 'c10_r_8', 'c10_r_9', 'c10_r_10'] },
    { name: 'Visualization, Design & Creation of Components', marks: 15, ids: ['c10_r_11', 'c10_r_12', 'c10_r_13'] },
    { name: 'Integrating Robots as a System', marks: 8, ids: ['c10_r_14', 'c10_r_15'] },
    { name: 'Decision Making in Machines', marks: 8, ids: ['c10_a_1', 'c10_a_2', 'c10_a_3'] },
    { name: 'Machine Intelligence & Cybersecurity', marks: 8, ids: ['c10_a_4', 'c10_a_5'] },
    { name: 'Components of AI Project Framework', marks: 14, ids: ['c10_a_6', 'c10_a_7', 'c10_a_8'] },
    { name: 'Data and Programming with Python', marks: 20, ids: ['c10_p_1', 'c10_p_2', 'c10_p_3', 'c10_p_4', 'c10_p_5', 'c10_p_6', 'c10_p_7', 'c10_p_8', 'c10_p_9'] },
  ],
  class_11: [
    { name: 'Introduction to Robotics', marks: 10, ids: ['c11_r_1', 'c11_r_2', 'c11_r_3', 'c11_r_4', 'c11_r_5', 'c11_r_6', 'c11_r_7'], qs: 1 },
    { name: 'Mechanical System', marks: 15, ids: ['c11_m_1', 'c11_m_2', 'c11_m_3', 'c11_m_4', 'c11_m_5', 'c11_m_6', 'c11_m_7', 'c11_m_8', 'c11_m_9'], qs: 2 },
    { name: 'Computing Systems', marks: 20, ids: ['c11_c_1', 'c11_c_2', 'c11_mc_1', 'c11_mc_2', 'c11_mc_3', 'c11_mc_4', 'c11_mc_5'], qs: 2 },
    { name: 'Electrical and Control Systems', marks: 15, ids: ['c11_e_1', 'c11_e_2', 'c11_e_3', 'c11_e_4', 'c11_e_5', 'c11_e_6'], qs: 1 },
    { name: 'Applications of Robotic Systems', marks: 10, ids: ['c11_app_1', 'c11_app_2', 'c11_app_3'], qs: 1 },
  ],
};

export const PATTERNS = {
  class_9: { board: 'Board', title: 'Robotics & Artificial Intelligence', total: 100, minutes: 120,
    A: { mcq: 20, short: 10, shortMarks: 2 }, B: { attempt: 4, partMarks: 5, parts: 3 } },
  class_10: { board: 'Board', title: 'Robotics & Artificial Intelligence', total: 100, minutes: 120,
    A: { mcq: 20, short: 10, shortMarks: 2 }, B: { attempt: 4, partMarks: 5, parts: 3 } },
  class_11: { board: 'Class XI', title: 'Robotics — Paper I (Theory)', total: 70, minutes: 180,
    A: { mcq: 10, short: 5, shortMarks: 2 }, B: { attempt: 5, partMarks: 5, parts: 2 } },
};

// Small seeded random generator so "Paper #3" is always the same paper.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(arr, r) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function lessonTitle(classId, id) {
  return getAllLessons(classId).find(l => l.id === id)?.title || '';
}

export function buildPaper(classId, paperNo = 1) {
  const pattern = PATTERNS[classId];
  const units = UNITS[classId];
  if (!pattern || !units) return null;
  const r = rng(paperNo * 7919 + classId.length * 31);

  // ---- Section A: MCQs spread across units by marks weight ----
  const totalUnitMarks = units.reduce((s, u) => s + u.marks, 0);
  const mcqs = [];
  const leftovers = [];
  const unitOrder = shuffled(units, r);
  for (const u of unitOrder) {
    const want = Math.max(1, Math.round((u.marks / totalUnitMarks) * pattern.A.mcq));
    const pool = shuffled(u.ids.flatMap(id => getHandQuiz(classId, id)
      .filter(q => q.type === 'mcq' && Array.isArray(q.options) && q.options.length >= 2)
      .map(q => ({ ...q, lessonId: id }))), r);
    mcqs.push(...pool.slice(0, want));
    leftovers.push(...pool.slice(want));
  }
  if (mcqs.length < pattern.A.mcq) mcqs.push(...shuffled(leftovers, r).slice(0, pattern.A.mcq - mcqs.length));
  const mcqFinal = shuffled(mcqs, r).slice(0, pattern.A.mcq).map(q => {
    // shuffle options but keep track of the answer
    const order = shuffled(q.options.map((_, i) => i), r);
    return { q: q.q, options: order.map(i => q.options[i]), answer: order.indexOf(q.answer), explanation: q.explanation, lessonId: q.lessonId };
  });

  // ---- Section A: short answers ----
  const shortPool = shuffled(units.flatMap(u => u.ids.flatMap(id => (TEXTBOOK[id]?.exam?.short || []).map(q => ({ ...q, lessonId: id })))), r);
  const shortFinal = shortPool.slice(0, pattern.A.short);

  // ---- Section B: long-answer questions, one block per unit ----
  const blocks = [];
  for (const u of units) {
    const longs = shuffled(u.ids.flatMap(id => (TEXTBOOK[id]?.exam?.long || []).map(q => ({ ...q, lessonId: id }))), r);
    const n = u.qs || 1;
    for (let k = 0; k < n; k++) {
      const parts = longs.slice(k * pattern.B.parts, (k + 1) * pattern.B.parts);
      if (parts.length === pattern.B.parts) blocks.push({ unit: u.name, parts });
    }
  }

  return {
    classId, paperNo, pattern,
    sectionA: { mcqs: mcqFinal, shorts: shortFinal },
    sectionB: blocks,
    lessonTitle: id => lessonTitle(classId, id),
  };
}

// Marks: Section A all compulsory; Section B counts the best `attempt` questions.
export function scorePaper(paper, { mcqPicks = {}, shortMarks = {}, longMarks = {} }) {
  const p = paper.pattern;
  let mcq = 0;
  paper.sectionA.mcqs.forEach((q, i) => { if (mcqPicks[i] === q.answer) mcq += 1; });
  const short = paper.sectionA.shorts.reduce((s, _, i) => s + (shortMarks[i] || 0), 0);
  const blockScores = paper.sectionB.map((b, bi) => b.parts.reduce((s, _, pi) => s + (longMarks[`${bi}-${pi}`] || 0), 0));
  const bestB = [...blockScores].sort((a, b) => b - a).slice(0, p.B.attempt).reduce((s, x) => s + x, 0);
  const aMax = p.A.mcq + p.A.short * p.A.shortMarks;
  const bMax = p.B.attempt * p.B.parts * p.B.partMarks;
  return { mcq, short, bestB, total: mcq + short + bestB, max: aMax + bMax, aMax, bMax };
}
