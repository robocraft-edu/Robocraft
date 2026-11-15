import React, { forwardRef } from 'react';
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';

const diffColors = {
  Beginner: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
  Intermediate: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  Advanced: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
};

const BuildSheet = forwardRef(({ data }, ref) => {
  const dc = diffColors[data.difficulty] || diffColors.Beginner;

  return (
    <div ref={ref} style={{
      background: '#ffffff', color: '#0F172A', fontFamily: "'Inter', sans-serif",
      padding: '40px', width: '794px', maxWidth: '100%', margin: '0 auto',
    }}>
      {/* ── Header / Branding ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #0EA5E9', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="RoboCraft" style={{ width: '48px', height: '48px' }} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0EA5E9', letterSpacing: '-0.5px' }}>RoboCraft</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Build Sheet — Robotics Project Manual</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Generated</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      {/* ── Project Title ── */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{data.projectName}</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>{data.difficulty}</span>
          <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, background: '#F1F5F9', color: '#475569' }}>⏱ {data.estimatedTime}</span>
          <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, background: '#F1F5F9', color: '#475569' }}>💰 {data.estimatedCost}</span>
          <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, background: '#F1F5F9', color: '#475569' }}>📚 {data.classLabel}</span>
        </div>
      </div>

      {/* ── Learning Objectives ── */}
      {data.objectives && data.objectives.length > 0 && (
        <Section title="Learning Objectives" icon="🎯">
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {data.objectives.map((obj, i) => (
              <li key={i} style={{ fontSize: '12px', color: '#334155', marginBottom: '4px' }}>{obj}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* ── Components Required ── */}
      <Section title="Components Required" icon="📦">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0F9FF' }}>
              <th style={thStyle}>Icon</th>
              <th style={thStyle}>Component Name</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.components.map((comp, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={tdStyleCenter}><span style={{ fontSize: '18px' }}>{comp.icon || '📦'}</span></td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{comp.name}</td>
                <td style={{ ...tdStyleCenter, fontWeight: 700, color: '#0EA5E9' }}>×{comp.quantity || 1}</td>
                <td style={{ ...tdStyle, fontSize: '11px', color: '#64748B' }}>{comp.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* ── Pin Connection Table ── */}
      {data.pinConnections && data.pinConnections.length > 0 && (
        <Section title="Pin Connection Table" icon="🔗">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F0F9FF' }}>
                <th style={thStyle}>Controller Pin</th>
                <th style={thStyle}>→</th>
                <th style={thStyle}>Component</th>
                <th style={thStyle}>Component Pin</th>
                <th style={thStyle}>Wire Color</th>
              </tr>
            </thead>
            <tbody>
              {data.pinConnections.map((conn, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: '#0EA5E9' }}>{conn.controllerPin}</td>
                  <td style={{ ...tdStyleCenter, color: '#94A3B8' }}>→</td>
                  <td style={tdStyle}>{conn.component}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{conn.componentPin}</td>
                  <td style={tdStyleCenter}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '14px', height: '4px', borderRadius: '2px', background: conn.color, display: 'inline-block' }} />
                      <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'capitalize' }}>{conn.wireColor || '—'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* ── Build Steps ── */}
      {data.buildSteps && data.buildSteps.length > 0 && (
        <Section title="Step-by-Step Build Guide" icon="📋">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.buildSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <span style={{ minWidth: '24px', height: '24px', borderRadius: '6px', background: '#0EA5E9', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>{step.title}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Source Code ── */}
      {data.arduinoCode && (
        <Section title="Source Code" icon="💻">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', marginBottom: '6px' }}>Arduino Code</div>
            <pre style={{ background: '#0F172A', color: '#E2E8F0', padding: '12px', borderRadius: '8px', fontSize: '10px', lineHeight: '1.5', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>
              <code>{sanitizeCode(data.arduinoCode)}</code>
            </pre>
          </div>
          {data.esp32Code && data.esp32Code.trim() && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#E63946', marginBottom: '6px' }}>ESP32 Code</div>
              <pre style={{ background: '#0F172A', color: '#E2E8F0', padding: '12px', borderRadius: '8px', fontSize: '10px', lineHeight: '1.5', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>
                <code>{sanitizeCode(data.esp32Code)}</code>
              </pre>
            </div>
          )}
        </Section>
      )}

      {/* ── Code Explanation ── */}
      {data.codeExplanation && (
        <Section title="Code Explanation" icon="📖">
          <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>{data.codeExplanation}</p>
        </Section>
      )}

      {/* ── Testing Checklist ── */}
      {data.testingChecklist && data.testingChecklist.length > 0 && (
        <Section title="Testing Checklist" icon="✅">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.testingChecklist.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#334155' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '3px', border: '2px solid #22C55E', flexShrink: 0 }} />
                {typeof item === 'string' ? item : item.problem || JSON.stringify(item)}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Troubleshooting ── */}
      {data.troubleshooting && data.troubleshooting.length > 0 && (
        <Section title="Troubleshooting Guide" icon="🔧">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.troubleshooting.map((item, i) => (
              <div key={i} style={{ padding: '10px', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>
                  ⚠️ {typeof item === 'string' ? item : item.problem || 'Issue'}
                </div>
                {typeof item === 'object' && item.causes && (
                  <div style={{ fontSize: '11px', color: '#78350F', marginBottom: '4px' }}>
                    <strong>Causes:</strong> {Array.isArray(item.causes) ? item.causes.join(', ') : item.causes}
                  </div>
                )}
                {typeof item === 'object' && item.solutions && (
                  <div style={{ fontSize: '11px', color: '#166534' }}>
                    <strong>Solution:</strong> {Array.isArray(item.solutions) ? item.solutions.join('; ') : item.solutions}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Real-World Applications ── */}
      {data.realWorldApplications && (
        <Section title="Real-World Applications" icon="🌍">
          <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', margin: 0 }}>{data.realWorldApplications}</p>
        </Section>
      )}

      {/* ── Future Improvements ── */}
      {data.futureImprovements && (
        <Section title="Possible Future Improvements" icon="💡">
          <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>{data.futureImprovements}</p>
        </Section>
      )}

      {/* ── Safety Tips ── */}
      <Section title="Safety Tips" icon="⚠️">
        <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '12px', border: '1px solid #FCD34D' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ fontSize: '11px', color: '#78350F', marginBottom: '5px' }}><strong>Always disconnect power</strong> before changing any wiring or connections.</li>
            <li style={{ fontSize: '11px', color: '#78350F', marginBottom: '5px' }}><strong>Double-check polarity</strong> — VCC to VCC, GND to GND. Reversed polarity can destroy components.</li>
            <li style={{ fontSize: '11px', color: '#78350F', marginBottom: '5px' }}><strong>Use a resistor (220Ω)</strong> with LEDs to prevent burnout. Never connect an LED directly to 5V.</li>
            <li style={{ fontSize: '11px', color: '#78350F', marginBottom: '5px' }}><strong>Never short 5V and GND</strong> — this can damage your Arduino and cause overheating.</li>
            <li style={{ fontSize: '11px', color: '#78350F', marginBottom: '5px' }}><strong>Keep away from water</strong> and work on a non-conductive surface.</li>
            <li style={{ fontSize: '11px', color: '#78350F' }}><strong>Ask for adult supervision</strong> when working with batteries above 12V or mains power via relays.</li>
          </ul>
        </div>
      </Section>

      {/* ── Footer ── */}
      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '2px solid #E2E8F0', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
          Generated by RoboCraft — Your AI Robotics Learning Platform · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
});

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '2px solid #0EA5E9' }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '0.3px' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

const thStyle = { fontSize: '11px', fontWeight: 700, color: '#0F172A', padding: '8px 10px', textAlign: 'left', borderBottom: '2px solid #E2E8F0' };
const tdStyle = { fontSize: '12px', padding: '8px 10px', color: '#334155' };
const tdStyleCenter = { fontSize: '12px', padding: '8px 10px', color: '#334155', textAlign: 'center' };

export default BuildSheet;