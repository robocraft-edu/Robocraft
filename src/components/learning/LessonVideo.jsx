import React, { useEffect, useState } from 'react';
import { PlayCircle, WifiOff, Youtube } from 'lucide-react';

function videoId(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/**
 * Lesson video: shows a thumbnail first and only loads YouTube when tapped
 * (saves data, and nothing from YouTube loads until the student chooses).
 */
export default function LessonVideo({ lesson, onWatched }) {
  const id = videoId(lesson?.videoUrl);
  const [playing, setPlaying] = useState(false);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => { setPlaying(false); }, [id]);
  useEffect(() => {
    const up = () => setOnline(true), down = () => setOnline(false);
    window.addEventListener('online', up); window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  if (!id) return null;

  return (
    <div className="glass-strong rounded-2xl p-3">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Youtube className="w-4 h-4 text-red-500" />
        <span className="text-xs font-bold">Watch: {lesson.videoTitle || 'Lesson video'}</span>
      </div>
      <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '16 / 9' }}>
        {playing && online ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={lesson.videoTitle || 'Lesson video'}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            disabled={!online}
            onClick={() => { setPlaying(true); onWatched?.(); }}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Play video: ${lesson.videoTitle || 'Lesson video'}`}
          >
            {online && (
              // Not lazy: inside this button a lazy image was never requested, so no thumbnail showed.
              <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" decoding="async" referrerPolicy="no-referrer"
                onError={(e) => { const el = e.currentTarget; if (!el.dataset.retry) { el.dataset.retry = '1'; el.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`; } else el.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            )}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
              {online ? (
                <PlayCircle className="w-14 h-14 drop-shadow-lg" />
              ) : (
                <>
                  <WifiOff className="w-8 h-8 opacity-80" />
                  <span className="text-xs opacity-80">Connect to the internet to watch this video</span>
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
