import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { SkipForward } from 'lucide-react';
import AICoreStage from '@/components/splash/AICoreStage';
import BootModulesStage from '@/components/splash/BootModulesStage';
import RobotBlueprintStage from '@/components/splash/RobotBlueprintStage';
import NeuralNetworkStage from '@/components/splash/NeuralNetworkStage';
import FinalStage from '@/components/splash/FinalStage';

const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

// Hard budget: the whole boot sequence never exceeds 2.5 seconds.
const BOOT_BUDGET_MS = 2500;

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, authChecked, user } = useAuth();
  const [stage, setStage] = useState(0);

  const isFirstLaunch = !lsGet('rc_booted');

  const finish = useCallback(() => {
    lsSet('rc_booted', '1');
    if (authChecked && isAuthenticated) {
      const uid = user?.id || 'guest';
      const savedClass = lsGet(`robocraft_class_${uid}`);
      navigate(savedClass ? '/' : '/class-selection');
    } else if (authChecked) {
      navigate('/login');
    }
  }, [authChecked, isAuthenticated, user, navigate]);

  // Hard 2.5s cap — whatever stage the animation is in, the app opens.
  useEffect(() => {
    const t = setTimeout(finish, BOOT_BUDGET_MS);
    return () => clearTimeout(t);
  }, [finish]);

  // Natural end of the sequence
  useEffect(() => {
    if (stage > 4) finish();
  }, [stage, finish]);

  // Repeat launches: jump straight to the short final stage
  useEffect(() => {
    if (!isFirstLaunch) setStage(4);
  }, [isFirstLaunch]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Skip — always available, ends the boot immediately */}
      <button
        onClick={finish}
        className="absolute top-4 right-4 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-muted-foreground text-[11px] font-medium hover:text-cyan-400 transition-colors"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        Skip <SkipForward className="w-3.5 h-3.5" />
      </button>

      {stage === 0 && <AICoreStage onDone={() => setStage(1)} />}
      {stage === 1 && <BootModulesStage onDone={() => setStage(2)} />}
      {stage === 2 && <RobotBlueprintStage onDone={() => setStage(3)} />}
      {stage === 3 && <NeuralNetworkStage onDone={() => setStage(4)} />}
      {stage === 4 && <FinalStage onDone={() => setStage(5)} />}

      <p className="absolute bottom-0 inset-x-0 z-[60] text-center text-[11px] tracking-wide text-white/60 pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 18px)' }}>
        Made &amp; licensed by <span className="text-cyan-300 font-semibold">Aryan</span>
      </p>
    </div>
  );
}
