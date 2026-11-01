import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AppProvider, useApp } from '@/lib/AppContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import BadgePopup from '@/components/learning/BadgePopup';
import LevelUpPopup from '@/components/learning/LevelUpPopup';
import InstallHint from '@/components/InstallHint';
import { isPro } from '@/lib/uiMode';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
// Add page imports here
import Splash from '@/pages/Splash';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Heavy pages are code-split so the app opens fast
const ClassSelection = lazy(() => import('@/pages/ClassSelection'));
const Home = lazy(() => import('@/pages/Home'));
const Learn = lazy(() => import('@/pages/Learn'));
const LessonDetail = lazy(() => import('@/pages/LessonDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProgressPage = lazy(() => import('@/pages/ProgressPage'));
const Settings = lazy(() => import('@/pages/Settings'));
const Shop = lazy(() => import('@/pages/Shop'));
const PythonPlayground = lazy(() => import('@/pages/PythonPlayground'));
const PythonProjectMaker = lazy(() => import('@/pages/PythonProjectMaker'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const StoryMap = lazy(() => import('@/pages/StoryMap'));
const Mentor = lazy(() => import('@/pages/Mentor'));
const Lab = lazy(() => import('@/pages/Lab'));
const EngineeringChallenges = lazy(() => import('@/pages/EngineeringChallenges'));
const RevisionMode = lazy(() => import('@/pages/RevisionMode'));
const ExamPractice = lazy(() => import('@/pages/ExamPractice'));
const DiagramBank = lazy(() => import('@/pages/DiagramBank'));
const Problems = lazy(() => import('@/pages/Problems'));
const Tools = lazy(() => import('@/pages/Tools'));
const Arena = lazy(() => import('@/pages/Arena'));
const DesignStudio = lazy(() => import('@/pages/DesignStudio'));
const MechanismLab = lazy(() => import('@/pages/MechanismLab'));
const Assessment = lazy(() => import('@/pages/Assessment'));
const BuildHub = lazy(() => import('@/pages/BuildHub'));
const RobotQuiz = lazy(() => import('@/pages/RobotQuiz'));

function PageLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { badgePopup, setBadgePopup, levelPopup, setLevelPopup, selectedClass } = useApp();
  const pro = isPro(selectedClass);
  // Pro mode: no full-screen celebrations, just a quiet note.
  useEffect(() => {
    if (!pro) return;
    if (badgePopup) { toast({ title: 'Milestone reached', description: badgePopup.map(b => b.name).join(', ') }); setBadgePopup(null); }
    if (levelPopup) setLevelPopup(null);
  }, [pro, badgePopup, levelPopup]); // eslint-disable-line react-hooks/exhaustive-deps
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <div className="relative">
      {offline && (
        <div className="fixed top-0 inset-x-0 z-[100] bg-amber-500 text-black text-[11px] font-medium text-center py-1" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 4px)' }}>
          You're offline — lessons, quizzes and the lab still work. AI features need internet.
        </div>
      )}
      <ErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route path="/robot-quiz" element={<RobotQuiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/class-selection" element={<ClassSelection />} />

        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/splash" replace />} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/lesson/:id" element={<LessonDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/python" element={<PythonPlayground />} />
            <Route path="/pyproject" element={<PythonProjectMaker />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/story" element={<StoryMap />} />
            <Route path="/mentor" element={<Mentor />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/challenges" element={<EngineeringChallenges />} />
            <Route path="/revision" element={<RevisionMode />} />
            <Route path="/exam" element={<ExamPractice />} />
            <Route path="/diagrams" element={<DiagramBank />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/design" element={<DesignStudio />} />
            <Route path="/mechanisms" element={<MechanismLab />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/build" element={<BuildHub />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
      {!pro && badgePopup && <BadgePopup badges={badgePopup} onClose={() => setBadgePopup(null)} />}
      {!pro && levelPopup && <LevelUpPopup level={levelPopup} onClose={() => setLevelPopup(null)} />}
      <InstallHint />
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AppProvider>
    </AuthProvider>
  )
}

export default App