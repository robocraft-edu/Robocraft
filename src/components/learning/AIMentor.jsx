import React, { useState, useRef, useEffect } from 'react';
import { aiEnabled } from '@/lib/features';
import { backend } from '@/api/client';
import { Send, Sparkles, X, Bot, Loader2, Code, Trophy, Lightbulb, TrendingUp } from 'lucide-react';
import MessageBubble from '@/components/learning/MessageBubble';

function AIMentorInner({ lessonContext, compact }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  const systemPrompt = lessonContext
    ? `You are RoboMentor, a friendly, encouraging robotics teacher in the RoboCraft learning app. The student is studying: "${lessonContext.title}" (Subject: ${lessonContext.subject}, Class: ${lessonContext.classId}). Explain concepts simply with real-world examples. Help debug Arduino/ESP32 code, explain Python, and motivate students. Keep responses under 4 sentences. Use emojis occasionally. If off-topic, gently guide back to robotics/programming/AI.`
    : `You are RoboMentor, a friendly, encouraging robotics teacher in the RoboCraft learning app. Help students with robotics, Python programming, AI, electronics, Arduino, ESP32, and related topics. Explain concepts simply with real-world examples. Motivate and encourage students. Keep responses under 4 sentences. Use emojis occasionally. If asked something unrelated, gently guide back to learning.`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (overrideInput) => {
    const text = (overrideInput ?? input).trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMsg].map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const res = await backend.integrations.Core.InvokeLLM({
        user_input: userMsg.content,
        prompt: `${systemPrompt}\n\nConversation so far:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nRespond as RoboMentor:`,
        response_json_schema: {
          type: 'object',
          properties: {
            response: { type: 'string' },
            suggestNext: { type: 'string' },
          },
        },
      });

      const botMsg = {
        role: 'assistant',
        content: res.response || "I'm here to help! What would you like to learn about? 🤖",
        suggestion: res.suggestNext,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again in a moment! 🤖',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = lessonContext
    ? [
        { text: 'Explain this lesson simply', icon: Lightbulb },
        { text: 'Where is this used in real life?', icon: TrendingUp },
        { text: 'Give me a robotics tip!', icon: Sparkles },
        { text: 'I need motivation 💪', icon: Trophy },
      ]
    : [
        { text: 'Explain how robots work', icon: Bot },
        { text: 'Help me debug Arduino code', icon: Code },
        { text: 'What should I study next?', icon: TrendingUp },
        { text: 'Give me a robotics tip!', icon: Sparkles },
      ];

  if (compact) {
    return (
      <>
        <button
          aria-label="Ask the AI mentor"
          onClick={() => setOpen(true)}
          style={{ bottom: 'calc(7.25rem + env(safe-area-inset-bottom))' }}
          className="fixed right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center neon-glow hover:scale-110 transition-transform"
        >
          <Bot className="w-6 h-6 text-white" />
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
            <div className="w-full max-w-md h-[70vh] glass-strong rounded-t-3xl sm:rounded-3xl flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-cyan-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">RoboMentor</h3>
                    <span className="text-[10px] text-green-400">● Online</span>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-cyan-500/10">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/15 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                      <Sparkles className="w-7 h-7 text-cyan-400" />
                    </div>
                    <p className="text-sm font-medium mb-1">Hi! I'm RoboMentor 🤖</p>
                    <p className="text-xs text-muted-foreground mb-4">Your personal robotics teacher. Ask me anything!</p>
                    <div className="flex flex-col gap-2">
                      {quickQuestions.map(q => {
                        const Icon = q.icon;
                        return (
                          <button
                            key={q.text}
                            onClick={() => send(q.text)}
                            className="text-xs glass rounded-xl px-3 py-2 text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center gap-2"
                          >
                            <Icon className="w-3.5 h-3.5" /> {q.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {loading && (
                  <div className="flex justify-start">
                    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="text-xs text-muted-foreground">RoboMentor is typing...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-cyan-500/10 flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask RoboMentor..."
                  className="flex-1 glass rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <button aria-label="Send message"
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center disabled:opacity-40 hover:neon-glow transition-all"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="glass-strong rounded-3xl flex flex-col" style={{ height: 'calc(100dvh - 19rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))', minHeight: 360 }}>
        <div className="flex items-center gap-2 p-4 border-b border-cyan-500/10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-bold">RoboMentor</h2>
            <span className="text-[10px] text-green-400">● Your AI Robotics Teacher</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-cyan-500/15 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Hi! I'm RoboMentor 🤖</h3>
              <p className="text-sm text-muted-foreground mb-4">Your personal robotics teacher. I can explain concepts, debug code, analyze quiz performance, and help with projects!</p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {quickQuestions.map(q => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.text}
                      onClick={() => send(q.text)}
                      className="text-xs glass rounded-xl px-3 py-2.5 text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center gap-2"
                    >
                      <Icon className="w-3.5 h-3.5" /> {q.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-muted-foreground">RoboMentor is typing...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-cyan-500/10 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask RoboMentor anything..."
            className="flex-1 glass rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <button aria-label="Send message"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center disabled:opacity-40 hover:neon-glow transition-all"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIMentor(props) {
  if (!aiEnabled) return null;
  return <AIMentorInner {...props} />;
}
