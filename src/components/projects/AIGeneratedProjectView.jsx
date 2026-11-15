import lazyRetry from '@/lib/lazyRetry';
import ErrorBoundary from '@/components/ErrorBoundary';
import React, { useState, Suspense } from 'react';
const CircuitDiagram = lazyRetry(() => import('@/components/buildsheet/CircuitDiagram'));
const FullscreenCircuit = lazyRetry(() => import('@/components/buildsheet/FullscreenCircuit'));
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';
import BuildSheetModal from '@/components/buildsheet/BuildSheetModal';
import { useInk } from '@/lib/ui/ink';
import { normalizeProject } from '@/lib/aiShape';
import {
  ArrowLeft, Clock, IndianRupee, Cpu, AlertTriangle, Copy, Check, Download,
  ChevronDown, ChevronUp, FileText, Eye, Shield, Globe, Lightbulb, 
  Bot, Wrench, Layers, Beaker, Sparkles, AlertCircle
} from 'lucide-react';

function CodeBlock({ code, label, color }) {
  const [copied, setCopied] = useState(false);
  const clean = sanitizeCode(code);
  if (!clean) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(clean)?.catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([clean], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${label.replace(/\s+/g, '_')}.ino`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-strong rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4" style={{ color }} /> {label}
        </h3>
        <div className="flex items-center gap-2">
          <button aria-label="Copy" onClick={handleCopy} className="text-xs glass px-3 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/15 transition-colors flex items-center gap-1">
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
          <button onClick={handleDownload} className="text-xs glass px-3 py-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/15 transition-colors flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
      <pre className="glass rounded-xl p-4 overflow-x-auto text-xs font-mono text-cyan-300/90 leading-relaxed">
        <code>{clean}</code>
      </pre>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, iconColor, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-strong rounded-2xl overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-cyan-500/5 transition-colors text-left">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
      <h3 className="font-bold text-sm flex-1">{title}</h3>
      {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
    </button>
    {open && <div className="px-4 pb-4 animate-fade-in">{children}</div>}
    </div>
  );
}

export default function AIGeneratedProjectView({ project: rawProject, onBack }) {
  // The AI occasionally returns a string where a list belongs; normalise once
  // here so nothing below has to guard against it.
  const project = React.useMemo(() => normalizeProject(rawProject) || {}, [rawProject]);
  const ink = useInk();
  const [showBuildSheet, setShowBuildSheet] = useState(false);
  const [showCircuit, setShowCircuit] = useState(false);
  const diffColors = { Beginner: '#4ADE80', Intermediate: '#F59E0B', Advanced: '#EF4444' };
  const diffColor = diffColors[project.difficulty] || '#4ADE80';
  const validation = project.validation || { valid: true, issues: [] };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400 transition-colors tap-target">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium glass text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Generated
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${diffColor}20`, color: ink(diffColor, 0.125) }}>
            {project.difficulty}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-3 animate-pulse-glow">
          <Bot className="w-7 h-7 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2 gradient-text">{project.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
          <span className="glass px-3 py-1.5 rounded-full text-cyan-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.estimatedTime}</span>
          <span className="glass px-3 py-1.5 rounded-full text-green-400 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> {String(project.estimatedCost || '').replace(/^₹\s*/, '')}</span>
          <span className="glass px-3 py-1.5 rounded-full text-purple-400 flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> {project.controller || 'Arduino Uno'}</span>
        </div>
      </div>

      {/* Validation banner */}
      {!validation.valid && (
        <div className="glass-strong rounded-2xl p-4 mb-4 border-l-2 border-yellow-500 animate-slide-up">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-yellow-400 mb-1">AI Validation Notice</h4>
              <p className="text-xs text-muted-foreground mb-1">This project was generated by AI. Please review before building:</p>
              <ul className="text-[10px] text-muted-foreground/80 ml-4 list-disc">
                {validation.issues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
      {validation.valid && (
        <div className="glass-strong rounded-2xl p-4 mb-4 border-l-2 border-yellow-500 animate-slide-up flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Made by AI — check before you build.</strong> The code passed basic checks, but AI can get wiring wrong (for example, every LED needs a resistor in series). Ask a teacher to check the wiring, and only use batteries or USB power.</p>
        </div>
      )}

      {/* Download Build Sheet buttons */}
      <div className="flex gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <button onClick={() => setShowBuildSheet(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:neon-glow transition-all flex-1">
          <Eye className="w-3.5 h-3.5" /> View Build Sheet
        </button>
        <button onClick={() => setShowBuildSheet(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors flex-1">
          <FileText className="w-3.5 h-3.5" /> Download PDF
        </button>
      </div>

      {/* Components */}
      <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> Components Required</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(project.components || []).map((comp, i) => (
            <div key={i} className="flex items-center gap-2 text-sm glass rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
              {typeof comp === 'string' ? comp : comp.name}
            </div>
          ))}
        </div>
      </div>

      {/* Wiring diagram */}
      {project.pinConnections?.length > 0 && (
        <div className="glass-strong rounded-2xl p-3 mb-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-sm flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Wiring Diagram</h3>
            <button onClick={() => setShowCircuit(true)} className="ml-auto text-[11px] font-bold text-cyan-500">Full screen</button>
          </div>
          <button onClick={() => setShowCircuit(true)} className="w-full rounded-xl overflow-hidden bg-white">
            <Suspense fallback={<div className="py-10 text-xs text-muted-foreground">Drawing the circuit…</div>}>
              <ErrorBoundary compact message="The wiring diagram could not be drawn. The pin table below still lists every connection.">
                <CircuitDiagram pinConnections={project.pinConnections} />
              </ErrorBoundary>
            </Suspense>
          </button>
        </div>
      )}
      {showCircuit && (
        <Suspense fallback={null}>
          <FullscreenCircuit pinConnections={project.pinConnections} projectName={project.name || project.title} onClose={() => setShowCircuit(false)} />
        </Suspense>
      )}

      {/* Pin Connection Table */}
      {project.pinConnections && project.pinConnections.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Pin Mapping Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-cyan-500/10">
                  <th className="text-left p-2 font-medium">Controller</th>
                  <th className="text-center p-2">→</th>
                  <th className="text-left p-2 font-medium">Component</th>
                  <th className="text-left p-2 font-medium">Pin</th>
                  <th className="text-center p-2 font-medium">Wire</th>
                </tr>
              </thead>
              <tbody>
                {project.pinConnections.map((conn, i) => (
                  <tr key={i} className="border-b border-cyan-500/5">
                    <td className="p-2 font-bold text-cyan-400">{conn.controllerPin}</td>
                    <td className="p-2 text-center text-muted-foreground">→</td>
                    <td className="p-2">{conn.component}</td>
                    <td className="p-2 font-medium">{conn.componentPin}</td>
                    <td className="p-2 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded" style={{ background: conn.color }} />
                        <span className="text-[10px] text-muted-foreground capitalize">{conn.wireColor}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Arduino Code */}
      {project.arduinoCode && (
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CodeBlock code={project.arduinoCode} label="Arduino Code" color="#0EA5E9" />
        </div>
      )}

      {/* ESP32 Code */}
      {project.esp32Code && project.esp32Code.trim() && (
        <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <CodeBlock code={project.esp32Code} label="ESP32 Code" color="#E63946" />
        </div>
      )}

      {/* Code Explanation */}
      {project.codeExplanation && (
        <CollapsibleSection title="Code Explanation" icon={Lightbulb} iconColor="#F59E0B" defaultOpen={false}>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{sanitizeCode(project.codeExplanation) || project.codeExplanation}</p>
        </CollapsibleSection>
      )}

      {/* Build Guide */}
      {project.buildSteps && project.buildSteps.length > 0 && (
        <CollapsibleSection title="Step-by-Step Build Guide" icon={Wrench} iconColor="#22C55E" defaultOpen={false}>
          <div className="space-y-2">
            {project.buildSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">{i + 1}</span>
                <div>
                  <div className="text-sm font-bold mb-1">{typeof step === 'string' ? `Step ${i+1}` : step.title}</div>
                  <div className="text-xs text-muted-foreground">{typeof step === 'string' ? step : step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Testing Checklist */}
      {project.testingChecklist && project.testingChecklist.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Beaker className="w-4 h-4 text-green-400" /> Testing Checklist</h3>
          <ul className="space-y-2">
            {project.testingChecklist.map((item, i) => (
              <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                <span className="w-4 h-4 rounded border border-green-500/30 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Troubleshooting */}
      {project.troubleshooting && project.troubleshooting.length > 0 && (
        <CollapsibleSection title="Troubleshooting Guide" icon={AlertTriangle} iconColor="#F59E0B" defaultOpen={false}>
          <div className="space-y-2">
            {project.troubleshooting.map((item, i) => {
              const text = typeof item === 'string' ? item : `${item.problem}: ${item.solution || (Array.isArray(item.solutions) ? item.solutions.join('; ') : item.solutions)}`;
              return (
                <div key={i} className="text-sm text-foreground/90 flex items-start gap-2 glass rounded-lg p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  {text}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Safety Tips */}
      {project.safetyTips && project.safetyTips.length > 0 && (
        <div className="glass-strong rounded-2xl p-4 mb-4 border-l-2 border-yellow-500 animate-slide-up">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-yellow-400" /> Safety Tips</h3>
          <ul className="space-y-2">
            {project.safetyTips.map((tip, i) => (
              <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Real-World Applications */}
      {project.realWorldApplications && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ borderLeft: '3px solid #22C55E' }}>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-green-400" /> Real-World Applications</h3>
          <p className="text-sm text-foreground/90">{project.realWorldApplications}</p>
        </div>
      )}

      {/* Future Improvements */}
      {project.futureImprovements && (
        <div className="glass-strong rounded-2xl p-4 mb-4 animate-slide-up" style={{ borderLeft: '3px solid #A78BFA' }}>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-purple-400" /> Future Improvements</h3>
          <p className="text-sm text-foreground/90 whitespace-pre-line">{project.futureImprovements}</p>
        </div>
      )}

      {/* Build Sheet Modal */}
      {showBuildSheet && (
        <BuildSheetModal
          project={{ ...project, title: project.title, name: project.title }}
          projectType="prebuilt"
          onClose={() => setShowBuildSheet(false)}
        />
      )}
    </div>
  );
}