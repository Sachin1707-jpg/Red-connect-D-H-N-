import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, User, Award, Bell, Settings, LogOut, Command } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setCommandPaletteOpen } from '../../redux/themeSlice';
import { logoutUser } from '../../redux/authSlice';

export const CommandPalette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.theme.commandPaletteOpen);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!isOpen));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isOpen]);

  const commands = [
    { id: '1', title: 'Browse Emergency Requests', icon: <Heart className="w-4 h-4 text-red-500" />, action: () => navigate('/requests') },
    { id: '2', title: 'Go to Donor Dashboard', icon: <User className="w-4 h-4 text-emerald-500" />, action: () => navigate('/dashboard') },
    { id: '3', title: 'View My Profile', icon: <User className="w-4 h-4 text-sky-500" />, action: () => navigate('/profile') },
    { id: '4', title: 'Rewards & Leaderboard', icon: <Award className="w-4 h-4 text-amber-500" />, action: () => navigate('/rewards') },
    { id: '5', title: 'Notifications Center', icon: <Bell className="w-4 h-4 text-indigo-500" />, action: () => navigate('/notifications') },
    { id: '6', title: 'Account Settings', icon: <Settings className="w-4 h-4 text-slate-500" />, action: () => navigate('/settings') },
    { id: '7', title: 'Sign Out', icon: <LogOut className="w-4 h-4 text-red-500" />, action: () => { dispatch(logoutUser()); navigate('/'); } },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(setCommandPaletteOpen(false))}
      maxWidth="max-w-xl"
    >
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or page destination... (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-700/60 rounded-xl focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
            autoFocus
          />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-500">No matching commands.</p>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  dispatch(setCommandPaletteOpen(false));
                  cmd.action();
                }}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {cmd.icon}
                  <span>{cmd.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-primary uppercase font-bold">
                  Jump ↵
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
