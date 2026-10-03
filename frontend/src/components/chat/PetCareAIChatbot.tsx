import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import { Bot, Send, Sparkles, AlertCircle, RefreshCw, User, HelpCircle } from 'lucide-react';

export const PetCareAIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am **PetCare AI**, your intelligent companion for pet health, nutrition, vaccination schedules, adoption readiness, and animal welfare assistance. 🐾\n\nHow can I help you care for your furry friend today?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'What should I feed my puppy?',
        'How often should I vaccinate my dog?',
        'My cat is not eating.',
        'How can I prepare my home for adoption?',
        'What should I do if I find an injured animal?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const res = await api.post('/pet-care/ai-assistant', { message: text });
      if (res.data.success && res.data.chatMessage) {
        setMessages(prev => [...prev, res.data.chatMessage]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `I'm having trouble connecting to the PetCare AI knowledge base right now. Please verify backend connectivity. For urgent veterinary emergencies, call 1800-PET-HELP or visit your nearest animal hospital.`,
          timestamp: new Date().toISOString(),
          suggestions: ['What should I feed my puppy?', 'How often should I vaccinate my dog?']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Header with Branding & Disclaimer */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold font-display">PetCare AI</h2>
              <span className="text-[10px] font-bold uppercase bg-emerald-400/30 px-2 py-0.5 rounded-full border border-emerald-300/30">
                Online
              </span>
            </div>
            <p className="text-xs text-emerald-100">Intelligent Animal Welfare & Veterinary Care Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Prominent Mandatory Medical Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Disclaimer:</strong> PetCare AI provides general educational information and does not replace professional veterinary advice.
        </span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none space-y-3'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-line prose-xs">
                  {msg.text}
                </div>

                {/* Suggestions Pills (if assistant message) */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-slate-400" /> Suggested Inquiries
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full text-left transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center space-x-2 text-xs text-slate-500">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
              </span>
              <span>PetCare AI is formulating veterinary guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask PetCare AI anything about puppy food, vaccines, cat care, or rescue..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="p-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white rounded-2xl shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
