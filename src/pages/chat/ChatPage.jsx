import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Paperclip, Smile, Phone, Video, Search, User } from 'lucide-react';
import { Avatar } from '../../components/common/Avatar';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/common/Button';

const mockConversations = [
  { id: '1', name: 'Dr. Sarah Jenkins', role: 'Hospital Physician', avatar: '', status: 'online', unread: 2, lastMsg: 'Is the O- blood donor arriving soon?' },
  { id: '2', name: 'Red Cross NGO Coordinator', role: 'NGO Coordinator', avatar: '', status: 'online', unread: 0, lastMsg: 'Volunteer roster updated for tomorrow drive' },
  { id: '3', name: 'Alex Vance (Donor)', role: 'O- Voluntary Donor', avatar: '', status: 'offline', unread: 0, lastMsg: 'I am on my way to Metro Hospital now' },
];

const mockMessages = [
  { id: 'm1', sender: 'Dr. Sarah Jenkins', text: 'Hello! We received your emergency pledge for Patient ICU Bed 4.', time: '10:30 AM', isMe: false },
  { id: 'm2', sender: 'Me', text: 'Yes! I am eligible to donate O- negative. What time should I arrive?', time: '10:32 AM', isMe: true },
  { id: 'm3', sender: 'Dr. Sarah Jenkins', text: 'Please come to Trauma Room 2 immediately. Our team is ready.', time: '10:35 AM', isMe: false },
];

const ChatPage = () => {
  const [activeConv, setActiveConv] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { id: `m_${Date.now()}`, sender: 'Me', text: inputText, time: 'Just now', isMe: true }]);
    setInputText('');
  };

  return (
    <div className="h-[80vh] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex overflow-hidden">
      {/* Chat Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            Messages
          </h2>
          <SearchBar placeholder="Search messages..." />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
          {mockConversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConv(c)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                activeConv.id === c.id ? 'bg-red-50 dark:bg-red-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
            >
              <div className="relative">
                <Avatar name={c.name} size="md" />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
                  c.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{c.name}</p>
                  {c.unread > 0 && <span className="w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{c.unread}</span>}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Window */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={activeConv.name} size="md" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{activeConv.name}</p>
              <p className="text-xs text-emerald-500 font-semibold capitalize">● {activeConv.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-2xl text-xs font-medium ${
                m.isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
              }`}>
                <p>{m.text}</p>
                <p className={`text-[9px] mt-1 text-right ${m.isMe ? 'text-red-100' : 'text-slate-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Paperclip className="w-5 h-5" /></button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
          />
          <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
