import React from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

/** True when a lazily-loaded screen could not be fetched — almost always
 *  because a new version was deployed and the old chunk file is gone. */
// Every browser words a missing code file differently (Chrome, Safari/iPhone, Firefox, Android WebView).
export const STALE_RE = /dynamically imported module|Importing a module script failed|module script|MIME type|ChunkLoadError|Loading (CSS )?chunk|Unable to preload|error loading dynamically|Load failed.*\.js/i;

export function isStaleChunkError(err) {
  const m = String(err?.message || err || '');
  return STALE_RE.test(m);
}

const RELOAD_KEY = 'rc_chunk_reload';

/**
 * Catches a rendering error and shows a way out instead of a blank page.
 * `resetKey` (the route path) clears the error when the user navigates.
 * `compact` renders a small inline card for one widget rather than a full screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, details: '', showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null, details: '', showDetails: false });
  }

  componentDidCatch(error, info) {
    // A stale chunk after a deploy fixes itself with one reload.
    if (isStaleChunkError(error)) {
      try {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1');
          window.location.reload();
          return;
        }
      } catch { /* storage unavailable */ }
    }
    // Keep the details so the student can show us what actually broke: on a
    // phone there is no console, and "something went wrong" tells nobody
    // anything. Stored in state, shown behind a tap, never sent anywhere.
    const where = String(info?.componentStack || '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 3).join(' < ');
    this.setState({ details: `${error?.name || 'Error'}: ${error?.message || error}` + (where ? `\n${where}` : '') });
    if (import.meta.env?.DEV) console.error('Caught by ErrorBoundary:', error, info);
  }

  // The error text, behind a tap. A screenshot of this is the one thing that
  // makes a crash on someone else's phone fixable.
  // Opens the student's email app with the error details already written in,
  // addressed to the developer. No account or server is needed.
  reportLink() {
    const { details } = this.state;
    const page = typeof window !== 'undefined' ? window.location.href : '';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const body = [
      'RoboCraft error report',
      `When: ${new Date().toString()}`,
      `Page: ${page}`,
      `Device: ${ua}`,
      '',
      details || 'No details available.',
      '',
      'Please describe what you were doing (optional):',
    ].join('\n').slice(0, 1800);
    const href = `mailto:aryansonkar243@gmail.com?subject=${encodeURIComponent('RoboCraft error report')}&body=${encodeURIComponent(body)}`;
    return (
      <a href={href} className="mt-3 inline-block px-3 py-2 rounded-xl glass text-xs font-bold">
        Send report to the developer
      </a>
    );
  }

  renderDetails() {
    const { details, showDetails } = this.state;
    if (!details) return null;
    if (!showDetails) {
      return (
        <button onClick={() => this.setState({ showDetails: true })} className="mt-3 text-[10px] underline text-muted-foreground">
          Show error details
        </button>
      );
    }
    return (
      <pre className="mt-3 text-[9px] leading-snug text-left whitespace-pre-wrap break-words max-h-40 overflow-auto rounded-lg bg-black/5 dark:bg-white/5 p-2">
        {details}
      </pre>
    );
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const stale = isStaleChunkError(error);
    if (stale && !this.state.details) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-xs">Getting the latest version…</p>
        </div>
      );
    }
    const title = stale ? 'A new version is ready' : 'Something went wrong';
    const body = stale
      ? 'RoboCraft was updated while you had it open. Reload to get the new version — your progress is safe.'
      : (this.props.message || 'This part of the app hit an error. Your progress is saved — you can reload or go back home.');

    const reload = () => { try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ } window.location.reload(); };
    const home = () => { try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ } window.location.href = import.meta.env.BASE_URL || '/'; };

    if (this.props.compact) {
      return (
        <div className="glass-strong rounded-2xl p-4 text-center my-3">
          <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{body}</p>
          <div className="flex gap-2 justify-center mt-3">
            <button onClick={() => this.setState({ error: null })} className="px-3 py-2 rounded-xl glass text-xs font-bold">Try again</button>
            <button onClick={reload} className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">Reload</button>
          </div>
          {this.renderDetails()}
        </div>
      );
    }

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="glass-strong rounded-3xl p-6 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{body}</p>
          <div className="flex gap-2 mt-5">
            <button onClick={home} className="flex-1 py-2.5 rounded-xl glass text-sm font-bold flex items-center justify-center gap-1.5">
              <Home className="w-4 h-4" /> Home
            </button>
            <button onClick={reload} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1.5">
              <RotateCw className="w-4 h-4" /> Reload
            </button>
          </div>
          {!stale && (
            <>
              {this.renderDetails()}
              {this.state.details && this.reportLink()}
              <p className="text-[10px] text-muted-foreground mt-3">
                If this keeps happening, please report it from Settings so we can fix it.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
}
