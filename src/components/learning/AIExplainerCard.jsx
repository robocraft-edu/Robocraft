import React, { useState } from 'react';
import ReportButton from '@/components/ReportButton';
import { aiEnabled } from '@/lib/features';
import { backend } from '@/api/client';
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { asText } from '@/lib/aiShape';

function AIExplainerCardInner({ title, subtitle, icon: Icon, color = '#00D2FF', prompt, renderResponse }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);

  const handleClick = async () => {
    if (content) { setOpen(!open); return; }
    setLoading(true);
    setOpen(true);
    try {
      const res = await backend.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: { type: 'object', properties: { response: { type: 'string' } } },
      });
      setContent(asText(res?.response ?? res) || 'Sorry, I could not generate this. Please try again.');
    } catch {
      setContent('Could not connect to AI. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden animate-fade-in">
      <button onClick={handleClick} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-xs font-bold" style={{ color }}>{title}</h4>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {content && (open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          {loading ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color }} />
              <span className="text-xs text-muted-foreground">AI is writing...</span>
            </div>
          ) : (
            <>
              {renderResponse ? renderResponse(content) : <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{content}</p>}
              <div className="text-right mt-1"><ReportButton ai context={{ excerpt: typeof content === 'string' ? content : '' }} /></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


export default function AIExplainerCard(props) {
  if (!aiEnabled) return null; // AI not configured for this build
  return <AIExplainerCardInner {...props} />;
}
