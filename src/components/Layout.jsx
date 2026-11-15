import React, { useState, useEffect, useRef, useMemo } from 'react';
import { formatClass } from '@/lib/utils';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, BookOpen, FolderGit2, BarChart3, Wrench, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import AvatarBadge from '@/components/AvatarBadge';
import AIMentor from '@/components/learning/AIMentor';
import CircuitBackground from '@/components/CircuitBackground';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedClass, user, isGuest, isLoading, getProgressForClass } = useApp();

  // Once a student picks an avatar from the Reward Shop, it takes the place of
  // the logo in the corner — that is the point of buying one. Computed on each
  // render (not memoised) so it changes the moment they equip it.
  const classProgress = selectedClass ? getProgressForClass(selectedClass) : null;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabState = useRef({});

  const getActiveTab = (pathname) => {
    if (pathname.startsWith('/learn') || pathname.startsWith('/lesson') || pathname.startsWith('/quiz')) return '/learn';
    if (pathname.startsWith('/project')) return '/projects';
    if (['/build', '/lab', '/arena', '/design', '/mechanisms', '/challenges', '/assessment'].some(x => pathname.startsWith(x))) return '/build';
    if (pathname.startsWith('/shop')) return '/shop';
    if (pathname.startsWith('/progress')) return '/progress';
    if (pathname === '/') return '/';
    return null; // settings, mentor, revision, search, challenges: no tab highlighted
  };

  const activeTab = useMemo(() => getActiveTab(location.pathname), [location.pathname]);
  const inLab = location.pathname.startsWith('/lab') || location.pathname.startsWith('/design');

  useEffect(() => {
    if (!activeTab) return;
    const saved = tabState.current[activeTab]?.scrollY;
    if (saved !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    }
    tabState.current[activeTab] = tabState.current[activeTab] || {};
    tabState.current[activeTab].lastPath = location.pathname;
  }, [activeTab, location.pathname]);

  const handleTabClick = (path) => {
    if (activeTab && activeTab === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (activeTab) {
      tabState.current[activeTab] = tabState.current[activeTab] || {};
      tabState.current[activeTab].scrollY = window.scrollY;
    }
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedClass) {
    return <Navigate to="/class-selection" replace />;
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/build', label: 'Build', icon: Wrench },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen animated-bg grid-pattern isolate">
      {/* moving circuit background; skipped in the full-screen workspaces */}
      {!inLab && !location.pathname.startsWith('/arena') && <CircuitBackground />}
      <a href="#main" className="skip-link">Skip to content</a>
      {/* Top bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'}`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            {/* The avatar wears its bought frame here too, so the ring the
                student paid for is on every screen, not only in the shop. */}
            <AvatarBadge
              progress={classProgress}
              size={38}
              fallback={(
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-label="RoboCraft">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400/60" strokeLinejoin="round"/>
                </svg>
              )}
            />
            <span className="font-bold text-lg gradient-text hidden sm:block">RoboCraft</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs glass px-3 py-1.5 rounded-full text-cyan-400 font-medium">
              {formatClass(selectedClass)}
            </span>
            <button
              onClick={() => navigate('/settings')}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm font-bold text-cyan-400 hover:neon-glow transition-all"
            >
              {user?.full_name?.[0]?.toUpperCase() || (isGuest ? 'G' : 'U')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main id="main" className="min-h-screen" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))', paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        {/* keyed on the path so every screen change replays the entrance animation */}
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      {/* Bottom navigation (hidden in the Lab, which has its own toolbar) */}
      {!inLab && <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-cyan-500/10" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map(item => {
            const active = activeTab === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleTabClick(item.path)}
                className={`flex flex-col items-center gap-1 px-1 sm:px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  active ? 'text-cyan-400 scale-110' : 'text-muted-foreground hover:text-cyan-400/70'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${active ? 'glass neon-glow' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>}

      {/* Floating AI Mentor */}
      {!inLab && location.pathname !== '/mentor' && <AIMentor compact />}
    </div>
  );
}