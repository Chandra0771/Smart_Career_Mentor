import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Plus, Trash2, MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const SUGGESTED = [
  'Create a career roadmap for me',
  'Review my resume tips',
  'Prepare me for a tech interview',
  'What skills should I learn next?',
  'How to negotiate salary?',
];

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    loadChatHistory();
    // Welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${user?.name}! 👋 I'm your AI Career Mentor, powered by Gemini AI.\n\nI can help you with:\n- 📄 **Resume review and optimization**\n- 🗺️ **Career roadmap generation**\n- 🎯 **Skill gap analysis**\n- 🎤 **Interview preparation**\n- 💼 **Job search strategies**\n\nWhat would you like to work on today?`
    }]);
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data } = await api.get('/chat/history');
      setChatHistory(data.chats || []);
    } catch {}
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await api.post('/chat/message', {
        message: msg,
        chatId,
        careerInterest: user?.careerInterest,
        skillLevel: user?.skillLevel
      });
      const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMsg]);
      setChatId(data.chatId);
      loadChatHistory();
    } catch (err) {
      toast.error('Failed to get AI response');
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const newChat = () => {
    setChatId(null);
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: "Starting a new conversation! What career topic would you like to explore?"
    }]);
  };

  const loadChat = async (id) => {
    try {
      const { data } = await api.get(`/chat/${id}`);
      setChatId(id);
      setMessages(data.chat.messages.map((m, i) => ({ ...m, id: i })));
    } catch {
      toast.error('Failed to load chat');
    }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/${id}`);
      setChatHistory(prev => prev.filter(c => c._id !== id));
      if (chatId === id) newChat();
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] max-w-7xl mx-auto">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${showSidebar ? 'w-72' : 'w-0 overflow-hidden'} transition-all duration-300 border-r border-white/10 flex flex-col`}
      >
        <div className="p-4 border-b border-white/10">
          <button onClick={newChat} className="w-full gradient-btn py-2.5 text-sm rounded-xl flex items-center justify-center gap-2">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {chatHistory.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">No previous chats</p>
          ) : chatHistory.map((chat) => (
            <button key={chat._id} onClick={() => loadChat(chat._id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 group flex items-start gap-2 ${chatId === chat._id ? 'bg-white/15' : 'hover:bg-white/10'}`}
            >
              <MessageSquare size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate">{chat.title || 'Chat'}</p>
                <p className="text-xs text-white/30">{new Date(chat.updatedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={(e) => deleteChat(chat._id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400 text-white/30"
              >
                <Trash2 size={12} />
              </button>
            </button>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">AI Career Mentor</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" /> Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 1 && (
            <div className="max-w-xl mx-auto space-y-3">
              <p className="text-white/40 text-sm text-center mb-4">Suggested topics</p>
              {SUGGESTED.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="w-full text-left p-3 rounded-xl glass-card text-sm text-white/70 hover:text-white hover:bg-white/15 transition-all duration-200 hover:border-white/30"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'bg-violet-600/40 border border-violet-500/30' : 'glass-card'} rounded-2xl px-5 py-3`}>
                  <div className="text-sm text-white/90 leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-1 text-sm font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="glass-card px-5 py-4 flex items-center gap-2">
                <Loader2 size={16} className="text-purple-400 animate-spin" />
                <span className="text-white/50 text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3 items-end">
            <div className="flex-1 glass-card flex items-end gap-2 p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask your AI Career Mentor anything..."
                rows={1}
                style={{ resize: 'none' }}
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm leading-relaxed max-h-32 overflow-y-auto"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 flex-shrink-0"
            >
              <Send size={18} className="text-white" />
            </motion.button>
          </div>
          <p className="text-xs text-white/25 text-center mt-2">AI responses are for guidance only. Always verify with professionals.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
