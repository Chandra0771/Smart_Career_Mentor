import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, MessageSquare, Plus, Trash2, Sparkles,
  Bot, User, Copy, Check, Sidebar
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import Navbar from '../components/ui/Navbar';
import toast from 'react-hot-toast';

// Format AI markdown-like responses
const formatMessage = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold text-white/90 mt-2 mb-1">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return <li key={i} className="text-white/75 ml-3 list-disc text-sm leading-relaxed">{line.slice(2)}</li>;
    }
    if (/^\d+\. /.test(line)) {
      return <li key={i} className="text-white/75 ml-3 list-decimal text-sm leading-relaxed">{line.replace(/^\d+\. /, '')}</li>;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="text-white/75 text-sm leading-relaxed">{line}</p>;
  });
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1 text-white/20 hover:text-white/50 transition-colors">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
      <Sparkles size={12} className="text-white" />
    </div>
    <div className="chat-bubble-ai flex items-center gap-1.5 py-2.5">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  </div>
);

const SUGGESTIONS = [
  "What skills should I learn for my career?",
  "Review my career progress so far",
  "Help me prepare for interviews",
  "How can I improve my resume?",
  "What's a good career roadmap for me?",
  "How to negotiate a higher salary?",
];

export default function ChatPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const loadHistory = async () => {
    try {
      const { data } = await chatAPI.getHistory();
      setSessions(data.chats || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    try {
      const { data } = await chatAPI.getSession(sessionId);
      setMessages(data.chat.messages || []);
    } catch {
      toast.error('Failed to load chat.');
    }
  };

  const startNewChat = () => {
    setActiveSessionId(uuidv4());
    setMessages([]);
    inputRef.current?.focus();
  };

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const sessionId = activeSessionId || uuidv4();
    if (!activeSessionId) setActiveSessionId(sessionId);

    // Optimistic update
    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    try {
      const { data } = await chatAPI.sendMessage({
        message: msg,
        sessionId,
        history: messages.slice(-10) // last 10 for context
      });

      const aiMsg = { role: 'assistant', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      await loadHistory(); // refresh sidebar
    } catch (err) {
      toast.error('Failed to send message.');
      setMessages(prev => prev.filter(m => m !== userMsg));
    } finally {
      setTyping(false);
    }
  }, [input, activeSessionId, messages]);

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-20 max-w-6xl mx-auto w-full px-4 pb-4 gap-4" style={{ height: 'calc(100vh - 0px)' }}>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '260px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex flex-col glass-card overflow-hidden flex-shrink-0"
              style={{ background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(24px)', height: 'calc(100vh - 96px)' }}
            >
              <div className="p-4 border-b border-white/10">
                <button
                  onClick={startNewChat}
                  className="btn-gradient w-full flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <Plus size={15} /> New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {sessions.length === 0 ? (
                  <p className="text-white/30 text-xs text-center mt-8 px-4">No chat history yet</p>
                ) : (
                  sessions.map(session => (
                    <button
                      key={session.sessionId}
                      onClick={() => loadSession(session.sessionId)}
                      className={`w-full text-left p-3 rounded-xl mb-1 group flex items-center justify-between gap-2 transition-all duration-150 ${
                        activeSessionId === session.sessionId
                          ? 'bg-violet-500/20 border border-violet-500/30'
                          : 'hover:bg-white/7'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MessageSquare size={13} className="text-white/40 flex-shrink-0" />
                        <span className="text-white/70 text-xs truncate">{session.title}</span>
                      </div>
                      <button
                        onClick={(e) => deleteSession(session.sessionId, e)}
                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all p-1"
                      >
                        <Trash2 size={11} />
                      </button>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat */}
        <div
          className="flex-1 glass-card flex flex-col overflow-hidden"
          style={{ background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(24px)', height: 'calc(100vh - 96px)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all hidden md:block"
            >
              <Sidebar size={16} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">AI Career Mentor</h2>
              <p className="text-white/40 text-xs">Powered by Google Gemini</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Hello, {user?.name?.split(' ')[0]}!
                </h3>
                <p className="text-white/45 text-sm mb-8 max-w-sm">
                  I'm your AI Career Mentor. Ask me anything about your {user?.careerInterest} career journey.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left p-3 glass-card hover:bg-white/12 text-white/60 hover:text-white/85 text-xs transition-all duration-200 rounded-xl"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-700'
                        : 'bg-gradient-to-br from-violet-500 to-indigo-600'
                    }`}>
                      {msg.role === 'user'
                        ? <User size={12} className="text-white" />
                        : <Sparkles size={12} className="text-white" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                        {msg.role === 'user'
                          ? <p className="text-sm">{msg.content}</p>
                          : <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                        }
                      </div>
                      <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-white/25 text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.role === 'assistant' && <CopyButton text={msg.content} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI career mentor..."
                  className="glass-input resize-none pr-12 text-sm py-3 min-h-[48px] max-h-32"
                  rows={1}
                  style={{ height: Math.min(Math.max(48, input.split('\n').length * 24 + 24), 128) + 'px' }}
                />
              </div>
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {typing
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send size={16} />
                }
              </motion.button>
            </div>
            <p className="text-white/20 text-xs mt-2 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
