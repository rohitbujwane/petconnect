import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message } from '../types';
import { MessageSquare, Send, User, Check, CheckCheck, Clock } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (!activeConv && res.data.conversations.length > 0) {
          setActiveConv(res.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await api.get(`/messages/${convId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const otherParticipant = activeConv.participantDetails.find(p => p.id !== user?.id);

    try {
      const res = await api.post('/messages', {
        conversationId: activeConv.id,
        recipientId: otherParticipant?.id,
        text: inputText
      });

      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
        setInputText('');
        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
          Direct Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chat securely with shelters, foster caregivers, veterinarians, and adopters.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        {/* Left Conversations Sidebar (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-500">
            Inbox ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet. Reach out to a shelter or veterinarian to start chatting!
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.participantDetails.find(p => p.id !== user?.id);
                const isSelected = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`p-4 cursor-pointer transition-colors flex items-center space-x-3 ${
                      isSelected ? 'bg-white shadow-xs border-l-4 border-brand-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <img
                      src={other?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name}`}
                      alt={other?.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{other?.name || 'User'}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageTimestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Message Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const other = activeConv.participantDetails.find(p => p.id !== user?.id);
                    return (
                      <>
                        <img
                          src={other?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name}`}
                          alt={other?.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{other?.name}</h3>
                          <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.2 rounded-full border border-brand-200">
                            {other?.role}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/30">
                {messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-400">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
