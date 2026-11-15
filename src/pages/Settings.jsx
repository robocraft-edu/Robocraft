import ReportButton from '@/components/ReportButton';
import React, { useState } from 'react';
import { formatClass } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getReminderSettings, setReminderSettings, remindersAreNative } from '@/lib/reminders';
import { localDay } from '@/lib/gamification';
import { toast } from '@/components/ui/use-toast';
import { Bell, ShoppingBag, ArrowLeft, Check, Cpu, LogOut, Settings as SettingsIcon, GraduationCap, Trash2, AlertTriangle, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { getUiMode, setUiMode } from '@/lib/uiMode';
import { Gamepad2, Briefcase } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { selectedClass, selectClass, isGuest, user, logout, getProgressForClass } = useApp();
  const [reminder, setReminder] = useState(getReminderSettings);
  const cp = selectedClass ? getProgressForClass(selectedClass) : null;
  const studiedToday = !!cp && cp.lastStreakDate === localDay();
  const updateReminder = async (next) => {
    const merged = { ...reminder, ...next };
    setReminder(merged);
    const res = await setReminderSettings(merged, studiedToday);
    if (!res.ok && res.reason === 'permission') {
      setReminder({ ...merged, enabled: false });
      await setReminderSettings({ enabled: false });
      toast({ title: 'Notifications are blocked', description: 'Allow notifications for RoboCraft in your phone settings, then try again.' });
    } else if (next.enabled === true) {
      toast({ title: 'Daily reminder on', description: remindersAreNative ? `We'll remind you at ${merged.time} (skipped on days you've already studied).` : 'You will see a streak reminder on Home. Install the Android app for phone notifications.' });
    }
  };
  const { theme, setTheme } = useTheme();
  const [changingClass, setChangingClass] = useState(false);
  const [uiMode, setUiModeState] = useState(() => getUiMode(selectedClass));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const classes = [
    { id: 'class_9', name: 'Class 9', desc: 'Foundation of Robotics, Python, AI & Computing', icon: '🤖', color: '#00D2FF' },
    { id: 'class_10', name: 'Class 10', desc: 'Advanced Robotics, Python Libraries & ML', icon: '⚙️', color: '#818CF8' },
    { id: 'class_11', name: 'Class 11', desc: 'Mechanical Systems, Microcontrollers & Control', icon: '🔧', color: '#C084FC' },
  ];

  const handleClassChange = (classId) => {
    selectClass(classId);
    setChangingClass(false);
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      if (user && !isGuest) {
        const { backend } = await import('@/api/client');
        await backend.auth.deleteAccount({ password: deletePassword });
      }
      // Everything this app ever kept on the device, including saved code,
      // podcasts and cached AI answers.
      try {
        Object.keys(localStorage)
          .filter(key => /progress|robocraft|class_|py_code_|podcast_|rc_/i.test(key))
          .forEach(key => localStorage.removeItem(key));
      } catch { /* storage blocked: nothing to clear */ }
      await logout();
      navigate('/login');
    } catch (err) {
      setIsDeleting(false);
      if (err?.needsPassword) {
        setNeedsPassword(true);
        setDeleteError('Enter your password to confirm. Nothing has been deleted yet.');
        return;
      }
      setDeleteError(err?.message || 'Could not delete the account. Please log out, log in again and retry.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <SettingsIcon className="w-5 h-5 text-cyan-400" />
      </div>

      <h1 className="text-2xl font-bold gradient-text animate-slide-up" style={{ animationDelay: '0.05s' }}>Settings</h1>

      {/* Profile */}
      <div className="glass-strong rounded-2xl p-5 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-xl font-bold text-cyan-400">
          {user?.full_name?.[0]?.toUpperCase() || 'G'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">{user?.full_name || (isGuest ? 'Guest User' : 'User')}</h3>
          <p className="text-xs text-muted-foreground">{user?.email || 'Not signed in'}</p>
          {isGuest && <span className="text-[10px] text-amber-600 dark:text-yellow-400 mt-1 inline-block">Guest mode • Progress saved locally</span>}
        </div>
      </div>

      {/* Appearance / Theme */}
      <div className="glass-strong rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.12s' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">Appearance</h3>
            <p className="text-xs text-muted-foreground">Choose how RoboCraft looks</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white neon-glow' : 'glass text-muted-foreground hover:text-cyan-400'}`}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${theme === 'light' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white neon-glow' : 'glass text-muted-foreground hover:text-cyan-400'}`}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
        </div>
      </div>

      {/* Daily reminder */}
      <div className="glass-strong rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.13s' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">Daily Study Reminder</h3>
            <p className="text-xs text-muted-foreground">{remindersAreNative ? 'A phone notification to keep your streak' : 'Shows a streak reminder on Home (phone notifications in the Android app)'}</p>
          </div>
          <button role="switch" aria-checked={reminder.enabled} aria-label="Daily study reminder"
            onClick={() => updateReminder({ enabled: !reminder.enabled })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${reminder.enabled ? 'bg-cyan-500' : 'bg-muted'}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${reminder.enabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        {reminder.enabled && (
          <label className="mt-3 flex items-center justify-between glass rounded-xl px-3 py-2 text-sm">
            <span className="text-muted-foreground text-xs">Remind me at</span>
            <input type="time" value={reminder.time} onChange={e => e.target.value && updateReminder({ time: e.target.value })}
              className="bg-transparent font-bold text-cyan-400 outline-none" />
          </label>
        )}
      </div>

      {/* Display style */}
      <div className="glass-strong rounded-2xl p-4 animate-slide-up">
        <h3 className="font-bold text-sm">Display style</h3>
        <p className="text-xs text-muted-foreground mb-3">For {formatClass(selectedClass)}. Pro is calmer and exam-focused; Fun adds games, confetti and rewards.</p>
        <div className="grid grid-cols-2 gap-2">
          {[['fun', 'Fun', 'Games, coins, story map', Gamepad2], ['pro', 'Pro', 'Numericals, tools, tracker', Briefcase]].map(([id, label, sub, Icon]) => (
            <button key={id} onClick={() => { setUiMode(selectedClass, id); setUiModeState(id); toast({ title: `${label} style on`, description: id === 'pro' ? 'Home, lessons and the tracker are now in Pro style.' : 'Games and rewards are back on.' }); }}
              className={`rounded-xl p-3 text-left transition-all ${uiMode === id ? 'bg-cyan-500/15 ring-1 ring-cyan-500' : 'glass'}`}>
              <Icon className={`w-4 h-4 mb-1 ${uiMode === id ? 'text-cyan-500' : 'text-muted-foreground'}`} />
              <p className="text-sm font-bold">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reward Shop */}
      <button onClick={() => navigate('/shop')} className="w-full glass-strong rounded-2xl p-4 flex items-center gap-3 hover:bg-cyan-500/5 transition-colors animate-slide-up" style={{ animationDelay: '0.14s' }}>
        <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-sm">Reward Shop</h3>
          <p className="text-xs text-muted-foreground">Avatars, colour themes, frames and mystery boxes</p>
        </div>
        <span className="text-xs text-cyan-400">Open ›</span>
      </button>

      {/* Change Class */}
      <div className="glass-strong rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={() => setChangingClass(!changingClass)}
          className="w-full flex items-center gap-3 p-4 hover:bg-cyan-500/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-sm">Change Class</h3>
            <p className="text-xs text-muted-foreground">Currently: {formatClass(selectedClass) || 'None'}</p>
          </div>
          <span className="text-xs text-cyan-400">{changingClass ? 'Cancel' : 'Change'}</span>
        </button>

        {changingClass && (
          <div className="border-t border-cyan-500/10 p-3 space-y-2 animate-fade-in">
            <p className="text-xs text-muted-foreground px-2 mb-2">Selecting a new class will load its curriculum. Your progress in each class is saved separately.</p>
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => handleClassChange(cls.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedClass === cls.id ? 'glass-strong neon-glow' : 'glass hover:bg-cyan-500/5'
                }`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${cls.color}15` }}>
                  {cls.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-medium" style={{ color: cls.color }}>{cls.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{cls.desc}</p>
                </div>
                {selectedClass === cls.id && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
            <button onClick={() => navigate('/python-course')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-emerald-500/15">🐍</div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Learn Python</h4>
                <p className="text-[10px] text-muted-foreground">Beginner to advanced course with Hindi videos, for every class</p>
              </div>
              <span className="text-emerald-500">→</span>
            </button>
          </div>
        )}
      </div>

      {/* About */}
      <div className="glass-strong rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">About RoboCraft</h3>
            <p className="text-xs text-muted-foreground">Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          RoboCraft helps ICSE/ISC students learn Robotics &amp; AI: chapters, board-style practice, a circuit lab, a 3-D robot arena, a 3-D design studio and a practical file.
        </p>
        <a href={`${import.meta.env.BASE_URL}about`} onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="mt-3 flex items-center gap-3 rounded-xl glass p-2.5">
          <img src={`${import.meta.env.BASE_URL}about-photo.jpg`} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500" />
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold">Made by Aryan</span>
            <span className="block text-[11px] text-muted-foreground">Meet the creator and why RoboCraft exists</span>
          </span>
          <span className="text-cyan-500 text-xs font-semibold">About →</span>
        </a>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          {[['privacy.html', 'Privacy policy'], ['terms.html', 'Terms of use'], ['accessibility.html', 'Accessibility'], ['security.html', 'Security'], ['contact.html', 'Contact']].map(([f, label]) => (
            <a key={f} href={`${import.meta.env.BASE_URL}${f}`} target="_blank" rel="noopener" className="text-cyan-500 font-semibold">{label}</a>
          ))}
          <button onClick={() => navigate('/about')} className="text-cyan-500 font-semibold">About us</button>
          <ReportButton label="Report a problem" className="!text-xs" />
        </div>
      </div>

      {/* Account Deletion */}
      <button
        onClick={() => setShowDeleteDialog(true)}
        className="w-full glass-strong rounded-2xl p-4 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors animate-slide-up"
        style={{ animationDelay: '0.22s' }}
      >
        <Trash2 className="w-5 h-5" />
        <span className="font-medium text-sm">Delete Account</span>
      </button>

      {/* Logout */}
      <button aria-label="Log out"
        onClick={logout}
        className="w-full glass-strong rounded-2xl p-4 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors animate-slide-up"
        style={{ animationDelay: '0.25s' }}
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium text-sm">{isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
      </button>

      {/* Delete Account Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setShowDeleteDialog(false)} />
          <div className="relative glass-strong rounded-3xl p-6 max-w-sm w-full animate-scale-in">
            <button onClick={() => setShowDeleteDialog(false)} className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-cyan-400">
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-bold text-lg text-center mb-2">Delete Account?</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {user && !isGuest ? 'This permanently deletes your RoboCraft account and all saved progress, on every device. This cannot be undone.' : 'This will permanently remove all your progress, achievements, and saved data from this device. This action cannot be undone.'}
            </p>
            <p className="text-xs text-muted-foreground text-center mb-3">
              Type <span className="font-bold text-red-400">DELETE</span> to confirm:
            </p>
            {deleteError && <p className="text-xs text-red-400 text-center mb-3">{deleteError}</p>}
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full glass rounded-xl p-3 text-sm text-center font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500/50 mb-4"
            />
            {needsPassword && (
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                aria-label="Your password"
                className="w-full glass rounded-xl p-3 text-sm text-center text-foreground focus:outline-none focus:ring-1 focus:ring-red-500/50 mb-4"
              />
            )}
            <div className="flex gap-2">
              <button onClick={() => { setShowDeleteDialog(false); setDeleteConfirm(''); setDeletePassword(''); setNeedsPassword(false); setDeleteError(''); }} className="flex-1 py-3 rounded-xl glass text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || isDeleting || (needsPassword && !deletePassword)}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm disabled:opacity-40 hover:bg-red-700 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}