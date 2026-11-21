// Gamification system — levels, badges, streaks, coins, missions, mystery boxes

/** XP a student aims for each day. Reaching it shows the goal-done break message. */
export const DAILY_GOAL_XP = 40;

export const LEVELS = [
  { level: 1, title: 'Rookie Builder', xpRequired: 0, color: '#94A3B8' },
  { level: 2, title: 'Tinkerer', xpRequired: 100, color: '#60A5FA' },
  { level: 3, title: 'Circuit Apprentice', xpRequired: 300, color: '#22D3EE' },
  { level: 4, title: 'Code Warrior', xpRequired: 600, color: '#4ADE80' },
  { level: 5, title: 'Robot Pilot', xpRequired: 1000, color: '#A78BFA' },
  { level: 6, title: 'Sensor Specialist', xpRequired: 1500, color: '#F59E0B' },
  { level: 7, title: 'AI Strategist', xpRequired: 2200, color: '#EC4899' },
  { level: 8, title: 'Robotics Engineer', xpRequired: 3000, color: '#F97316' },
  { level: 9, title: 'Master Roboticist', xpRequired: 4000, color: '#EF4444' },
  { level: 10, title: 'Robotics Genius', xpRequired: 5500, color: '#FBBF24' },
];

export function getLevel(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const progressInLevel = next ? xp - current.xpRequired : 0;
  const xpForLevel = next ? next.xpRequired - current.xpRequired : 1;
  const levelProgress = next ? Math.min(100, (progressInLevel / xpForLevel) * 100) : 100;
  const xpToNext = next ? next.xpRequired - xp : 0;
  return { current, next, levelProgress, xpToNext, levelNumber: current.level };
}

export const BADGES = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: 'Footprints', color: '#60A5FA' },
  { id: 'first_quiz', name: 'Quiz Rookie', description: 'Complete your first quiz', icon: 'Target', color: '#22D3EE' },
  { id: 'five_lessons', name: 'Robotics Beginner', description: 'Complete 5 lessons', icon: 'Bot', color: '#4ADE80' },
  { id: 'ten_lessons', name: 'Python Explorer', description: 'Complete 10 lessons', icon: 'Code', color: '#A78BFA' },
  { id: 'perfect_quiz', name: 'Quiz Champion', description: 'Get 100% on a quiz', icon: 'Crown', color: '#FBBF24' },
  { id: 'streak_3', name: 'On Fire', description: '3-day learning streak', icon: 'Flame', color: '#F97316' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: 'Flame', color: '#EF4444' },
  { id: 'streak_30', name: 'Unstoppable', description: '30-day learning streak', icon: 'Flame', color: '#DC2626' },
  { id: 'all_flashcards', name: 'Card Master', description: 'Review a full deck of flash cards', icon: 'Layers', color: '#06B6D4' },
  { id: 'activity_complete', name: 'Game On', description: 'Complete your first interactive activity', icon: 'Gamepad2', color: '#8B5CF6' },
  { id: 'fast_learner', name: 'Fast Learner', description: 'Complete 3 lessons in one day', icon: 'Zap', color: '#F59E0B' },
  { id: 'circuit_master', name: 'Circuit Master', description: 'Complete all Computing lessons in a class', icon: 'Cpu', color: '#10B981' },
  { id: 'sensor_expert', name: 'Sensor Expert', description: 'Complete all Robotics lessons in a class', icon: 'Radar', color: '#3B82F6' },
  { id: 'robotics_genius', name: 'Robotics Genius', description: 'Complete all lessons in a class', icon: 'Brain', color: '#FBBF24' },
];

export function checkBadges(progress, classId, allLessons) {
  const earned = new Set(progress.achievements || []);
  const newBadges = [];
  const completed = progress.completedLessons || [];
  const quizScores = progress.quizScores || {};
  const streak = progress.streak || 0;
  const flashcardReviews = progress.flashcardReviews || {};

  const tryAdd = (id) => {
    if (!earned.has(id)) {
      earned.add(id);
      const badge = BADGES.find(b => b.id === id);
      if (badge) newBadges.push(badge);
    }
  };

  if (completed.length >= 1) tryAdd('first_lesson');
  if (completed.length >= 5) tryAdd('five_lessons');
  if (completed.length >= 10) tryAdd('ten_lessons');
  if (Object.keys(quizScores).length >= 1) tryAdd('first_quiz');
  if (Object.values(quizScores).some(scores => scores.some(s => s.percentage === 100))) tryAdd('perfect_quiz');
  if (streak >= 3) tryAdd('streak_3');
  if (streak >= 7) tryAdd('streak_7');
  if (streak >= 30) tryAdd('streak_30');
  if (Object.keys(flashcardReviews).length >= 1) tryAdd('all_flashcards');
  if ((progress.activitiesCompleted || []).length > 0) tryAdd('activity_complete');
  const today = localDay();
  const doneToday = Object.values(progress.lessonDates || {}).filter(d => d === today).length;
  if (doneToday >= 3) tryAdd('fast_learner');

  if (allLessons && allLessons.length > 0) {
    const roboticsLessons = allLessons.filter(l => l.subject === 'Robotics');
    const computingLessons = allLessons.filter(l => l.subject === 'Computing Fundamentals' || l.subject === 'Computing');
    if (roboticsLessons.length > 0 && roboticsLessons.every(l => completed.includes(l.id))) tryAdd('sensor_expert');
    if (computingLessons.length > 0 && computingLessons.every(l => completed.includes(l.id))) tryAdd('circuit_master');
    if (allLessons.every(l => completed.includes(l.id))) tryAdd('robotics_genius');
  }

  return { achievements: Array.from(earned), newBadges };
}

export const DAILY_MISSIONS = [
  { id: 'complete_lesson', name: 'Complete a Lesson', xp: 50, coins: 10, icon: 'BookOpen' },
  { id: 'take_quiz', name: 'Take a Quiz', xp: 30, coins: 5, icon: 'Target' },
  { id: 'review_flashcards', name: 'Review Flash Cards', xp: 20, coins: 5, icon: 'Layers' },
  { id: 'play_activity', name: 'Play an Activity', xp: 25, coins: 5, icon: 'Gamepad2' },
  { id: 'earn_100_xp', name: 'Earn 100 XP Today', xp: 50, coins: 15, icon: 'Zap' },
];

export const WEEKLY_MISSIONS = [
  { id: 'w_complete_5', name: 'Complete 5 Lessons This Week', xp: 200, coins: 50, icon: 'Trophy' },
  { id: 'w_7_day_streak', name: 'Maintain a 7-Day Streak', xp: 300, coins: 75, icon: 'Flame' },
  { id: 'w_perfect_3', name: 'Get 100% on 3 Quizzes', xp: 250, coins: 60, icon: 'Crown' },
];

// Weeks run Monday–Sunday in the student's own time zone.
export function weekStartDay() {
  const d = new Date();
  const back = (d.getDay() + 6) % 7; // days since Monday
  return localDay(-back);
}
export function weekId() {
  // e.g. "2026-10-19" (the Monday the week starts on)
  return weekStartDay();
}

// One featured challenge per week, rotating. Progress is this week's XP or lessons.
export const WEEKLY_CHALLENGES = [
  { id: 'xp300', name: 'Earn 300 XP this week', metric: 'xp', target: 300, coins: 60, xp: 50, emoji: '⚡' },
  { id: 'lessons3', name: 'Finish 3 lessons this week', metric: 'lessons', target: 3, coins: 60, xp: 50, emoji: '📘' },
  { id: 'xp600', name: 'Earn 600 XP this week', metric: 'xp', target: 600, coins: 100, xp: 80, emoji: '🚀' },
  { id: 'lessons5', name: 'Finish 5 lessons this week', metric: 'lessons', target: 5, coins: 100, xp: 80, emoji: '🏁' },
  { id: 'xp1000', name: 'Earn 1000 XP this week', metric: 'xp', target: 1000, coins: 150, xp: 120, emoji: '🏆' },
];
export function currentWeeklyChallenge() {
  const start = new Date(weekStartDay() + 'T00:00:00');
  const n = Math.floor(start.getTime() / (7 * 86400000));
  return WEEKLY_CHALLENGES[((n % WEEKLY_CHALLENGES.length) + WEEKLY_CHALLENGES.length) % WEEKLY_CHALLENGES.length];
}
/** { value, target, done, claimed } for this week's challenge. */
export function weeklyChallengeStatus(progress) {
  const ch = currentWeeklyChallenge();
  const wk = weekId();
  const value = ch.metric === 'xp'
    ? (progress?.weekId === wk ? progress.weekXp || 0 : 0)
    : Object.values(progress?.lessonDates || {}).filter(d => d >= wk).length;
  return { challenge: ch, value: Math.min(value, ch.target), target: ch.target, done: value >= ch.target, claimed: progress?.challengeClaimed === wk + ':' + ch.id };
}

// Local calendar day (not UTC) so streaks and daily missions reset at the
// student's own midnight.
export function localDay(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getToday() { return localDay(); }
function getWeekId() { const d = new Date(); const y = d.getFullYear(); const start = new Date(y, 0, 1); const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7); return `${y}_W${week}`; }

export function getDailyMissionsStatus(progress) {
  const today = getToday();
  const todayMissions = (progress.dailyMissions && progress.dailyMissions[today]) || { completed: [] };
  return DAILY_MISSIONS.map(m => ({
    ...m,
    done: todayMissions.completed.includes(m.id),
  }));
}

export function getWeeklyMissionsStatus(progress) {
  const weekId = getWeekId();
  const weekMissions = (progress.weeklyMissions && progress.weeklyMissions[weekId]) || { completed: [] };
  return WEEKLY_MISSIONS.map(m => ({
    ...m,
    done: weekMissions.completed.includes(m.id),
  }));
}

export function recordMission(oldProgress, missionId, type) {
  const dateKey = type === 'weekly' ? getWeekId() : getToday();
  const field = type === 'weekly' ? 'weeklyMissions' : 'dailyMissions';
  const existing = (oldProgress[field] && oldProgress[field][dateKey]) || { completed: [] };
  if (existing.completed.includes(missionId)) return { progress: oldProgress, awarded: false };
  const completed = [...existing.completed, missionId];
  const updated = { ...oldProgress, [field]: { ...oldProgress[field], [dateKey]: { completed } } };
  return { progress: updated, awarded: true };
}

export const MYSTERY_BOXES = [
  {
    id: 'small',
    name: 'Small Mystery Box',
    cost: 50,
    rewards: [
      { type: 'coins', min: 10, max: 30 },
      { type: 'xp', min: 20, max: 50 },
    ],
    color: '#60A5FA',
  },
  {
    id: 'medium',
    name: 'Golden Mystery Box',
    cost: 150,
    rewards: [
      { type: 'coins', min: 40, max: 100 },
      { type: 'xp', min: 50, max: 150 },
    ],
    color: '#FBBF24',
  },
  {
    id: 'large',
    name: 'Legendary Mystery Box',
    cost: 300,
    rewards: [
      { type: 'coins', min: 100, max: 250 },
      { type: 'xp', min: 150, max: 400 },
    ],
    color: '#A78BFA',
  },
];

export function openMysteryBox(boxId) {
  const box = MYSTERY_BOXES.find(b => b.id === boxId);
  if (!box) return null;
  return box.rewards.map(r => ({
    type: r.type,
    amount: Math.floor(Math.random() * (r.max - r.min + 1)) + r.min,
  }));
}

// Reward Shop: things students can spend coins on. Owned items are saved in
// progress.shop = { owned: [...ids], avatar, frame, accent, title }.
export const REWARD_SHOP = [
  // Avatars (shown on Home and the leaderboard)
  { id: 'av_bot', type: 'avatar', name: 'Classic Bot', emoji: '🤖', cost: 0 },
  { id: 'av_arm', type: 'avatar', name: 'Robo Arm', emoji: '🦾', cost: 60 },
  { id: 'av_rocket', type: 'avatar', name: 'Rocket', emoji: '🚀', cost: 80 },
  { id: 'av_alien', type: 'avatar', name: 'Pixel Alien', emoji: '👾', cost: 100 },
  { id: 'av_ufo', type: 'avatar', name: 'UFO', emoji: '🛸', cost: 120 },
  { id: 'av_brain', type: 'avatar', name: 'AI Brain', emoji: '🧠', cost: 150 },
  { id: 'av_satellite', type: 'avatar', name: 'Satellite', emoji: '🛰️', cost: 180 },
  { id: 'av_dino', type: 'avatar', name: 'Robo Dino', emoji: '🦖', cost: 220 },
  { id: 'av_owl', type: 'avatar', name: 'Wise Owl', emoji: '🦉', cost: 260 },
  { id: 'av_dragon', type: 'avatar', name: 'Dragon', emoji: '🐉', cost: 400 },
  { id: 'av_gear', type: 'avatar', name: 'Gear Head', emoji: '⚙️', cost: 70 },
  { id: 'av_bulb', type: 'avatar', name: 'Bright Spark', emoji: '💡', cost: 90 },
  { id: 'av_chip', type: 'avatar', name: 'Microchip', emoji: '🔌', cost: 110 },
  { id: 'av_magnet', type: 'avatar', name: 'Magnet', emoji: '🧲', cost: 130 },
  { id: 'av_tools', type: 'avatar', name: 'Toolkit', emoji: '🛠️', cost: 140 },
  { id: 'av_car', type: 'avatar', name: 'Line Follower', emoji: '🏎️', cost: 170 },
  { id: 'av_drone', type: 'avatar', name: 'Drone', emoji: '🚁', cost: 190 },
  { id: 'av_telescope', type: 'avatar', name: 'Stargazer', emoji: '🔭', cost: 210 },
  { id: 'av_atom', type: 'avatar', name: 'Atom', emoji: '⚛️', cost: 240 },
  { id: 'av_shark', type: 'avatar', name: 'Robo Shark', emoji: '🦈', cost: 280 },
  { id: 'av_octopus', type: 'avatar', name: 'Soft Robot', emoji: '🐙', cost: 300 },
  { id: 'av_phoenix', type: 'avatar', name: 'Phoenix', emoji: '🔥', cost: 340 },
  { id: 'av_crown', type: 'avatar', name: 'Champion', emoji: '👑', cost: 450 },
  { id: 'av_galaxy', type: 'avatar', name: 'Galaxy Mind', emoji: '🌌', cost: 600 },
  // Your own photo. It never leaves the phone — see photoAvatar.js.
  { id: 'av_photo', type: 'avatar', name: 'Your own photo', emoji: '📷', cost: 1000, photo: true },
  // App colour themes (recolour buttons, highlights and icons)
  { id: 'ac_cyan', type: 'accent', name: 'Lab Green', value: 'cyan', swatch: '#10b981', cost: 0 },
  { id: 'ac_neon', type: 'accent', name: 'Neon Cyan', value: 'neon', swatch: '#22d3ee', cost: 150 },
  { id: 'ac_sky', type: 'accent', name: 'Sky Blue', value: 'sky', swatch: '#38bdf8', cost: 150 },
  { id: 'ac_emerald', type: 'accent', name: 'Circuit Green', value: 'emerald', swatch: '#34d399', cost: 200 },
  { id: 'ac_violet', type: 'accent', name: 'Cyber Violet', value: 'violet', swatch: '#a78bfa', cost: 250 },
  { id: 'ac_amber', type: 'accent', name: 'Solar Gold', value: 'amber', swatch: '#fbbf24', cost: 300 },
  { id: 'ac_rose', type: 'accent', name: 'Laser Pink', value: 'rose', swatch: '#fb7185', cost: 300 },
  { id: 'ac_lime', type: 'accent', name: 'Lab Lime', value: 'lime', swatch: '#a3e635', cost: 220 },
  { id: 'ac_teal', type: 'accent', name: 'Deep Teal', value: 'teal', swatch: '#2dd4bf', cost: 240 },
  { id: 'ac_indigo', type: 'accent', name: 'Midnight Indigo', value: 'indigo', swatch: '#818cf8', cost: 260 },
  { id: 'ac_orange', type: 'accent', name: 'Soldering Orange', value: 'orange', swatch: '#fb923c', cost: 280 },
  { id: 'ac_fuchsia', type: 'accent', name: 'Plasma Pink', value: 'fuchsia', swatch: '#e879f9', cost: 320 },
  { id: 'ac_slate', type: 'accent', name: 'Workshop Steel', value: 'slate', swatch: '#94a3b8', cost: 350 },
  // Avatar frames
  { id: 'fr_none', type: 'frame', name: 'No Frame', value: 'transparent', cost: 0 },
  { id: 'fr_silver', type: 'frame', name: 'Silver Ring', value: 'linear-gradient(135deg,#e5e7eb,#9ca3af)', cost: 80 },
  { id: 'fr_gold', type: 'frame', name: 'Gold Ring', value: 'linear-gradient(135deg,#fde68a,#f59e0b)', cost: 200 },
  { id: 'fr_rainbow', type: 'frame', name: 'Rainbow Ring', value: 'conic-gradient(#f43f5e,#f59e0b,#22c55e,#06b6d4,#8b5cf6,#f43f5e)', cost: 350 },
  { id: 'fr_copper', type: 'frame', name: 'Copper Coil', value: 'linear-gradient(135deg,#fdba74,#b45309)', cost: 120 },
  { id: 'fr_circuit', type: 'frame', name: 'Circuit Trace', value: 'linear-gradient(135deg,#34d399,#0f766e)', cost: 260 },
  { id: 'fr_plasma', type: 'frame', name: 'Plasma Ring', value: 'conic-gradient(#22d3ee,#8b5cf6,#22d3ee)', cost: 420 },
  // Titles (shown under your name)
  { id: 'ti_learner', type: 'title', name: 'Robotics Learner', cost: 0 },
  { id: 'ti_tinkerer', type: 'title', name: 'Tinkerer', cost: 70 },
  { id: 'ti_coder', type: 'title', name: 'Code Ninja', cost: 120 },
  { id: 'ti_circuit', type: 'title', name: 'Circuit Wizard', cost: 180 },
  { id: 'ti_engineer', type: 'title', name: 'Future Engineer', cost: 250 },
  { id: 'ti_master', type: 'title', name: 'Robot Master', cost: 500 },
  { id: 'ti_solder', type: 'title', name: 'Solder Smith', cost: 90 },
  { id: 'ti_debug', type: 'title', name: 'Bug Hunter', cost: 150 },
  { id: 'ti_maker', type: 'title', name: 'Maker', cost: 200 },
  { id: 'ti_board', type: 'title', name: 'Board Topper', cost: 400 },
  // Pets: one companion that sits beside your avatar on Home
  { id: 'pet_none', type: 'pet', name: 'No pet', emoji: '', cost: 0 },
  { id: 'pet_bot', type: 'pet', name: 'Robo Puppy', emoji: '🐶', cost: 120 },
  { id: 'pet_cat', type: 'pet', name: 'Circuit Cat', emoji: '🐱', cost: 150 },
  { id: 'pet_bird', type: 'pet', name: 'Sensor Bird', emoji: '🐦', cost: 180 },
  { id: 'pet_fox', type: 'pet', name: 'Fox Engineer', emoji: '🦊', cost: 220 },
  { id: 'pet_panda', type: 'pet', name: 'Panda Coder', emoji: '🐼', cost: 260 },
  { id: 'pet_dragon', type: 'pet', name: 'Mini Dragon', emoji: '🐲', cost: 380 },
  // Room decor: items shown on your Robot Room on Home
  { id: 'room_none', type: 'room', name: 'Bare room', emoji: '', cost: 0 },
  { id: 'room_desk', type: 'room', name: 'Robot Workbench', emoji: '🛠️', cost: 90 },
  { id: 'room_plant', type: 'room', name: 'Desk Plant', emoji: '🌱', cost: 60 },
  { id: 'room_poster', type: 'room', name: 'Space Poster', emoji: '🪐', cost: 110 },
  { id: 'room_lamp', type: 'room', name: 'Lab Lamp', emoji: '💡', cost: 130 },
  { id: 'room_trophy', type: 'room', name: 'Trophy Shelf', emoji: '🏆', cost: 240 },
  { id: 'room_rocket', type: 'room', name: 'Model Rocket', emoji: '🚀', cost: 200 },
];

export const SHOP_DEFAULTS = { avatar: 'av_bot', accent: 'ac_cyan', frame: 'fr_none', title: 'ti_learner', pet: 'pet_none', room: 'room_none' };

/** The equipped item of each type (falls back to the free default). */
export function equippedItems(progress) {
  const shop = progress?.shop || {};
  const pick = (type) => REWARD_SHOP.find(i => i.id === (shop[type] || SHOP_DEFAULTS[type])) || REWARD_SHOP.find(i => i.id === SHOP_DEFAULTS[type]);
  return { avatar: pick('avatar'), accent: pick('accent'), frame: pick('frame'), title: pick('title'), pet: pick('pet'), room: pick('room') };
}

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_PASS: 50,
  QUIZ_QUESTION: 10,
  FLASHCARD_REVIEW: 15,
  ACTIVITY_COMPLETE: 30,
  DAILY_MISSION: 50,
  STREAK_BONUS: 20,
  BADGE_EARN: 100,
};